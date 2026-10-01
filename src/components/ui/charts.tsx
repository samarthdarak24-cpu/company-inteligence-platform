"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type SeriesPoint = { label: string; value: number };

type LineChartProps = {
  data: SeriesPoint[];
  height?: number;
  formatValue?: (value: number) => string;
  accent?: string;
  area?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function LineChart({
  data,
  height = 180,
  formatValue = (v) => v.toLocaleString("en-GB"),
  accent = "var(--sp-accent)",
  area = true,
  className,
  ariaLabel = "Chart",
}: LineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 560;
  const padX = 12;
  const padY = 16;

  const { points, path, areaPath, min, max } = useMemo(() => {
    const values = data.map((d) => d.value);
    const rawMin = Math.min(...values, 0);
    const rawMax = Math.max(...values, 1);
    const span = rawMax - rawMin || 1;
    const lo = rawMin - span * 0.12;
    const hi = rawMax + span * 0.12;
    const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0;
    const pts = data.map((d, i) => {
      const x = padX + stepX * i;
      const y = padY + (1 - (d.value - lo) / (hi - lo)) * (height - padY * 2);
      return { x, y, ...d };
    });
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    const areaD = `${line} L${pts[pts.length - 1]?.x ?? padX},${height - padY} L${pts[0]?.x ?? padX},${height - padY} Z`;
    return { points: pts, path: line, areaPath: areaD, min: lo, max: hi };
  }, [data, height]);

  if (!data.length) return null;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const gradientId = `sp-area-${Math.round(min)}-${Math.round(max)}`.replace(/[^a-z0-9-]/gi, "");

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const relative = ((event.clientX - rect.left) / rect.width) * width;
          let nearest = 0;
          points.forEach((p, i) => {
            if (Math.abs(p.x - relative) < Math.abs(points[nearest].x - relative)) nearest = i;
          });
          setHover(nearest);
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines.map((g, i) => (
          <line
            key={g}
            x1={0}
            x2={width}
            y1={padY + g * (height - padY * 2)}
            y2={padY + g * (height - padY * 2)}
            stroke={i === gridLines.length - 1 ? "var(--sp-border-strong)" : "var(--sp-border-soft)"}
            strokeWidth={1}
            strokeDasharray={i === gridLines.length - 1 ? undefined : "2 5"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {area ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1600,
            strokeDashoffset: 1600,
            animation: "sp-draw 900ms cubic-bezier(0.22,0.61,0.36,1) forwards",
          }}
        />
        {points.map((p, i) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 4.5 : 3}
            fill="var(--sp-surface)"
            stroke={accent}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {hover !== null ? (
          <line
            x1={points[hover].x}
            x2={points[hover].x}
            y1={padY}
            y2={height - padY}
            stroke="var(--sp-border-strong)"
            strokeWidth={1}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      <div className="mt-1 flex justify-between px-1">
        {data.map((d, i) => (
          <span
            key={d.label}
            className={cn(
              "tnum text-[11.5px] transition-colors duration-150",
              hover === i ? "text-[var(--sp-text)]" : "text-[var(--sp-text-subtle)]",
            )}
          >
            {d.label}
          </span>
        ))}
      </div>

      {hover !== null ? (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2 py-1 text-[12px] shadow-[var(--sp-shadow-md)]"
          style={{ left: `${(points[hover].x / width) * 100}%` }}
        >
          <span className="text-[var(--sp-text-subtle)]">{data[hover].label}</span>{" "}
          <span className="tnum font-medium text-[var(--sp-text)]">{formatValue(data[hover].value)}</span>
        </div>
      ) : null}
    </div>
  );
}

export function BarChart({
  data,
  height = 150,
  formatValue = (v) => v.toLocaleString("en-GB"),
  className,
  ariaLabel = "Bar chart",
}: {
  data: SeriesPoint[];
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);
  return (
    <div className={cn("w-full", className)} role="img" aria-label={ariaLabel} style={{ minHeight: height }}>
      <div className="flex h-full items-end gap-2" style={{ height }}>
        {data.map((d) => {
          const ratio = Math.abs(d.value) / max;
          return (
            <div key={d.label} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
              <span className="tnum text-[11px] text-[var(--sp-text-subtle)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {formatValue(d.value)}
              </span>
              <div
                className={cn(
                  "w-full rounded-t-[4px] transition-[height,background-color] duration-300",
                  d.value < 0 ? "bg-[var(--sp-danger)]" : "bg-[var(--sp-accent)]",
                  "opacity-85 group-hover:opacity-100",
                )}
                style={{ height: `${Math.max(4, ratio * (height - 28))}px` }}
              />
              <span className="tnum truncate text-[11px] text-[var(--sp-text-subtle)]">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Sparkline({
  data,
  accent = "var(--sp-accent)",
  width = 72,
  height = 26,
}: {
  data: number[];
  accent?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / span) * (height - 6) - 3,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];
  const id = `spark-${Math.round(min)}-${Math.round(max)}-${data.length}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2} fill={accent} />
      <circle cx={last.x} cy={last.y} r={3.5} fill="none" stroke={accent} strokeWidth={1} opacity={0.35} />
    </svg>
  );
}
