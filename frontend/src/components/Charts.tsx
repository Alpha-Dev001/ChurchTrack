import React, { useId, useMemo, useState } from "react";

const CHART_FONT = "Outfit, sans-serif";

/** Design-system navy accents (no green / off-brand colors) */
const NAVY = {
  950: "#0b1f33",
  900: "#132a44",
  800: "#1b3a57",
  600: "#3a5f7d",
  400: "#6b879e",
  300: "#94a8b8",
  100: "#e8ecf0",
} as const;

const STATUS_COLORS = {
  approved: NAVY[950],
  pending: NAVY[700],
  rejected: NAVY[300],
} as const;

/** Mild Catmull-Rom → cubic Bézier (tracks data closely) */
function smoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    // /8 = tighter to data than classic /6
    const cp1x = p1.x + (p2.x - p0.x) / 8;
    const cp1y = p1.y + (p2.y - p0.y) / 8;
    const cp2x = p2.x - (p3.x - p1.x) / 8;
    const cp2y = p2.y - (p3.y - p1.y) / 8;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

interface OverviewChartProps {
  data: { date: string; amount: number }[];
  emptyLabel?: string;
}

export function BookingsOverviewChart({
  data,
  emptyLabel = "No booking activity yet",
}: OverviewChartProps) {
  const gradId = useId().replace(/:/g, "");
  const chartData = data && data.length > 0 ? data : [];
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const total = chartData.reduce((sum, d) => sum + d.amount, 0);

  if (chartData.length === 0 || total === 0) {
    return (
      <div className="w-full h-full min-h-[180px] flex items-center justify-center text-xs font-semibold text-navy-400">
        {emptyLabel}
      </div>
    );
  }

  const color = NAVY[800];
  const width = 560;
  const height = 200;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 28;
  const paddingBottom = 32;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxVal = Math.max(...chartData.map((d) => d.amount), 1);

  const points = chartData.map((d, idx) => {
    const x =
      chartData.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.amount / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = smoothLinePath(points);
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${paddingTop + chartHeight}` +
    ` L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const peakIdx = chartData.reduce(
    (best, d, i) => (d.amount > chartData[best].amount ? i : best),
    0
  );
  const activeIdx = hoverIdx ?? peakIdx;
  const active = points[activeIdx];

  const yTicks = [0, 0.5, 1].map((ratio) => ({
    ratio,
    y: paddingTop + chartHeight * (1 - ratio),
    label: Math.round(maxVal * ratio),
  }));

  return (
    <div className="w-full h-full flex flex-col" id="bookings-overview-chart">
      <div className="flex-1 min-h-[180px] relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Bookings overview"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id={`area-grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="65%" stopColor={color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <text
              key={tick.ratio}
              x={paddingLeft - 8}
              y={tick.y + 3}
              textAnchor="end"
              fill={NAVY[400]}
              fontSize="10"
              fontFamily={CHART_FONT}
              fontWeight="500"
            >
              {tick.label}
            </text>
          ))}

          <path d={areaPath} fill={`url(#area-grad-${gradId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points — only where amount > 0 so the graph reflects real activity */}
          {points.map((p, idx) =>
            p.amount > 0 ? (
              <circle
                key={`pt-${idx}`}
                cx={p.x}
                cy={p.y}
                r={idx === activeIdx ? 5 : 3.5}
                fill="#fff"
                stroke={color}
                strokeWidth={idx === activeIdx ? 2.5 : 2}
              />
            ) : null
          )}

          {points.map((p, idx) => (
            <rect
              key={`hit-${idx}`}
              x={p.x - chartWidth / Math.max(chartData.length * 2, 2)}
              y={paddingTop}
              width={chartWidth / Math.max(chartData.length, 1)}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(idx)}
            />
          ))}

          {active && active.amount > 0 && (
            <text
              x={active.x}
              y={active.y - 12}
              textAnchor="middle"
              fill={NAVY[950]}
              fontSize="12"
              fontWeight="700"
              fontFamily={CHART_FONT}
            >
              {active.amount}
            </text>
          )}

          {points.map((p, idx) =>
            p.date ? (
              <text
                key={`lbl-${idx}`}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill={NAVY[400]}
                fontSize="10"
                fontFamily={CHART_FONT}
                fontWeight="500"
              >
                {p.date}
              </text>
            ) : null
          )}
        </svg>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSegment(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const sweep = endAngle - startAngle;
  if (sweep <= 0.01) return "";
  const large = sweep > 180 ? 1 : 0;
  const os = polarToCartesian(cx, cy, outerR, startAngle);
  const oe = polarToCartesian(cx, cy, outerR, endAngle);
  const ie = polarToCartesian(cx, cy, innerR, endAngle);
  const is = polarToCartesian(cx, cy, innerR, startAngle);
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is.x} ${is.y}`,
    "Z",
  ].join(" ");
}

interface StatusBreakdownProps {
  pending: number;
  approved: number;
  rejected: number;
  labels?: { pending: string; approved: string; rejected: string; empty: string };
  footerNote?: string;
}

export function BookingStatusBreakdown({
  pending,
  approved,
  rejected,
  labels = { pending: "Pending", approved: "Approved", rejected: "Rejected", empty: "No bookings yet" },
  footerNote = "Based on current booking statuses.",
}: StatusBreakdownProps) {
  const total = pending + approved + rejected;

  const rows = useMemo(
    () => [
      {
        key: "approved",
        label: labels.approved,
        value: approved,
        color: STATUS_COLORS.approved,
        hint: `${approved}`,
      },
      {
        key: "pending",
        label: labels.pending,
        value: pending,
        color: STATUS_COLORS.pending,
        hint: `${pending}`,
      },
      {
        key: "rejected",
        label: labels.rejected,
        value: rejected,
        color: STATUS_COLORS.rejected,
        hint: `${rejected}`,
      },
    ],
    [approved, pending, rejected, labels]
  );

  if (total === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs font-semibold text-navy-400">
        {labels.empty}
      </div>
    );
  }

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 68;
  const innerR = 46;
  const gapDeg = 3;
  const activeRows = rows.filter((r) => r.value > 0);
  const usable = 360 - gapDeg * activeRows.length;

  let angle = 0;
  const segments = activeRows.map((row) => {
    const sweep = (row.value / total) * usable;
    const start = angle + gapDeg / 2;
    const end = start + sweep;
    angle = end + gapDeg / 2;
    return { ...row, start, end, path: donutSegment(cx, cy, outerR, innerR, start, end) };
  });

  return (
    <div className="flex flex-col h-full" id="booking-status-breakdown">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4 flex-1 py-2">
        <div className="shrink-0 relative" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" role="img" aria-label="Status mix">
            {segments.map((seg) => (
              <path key={seg.key} d={seg.path} fill={seg.color} className="transition-opacity hover:opacity-90" />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-navy-950 leading-none tracking-tight">{total}</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-navy-400 mt-1">Total</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4 min-w-0">
          {rows.map((row) => {
            const pct = Math.round((row.value / total) * 100);
            return (
              <div key={row.key} className="text-left">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-navy-950">{row.label}</span>
                      <span className="text-[11px] text-navy-400 font-medium">({row.hint})</span>
                    </div>
                    <div className="text-lg font-bold text-navy-950 mt-0.5 leading-none">{pct}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-navy-100 pt-3 mt-2">
        <p className="text-[10px] text-navy-400 font-medium">{footerNote}</p>
      </div>
    </div>
  );
}

/** @deprecated Use BookingStatusBreakdown */
export function HallOccupancyRing({ occupied = 0 }: { occupied?: number; available?: number; maintenance?: number }) {
  return (
    <BookingStatusBreakdown
      pending={0}
      approved={occupied}
      rejected={Math.max(0, 100 - occupied)}
      labels={{ pending: "Pending", approved: "Occupied", rejected: "Open", empty: "No data" }}
    />
  );
}

interface TopHall {
  name: string;
  bookings: number;
  percentage: number;
}

interface TopPerformingHallsProps {
  halls?: TopHall[];
  emptyLabel?: string;
  bookingsLabel?: string;
}

export function TopPerformingHalls({
  halls = [],
  emptyLabel = "No hall bookings yet",
  bookingsLabel = "bookings",
}: TopPerformingHallsProps) {
  if (!halls.length) {
    return (
      <div className="h-40 flex items-center justify-center text-xs font-semibold text-navy-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-5" id="top-performing-halls-bars">
      {halls.map((hall) => (
        <div key={hall.name} className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-navy-800 tracking-wide truncate pr-2">{hall.name}</span>
            <span className="text-navy-400 shrink-0 font-medium">
              {hall.bookings} {bookingsLabel}
            </span>
          </div>
          <div className="w-full bg-navy-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-navy-900 transition-all duration-500"
              style={{ width: `${Math.max(hall.percentage, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
