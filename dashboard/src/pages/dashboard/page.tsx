import { useState } from "react";
import { useTrafficData, type Zone } from "@/hooks/use-traffic-data.ts";
import DashboardHeader from "./_components/dashboard-header.tsx";
import MetricsCards from "./_components/metrics-cards.tsx";
import ZoneSummaries from "./_components/zone-summaries.tsx";
import SystemStatus from "./_components/system-status.tsx";
import SignalStatus from "./_components/signal-status.tsx";
import CameraMonitoring from "./_components/camera-monitoring.tsx";
import TrafficAnalytics from "./_components/traffic-analytics.tsx";
import IncidentAlerts from "./_components/incident-alerts.tsx";
import TrafficMap from "./_components/traffic-map.tsx";
import TrafficReports from "./_components/traffic-reports.tsx";

export default function DashboardPage() {
  const [zone, setZone] = useState<Zone>("global");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data, refresh } = useTrafficData(zone, autoRefresh, 4000);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardHeader
        zone={zone}
        onZoneChange={setZone}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        onRefresh={refresh}
        lastUpdated={data.lastUpdated}
        systemStatus={data.systemStatus}
      />

      <main className="flex-1 overflow-auto p-4 space-y-4">
        <MetricsCards metrics={data.metrics} />
        <ZoneSummaries summaries={data.zoneSummaries} />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">System Health</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <SystemStatus status={data.systemStatus} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Signal Network</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <SignalStatus signals={data.signals} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Camera Network</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <CameraMonitoring cameras={data.cameras} signals={data.signals} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Analytics</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <TrafficAnalytics
            distribution={data.vehicleDistribution}
            hourlyFlow={data.hourlyFlow}
            metrics={data.metrics}
            zoneSummaries={data.zoneSummaries}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Incidents</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <IncidentAlerts incidents={data.incidents} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live Map & Flow</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <TrafficMap
            vehicles={data.vehiclePositions}
            signals={data.signals}
            incidents={data.incidents}
            cameras={data.cameras}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Reports & Downloads</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <TrafficReports
            metrics={data.metrics}
            signals={data.signals}
            cameras={data.cameras}
            incidents={data.incidents}
            zoneSummaries={data.zoneSummaries}
            hourlyFlow={data.hourlyFlow}
            vehicleDistribution={data.vehicleDistribution}
            currentZone={zone}
            lastUpdated={data.lastUpdated}
          />
        </div>
      </main>

      <footer className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground/60">
        <span className="uppercase tracking-widest">TrafficOS v3.2.1</span>
        <span className="font-mono">
          {data.lastUpdated.toLocaleString([], { dateStyle: "short", timeStyle: "medium" })}
        </span>
        <span className="uppercase tracking-widest">Smart City Initiative</span>
      </footer>
    </div>
  );
}
