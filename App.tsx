
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, Menu, X, Wand2, Download, Loader2, Sparkles, Wallet, Coins, Search, ShoppingCart, ChevronDown, Pencil, Eraser, Trash2, Zap, Rocket, Type, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const CONTRACT_ADDRESS = "4TyZGqRLG3VcHTGMcLBoPUmqYitMVojXinAmkL8xpump";
const X_COMMUNITY_URL = "https://x.com/i/communities/2002717537985773778";
const LOGO_URL = "https://pbs.twimg.com/media/G8sWdI6bEAEnZWB?format=jpg&name=240x240";
const PUMP_FUN_URL = `https://pump.fun/coin/${CONTRACT_ADDRESS}`;
const THEME_YELLOW = "#fbbf24";

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

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className, id }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.section>
);

const BackgroundDrifters: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
      {[...Array(8)].map((_, i) => (
        <motion.img
          key={i}
          src={LOGO_URL}
          className="absolute w-32 h-32 md:w-64 md:h-64"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            rotate: Math.random() * 360
          }}
          animate={{ 
            x: [null, Math.random() * 100 + "%"],
            y: [null, Math.random() * 100 + "%"],
            rotate: [null, Math.random() * 360]
          }}
          transition={{
            duration: Math.random() * 30 + 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const Snowfall: React.FC = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
      size: `${Math.random() * 8 + 4}px`,
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

const DrawingBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = THEME_YELLOW;
    context.lineWidth = 5;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: (e as React.TouchEvent).touches[0].clientX - rect.left,
        y: (e as React.TouchEvent).touches[0].clientY - rect.top
      };
    } else {
      return {
        x: (e as React.MouseEvent).nativeEvent.offsetX,
        y: (e as React.MouseEvent).nativeEvent.offsetY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!contextRef.current) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.strokeStyle = mode === 'pen' ? THEME_YELLOW : 'black';
    contextRef.current.lineWidth = mode === 'pen' ? 5 : 25;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    if ('touches' in e && e.cancelable) e.preventDefault();
  };

  const stopDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-doodle.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <SectionReveal id="draw" className="py-24 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-4 text-center yellow-glow uppercase">Draw Something Crude</h2>
        <p className="text-center text-xl mb-12 opacity-80 uppercase tracking-widest italic">The $testicle way</p>
        <div className="bg-yellow-400/5 border-4 border-yellow-400 rounded-3xl p-4 md:p-8 shadow-[12px_12px_0px_#451a03]">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-4">
              <button onClick={() => setMode('pen')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'pen' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Pencil size={24} /></button>
              <button onClick={() => setMode('eraser')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'eraser' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Eraser size={24} /></button>
              <button onClick={clearCanvas} className="p-4 rounded-xl border-2 bg-black text-red-500 border-red-500 hover:bg-red-500 hover:text-black transition-all"><Trash2 size={24} /></button>
              <button onClick={downloadDrawing} className="p-4 rounded-xl border-2 bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black transition-all"><Download size={24} /></button>
            </div>
            <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-yellow-400/30 cursor-crosshair touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[400px] md:h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [memeText, setMemeText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateMeme = async (overridePrompt?: string) => {
    const activePrompt = (overridePrompt || prompt).trim();
    if (!activePrompt || generating) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const fullPrompt = `
        STYLE: Crude primitive marker doodle, simple 2D sketch.
        COLORS: Strictly Pure Black and Golden Yellow (#fbbf24) ONLY.
        CHARACTER: A wobbly potato head with tiny dot eyes and stick body.
        BACKGROUND: Pure solid black.
        SCENE: ${activePrompt}.
        ${memeText ? `Include text "${memeText.toUpperCase()}" in hand-drawn yellow letters.` : ""}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        setResultImage(`data:image/png;base64,${part.inlineData.data}`);
      } else {
        throw new Error("No image generated. Check your API key.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SectionReveal id="meme-lab" className="py-24 px-6 bg-black relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Rocket size={48} className="mx-auto mb-6 text-yellow-400 animate-bounce" />
          <h2 className="text-6xl md:text-7xl text-yellow-400 mb-4 yellow-glow uppercase">Meme-Lab</h2>
          <p className="text-xl opacity-60 uppercase tracking-widest italic">Powered by Gemini 2.5 Flash</p>
        </div>

        <div className="bg-black border-4 border-yellow-400 rounded-[2.5rem] p-8 md:p-12 shadow-[20px_20px_0px_rgba(251,191,36,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-yellow-400 text-lg font-black uppercase tracking-widest">Scenario</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Testicle character in a yellow Ferrari..."
                  className="w-full bg-black border-2 border-yellow-400/30 rounded-2xl p-5 text-lg text-yellow-100 placeholder:text-yellow-400/20 focus:border-yellow-400 outline-none transition-all h-32"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-yellow-400 text-lg font-black uppercase tracking-widest">Caption</label>
                <input
                  type="text"
                  value={memeText}
                  onChange={(e) => setMemeText(e.target.value)}
                  placeholder="TO THE MOON"
                  className="w-full bg-black border-2 border-yellow-400/30 rounded-xl p-4 text-lg text-yellow-100 placeholder:text-yellow-400/20 focus:border-yellow-400 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => generateMeme()}
                disabled={generating || !prompt.trim()}
                className="w-full bg-yellow-400 text-black font-black text-3xl py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all disabled:opacity-50 shadow-[0_8px_0_#78350f]"
              >
                {generating ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} />}
                GENERATE
              </button>
              {error && (
                <div className="p-4 bg-red-900/20 border-2 border-red-500 rounded-xl text-red-400 text-sm flex gap-3 italic">
                  <AlertCircle size={20} /> {error}
                </div>
              )}
            </div>

            <div className="relative aspect-square bg-black rounded-[2rem] border-2 border-dashed border-yellow-400/20 flex items-center justify-center overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                    <Loader2 size={80} className="text-yellow-400 animate-spin" />
                    <p className="text-yellow-400 font-black uppercase tracking-[0.2em] animate-pulse">Engines Warming Up...</p>
                  </motion.div>
                ) : resultImage ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full p-4 group">
                    <img src={resultImage} alt="Meme" className="w-full h-full object-contain rounded-2xl" />
                    <a href={resultImage} download="meme.png" className="absolute top-8 right-8 bg-yellow-400 text-black p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity"><Download size={24} /></a>
                  </motion.div>
                ) : (
                  <div className="text-center opacity-10"><Sparkles size={120} /></div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b-2 border-yellow-400/20 py-4 px-6 backdrop-blur-sm">
      <motion.div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-yellow-400 origin-left" style={{ scaleX }} />
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <img src={LOGO_URL} alt="logo" className="w-12 h-12 object-contain" />
          <span className="text-2xl text-yellow-400 yellow-glow uppercase">testicle</span>
        </div>
        <div className="hidden md:flex items-center gap-10 font-black uppercase text-sm tracking-widest">
          {["About", "Meme-Lab", "Draw", "How-to-Buy", "Chart"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors">{item}</a>
          ))}
          <a href={PUMP_FUN_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black px-6 py-2 rounded-lg shadow-[4px_4px_0px_#78350f]">BUY</a>
        </div>
        <button className="md:hidden text-yellow-400" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={32} /> : <Menu size={32} />}</button>
      </div>
    </nav>
  );
};

const App: React.FC = () => (
  <div className="min-h-screen bg-black text-yellow-400 selection:bg-yellow-400 selection:text-black font-['Permanent_Marker']">
    <BackgroundDrifters /><Snowfall /><Navbar />
    <main>
      <section className="pt-48 pb-24 px-6 text-center">
        <motion.img animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} src={LOGO_URL} className="w-56 h-56 mx-auto mb-12 rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]" />
        <h1 className="text-8xl md:text-[12rem] mb-4 yellow-glow uppercase leading-none tracking-tighter">testicle</h1>
        <p className="text-3xl md:text-5xl font-black mb-16 uppercase opacity-90 tracking-[0.3em]">$testicle</p>
        <div className="bg-yellow-400 text-black border-4 border-black rounded-xl p-4 max-w-xl mx-auto flex items-center justify-between gap-4 shadow-[8px_8px_0px_rgba(251,191,36,0.4)] mb-12">
          <code className="text-xl font-bold break-all">{CONTRACT_ADDRESS}</code>
          <button onClick={() => navigator.clipboard.writeText(CONTRACT_ADDRESS)} className="bg-black text-yellow-400 p-3 rounded-lg"><Copy size={24} /></button>
        </div>
        <a href={PUMP_FUN_URL} target="_blank" className="bg-black border-4 border-yellow-400 px-12 py-6 rounded-2xl text-3xl hover:bg-yellow-400 hover:text-black transition-all shadow-[10px_10px_0px_rgba(251,191,36,0.2)] inline-block uppercase font-black">🚀 TO PUMP.FUN</a>
      </section>

      <About />
      <MemeGenerator />
      <DrawingBoard />
      <HowToBuy />
      <Chart />
    </main>

    <div className="py-12 bg-yellow-400 text-black overflow-hidden font-black text-4xl uppercase border-y-4 border-black">
      <div className="flex animate-marquee gap-12">
        {[...Array(10)].map((_, i) => <span key={i}>$TESTICLE • NO UTILITY • JUST VIBES • TESTED THE SNOWBALL TECH • </span>)}
      </div>
    </div>

    <footer className="py-20 bg-black text-center border-t-4 border-yellow-400/10">
      <img src={LOGO_URL} alt="logo" className="w-16 h-16 mx-auto mb-8 grayscale hover:grayscale-0 transition-all" />
      <div className="flex justify-center gap-12 mb-12">
        <a href={X_COMMUNITY_URL} target="_blank"><XLogo size={40} /></a>
        <a href={PUMP_FUN_URL} target="_blank"><ShoppingCart size={40} /></a>
      </div>
      <p className="opacity-40 italic tracking-widest uppercase text-sm">© 2025 $testicle. DYOR. NO FINANCIAL ADVICE.</p>
    </footer>

    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 30s linear infinite; display: inline-flex; white-space: nowrap; }
      @keyframes fall { 0% { transform: translateY(-100px) rotate(0); } 100% { transform: translateY(110vh) rotate(360deg); } }
      .animate-fall { animation: fall linear infinite; }
      html { scroll-behavior: smooth; }
    `}</style>
  </div>
);

const About: React.FC = () => (
  <SectionReveal id="about" className="py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase underline decoration-4 underline-offset-8">The Story</h2>
      <div className="bg-black border-4 border-yellow-400 p-10 md:p-16 rounded-[3rem] shadow-[15px_15px_0px_#451a03]">
        <p className="text-3xl md:text-4xl leading-tight mb-8">
          Dev used <span className="text-yellow-400 font-black">$testicle</span> to battle-test the tech before <span className="text-yellow-100">$snowball</span>.
        </p>
        <p className="text-2xl opacity-80 leading-relaxed mb-8">
          The project grew wings. The community took over. It became the ultimate stress-test for the ecosystem. 
        </p>
        <p className="text-yellow-400 text-3xl font-black italic uppercase border-t-2 border-yellow-400/20 pt-8">"It's just a testicle. But it's our testicle."</p>
      </div>
    </div>
  </SectionReveal>
);

const HowToBuy: React.FC = () => (
  <SectionReveal id="how-to-buy" className="py-24 px-6 bg-black">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-6xl text-yellow-400 mb-20 text-center yellow-glow uppercase">Instructions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          { t: "WALLET", d: "Get Phantom. It's safe and yellow (mostly).", i: <Wallet size={32} /> },
          { t: "SOL", d: "Load up on SOL. Transfers are instant.", i: <Coins size={32} /> },
          { t: "PUMP", d: "Paste the CA on Pump.fun search bar.", i: <Search size={32} /> },
          { t: "SWAP", d: "Swap SOL for $TESTICLE. Feel the power.", i: <ShoppingCart size={32} /> }
        ].map((step, idx) => (
          <div key={idx} className="bg-black border-4 border-yellow-400 p-8 rounded-3xl shadow-[10px_10px_0px_rgba(251,191,36,0.1)]">
            <div className="bg-yellow-400 text-black p-4 rounded-xl inline-block mb-6">{step.i}</div>
            <h3 className="text-4xl font-black text-yellow-400 uppercase mb-4">{step.t}</h3>
            <p className="text-2xl opacity-70 italic">{step.d}</p>
          </div>
        ))}
      </div>
    </div>
  </SectionReveal>
);

const Chart: React.FC = () => (
  <SectionReveal id="chart" className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">Real-Time Data</h2>
      <div className="bg-black border-4 border-yellow-400 rounded-3xl overflow-hidden shadow-[15px_15px_0px_rgba(251,191,36,0.05)]">
        <iframe src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`} className="w-full h-[600px] border-none" />
      </div>
    </div>
  </SectionReveal>
);

export default App;
