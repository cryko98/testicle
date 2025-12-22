
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, ExternalLink, Menu, X, Wand2, RefreshCw, Download, Loader2, Sparkles, Wallet, Coins, Search, ShoppingCart, ChevronDown, Pencil, Eraser, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const CONTRACT_ADDRESS = "4TyZGqRLG3VcHTGMcLBoPUmqYitMVojXinAmkL8xpump";
const X_COMMUNITY_URL = "https://x.com/i/communities/2002717537985773778";
const CTO_LEADER_URL = "https://x.com/tisgambino";
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
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const BackgroundDrifters: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {[...Array(6)].map((_, i) => (
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
            duration: Math.random() * 20 + 20,
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
    if (contextRef.current) {
      contextRef.current.closePath();
    }
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMode('pen')}
                className={`p-4 rounded-xl border-2 transition-all ${mode === 'pen' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}
              >
                <Pencil size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMode('eraser')}
                className={`p-4 rounded-xl border-2 transition-all ${mode === 'eraser' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}
              >
                <Eraser size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearCanvas}
                className="p-4 rounded-xl border-2 bg-black text-red-500 border-red-500 hover:bg-red-500 hover:text-black transition-all"
              >
                <Trash2 size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={downloadDrawing}
                className="p-4 rounded-xl border-2 bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black transition-all"
              >
                <Download size={24} />
              </motion.button>
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
            
            <p className="text-center text-yellow-400/40 text-sm uppercase tracking-widest font-bold">
              Tip: Draw a circle with two dots and a stick body
            </p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const randomPrompts = [
    "Yellow stick hero skiing down a mountain of gold",
    "Yellow stick hero stuck inside a giant golden snowball",
    "Yellow stick hero ice fishing and catching a golden coin",
    "Yellow stick hero sledding on a coin through a blizzard",
    "Yellow stick hero wearing a tiny winter hat and scarf",
    "Yellow stick hero eating a yellow popsicle in a snowstorm",
    "Yellow stick hero ice skating on a trading chart",
    "Yellow stick hero building a snow fort made of coins"
  ];

  const generateMeme = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim() || generating) return;
    
    setGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // SANITIZATION: We strictly avoid the "testicle" word in the AI prompt to avoid safety filters.
      const visualDescription = "minimalist 2D yellow stick figure character. The head is a hand-drawn thick yellow circular outline, the interior of the face is solid black, and there are two small yellow dots for eyes.";
      const cleanedPrompt = activePrompt.replace(/testicle/gi, "yellow hero character");

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a funny minimalist 2D meme.
              CHARACTER: ${visualDescription}
              SCENE: ${cleanedPrompt}.
              BACKGROUND: Solid deep black (#000000).
              STYLE: Very simple rough digital sketch, minimalist doodle.
              COLORS: strictly use only Yellow (#fbbf24) and Black (#000000).`
            }
          ]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
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
      
      if (!foundImage) {
        setError("PROMPT BLOCKED BY AI FILTERS. TRY SOMETHING ELSE.");
      }
    } catch (err) {
      console.error(err);
      setError("FAILED TO COOK THE MEME. TRY AGAIN!");
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
    <SectionReveal id="meme-lab" className="py-24 px-6 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-4 text-center yellow-glow uppercase">Meme Lab</h2>
        <p className="text-center text-xl mb-12 opacity-80 uppercase tracking-widest">Black Face • Yellow Outline • Yellow Body</p>
        
        <div className="bg-yellow-900/10 border-4 border-yellow-400 rounded-3xl p-6 md:p-10 shadow-[10px_10px_0px_rgba(251,191,36,0.2)]">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your meme idea (e.g. Hero in a blizzard...)"
                className="w-full bg-black border-2 border-yellow-400/50 rounded-xl p-6 text-xl text-yellow-100 placeholder:text-yellow-400/30 focus:border-yellow-400 outline-none transition-all resize-none h-32"
              />
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)])}
                className="absolute right-4 bottom-4 text-yellow-400 hover:text-white transition-colors p-2"
              >
                <RefreshCw size={24} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#fef08a" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateMeme()}
                disabled={generating || !prompt.trim()}
                className="bg-yellow-400 text-black font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all disabled:opacity-50 shadow-[6px_6px_0px_#78350f]"
              >
                {generating ? <Loader2 className="animate-spin" size={28} /> : <Wand2 size={28} />}
                COOK THE MEME
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRandomMeme}
                disabled={generating}
                className="bg-black text-yellow-400 border-4 border-yellow-400 font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50"
              >
                <Sparkles size={28} />
                RANDOM MEME
              </motion.button>
            </div>

            {error && <p className="text-red-500 text-center font-bold text-lg uppercase">{error}</p>}

            <AnimatePresence>
              {resultImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-8"
                >
                  <div className="relative group rounded-2xl overflow-hidden border-4 border-yellow-400 bg-black aspect-square max-w-md mx-auto shadow-[15px_15px_0px_rgba(251,191,36,0.1)]">
                    <img src={resultImage} alt="Generated Meme" className="w-full h-full object-cover" />
                    <motion.a 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={resultImage} 
                      download="meme.png"
                      className="absolute top-4 right-4 bg-yellow-400 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download size={24} />
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b-2 border-yellow-500/30 py-4 px-6">
      <motion.div 
        className="absolute bottom-[-2px] left-0 right-0 h-1 bg-yellow-400 origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center gap-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <img src={LOGO_URL} alt="logo" className="w-14 h-14 object-contain" />
          <span className="text-3xl tracking-tighter text-yellow-400 yellow-glow uppercase">testicle</span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10 font-bold uppercase text-lg">
          {["About", "Meme-Lab", "Draw", "How-to-Buy", "Chart"].map((item) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="hover:text-white transition-colors relative group"
              whileHover={{ y: -2 }}
            >
              {item.replace("-", " ")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full" />
            </motion.a>
          ))}
          <a href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
            Community <XLogo size={18} />
          </a>
          <motion.a 
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            href={PUMP_FUN_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_#78350f]"
          >
            BUY NOW
          </motion.a>
        </div>

        <button className="md:hidden text-yellow-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black border-b-2 border-yellow-500/30 p-8 flex flex-col gap-8 text-2xl text-center overflow-hidden"
          >
            {["About", "Meme-Lab", "Draw", "How-to-Buy", "Chart"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)}>{item.replace("-", " ")}</a>
            ))}
            <a href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer">Community</a>
            <a 
              href={PUMP_FUN_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-yellow-400 text-black py-4 rounded-lg shadow-[4px_4px_0px_#78350f]"
            >
              BUY NOW
            </a>
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="pt-40 pb-24 px-6 relative overflow-hidden bg-black flex flex-col items-center text-center">
      <div className="max-w-4xl mx-auto z-10">
        <motion.div 
          className="mb-10 inline-block relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
           <motion.img 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0, -5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             src={LOGO_URL} 
             alt="Testicle Hero" 
             className="w-56 h-56 md:w-80 md:h-80 object-contain mx-auto" 
           />
           <motion.div 
            initial={{ rotate: 12, scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 rotate-12 text-xl font-bold animate-pulse uppercase"
           >
             $TESTICLE
           </motion.div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl md:text-[10rem] mb-2 text-yellow-400 tracking-tighter yellow-glow uppercase leading-none"
        >
          testicle
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-5xl font-bold mb-12 tracking-widest uppercase opacity-90"
        >
          $testicle - the tech tester
        </motion.p>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="bg-yellow-400 text-black border-4 border-black rounded-xl p-4 w-full max-w-xl mx-auto flex items-center justify-between gap-4 shadow-[6px_6px_0px_rgba(251,191,36,0.4)]">
            <code className="text-sm md:text-xl font-bold break-all leading-tight">
              {CONTRACT_ADDRESS}
            </code>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyCA}
              className="bg-black text-yellow-400 p-3 rounded-lg shrink-0"
            >
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.a 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              href={PUMP_FUN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black border-4 border-yellow-400 px-10 py-5 rounded-xl text-2xl hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_rgba(251,191,36,0.3)]"
            >
              🚀 BUY ON PUMP.FUN
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-20 text-yellow-400/30"
      >
        <ChevronDown size={48} />
      </motion.div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <SectionReveal id="about" className="py-24 px-6 bg-yellow-400/5 relative">
      <div className="max-w-4xl mx-auto border-4 border-yellow-400 p-10 md:p-16 rounded-3xl bg-black shadow-[10px_10px_0px_#451a03]">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">About $testicle</h2>
        <div className="space-y-8 text-2xl md:text-3xl leading-snug">
          <p>
            This coin was launched by the <span className="text-yellow-400 font-black">$snowball dev</span>, who used <span className="text-yellow-400 font-black">testicle</span> to battle-test the tech.
          </p>
          <p>
            Now, the project is under the visionary leadership of <a href={CTO_LEADER_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline underline-offset-8">@tisgambino</a>.
          </p>
          <p className="text-yellow-400 pt-6 italic border-t-2 border-yellow-400/20">
            "Driven by community, tested by tech."
          </p>
        </div>
      </div>
    </SectionReveal>
  );
};

const HowToBuy: React.FC = () => {
  const steps = [
    {
      title: "CREATE WALLET",
      desc: "Download Phantom or your wallet of choice for free. Desktop users can get the browser extension.",
      icon: <Wallet size={32} />
    },
    {
      title: "GET SOME SOL",
      desc: "Buy SOL directly in Phantom or transfer from an exchange to your wallet address.",
      icon: <Coins size={32} />
    },
    {
      title: "GO TO PUMP.FUN",
      desc: "Paste the contract address on pump.fun to find the $testicle page.",
      icon: <Search size={32} />
    },
    {
      title: "SWAP FOR $TESTICLE",
      desc: "Switch your SOL for $testicle. Zero tax project, so slippage isn't usually an issue.",
      icon: <ShoppingCart size={32} />
    }
  ];

  return (
    <SectionReveal id="how-to-buy" className="py-24 px-6 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl text-yellow-400 mb-16 text-center yellow-glow uppercase">How to Buy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black border-4 border-yellow-400 p-8 rounded-3xl shadow-[8px_8px_0px_#451a03] flex flex-col items-start gap-4 h-full"
            >
              <div className="bg-yellow-400 text-black p-4 rounded-xl flex items-center justify-center mb-2">
                {step.icon}
              </div>
              <h3 className="text-3xl font-black text-yellow-400 leading-tight">STEP {idx + 1}: {step.title}</h3>
              <p className="text-xl opacity-80 font-bold leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

const Chart: React.FC = () => {
  return (
    <SectionReveal id="chart" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 yellow-glow uppercase">Live Chart</h2>
        <div className="w-full bg-black border-4 border-yellow-400 rounded-3xl overflow-hidden h-[600px] shadow-[10px_10px_0px_#451a03]">
          <iframe 
            src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
            className="w-full h-full border-none"
            title="Chart"
          />
        </div>
      </div>
    </SectionReveal>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <BackgroundDrifters />
      <Snowfall />

      <Navbar />
      
      <main>
        <Hero />
        <About />
        <MemeGenerator />
        <DrawingBoard />
        <HowToBuy />
        <Chart />
      </main>
      
      <div className="py-12 bg-yellow-400 text-black flex overflow-hidden font-black text-5xl uppercase border-y-4 border-black relative z-10">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
           {[...Array(10)].map((_, i) => (
             <span key={i}>$TESTICLE TECH • CTO BY @TISGAMBINO • MILLIONS SOON • </span>
           ))}
        </div>
      </div>

      <footer className="py-20 text-center bg-black border-t-4 border-yellow-500/20">
        <img src={LOGO_URL} alt="logo" className="w-16 h-16 mx-auto mb-6 opacity-50" />
        <p className="opacity-40 uppercase tracking-widest italic">© 2025 $TESTICLE. NO FINANCIAL ADVICE.</p>
      </footer>

      <style>{`
        ::selection { background-color: #fbbf24; color: #000; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @keyframes fall { 0% { transform: translateY(-100px); } 100% { transform: translateY(110vh); } }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
