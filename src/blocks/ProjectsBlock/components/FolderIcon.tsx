import React from 'react'

export const FolderIcon: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  return (
    <div
      className="relative"
      style={{
        width: 120,
        height: 92,
        perspective: 600,
        transition: 'transform 240ms cubic-bezier(.4,1.4,.5,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* Tab */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 8,
          width: '42%',
          height: 14,
          background: hovered ? 'oklch(0.26 0.07 195)' : 'oklch(0.2 0.06 195)',
          borderTop: `1px solid ${hovered ? 'var(--primary)' : 'oklch(0.5 0.1 188)'}`,
          borderRight: `1px solid ${hovered ? 'var(--primary)' : 'oklch(0.5 0.1 188)'}`,
          borderBottom: 'none',
          borderLeft: `1px solid ${hovered ? 'var(--primary)' : 'oklch(0.5 0.1 188)'}`,
          borderRadius: '4px 8px 0 0',
          transition: 'all 220ms ease',
        }}
      />
      {/* Back */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'oklch(0.16 0.05 195)',
          border: `1px solid ${hovered ? 'var(--primary)' : 'oklch(0.45 0.09 188)'}`,
          borderRadius: '1px 4px 4px 4px',
          transition: 'all 220ms ease',
        }}
      />
      {/* Front flap (opens on hover) */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 0,
          right: 0,
          bottom: 0,
          background: hovered
            ? 'linear-gradient(180deg, oklch(0.3 0.08 195) 0%, oklch(0.24 0.07 195) 100%)'
            : 'linear-gradient(180deg, oklch(0.26 0.07 195) 0%, oklch(0.22 0.06 195) 100%)',
          border: `1px solid ${hovered ? 'var(--primary)' : 'oklch(0.55 0.11 188)'}`,
          borderRadius: '2px 2px 4px 4px',
          transformOrigin: 'bottom center',
          transform: hovered ? 'rotateX(-22deg)' : 'rotateX(0deg)',
          transition:
            'transform 320ms cubic-bezier(.4,1.6,.5,1), background 220ms ease, border-color 220ms ease',
          overflow: 'hidden',
          boxShadow: hovered ? '0 -4px 10px -6px oklch(0 0 0 / 0.5)' : 'none',
        }}
      >
        {/* stripe pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              -45deg,
              transparent 0 5px,
              oklch(from var(--primary) l c h / 0.05) 5px 6px
            )`,
          }}
        />
        {/* top edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'oklch(from var(--primary) l c h / 0.4)',
          }}
        />
      </div>
    </div>
  )
}
