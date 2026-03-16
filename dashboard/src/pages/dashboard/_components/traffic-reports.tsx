import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import * as Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import {
  type TrafficMetrics,
  type TrafficSignal,
  type TrafficCamera,
  type TrafficIncident,
  type ZoneSummary,
  type HourlyFlow,
  type VehicleDistribution,
  type Zone
} from "@/hooks/use-traffic-data.ts";
import { cn } from "@/lib/utils.ts";

interface TrafficReportsProps {
  metrics: TrafficMetrics;
  signals: TrafficSignal[];
  cameras: TrafficCamera[];
  incidents: TrafficIncident[];
  zoneSummaries: ZoneSummary[];
  hourlyFlow: HourlyFlow[];
  vehicleDistribution: VehicleDistribution[];
  currentZone: Zone;
  lastUpdated: Date;
}

export default function TrafficReports({
  metrics,
  signals,
  incidents,
  currentZone,
}: TrafficReportsProps) {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const exportCSV = async () => {
    setIsExportingCSV(true);
    try {
      // Create comprehensive export data
      const data = signals.map(s => ({
        Type: "Signal",
        ID: s.id,
        Name: s.name,
        Zone: s.zone,
        Intersection: s.intersection,
        Status: s.status,
        Vehicles: s.vehicles,
        Efficiency: s.efficiency,
        "Current Phase": s.currentPhase
      }));
      
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `traffic_report_${currentZone}_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const exportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text("TrafficOS System Report", 14, 22);
      
      // Meta
      doc.setFontSize(10);
      doc.text(`Zone: ${currentZone.toUpperCase()}`, 14, 30);
      doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 14, 36);
      
      // Summary Metrics Map
      const metricsData = [
        ["Total Vehicles", metrics.totalVehicles.toLocaleString()],
        ["Active Signals", `${metrics.activeSignals} / ${metrics.totalSignals}`],
        ["Avg Speed", `${metrics.avgSpeed} km/h`],
        ["Throughput", `${metrics.throughput} veh/hr`],
        ["CO2 Prevented", `${metrics.co2Prevented.toLocaleString()} kg`]
      ];

      (doc as any).autoTable({
        startY: 45,
        head: [["Metric", "Value"]],
        body: metricsData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] }
      });

      // Active Incidents
      if (incidents.length > 0) {
        const currentY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Active Incidents", 14, currentY);
        
        const incidentData = incidents.filter(i => i.active).map(i => [
          i.type.toUpperCase(),
          i.severity.toUpperCase(),
          i.zone,
          i.location,
          format(i.timestamp, 'HH:mm:ss')
        ]);
        
        (doc as any).autoTable({
          startY: currentY + 5,
          head: [["Type", "Severity", "Zone", "Location", "Time"]],
          body: incidentData,
          theme: 'grid',
          headStyles: { fillColor: [185, 28, 28] }
        });
      }
      
      doc.save(`traffic_report_${currentZone}_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Data Export & Reports
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
            Snapshot data for analytics and compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={isExportingCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors duration-200"
          >
            {isExportingCSV ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            Export CSV
          </button>
          
          <button
            onClick={exportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors duration-200"
          >
            {isExportingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export PDF
          </button>
        </div>
      </div>

      {/* Data Preview */}
      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-muted-foreground">
            <thead className="text-[10px] uppercase bg-secondary/50 text-foreground border-b border-border">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Intersection</th>
                <th className="px-3 py-2">Zone</th>
                <th className="px-3 py-2 text-right">Vehicles</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-right">Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {signals.slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px]">{s.id.toUpperCase()}</td>
                  <td className="px-3 py-2 text-foreground truncate max-w-[200px]">{s.intersection}</td>
                  <td className="px-3 py-2 capitalize">{s.zone}</td>
                  <td className="px-3 py-2 text-right font-mono text-[11px]">{s.vehicles}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-center">
                       <span className={cn("px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold",
                          s.status === "green" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" :
                          s.status === "yellow" ? "text-amber-400 bg-amber-500/10 border border-amber-500/30" :
                          "text-red-400 bg-red-500/10 border border-red-500/30"
                       )}>
                          {s.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[11px]">{s.currentPhase}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-secondary/30 p-2 text-center text-[10px] text-muted-foreground border-t border-border">
          Showing 5 of {signals.length} records. Export to view full dataset.
        </div>
      </div>
    </div>
  );
}
