
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, ExternalLink, Menu, X, Wand2, RefreshCw, Download, Loader2, Sparkles, Wallet, Coins, Search, ShoppingCart, ChevronDown, Pencil, Eraser, Trash2, Terminal as TerminalIcon, Send, Minus, Square } from 'lucide-react';
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

const Terminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', content: string }[]>([
    { 
      role: 'agent', 
      content: "SYSTEM INITIALIZED... TESTICLE AGENT V4.0 ONLINE.\n\n[CORE SPECS]: Multi-layered market analyst, Solana ecosystem specialist, and universal wit engine.\n\n[NOTICE]: I can discuss high-frequency trading, explain quantum entanglement with stick figures, or roast your portfolio with professional-grade humor.\n\nAsk me for a market dump, a joke, or the meaning of life. I'm listening." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: "You are Testicle Agent, a professional crypto expert, memecoin specialist, and a witty general conversationalist. You are highly intelligent and possess a great sense of humor—sarcastic, playful, and sharp. You have deep knowledge of the Solana ecosystem and technical analysis, but you are also an expert in history, science, philosophy, and pop culture. You can talk about anything, and you always maintain your 'cool terminal agent' persona. Be funny, make jokes, use occasional terminal-style formatting (e.g., [ANALYSIS], [JOKE_MODE]), and provide high-level insights. You advocate for $TESTICLE but give honest, technically sound advice. You know everything about recent crypto trends and memecoin culture.",
            temperature: 0.9,
          }
        });
      }

      const result = await chatRef.current.sendMessage({ message: userMsg });
      const agentText = result.text || "Connection lost... Signal noise detected.";
      setMessages(prev => [...prev, { role: 'agent', content: agentText }]);
    } catch (err) {
      console.error("Terminal Error:", err);
      setMessages(prev => [...prev, { role: 'agent', content: "ERROR: CRITICAL API FAILURE. SHIELD YOUR PORTFOLIO, THE ALPHA IS TOO STRONG." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none"
    >
      <div className="w-full max-w-2xl h-[600px] bg-[#050505] border-2 border-yellow-400 rounded-lg shadow-[0_0_40px_rgba(251,191,36,0.2)] flex flex-col overflow-hidden pointer-events-auto font-mono">
        {/* Header */}
        <div className="bg-yellow-400 text-black px-4 py-2 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <TerminalIcon size={18} />
            <span>TESTICLE_TERMINAL_v4.0.exe</span>
          </div>
          <div className="flex items-center gap-3">
            <Minus size={18} className="cursor-pointer hover:opacity-70" />
            <Square size={14} className="cursor-pointer hover:opacity-70" />
            <X size={20} className="cursor-pointer hover:opacity-70" onClick={onClose} />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg ${m.role === 'user' ? 'bg-yellow-400 text-black shadow-[4px_4px_0_#451a03]' : 'bg-black/80 border border-yellow-400/30 text-yellow-400 shadow-[4px_4px_0_rgba(251,191,36,0.1)]'}`}>
                <div className="text-[10px] opacity-60 mb-1 uppercase tracking-widest font-black">
                  {m.role === 'user' ? 'ROOT@SOLANA' : 'TESTICLE@AGENT'}
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start">
              <div className="bg-black border border-yellow-400/30 text-yellow-400 p-3 rounded-lg animate-pulse">
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  ANALYZING BLOCKCHAIN & UNIVERSE...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-black border-t border-yellow-400/20">
          <div className="relative flex items-center gap-2">
            <span className="text-yellow-400 font-bold">$</span>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for alpha, a joke, or anything..."
              className="flex-1 bg-transparent text-yellow-400 border-none outline-none placeholder:text-yellow-400/30 text-sm"
              autoFocus
            />
            <button 
              onClick={handleSend}
              className="text-yellow-400 hover:text-white transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

    // Set display size
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
    
    // Fill background black initially
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
      // Prevent scrolling while drawing on touch devices
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
            {/* Toolbar */}
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

            {/* Canvas Container */}
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
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
                placeholder="Describe your meme idea (e.g. Testicle in a blizzard...)"
                className="w-full bg-black border-2 border-yellow-400/50 rounded-xl p-6 text-xl text-yellow-100 placeholder:text-yellow-400/30 focus:border-yellow-400 outline-none transition-all resize-none h-32"
              />
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPrompt(randomPrompts[Math.floor(Math.random() * randomPrompts.length)])}
                className="absolute right-4 bottom-4 text-yellow-400 hover:text-white transition-colors p-2"
                title="Shuffle Prompt"
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
                className="bg-yellow-400 text-black font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[6px_6px_0px_#78350f]"
              >
                {generating ? <Loader2 className="animate-spin" size={28} /> : <Wand2 size={28} />}
                COOK THE MEME
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRandomMeme}
                disabled={generating}
                className="bg-black text-yellow-400 border-4 border-yellow-400 font-black text-2xl py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 shadow-[6px_6px_0px_rgba(251,191,36,0.2)]"
              >
                <Sparkles size={28} />
                RANDOM MEME
              </motion.button>
            </div>

            {error && <p className="text-red-500 text-center font-bold text-lg uppercase">{error}</p>}

            <AnimatePresence>
              {resultImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-8"
                >
                  <div className="relative group rounded-2xl overflow-hidden border-4 border-yellow-400 bg-black aspect-square max-w-md mx-auto shadow-[15px_15px_0px_rgba(251,191,36,0.1)]">
                    <img src={resultImage} alt="Generated Meme" className="w-full h-full object-cover" />
                    <motion.a 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={resultImage} 
                      download="testicle-meme.png"
                      className="absolute top-4 right-4 bg-yellow-400 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Download size={24} />
                    </motion.a>
                  </div>
                  <p className="text-center text-yellow-400/60 mt-4 text-lg uppercase tracking-tighter italic">Hand-drawn Stick Masterpiece</p>
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
    <section className="pt-40 pb-24 px-6 relative overflow-hidden bg-black flex flex-col items-center">
      <div className="max-w-4xl mx-auto text-center z-10">
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
          $testicle
        </motion.p>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="bg-yellow-400 text-black border-4 border-black rounded-xl p-4 w-full max-w-xl flex items-center justify-between gap-4 shadow-[6px_6px_0px_rgba(251,191,36,0.4)]">
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
    </section>
  );
};

const About: React.FC = () => {
  return (
    <SectionReveal id="about" className="py-24 px-6 bg-yellow-400/5 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">About $testicle</h2>
        <motion.div 
          whileHover={{ rotate: 1, scale: 1.01 }}
          className="bg-black border-4 border-yellow-400 p-10 md:p-16 rounded-3xl shadow-[10px_10px_0px_#451a03] relative overflow-hidden group"
        >
          <div className="space-y-8 text-2xl md:text-3xl leading-snug">
            <p>
              This coin was launched by the <span className="text-yellow-400 font-black">$snowball dev</span>, who used <span className="text-yellow-400 font-black">testicle</span> to battle-test the <span className="underline decoration-yellow-400 decoration-4">snowball tech</span>.
            </p>
            <p>
              It started as a technical demonstration, but it quickly grew into something much bigger. Now, the project is under the visionary leadership of <a href={CTO_LEADER_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline decoration-2 underline-offset-8 hover:text-white transition-colors">@tisgambino</a> as the CTO leader.
            </p>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-yellow-400 text-3xl md:text-4xl pt-6 italic border-t-2 border-yellow-400/20"
            >
              "The plan is simple: drive this project to a multi-million market cap."
            </motion.p>
          </div>
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-yellow-400/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"
          />
        </motion.div>
      </div>
    </SectionReveal>
  );
};

const HowToBuy: React.FC = () => {
  const steps = [
    {
      title: "CREATE WALLET",
      desc: "Download Phantom or your wallet of choice from the app store or google play store for free. Desktop users, download the google chrome extension by going to phantom.app.",
      icon: <Wallet size={32} />
    },
    {
      title: "GET SOME SOL",
      desc: "Have SOL in your wallet to switch to $testicle. If you don’t have any SOL, you can buy directly on phantom, transfer from another wallet, or buy on another exchange and send it to your wallet.",
      icon: <Coins size={32} />
    },
    {
      title: "GO TO PUMP.FUN",
      desc: "Go to pump.fun and search for the contract address or click the button on this site to go directly to the $testicle page.",
      icon: <Search size={32} />
    },
    {
      title: "SWITCH SOL FOR $TESTICLE",
      desc: "Paste the CA into pump.fun and confirm the swap. We have zero taxes so you don’t need to worry about buying with a specific slippage, although you may need to increase during times of volatility.",
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
              whileHover={{ y: -10, boxShadow: "0px 20px 40px rgba(251, 191, 36, 0.1)" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
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
        <div className="mt-16 text-center">
          <motion.a 
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.9 }}
            href={PUMP_FUN_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-yellow-400 text-black font-black text-3xl px-12 py-6 rounded-2xl shadow-[10px_10px_0px_#451a03]"
          >
            BUY $TESTICLE ON PUMP.FUN
          </motion.a>
        </div>
      </div>
    </SectionReveal>
  );
};

const Chart: React.FC = () => {
  return (
    <SectionReveal id="chart" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">$testicle Live Chart</h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="w-full bg-black border-4 border-yellow-400 rounded-3xl overflow-hidden shadow-[10px_10px_0px_#451a03]"
        >
          <iframe 
            src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Dexscreener Chart"
          />
        </motion.div>
      </div>
    </SectionReveal>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t-4 border-yellow-500/20 px-6 bg-black z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-6">
          <motion.img 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            src={LOGO_URL} alt="logo" className="w-16 h-16 object-contain" 
          />
          <div className="text-left">
            <h3 className="text-4xl text-yellow-400 leading-none uppercase">testicle</h3>
            <p className="text-lg font-bold opacity-60 uppercase tracking-tighter">by $snowball dev</p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="mb-6 text-2xl font-bold">Led by <a href={CTO_LEADER_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-white underline underline-offset-4 decoration-2">@tisgambino</a></p>
          <div className="flex justify-center md:justify-end gap-10">
            <motion.a whileHover={{ y: -5 }} href={X_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400"><XLogo size={40} /></motion.a>
            <motion.a whileHover={{ y: -5 }} href={PUMP_FUN_URL} target="_blank" rel="noopener noreferrer" className="text-yellow-400"><ExternalLink size={40} /></motion.a>
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
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-yellow-400 selection:text-black bg-black">
      <BackgroundDrifters />
      <Snowfall />

      {/* Terminal Launcher */}
      <div className="fixed top-24 left-6 z-[60]">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251,191,36,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTerminalOpen(true)}
          className="bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg font-mono flex items-center gap-2 text-sm shadow-[4px_4px_0_rgba(251,191,36,0.2)]"
        >
          <TerminalIcon size={16} />
          TESTICLE TERMINAL
        </motion.button>
      </div>

      <AnimatePresence>
        {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      <Navbar />
      
      <main>
        <Hero />
        <About />
        <MemeGenerator />
        <DrawingBoard />
        <HowToBuy />
        <Chart />
      </main>
      
      <div className="py-12 bg-yellow-400 text-black flex overflow-hidden whitespace-nowrap font-black text-5xl uppercase select-none border-y-4 border-black relative z-10">
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
        /* Custom terminal scrollbar */
        .flex-1::-webkit-scrollbar {
          width: 4px;
        }
        .flex-1::-webkit-scrollbar-track {
          background: transparent;
        }
        .flex-1::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default App;
