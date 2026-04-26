import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Privacy-Safe Bloom Filter (1KB / 8192 bits) ---
class BloomFilter {
  bits: Uint8Array;
  constructor(data?: any) {
    // 1. Force conversion to Uint8Array regardless of input type
    if (data && typeof data === 'object' && data.constructor.name === 'Uint8Array') {
      this.bits = new Uint8Array(data);
    } else if (typeof data === 'string') {
      // Handle PostgreSQL hex format (\x...)
      const hex = data.startsWith('\\x') ? data.slice(2) : data;
      // Also handle potential JSON-stringified array if Supabase misbehaves
      if (data.startsWith('[') || data.startsWith('{')) {
        try {
          const parsed = JSON.parse(data);
          const vals = Object.values(parsed).map(Number);
          this.bits = new Uint8Array(vals);
        } catch {
          this.bits = new Uint8Array(1024);
        }
      } else if (/^[0-9a-fA-F]+$/.test(hex)) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        this.bits = bytes;
      } else {
        this.bits = new Uint8Array(1024);
      }
    } else {
      this.bits = new Uint8Array(1024);
    }
    
    // 2. Guarantee mutability and size
    if (!(this.bits instanceof Uint8Array) || this.bits.length !== 1024) {
      const fixed = new Uint8Array(1024);
      if (this.bits && this.bits.length) {
        fixed.set(Array.from(this.bits).slice(0, 1024));
      }
      this.bits = fixed;
    }
  }
  
  private hash(str: string, seed: number): number {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
      h ^= h >>> 15;
    }
    return Math.abs(h) % 8192;
  }

  add(item: string) {
    this.bits[this.hash(item, 0xdeadbeef) >> 3] |= (1 << (this.hash(item, 0xdeadbeef) % 8));
    this.bits[this.hash(item, 0xfacefeed) >> 3] |= (1 << (this.hash(item, 0xfacefeed) % 8));
  }

  test(item: string): boolean {
    const b1 = this.bits[this.hash(item, 0xdeadbeef) >> 3] & (1 << (this.hash(item, 0xdeadbeef) % 8));
    const b2 = this.bits[this.hash(item, 0xfacefeed) >> 3] & (1 << (this.hash(item, 0xfacefeed) % 8));
    return Boolean(b1 && b2);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { profileId, referrer, fp: clientFp, source } = await req.json();
    const ua = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    
    // 1. Device & Browser Parsing
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
    const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Other";

    // 2. Geo-Enrichment
    let geo = { country: 'Unknown', city: 'Unknown' };
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
      geo = await geoRes.json();
    } catch (e) {
      console.error("Geo lookup failed:", e);
    }

    // 3. Privacy Fingerprint (SHA-256)
    const today = new Date().toISOString().split('T')[0];
    const dataToHash = new TextEncoder().encode(ip + ua + today + clientFp);
    const serverFpBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
    const fpHash = Array.from(new Uint8Array(serverFpBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // 4. Repeat Detection (Bloom Filter)
    const { data: bloomData } = await supabase.from('profile_visitor_bloom').select('filter_bits').eq('profile_id', profileId).single();
    const filter = new BloomFilter(bloomData?.filter_bits);
    const isRepeat = filter.test(fpHash);
    
    if (!isRepeat) {
      filter.add(fpHash);
      const hexBits = '\\x' + Array.from(filter.bits).map(b => b.toString(16).padStart(2, '0')).join('');
      await supabase.from('profile_visitor_bloom').upsert({
        profile_id: profileId,
        filter_bits: hexBits,
        updated_at: new Date().toISOString()
      });
    }

    // 5. Ingest Event
    const { error: eventErr } = await supabase.from('profile_view_events').insert({
      profile_id: profileId,
      visitor_fp: fpHash,
      referrer,
      device_type: deviceType,
      browser,
      country: geo.country || 'Unknown',
      city: geo.city || 'Unknown',
      is_repeat: isRepeat
    });

    if (eventErr) throw eventErr;

    // 6. Update Daily Stats (Rollup)
    const { error: rpcErr } = await supabase.rpc('increment_daily_views', {
      p_id: profileId,
      p_day: today,
      p_is_qr: source === 'qr',
      p_is_social: source === 'social',
      p_is_direct: source === 'direct',
      p_is_mobile: isMobile,
      p_is_unique: !isRepeat
    });

    if (rpcErr) {
      console.error("RPC Error:", rpcErr);
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200 
    });

  } catch (err) {
    console.error("Ingestion Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
