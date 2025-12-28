
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, Menu, X, Wand2, RefreshCw, Download, Loader2, Sparkles, Wallet, Coins, Search, ShoppingCart, ChevronDown, Pencil, Eraser, Trash2, Zap, Rocket, Type, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { HfInference } from "@huggingface/inference";

const CONTRACT_ADDRESS = "4TyZGqRLG3VcHTGMcLBoPUmqYitMVojXinAmkL8xpump";
const X_COMMUNITY_URL = "https://x.com/i/communities/2002717537985773778";
const LOGO_URL = "https://pbs.twimg.com/media/G8sWdI6bEAEnZWB?format=jpg&name=240x240";
const PUMP_FUN_URL = `https://pump.fun/coin/${CONTRACT_ADDRESS}`;
const THEME_YELLOW = "#fbbf24";

// Vite client-side exposed variables MUST have VITE_ prefix.
// This function checks all possible locations for the token.
const getHFToken = (): string => {
  // @ts-ignore
  const viteToken = import.meta.env?.VITE_HF_TOKEN;
  if (viteToken) return viteToken;

  // @ts-ignore
  const viteApiKey = import.meta.env?.VITE_API_KEY;
  if (viteApiKey) return viteApiKey;

  // Fallback for process.env (less common in pure Vite client builds)
  const processToken = (process.env as any).VITE_HF_TOKEN || process.env.API_KEY || (process.env as any).HF_TOKEN;
  if (processToken) return processToken;

  return "";
};

const HF_TOKEN = getHFToken();
const HF_MODEL = "Tongyi-MAI/Z-Image-Turbo"; 

const XLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {[...Array(6)].map((_, i) => (
        <motion.img
          key={i}
          src={LOGO_URL}
          className="absolute w-32 h-32 md:w-64 md:h-64"
          initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", rotate: Math.random() * 360 }}
          animate={{ x: [null, Math.random() * 100 + "%"], y: [null, Math.random() * 100 + "%"], rotate: [null, Math.random() * 360] }}
          transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />
      ))}
    </div>
  );
};

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
        <div key={flake.id} className="absolute text-yellow-400 animate-fall" style={{ left: flake.left, top: '-20px', opacity: flake.opacity, fontSize: flake.size, animationDuration: flake.animationDuration, animationDelay: flake.animationDelay }}>●</div>
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

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    const rect = canvas.getBoundingClientRect();
    let offsetX, offsetY;
    if ('touches' in e) {
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let offsetX, offsetY;
    if ('touches' in e) {
      offsetX = e.touches[0].clientX - rect.left;
      offsetY = e.touches[0].clientY - rect.top;
      if (e.cancelable) e.preventDefault();
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    contextRef.current.strokeStyle = mode === 'pen' ? THEME_YELLOW : 'black';
    contextRef.current.lineWidth = mode === 'pen' ? 5 : 20;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
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
    link.download = 'my-testicle-character.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <SectionReveal id="draw" className="py-24 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-4 text-center yellow-glow uppercase">Draw your own Testicle character</h2>
        <p className="text-center text-xl mb-12 opacity-80 uppercase tracking-widest italic">Channel your inner Dev</p>
        <div className="bg-yellow-900/10 border-4 border-yellow-400 rounded-3xl p-4 md:p-8 shadow-[10px_10px_0px_rgba(251,191,36,0.1)]">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setMode('pen')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'pen' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Pencil size={24} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setMode('eraser')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'eraser' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Eraser size={24} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={clearCanvas} className="p-4 rounded-xl border-2 bg-black text-red-500 border-red-500 hover:bg-red-500 hover:text-black transition-all"><Trash2 size={24} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={downloadDrawing} className="p-4 rounded-xl border-2 bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black transition-all"><Download size={24} /></motion.button>
            </div>
            <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-yellow-400/30 cursor-crosshair touch-none">
              <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-[400px] md:h-[500px]" />
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
      if (!HF_TOKEN) {
        throw new Error("HIÁNYZÓ TOKEN: Nevezd át Vercelen a változót 'VITE_HF_TOKEN'-re és csinálj egy Redeploy-t!");
      }

      const client = new HfInference(HF_TOKEN);
      const styleRules = `Hand-drawn doodle style, crude yellow marker on pitch black background, 2D simple character.`;
      const finalInputs = `${styleRules} SCENE: ${activePrompt}. ${memeText ? `TEXT: ${memeText}` : ""}`;

      const response = await client.textToImage({
        model: HF_MODEL,
        inputs: finalInputs,
        provider: "fal-ai",
        parameters: { num_inference_steps: 5 }
      } as any);

      if (!(response instanceof Blob)) throw new Error("API hiba: nem kép érkezett vissza.");
      setResultImage(URL.createObjectURL(response));

    } catch (err: any) {
      console.error("Meme generation error:", err);
      if (err.message?.includes("fetch") || err.name === "TypeError") {
        setError("FAILED TO FETCH: A böngésző nem éri el a Hugging Face-t. Ellenőrizd a VITE_HF_TOKEN-t és Redeploy-t a Vercelen!");
      } else {
        setError(err.message || "Hiba történt a generálás során.");
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SectionReveal id="meme-lab" className="py-24 px-6 bg-black relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="inline-block bg-yellow-400 text-black p-4 rounded-2xl mb-6 shadow-[0_0_50px_rgba(251,191,36,0.4)]"><Rocket size={40} fill="currentColor" /></motion.div>
          <h2 className="text-6xl md:text-7xl text-yellow-400 mb-4 yellow-glow uppercase">meme-lab</h2>
          <p className="text-xl opacity-60 uppercase tracking-[0.3em]">AI Generator via Fal.ai</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/20 to-black border-4 border-yellow-400 rounded-[3rem] p-8 md:p-12 shadow-[30px_30px_0px_rgba(251,191,36,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <label className="text-yellow-400 text-sm font-black uppercase tracking-widest block">Scenario</label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Testicle in space..." className="w-full bg-black border-2 border-yellow-400/30 rounded-2xl p-4 text-lg text-yellow-100 outline-none focus:border-yellow-400 h-32" />
                <label className="text-yellow-400 text-sm font-black uppercase tracking-widest block">Text Overlay</label>
                <input type="text" value={memeText} onChange={(e) => setMemeText(e.target.value)} placeholder="e.g. TO THE MOON" className="w-full bg-black border-2 border-yellow-400/30 rounded-xl p-4 text-lg text-yellow-100 outline-none focus:border-yellow-400" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => generateMeme()} disabled={generating || !prompt.trim()} className="w-full bg-yellow-400 text-black font-black text-2xl py-6 rounded-2xl shadow-[0_10px_0_#78350f] disabled:opacity-50">
                {generating ? <Loader2 className="animate-spin mx-auto" /> : "INITIATE ENGINE"}
              </motion.button>
              {error && <div className="p-4 bg-red-950/40 border-2 border-red-500 rounded-xl text-red-500 text-sm flex gap-3 italic"><AlertCircle className="shrink-0" /> {error}</div>}
            </div>
            <div className="lg:col-span-7 min-h-[400px] bg-black/40 rounded-3xl border-2 border-dashed border-yellow-400/20 flex items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><Loader2 size={64} className="animate-spin text-yellow-400 mx-auto mb-4" /><p className="text-yellow-400 uppercase font-bold tracking-widest">Generating...</p></motion.div>
                ) : resultImage ? (
                  <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={resultImage} className="max-w-full h-full object-contain" />
                ) : (
                  <p className="text-yellow-400/20 font-black uppercase text-3xl italic">Ready</p>
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
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b-2 border-yellow-500/30 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo(0, 0)}><img src={LOGO_URL} className="w-12 h-12" /><span className="text-2xl text-yellow-400 uppercase">testicle</span></div>
        <div className="hidden md:flex gap-8 items-center font-bold uppercase">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#meme-lab" className="hover:text-white transition-colors">Meme Lab</a>
          <a href="#draw" className="hover:text-white transition-colors">Draw</a>
          <a href={PUMP_FUN_URL} className="bg-yellow-400 text-black px-6 py-2 rounded-lg">BUY NOW</a>
        </div>
        <button className="md:hidden text-yellow-400" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copyCA = () => { navigator.clipboard.writeText(CONTRACT_ADDRESS); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <section className="pt-40 pb-20 px-6 text-center">
      <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={LOGO_URL} className="w-64 h-64 mx-auto mb-10 shadow-[0_0_80px_rgba(251,191,36,0.2)] rounded-full" />
      <h1 className="text-8xl md:text-[12rem] text-yellow-400 uppercase leading-none mb-4">testicle</h1>
      <div className="bg-yellow-400 text-black font-bold p-4 rounded-xl max-w-xl mx-auto flex justify-between gap-4 mb-8">
        <code className="text-xs md:text-lg break-all">{CONTRACT_ADDRESS}</code>
        <button onClick={copyCA}>{copied ? <Check /> : <Copy />}</button>
      </div>
      <a href={PUMP_FUN_URL} className="inline-block bg-black border-4 border-yellow-400 px-10 py-5 text-2xl uppercase hover:bg-yellow-400 hover:text-black transition-all">🚀 Buy on Pump.fun</a>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="py-10 border-t-2 border-yellow-500/10 text-center opacity-40 uppercase tracking-widest text-sm">© 2025 $TESTICLE • FOR TECHNICAL TESTING ONLY</footer>
);

const App: React.FC = () => (
  <div className="min-h-screen bg-black">
    <BackgroundDrifters /><Snowfall /><Navbar />
    <main><Hero /><MemeGenerator /><DrawingBoard /></main>
    <Footer />
    <style>{`
      @keyframes fall { 0% { transform: translateY(-100px); } 100% { transform: translateY(110vh); } }
      .animate-fall { animation: fall linear infinite; }
    `}</style>
  </div>
);

export default App;
