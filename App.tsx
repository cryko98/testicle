
import React, { useState, useMemo } from 'react';
import { Copy, Check, ExternalLink, Menu, X } from 'lucide-react';

const CONTRACT_ADDRESS = "4TyZGqRLG3VcHTGMcLBoPUmqYitMVojXinAmkL8xpump";
const X_COMMUNITY_URL = "https://x.com/i/communities/2002717537985773778";
const CTO_LEADER_URL = "https://x.com/tisgambino";
const LOGO_URL = "https://pbs.twimg.com/media/G8sWdI6bEAEnZWB?format=jpg&name=240x240";

// Custom X (formerly Twitter) logo component
const XLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.31 17.41z" />
  </svg>
);

const Snowfall: React.FC = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 4}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.7 + 0.3,
      size: `${Math.random() * 10 + 5}px`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-yellow-400 animate-fall"
          style={{
            left: flake.left,
            top: '-20px',
            opacity: flake.opacity,
            fontSize: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        >
          ●
        </div>
      ))}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b-2 border-yellow-500/30 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="logo" className="w-14 h-14 object-contain" />
          <span className="text-3xl tracking-tighter text-yellow-400 yellow-glow uppercase">testicle</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-bold uppercase text-lg">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#chart" className="hover:text-white transition-colors">Chart</a>
          <a href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            Community <XLogo size={18} />
          </a>
          <a 
            href={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_#78350f]"
          >
            BUY NOW
          </a>
        </div>

        <button className="md:hidden text-yellow-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b-2 border-yellow-500/30 p-8 flex flex-col gap-8 text-2xl text-center">
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#chart" onClick={() => setIsOpen(false)}>Chart</a>
          <a href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer">Community</a>
          <a 
            href={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-yellow-400 text-black py-4 rounded-lg shadow-[4px_4px_0px_#78350f]"
          >
            BUY NOW
          </a>
        </div>
      )}
    </nav>
  );
};

const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCA = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-40 pb-24 px-6 relative overflow-hidden bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10 inline-block relative">
           <img 
             src={LOGO_URL} 
             alt="Testicle Hero" 
             className="w-56 h-56 md:w-80 md:h-80 object-contain mx-auto" 
           />
           {/* Floating badge */}
           <div className="absolute -bottom-4 -right-4 bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 rotate-12 text-xl font-bold animate-pulse uppercase">
             $TESTICLE
           </div>
        </div>
        
        <h1 className="text-7xl md:text-[10rem] mb-2 text-yellow-400 tracking-tighter yellow-glow uppercase leading-none">
          testicle
        </h1>
        <p className="text-3xl md:text-5xl font-bold mb-12 tracking-widest uppercase opacity-90">
          $testicle
        </p>

        <div className="flex flex-col items-center gap-8">
          <div className="bg-yellow-400 text-black border-4 border-black rounded-xl p-4 w-full max-w-xl flex items-center justify-between gap-4 shadow-[6px_6px_0px_rgba(251,191,36,0.4)]">
            <code className="text-sm md:text-xl font-bold break-all leading-tight">
              {CONTRACT_ADDRESS}
            </code>
            <button 
              onClick={copyCA}
              className="bg-black text-yellow-400 p-3 rounded-lg hover:scale-110 transition-transform shrink-0"
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href={X_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black border-4 border-yellow-400 px-10 py-5 rounded-xl text-2xl hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_rgba(251,191,36,0.3)]"
            >
              <XLogo size={28} /> JOIN COMMUNITY
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-yellow-400/5 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">About $testicle</h2>
        <div className="bg-black border-4 border-yellow-400 p-10 md:p-16 rounded-3xl shadow-[10px_10px_0px_#451a03] relative overflow-hidden">
          <div className="space-y-8 text-2xl md:text-3xl leading-snug">
            <p>
              This coin was launched by the <span className="text-yellow-400 font-black">$snowball dev</span>, who used <span className="text-yellow-400">testicle</span> to battle-test the <span className="underline decoration-yellow-400">snowball tech</span>.
            </p>
            <p>
              It started as a technical demonstration, but it quickly grew into something much bigger. Now, the project is under the visionary leadership of <a href={CTO_LEADER_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline decoration-2 underline-offset-8 hover:text-white transition-colors">@tisgambino</a> as the CTO leader.
            </p>
            <p className="text-yellow-400 text-3xl md:text-4xl pt-6 italic border-t-2 border-yellow-400/20">
              "The plan is simple: drive this project to a multi-million market cap."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Chart: React.FC = () => {
  return (
    <section id="chart" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">$testicle Live Chart</h2>
        <div className="w-full bg-black border-4 border-yellow-400 rounded-3xl overflow-hidden shadow-[10px_10px_0px_#451a03]">
          <iframe 
            src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Dexscreener Chart"
          />
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t-4 border-yellow-500/20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-6">
          <img src={LOGO_URL} alt="logo" className="w-16 h-16 object-contain" />
          <div className="text-left">
            <h3 className="text-4xl text-yellow-400 leading-none uppercase">testicle</h3>
            <p className="text-lg font-bold opacity-60 uppercase tracking-tighter">by $snowball dev</p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="mb-6 text-2xl font-bold">Led by <a href={CTO_LEADER_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-white underline underline-offset-4 decoration-2">@tisgambino</a></p>
          <div className="flex justify-center md:justify-end gap-10">
            <a href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:scale-125 transition-transform"><XLogo size={40} /></a>
            <a href={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:scale-125 transition-transform"><ExternalLink size={40} /></a>
          </div>
        </div>
      </div>
      <div className="mt-16 text-center text-lg opacity-40 italic uppercase tracking-widest">
        © 2025 $testicle. JUST A TESTICLE. NO FINANCIAL ADVICE.
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen selection:bg-yellow-400 selection:text-black">
      <Snowfall />
      <Navbar />
      <Hero />
      <About />
      <Chart />
      
      {/* Visual Marquee */}
      <div className="py-12 bg-yellow-400 text-black flex overflow-hidden whitespace-nowrap font-black text-5xl uppercase select-none border-y-4 border-black">
        <div className="flex animate-marquee gap-12">
           {[...Array(10)].map((_, i) => (
             <span key={i}>$TESTICLE TESTED THE TECH • CTO BY @TISGAMBINO • MILLIONS SOON • </span>
           ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
