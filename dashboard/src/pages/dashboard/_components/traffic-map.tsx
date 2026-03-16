import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Map as MapIcon, Layers, Navigation, AlertCircle, Crosshair
} from "lucide-react";
import {
  type TrafficSignal, type TrafficCamera,
  type TrafficIncident, type VehiclePosition
} from "@/hooks/use-traffic-data.ts";
import { cn } from "@/lib/utils.ts";

// ── Map Layer Controls ────────────────────────────────────────────────────────
function MapControls() {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
      <div className="bg-card/90 backdrop-blur border border-border rounded-md shadow-lg p-1 space-y-1">
        {[
          { icon: Layers, tooltip: "Toggle Layers", active: true },
          { icon: Navigation, tooltip: "Recenter Map", active: false },
          { icon: Crosshair, tooltip: "Focus Active Signals", active: false },
        ].map((ctrl, i) => {
          const Icon = ctrl.icon;
          return (
            <button
              key={i}
              title={ctrl.tooltip}
              className={cn(
                "p-2 rounded-md transition-colors",
                ctrl.active
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function MapLegend() {
  return (
    <div className="absolute left-4 bottom-4 bg-card/95 backdrop-blur border border-border p-3 rounded-md shadow-lg z-10 pointer-events-none">
      <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Map Legend</h4>
      <div className="space-y-2 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-foreground">Signal (Green)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-foreground">Signal (Red)</span>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-transparent border-b-primary" />
          <span className="text-foreground">Vehicle</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-foreground">Active Incident</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface TrafficMapProps {
  vehicles: VehiclePosition[];
  signals: TrafficSignal[];
  incidents: TrafficIncident[];
  cameras: TrafficCamera[];
}

export default function TrafficMap({ vehicles, signals, incidents }: TrafficMapProps) {
  // Generate signal positions deterministically based on their IDs just for the mock map
  const signalNodes = useMemo(() => {
    return signals.map((s, i) => {
      // Create a grid-like layout for intersections
      let x = 0, y = 0;
      if (s.zone === "north") { x = 25 + (i % 4) * 16; y = 20 + Math.floor(i / 4) * 15; }
      if (s.zone === "south") { x = 25 + (i % 4) * 16; y = 65 + Math.floor(i / 4) * 15; }
      if (s.zone === "east")  { x = 70 + (i % 4) * 8;  y = 35 + Math.floor(i / 4) * 20; }
      if (s.zone === "west")  { x = 10 + (i % 4) * 8;  y = 35 + Math.floor(i / 4) * 20; }
      return { ...s, x, y };
    });
  }, [signals]);

  return (
    <div className="rounded-lg border border-border bg-card p-4 h-[600px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-primary" />
          Live Network Map
        </h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
          Real-time spatial visualization
        </p>
      </div>

      <div className="relative flex-1 rounded-md border border-border/50 overflow-hidden bg-[#0c0f16]">
        <MapControls />
        <MapLegend />

        {/* Map grid background */}
        <div className="absolute inset-0"
             style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "4% 4%" }} />

        {/* Mock road network lines connecting signals loosely */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {signalNodes.map((s1, i) => {
            const next = signalNodes[(i + 1) % signalNodes.length];
            if (s1.zone !== next.zone) return null; // Only connect within zones
            return (
              <line key={`l-${i}`} x1={`${s1.x}%`} y1={`${s1.y}%`} x2={`${next.x}%`} y2={`${next.y}%`}
                    stroke="rgba(0, 229, 255, 0.5)" strokeWidth="2" />
            );
          })}
        </svg>

        {/* Dynamic elements layer */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Incidents */}
          {incidents.filter(i => i.active).map((inc, i) => {
            // Mock cluster positions near center based on index
            const x = 40 + (i * 13) % 40;
            const y = 30 + (i * 17) % 40;
            return (
              <motion.div
                key={inc.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%`, zIndex: 10 }}
              >
                <div className="absolute w-8 h-8 bg-orange-500/20 rounded-full animate-ping" />
                <div className="w-5 h-5 bg-orange-500 rounded-full border border-orange-200 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.8)] cursor-pointer">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
                {/* Tooltip */}
                <div className="absolute mb-8 bottom-full opacity-0 group-hover:opacity-100 transition-opacity bg-card/95 backdrop-blur border border-border p-2 rounded-md shadow-xl whitespace-nowrap pointer-events-none">
                  <p className="text-xs font-bold text-orange-400">{inc.type.toUpperCase()}</p>
                  <p className="text-[10px] text-muted-foreground">{inc.location}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Signals */}
          {signalNodes.map(sig => {
            const color = sig.status === "green" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" :
                          sig.status === "yellow" ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" :
                          "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]";
            return (
              <div
                key={sig.id}
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-crosshair group"
                style={{ left: `${sig.x}%`, top: `${sig.y}%`, zIndex: 20 }}
              >
                <div className={cn("w-3 h-3 rounded-full border border-white/20 transition-colors duration-300", color)} />
                <div className="absolute w-6 h-6 rounded-full border border-current opacity-30 animate-[spin_4s_linear_infinite]"
                     style={{ color: sig.status === "green" ? "#10b981" : sig.status === "yellow" ? "#f59e0b" : "#ef4444" }} />
                
                <div className="absolute mt-6 top-full opacity-0 group-hover:opacity-100 transition-opacity bg-card/95 backdrop-blur border border-border p-2 rounded-md shadow-xl whitespace-nowrap pointer-events-none z-50">
                  <p className="text-xs font-bold font-mono">{sig.name}</p>
                  <p className="text-[10px] text-muted-foreground">{sig.intersection}</p>
                  <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border/50">
                    <span className="text-[10px]">Phase: {sig.currentPhase}s</span>
                    <span className="text-[10px] text-emerald-400">Eff: {sig.efficiency}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Vehicles */}
          {vehicles.map(v => (
            <motion.div
              layout
              key={v.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.6)]"
              style={{ left: `${v.x}%`, top: `${v.y}%`, zIndex: 5 }}
              animate={{ left: `${v.x}%`, top: `${v.y}%` }}
              transition={{ duration: 0.8, ease: "linear" }}
            >
              <div style={{ transform: `rotate(${v.heading}deg)` }}>
                {v.type === "bus" || v.type === "truck" ? (
                   <div className="w-1.5 h-3 bg-amber-400 rounded-sm" />
                ) : (
                  <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-transparent border-b-primary" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
