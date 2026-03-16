import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Video, Activity, HardDrive, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils.ts";

interface CameraFeedProps {
  signalStatus: "green" | "yellow" | "red";
  cameraName?: string;
  vehicleCount?: number;
  intersection?: string;
  active?: boolean;
}

export default function CameraFeed({
  signalStatus,
  cameraName = "CAM-N01",
  vehicleCount = 45,
  intersection = "Main St & 1st Ave",
  active = true
}: CameraFeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Simulated WebGL/Canvas mock feed rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let t = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Base background (dark asphalt/night feel)
      ctx.fillStyle = "#0c0f16";
      ctx.fillRect(0, 0, w, h);

      // Grid overlay
      ctx.strokeStyle = "rgba(45, 212, 191, 0.05)"; // teal tint
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < w; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
      for (let i = 0; i < h; i += 40) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
      ctx.stroke();

      // Simulated "vehicles" moving
      const numVehicles = Math.min(20, Math.max(5, Math.floor(vehicleCount / 4)));
      for (let i = 0; i < numVehicles; i++) {
        const speed = 0.5 + Math.sin(i * 123) * 0.3;
        const x = (i * 80 + t * speed * 2) % w;
        const y = h * 0.4 + Math.sin(x * 0.01 + i) * 30 + i * 15;

        // Bounding box (ai detection style)
        ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, 40, 24);

        // Vehicle "tail lights" (red dot)
        ctx.fillStyle = "#ff2a2a";
        ctx.beginPath();
        ctx.arc(x + 5, y + 12, 2, 0, Math.PI * 2);
        ctx.arc(x + 5, y + 20, 2, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "rgba(0, 229, 255, 0.9)";
        ctx.font = "10px monospace";
        ctx.fillText(`ID:${Math.floor(i * 1000 + x)}`, x, y - 5);
      }

      // Scanner line effect
      const scanY = (t * 2) % h;
      ctx.fillStyle = "rgba(0, 229, 255, 0.1)";
      ctx.fillRect(0, scanY, w, 4);

      // Signal light reflection mock
      const signalGradient = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, 200);
      const sColor = signalStatus === "red" ? "rgba(255,0,0," :
                     signalStatus === "green" ? "rgba(0,255,100," : "rgba(255,200,0,";
      signalGradient.addColorStop(0, sColor + "0.15)");
      signalGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = signalGradient;
      ctx.fillRect(0, 0, w, h);

      // Distorted scanlines
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      for (let i = 0; i < h; i += 3) {
        ctx.fillRect(0, i, w, 1);
      }

      t++;
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [signalStatus, vehicleCount, active]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && wrapperRef.current) {
        canvasRef.current.width = wrapperRef.current.clientWidth;
        canvasRef.current.height = wrapperRef.current.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  if (!active) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-card border border-border/50 rounded-lg">
        <div className="text-center">
          <Video className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs font-mono text-muted-foreground/50">FEED OFFLINE</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border/50 font-mono group">
      {/* Canvas Feed */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Overlays */}
      <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-xs font-bold text-white tracking-widest">{cameraName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/20 bg-black/40 text-white/80 uppercase">
              Live WebGL
            </span>
          </div>
          <p className="text-[10px] text-white/60">{intersection}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-sm">
            <span className={cn("w-1.5 h-1.5 rounded-full",
              signalStatus === "red" ? "bg-red-500" :
              signalStatus === "yellow" ? "bg-amber-500" : "bg-emerald-500"
            )} />
            <span className="text-[10px] text-white/90 uppercase">Signal</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-black/40 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between z-10">
        <div className="space-y-1 w-full max-w-[200px]">
          <div className="flex justify-between text-[10px] text-primary">
            <span>AI Confidence</span>
            <span>94.2%</span>
          </div>
          <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-primary w-[94.2%]" />
          </div>

          <div className="flex justify-between text-[10px] text-emerald-400 pt-1">
            <span>Tracking Objects</span>
            <span>{vehicleCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-white/60">
          <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-cyan-400" /> 30 FPS</div>
          <div className="flex items-center gap-1 hidden sm:flex"><HardDrive className="w-3 h-3 text-amber-400" /> 12ms Lat</div>
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure</div>
        </div>
      </div>

      {/* Crosshairs & UI Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
        <div className="w-8 h-px bg-primary" />
        <div className="w-px h-8 bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary/50 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary/50 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary/50 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary/50 pointer-events-none" />
    </div>
  );
}
