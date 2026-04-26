import { useReveal } from '../hooks/useReveal'

export default function FounderStory() {
  const ref = useReveal()

  return (
    <section id="founder-story" className="py-32 bg-[#111111] text-white snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1 reveal">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/face-of-knowmi.jpg" 
                alt="Founder of KnoWMi" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -top-6 -right-6 bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
              Founder & Creator
            </div>
          </div>
          
          <div className="order-1 lg:order-2 reveal reveal-delay-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 text-orange-400 text-[10px] font-black uppercase tracking-widest">
              A Personal Mission
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black mb-10 leading-tight">
              Why I Built <br />
              <span className="text-orange-500 italic">KnoWMi.</span>
            </h2>
            <div className="space-y-6 text-lg text-white/60 font-medium leading-relaxed">
              <p>
                The idea for KnoWMi didn’t come from a boardroom—it came from a frustration we’ve all felt: the friction of a first meeting. 
              </p>
              <p>
                I realized that while we all carry powerful digital identities, we struggle to share them effectively in the physical world. Business cards get lost, and "find me on Instagram" is a clumsy dance.
              </p>
              <p>
                I wanted to build something that felt human. A bridge between who you are standing in front of me and who you are online. By putting your identity on the most basic piece of human apparel—the T-shirt—we’ve made connection as natural as a handshake.
              </p>
              <p className="text-white italic">
                "KnoWMi is about removing the friction from human connection, one scan at a time."
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden">
                  <img src="/face-of-knowmi.jpg" alt="Nanda Kumar" className="w-full h-full object-cover" />
               </div>
               <div>
                 <div className="text-sm font-black uppercase tracking-widest text-white">Nanda Kumar</div>
                 <div className="text-[10px] font-bold text-neutral-500 uppercase">Creator of KnoWMi</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
