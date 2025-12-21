
import React, { useState, useMemo, useEffect } from 'react';
import { Copy, Check, ExternalLink, Menu, X, Wand2, RefreshCw, Download, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

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

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(LOGO_URL);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setLogoBase64(base64);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Failed to load logo for generator", err);
      }
    };
    fetchLogo();
  }, []);

  const randomPrompts = [
    "Testicle skiing down a mountain of yellow snow",
    "Testicle stuck inside a giant yellow snowball",
    "Testicle ice fishing and catching a golden coin",
    "Testicle building a snowman that looks exactly like him",
    "Testicle sledding on a golden coin through a blizzard",
    "Testicle wearing a tiny yellow winter hat and scarf",
    "Testicle eating a yellow popsicle in a snowstorm",
    "Testicle ice skating on a vertical trading chart",
    "Testicle fighting a blizzard with a tiny yellow stick",
    "Testicle waiting for the bus in a heavy yellow snowfall"
  ];

  const generateMeme = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim()) return;
    
    setGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env?.VITE_API_KEY || (process.env as any).API_KEY });
      
      const contents = {
        parts: [
          ...(logoBase64 ? [{
            inlineData: {
              data: logoBase64,
              mimeType: 'image/jpeg',
            },
          }] : []),
          {
            text: `Generate a funny 2D meme image. 
            STRICT VISUAL RULES:
            1. BACKGROUND: Pure solid pitch black (#000000).
            2. CHARACTER (Named "Testicle"):
               - HEAD: A thick yellow hand-drawn circular outline. The interior of the head MUST be pitch black.
               - EYES: Two small solid yellow dots inside the black head (exactly like the provided logo).
               - BODY: A simple hand-drawn yellow stick-figure body (thin yellow lines for torso, arms, and legs).
            3. STYLE: Hand-drawn, minimalist, simple 2D scribble/meme aesthetic.
            4. SCENE: ${activePrompt}.
            5. COLOR PALETTE: ONLY Black (#000000) and Yellow (#fbbf24). No other colors unless absolutely necessary for the joke (and even then, prefer yellow).
            Make the drawing look like a fast digital sketch.`,
          },
        ],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents,
      });

      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) setError("The lab exploded! Try again.");
    } catch (err) {
      console.error(err);
      setError("Failed to cook the meme. Try again!");
    } finally {
      setGenerating(false);
    }
  };

  const handleRandomMeme = () => {
    const random = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(random);
    generateMeme(random);
  };

  return (
    <section id="generator" className="py-24 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-4 text-center yellow-glow uppercase">Winter Meme Lab</h2>
        <p className="text-center text-xl mb-12 opacity-80 uppercase tracking-widest">Black Face • Yellow Outline • Yellow Body</p>
        
        <div className="bg-yellow-900/10 border-4 border-yellow-400 rounded-3xl p-6 md:p-10 shadow-[10px_10px_0px_rgba(251,191,36,0.2)]">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your winter meme idea (e.g. Testicle in a blizzard...)"
                className="w-full bg-black border-2 border-yellow-400/50 rounded-xl p-6 text-xl text-yellow-100 placeholder:text-yellow-400/30 focus:border-yellow-400 outline-none transition-all resize-none h-32"
              />
              <button 
                onClick={() => setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)])}
                className="absolute right-4 bottom-4 text-yellow-400 hover:text-white transition-colors p-2"
                title="Shuffle Prompt"
              >
                <RefreshCw size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => generateMeme()}
                disabled={generating || !prompt.trim()}
                className="bg-yellow-400 text-black font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[6px_6px_0px_#78350f]"
              >
                {generating ? <Loader2 className="animate-spin" size={28} /> : <Wand2 size={28} />}
                COOK THE MEME
              </button>
              
              <button
                onClick={handleRandomMeme}
                disabled={generating}
                className="bg-black text-yellow-400 border-4 border-yellow-400 font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 shadow-[6px_6px_0px_rgba(251,191,36,0.2)]"
              >
                <Sparkles size={28} />
                RANDOM MEME
              </button>
            </div>

            {error && <p className="text-red-500 text-center font-bold text-lg uppercase">{error}</p>}

            {resultImage && (
              <div className="mt-8 animate-in fade-in zoom-in duration-500">
                <div className="relative group rounded-2xl overflow-hidden border-4 border-yellow-400 bg-black aspect-square max-w-md mx-auto shadow-[15px_15px_0px_rgba(251,191,36,0.1)]">
                  <img src={resultImage} alt="Generated Meme" className="w-full h-full object-cover" />
                  <a 
                    href={resultImage} 
                    download="testicle-meme.png"
                    className="absolute top-4 right-4 bg-yellow-400 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Download size={24} />
                  </a>
                </div>
                <p className="text-center text-yellow-400/60 mt-4 text-lg uppercase tracking-tighter italic">Hand-drawn Stick Masterpiece</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
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
          <a href="#generator" className="hover:text-white transition-colors">Memes</a>
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

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b-2 border-yellow-500/30 p-8 flex flex-col gap-8 text-2xl text-center">
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#generator" onClick={() => setIsOpen(false)}>Memes</a>
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
      <MemeGenerator />
      <Chart />
      
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
