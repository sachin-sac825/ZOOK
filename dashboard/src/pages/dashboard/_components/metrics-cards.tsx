import { motion } from "framer-motion";
import { Car, TrafficCone, Leaf, Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type TrafficMetrics } from "@/hooks/use-traffic-data.ts";
import { cn } from "@/lib/utils.ts";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

interface MetricCardProps {
  label: string;
  value: string;
  subvalue?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  delay?: number;
}

function MetricCard({ label, value, subvalue, trend, trendLabel, icon, accentColor, bgColor, borderColor, delay = 0 }: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("relative overflow-hidden rounded-lg border p-4 group hover:scale-[1.01] transition-transform duration-200", borderColor)}
      style={{ background: `linear-gradient(135deg, var(--card) 60%, ${bgColor})` }}
    >
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity", bgColor)} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", bgColor, borderColor)}>
            <div className={accentColor}>{icon}</div>
          </div>
          {trend && trendLabel && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>

        <motion.p
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={cn("text-2xl font-bold tracking-tight mb-0.5", accentColor)}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </motion.p>

        {subvalue && (
          <p className="text-xs text-muted-foreground mb-1">{subvalue}</p>
        )}

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
      </div>
    </motion.div>
  );
}

interface MetricsCardsProps {
  metrics: TrafficMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const signalPct = metrics.totalSignals > 0
    ? Math.round((metrics.activeSignals / metrics.totalSignals) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Total Vehicles"
        value={formatNumber(metrics.totalVehicles)}
        trendLabel="+2.4%"
        trend="up"
        subvalue={`${metrics.throughput.toLocaleString()} veh/hr throughput`}
        icon={<Car className="w-5 h-5" />}
        accentColor="text-cyan-400"
        bgColor="oklch(0.76 0.155 195 / 0.08)"
        borderColor="border-cyan-500/20"
        delay={0}
      />
      <MetricCard
        label="Active Signals"
        value={`${metrics.activeSignals} / ${metrics.totalSignals}`}
        trendLabel={`${signalPct}% active`}
        trend={signalPct >= 60 ? "up" : "down"}
        subvalue={`${metrics.totalSignals - metrics.activeSignals} signals on red`}
        icon={<TrafficCone className="w-5 h-5" />}
        accentColor="text-amber-400"
        bgColor="oklch(0.76 0.17 85 / 0.08)"
        borderColor="border-amber-500/20"
        delay={0.1}
      />
      <MetricCard
        label="CO₂ Prevented"
        value={`${formatNumber(metrics.co2Prevented)} kg`}
        trendLabel="+5.1%"
        trend="up"
        subvalue="vs. non-optimized flow"
        icon={<Leaf className="w-5 h-5" />}
        accentColor="text-emerald-400"
        bgColor="oklch(0.72 0.18 145 / 0.08)"
        borderColor="border-emerald-500/20"
        delay={0.2}
      />
      <MetricCard
        label="Fuel Saved"
        value={`${formatNumber(metrics.fuelSaved)} L`}
        trendLabel="+3.7%"
        trend="up"
        subvalue={`≈ ${Math.round(metrics.fuelSaved * 0.87 / 1000).toLocaleString()}t CO₂ equiv.`}
        icon={<Droplets className="w-5 h-5" />}
        accentColor="text-violet-400"
        bgColor="oklch(0.72 0.19 285 / 0.08)"
        borderColor="border-violet-500/20"
        delay={0.3}
      />
    </div>
  );
}
