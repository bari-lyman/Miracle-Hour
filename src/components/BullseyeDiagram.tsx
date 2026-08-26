import { RING_ORDER, RING_LABEL, RingId } from '../types'

interface Props {
  activeRing?: RingId | null
  compact?: boolean
}

// Recreates Kelly Roach's "Order of Action for Daily Sales" bullseye:
// a black target, current clients at the center, new leads at the outer edge.
export default function BullseyeDiagram({ activeRing, compact }: Props) {
  const radii = [190, 150, 112, 78, 48, 22]
  const cx = 230
  const cy = 230
  const size = compact ? 220 : 460

  return (
    <div className="flex items-center gap-6">
      <svg
        viewBox="0 0 640 460"
        width={size}
        height={compact ? size * (460 / 640) : size * (460 / 640)}
        className="shrink-0"
      >
        <circle cx={cx} cy={cy} r={200} fill="#111114" />
        {radii.map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={RING_ORDER[i] === activeRing ? '#C9A227' : 'rgba(255,255,255,0.55)'}
            strokeWidth={RING_ORDER[i] === activeRing ? 3 : 1.4}
          />
        ))}
        {!compact &&
          RING_ORDER.map((ring, i) => {
            const r = radii[i]
            const labelY = 40 + i * 34
            const isActive = ring === activeRing
            return (
              <g key={ring}>
                <line
                  x1={cx}
                  y1={cy - r}
                  x2={480}
                  y2={labelY}
                  stroke={isActive ? '#C9A227' : '#B99A3E'}
                  strokeWidth={isActive ? 2 : 1}
                />
                <circle cx={480} cy={labelY} r={3} fill={isActive ? '#C9A227' : '#B99A3E'} />
                <text
                  x={488}
                  y={labelY + 5}
                  fontSize={15}
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive ? '#111114' : '#3a3a3f'}
                >
                  {i + 1}. {RING_LABEL[ring]}
                </text>
              </g>
            )
          })}
      </svg>
      {compact && (
        <ol className="text-sm space-y-1.5">
          {RING_ORDER.map((ring, i) => (
            <li
              key={ring}
              className={
                ring === activeRing
                  ? 'font-semibold text-ink flex items-center gap-2'
                  : 'text-black/60 flex items-center gap-2'
              }
            >
              <span
                className={
                  'inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ' +
                  (ring === activeRing ? 'bg-gold text-ink' : 'bg-black/10 text-black/60')
                }
              >
                {i + 1}
              </span>
              {RING_LABEL[ring]}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
