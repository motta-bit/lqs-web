'use client'

interface FilterOption { value: string; label: string }
interface FilterTabsProps {
  options:  FilterOption[]
  active:   string
  onChange: (value: string) => void
  color?:   string
}

export function FilterTabs({ options, active, onChange, color = 'var(--imi-accentOrange)' }: FilterTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="font-mono-data text-xs tracking-widest uppercase px-3 py-1.5 border rounded-sm transition-all duration-200"
          style={{
            borderColor: active === opt.value ? color : 'var(--imi-gridBorder)',
            color:       active === opt.value ? color : 'var(--imi-textMuted)',
            background:  active === opt.value ? `${color}15` : 'transparent',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
