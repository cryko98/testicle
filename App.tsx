
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Check, Menu, X, Wand2, Download, Loader2, Sparkles, Wallet, Coins, Search, ShoppingCart, ChevronDown, Pencil, Eraser, Trash2, Zap, Rocket, Type, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const CONTRACT_ADDRESS = "4TyZGqRLG3VcHTGMcLBoPUmqYitMVojXinAmkL8xpump";
const X_OFFICIAL_URL = "https://x.com/testicletoken";
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
    viewport={{ once: true, margin: "-50px" }}
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
          className="absolute w-24 h-24 md:w-64 md:h-64"
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
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
      size: `${Math.random() * 6 + 4}px`,
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

const MarqueeBar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-yellow-400 text-black overflow-hidden font-black uppercase border-y-4 border-black select-none pointer-events-none ${className}`}>
    <div className="flex animate-marquee gap-8 md:gap-12 whitespace-nowrap">
      {[...Array(10)].map((_, i) => <span key={i}>TESTICLES ALWAYS BOUNCE - TICKER IS $TESTICLE - </span>)}
    </div>
  </div>
);

const DrawingBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          context.lineCap = 'round';
          context.strokeStyle = THEME_YELLOW;
          context.lineWidth = 5;
          context.fillStyle = "black";
          context.fillRect(0, 0, rect.width, rect.height);
          contextRef.current = context;
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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
    const rect = canvas.getBoundingClientRect();
    context.fillRect(0, 0, rect.width, rect.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-balls.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <SectionReveal id="draw" className="py-16 md:py-24 px-4 md:px-6 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl text-yellow-400 mb-8 md:mb-12 text-center yellow-glow uppercase">DRAW BALLS</h2>
        <div className="bg-yellow-400/5 border-4 border-yellow-400 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-[8px_8px_0px_#451a03]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <button onClick={() => setMode('pen')} className={`p-3 md:p-4 rounded-xl border-2 transition-all ${mode === 'pen' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Pencil size={20} /></button>
              <button onClick={() => setMode('eraser')} className={`p-3 md:p-4 rounded-xl border-2 transition-all ${mode === 'eraser' ? 'bg-yellow-400 text-black border-black' : 'bg-black text-yellow-400 border-yellow-400'}`}><Eraser size={20} /></button>
              <button onClick={clearCanvas} className="p-3 md:p-4 rounded-xl border-2 bg-black text-red-500 border-red-500 hover:bg-red-500 hover:text-black transition-all"><Trash2 size={20} /></button>
              <button onClick={downloadDrawing} className="p-3 md:p-4 rounded-xl border-2 bg-black text-green-500 border-green-500 hover:bg-green-500 hover:text-black transition-all"><Download size={20} /></button>
            </div>
            <div className="relative bg-black rounded-xl overflow-hidden border-2 border-yellow-400/30 cursor-crosshair touch-none h-[350px] md:h-[500px]">
              <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const randomPrompts = [
    "skiing down a mountain of yellow snow",
    "stuck inside a giant yellow snowball",
    "ice fishing in a frozen lake",
    "building a snowman that looks like a giant ball",
    "sledding on a giant gold coin",
    "wearing a tiny yellow winter hat and scarf",
    "eating a yellow popsicle in a snowstorm",
    "ice skating on a vertical trading chart",
    "driving a yellow lambo on the moon",
    "fighting a giant bear with a yellow stick",
    "floating in a sea of yellow bubbles",
    "meditating on top of a giant golden coin"
  ];

  const handleRandomPrompt = () => {
    const random = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(random);
  };

  useEffect(() => {
    const initLogo = async () => {
        try {
            const res = await fetch(LOGO_URL);
            const blob = await res.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.onload = () => { logoRef.current = img; };
        } catch (e) {
            console.error("Logo load failed", e);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = LOGO_URL;
            img.onload = () => { logoRef.current = img; };
        }
    };
    initLogo();
  }, []);

  const generateMeme = async () => {
    if (!canvasRef.current || generating) return;
    setGenerating(true);
    setError(null);

    try {
      // Get logo as base64
      let logoBase64 = "";
      if (logoRef.current) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = logoRef.current.width;
        tempCanvas.height = logoRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(logoRef.current, 0, 0);
          logoBase64 = tempCanvas.toDataURL('image/jpeg').split(',')[1];
        }
      }

      if (!logoBase64) throw new Error("Logo image not loaded");

      const rawPrompt = prompt.trim() ? prompt : "celebrating a victory";

      // Send to backend for AI generation
      const response = await fetch("/api/generate-meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: rawPrompt,
          logoBase64: logoBase64
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate meme");
      }

      const data = await response.json();
      if (!data.base64) throw new Error("No image data returned");

      // Display the AI-generated image
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not available");

      // Load and draw the generated image
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add overlay text if provided
        if (overlayText.trim()) {
          ctx.font = "900 60px 'Permanent Marker'";
          ctx.fillStyle = THEME_YELLOW;
          ctx.strokeStyle = "black";
          ctx.lineWidth = 15;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          const text = overlayText.toUpperCase();
          const textX = canvas.width / 2;
          const textY = canvas.height - 40;

          ctx.strokeText(text, textX, textY);
          ctx.fillText(text, textX, textY);
        }

        setResultImage(canvas.toDataURL("image/png"));
      };

      img.onerror = () => {
        setError("Failed to load generated image");
        setGenerating(false);
      };
      img.src = `data:image/png;base64,${data.base64}`;

    } catch (err: any) {
      console.error("Meme generation error:", err);
      setError(err.message || "Sack overload. Try again in a bit!");
    } finally {
      setGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (resultImage) {
        const link = document.createElement('a');
        link.download = 'testicle-meme.png';
        link.href = resultImage;
        link.click();
    }
  };

  return (
    <SectionReveal id="sack-lab" className="py-16 md:py-24 px-4 md:px-6 bg-black relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <Rocket size={40} className="mx-auto mb-4 md:mb-6 text-yellow-400 animate-bounce" />
          <h2 className="text-5xl md:text-7xl text-yellow-400 mb-2 md:mb-4 yellow-glow uppercase">Sack-Lab</h2>
          <p className="text-lg md:text-xl opacity-60 uppercase tracking-widest italic">AI Scene Generator</p>
        </div>
        <div className="bg-black border-4 border-yellow-400 rounded-2xl md:rounded-[2.5rem] p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div className="space-y-6 order-2 lg:order-1">
              
              {/* INPUT 1: SCENE PROMPT */}
              <div className="bg-yellow-400/10 p-6 rounded-xl border border-yellow-400/30">
                <p className="text-sm text-yellow-400/80 mb-2 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Wand2 size={16}/> WHAT IS THE SACK DOING?
                </p>
                <div className="relative">
                  <input 
                    type="text" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="eating pizza, driving a lambo..." 
                    className="w-full bg-black border-2 border-yellow-400 rounded-xl p-4 pr-12 text-yellow-400 text-xl font-black outline-none focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all placeholder:text-yellow-400/30" 
                  />
                  <button 
                    onClick={handleRandomPrompt}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:scale-110 transition-transform p-2"
                    title="Random Idea"
                  >
                    <Sparkles size={24} />
                  </button>
                </div>
              </div>

              {/* INPUT 2: OVERLAY TEXT */}
              <div className="bg-yellow-400/5 p-4 rounded-xl border border-yellow-400/20">
                <p className="text-sm text-yellow-400/60 mb-2 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Type size={16}/> MEME TEXT (OPTIONAL)
                </p>
                <input 
                  type="text" 
                  value={overlayText} 
                  onChange={(e) => setOverlayText(e.target.value)} 
                  placeholder="GM / HODL / LFG" 
                  className="w-full bg-black border border-yellow-400/50 rounded-lg p-3 text-yellow-400 text-lg font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-yellow-400/20" 
                />
              </div>
              
              <button 
                onClick={generateMeme} 
                disabled={generating} 
                className="w-full bg-yellow-400 text-black font-black text-2xl py-6 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? <Loader2 className="animate-spin w-8 h-8" /> : <Zap className="w-8 h-8 fill-black" />} 
                {resultImage ? "RE-ROLL SACK" : "GENERATE SCENE"}
              </button>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-500/50 justify-center animate-pulse">
                  <AlertCircle size={20} />
                  <span className="text-sm font-bold uppercase">{error}</span>
                </div>
              )}

              {resultImage && (
                  <button onClick={downloadMeme} className="w-full bg-black border-2 border-yellow-400 text-yellow-400 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400/10 transition-all">
                      <Download size={20} /> DOWNLOAD HD
                  </button>
              )}
            </div>

            <div className="order-1 lg:order-2 aspect-square bg-black rounded-2xl border-4 border-dashed border-yellow-400/30 flex items-center justify-center overflow-hidden relative group">
                <canvas ref={canvasRef} width={800} height={800} className="hidden" />
                {generating ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={80} className="text-yellow-400 animate-spin" />
                        <span className="text-yellow-400 animate-pulse font-black tracking-widest">BREWING...</span>
                    </div>
                ) : resultImage ? (
                    <img src={resultImage} alt="Meme" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="text-center opacity-30">
                        <Sparkles size={80} className="mx-auto mb-4" />
                        <span className="font-black text-2xl tracking-widest">READY TO COOK</span>
                    </div>
                )}
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

  const scrollToSection = (id: string) => {
    // 1. Close mobile menu immediately to ensure layout is final
    setIsOpen(false);
    
    // 2. Short timeout to wait for menu closing animation/re-render
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b-2 border-yellow-400/20 py-3 md:py-4 px-4 md:px-6 backdrop-blur-sm">
      <motion.div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-yellow-400 origin-left" style={{ scaleX }} />
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={LOGO_URL} alt="logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-xl md:text-2xl text-yellow-400 yellow-glow uppercase">testicle</span>
        </div>
        <div className="hidden md:flex items-center gap-10 font-black uppercase text-sm tracking-widest">
          {["About", "Sack-Lab", "Draw", "How-to-Buy", "Chart"].map((item) => (
            <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, "-"))} className="hover:text-white transition-colors">{item}</button>
          ))}
          <a href={PUMP_FUN_URL} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black px-6 py-2 rounded-lg shadow-[4px_4px_0px_#78350f] hover:translate-y-[2px] transition-all">BUY</a>
        </div>
        <button className="md:hidden text-yellow-400 p-1" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="md:hidden overflow-hidden bg-black border-t border-yellow-400/20"
          >
            <div className="flex flex-col p-6 gap-2 font-black uppercase tracking-widest text-center">
              {["About", "Sack-Lab", "Draw", "How-to-Buy", "Chart"].map((item) => (
                <button 
                  key={item} 
                  type="button"
                  onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, "-"))} 
                  className="text-2xl text-yellow-400 hover:text-white py-4 w-full active:bg-yellow-400/10 transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4">
                <a 
                  href={PUMP_FUN_URL} 
                  target="_blank" 
                  className="bg-yellow-400 text-black py-5 rounded-xl font-black block text-xl shadow-[4px_4px_0px_#78350f]"
                >
                  BUY $TESTICLE
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const App: React.FC = () => (
  <div className="min-h-screen bg-black text-yellow-400 selection:bg-yellow-400 selection:text-black font-['Permanent_Marker'] overflow-x-hidden">
    <BackgroundDrifters /><Snowfall /><Navbar />
    <div className="pt-[66px] md:pt-[82px] select-none">
      <MarqueeBar className="py-3 md:py-4 text-xl md:text-2xl" />
    </div>
    <main>
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 px-4 md:px-6 text-center overflow-hidden">
        <motion.img animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} src={LOGO_URL} className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 md:mb-12" />
        <h1 className="text-6xl md:text-[12rem] mb-4 yellow-glow uppercase leading-none tracking-tighter break-words">testicle</h1>
        <p className="text-2xl md:text-5xl font-black mb-10 md:mb-16 uppercase opacity-90 tracking-[0.2em] md:tracking-[0.3em]">$testicle</p>
        <div className="bg-yellow-400 text-black border-4 border-black rounded-xl p-3 md:p-4 max-w-full md:max-w-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 shadow-[6px_6px_0px_#78350f] mb-8 md:mb-12 overflow-hidden">
          <code className="text-base md:text-xl font-bold break-all font-mono">{CONTRACT_ADDRESS}</code>
          <button onClick={() => navigator.clipboard.writeText(CONTRACT_ADDRESS)} className="bg-black text-yellow-400 p-2 md:p-3 rounded-lg flex-shrink-0 w-full md:w-auto flex justify-center"><Copy size={20} /></button>
        </div>
        <a href={PUMP_FUN_URL} target="_blank" className="bg-black border-4 border-yellow-400 px-8 py-4 md:px-12 md:py-6 rounded-2xl text-xl md:text-3xl hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_rgba(251,191,36,0.2)] inline-block uppercase font-black">🚀 TO PUMP.FUN</a>
      </section>
      <About />
      <MemeGenerator />
      <DrawingBoard />
      <HowToBuy />
      <Chart />
    </main>
    <MarqueeBar className="py-8 md:py-12 text-2xl md:text-4xl" />
    <footer className="py-12 md:py-20 bg-black text-center border-t-4 border-yellow-400/10 px-6">
      <img src={LOGO_URL} alt="logo" className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 grayscale hover:grayscale-0 transition-all" />
      <div className="flex justify-center gap-8 mb-8">
        <a href={X_OFFICIAL_URL} target="_blank" className="hover:scale-110 transition-transform"><XLogo size={32} /></a>
        <a href={PUMP_FUN_URL} target="_blank" className="hover:scale-110 transition-transform"><ShoppingCart size={32} /></a>
      </div>
      <p className="opacity-40 italic tracking-widest uppercase text-xs">© 2025 $testicle. DYOR.</p>
    </footer>
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 20s linear infinite; display: inline-flex; }
      @keyframes fall { 0% { transform: translateY(-100px) rotate(0); } 100% { transform: translateY(110vh) rotate(360deg); } }
      .animate-fall { animation: fall linear infinite; }
      html { scroll-behavior: smooth; }
    `}</style>
  </div>
);

const About: React.FC = () => (
  <SectionReveal id="about" className="py-16 md:py-24 px-4 md:px-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-6xl text-yellow-400 mb-8 md:mb-12 text-center yellow-glow uppercase underline decoration-4 underline-offset-8">The Story</h2>
      <div className="bg-black border-4 border-yellow-400 p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-[10px_10px_0px_#451a03]">
        <p className="text-3xl md:text-5xl font-black text-center text-yellow-400 leading-tight mb-8 md:mb-12 uppercase">EVERY SINGLE ONE OF YOU CAME FROM A $TESTICLE.</p>
        <div className="w-full h-1 bg-yellow-400/20 my-6 md:my-8"></div>
        <p className="text-center text-3xl md:text-5xl font-black italic uppercase text-yellow-400">SACK UP.</p>
      </div>
    </div>
  </SectionReveal>
);

const HowToBuy: React.FC = () => (
  <SectionReveal id="how-to-buy" className="py-16 md:py-24 px-4 md:px-6 bg-black">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-6xl text-yellow-400 mb-12 text-center yellow-glow uppercase">Instructions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {[
          { t: "WALLET", d: "Get Phantom.", i: <Wallet size={28} /> },
          { t: "SOL", d: "Load up on SOL. Transfers are instant.", i: <Coins size={28} /> },
          { t: "PUMP", d: "Paste the CA on Pump.fun search bar.", i: <Search size={28} /> },
          { t: "SWAP", d: "Swap SOL for $TESTICLE. Feel the tingle.", i: <ShoppingCart size={28} /> }
        ].map((step, idx) => (
          <div key={idx} className="bg-black border-4 border-yellow-400 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-[6px_6px_0px_rgba(251,191,36,0.1)]">
            <div className="bg-yellow-400 text-black p-3 rounded-xl inline-block mb-4 md:mb-6">{step.i}</div>
            <h3 className="text-2xl md:text-4xl font-black text-yellow-400 uppercase mb-2 md:mb-4">{step.t}</h3>
            <p className="text-lg md:text-2xl opacity-70 italic">{step.d}</p>
          </div>
        ))}
      </div>
    </div>
  </SectionReveal>
);

const Chart: React.FC = () => (
  <SectionReveal id="chart" className="py-16 md:py-24 px-4 md:px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-6xl text-yellow-400 mb-8 md:mb-12 text-center yellow-glow uppercase">Real-Time Data</h2>
      <div className="bg-black border-4 border-yellow-400 rounded-2xl md:rounded-3xl overflow-hidden shadow-[10px_10px_0px_rgba(251,191,36,0.05)]">
        <iframe 
          src={`https://dexscreener.com/solana/${CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0`} 
          className="w-full h-[450px] md:h-[600px] border-none bg-black" 
          title="Dexscreener Chart"
          loading="lazy"
        />
      </div>
    </div>
  </SectionReveal>
);

export default App;
