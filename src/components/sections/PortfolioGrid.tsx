'use client'

import { useState, useMemo } from 'react'
import { Modal }           from '@/components/ui/Modal'
import { FilterTabs }      from '@/components/ui/FilterTabs'
import { useScrollReveal } from '@/hooks/useScrollAnimation'

const PROJECTS = [
  {
    id: '1', slug: 'vita-nova-colombia', title: 'Vita Nova Colombia',
    description: 'Dossier institucional bilingüe y plataforma web para organización social. Diseño accesible con galería interactiva de 34 fotos.',
    coverImage: '', techUsed: ['Next.js', 'HTML', 'CSS', 'JavaScript'],
    metrics: { 'Aumento visibilidad': '+340%', 'Documentos generados': '3', 'Fotos embebidas': '34' },
    category: 'Web', clientType: 'NGO' as const, featured: true, isActive: true,
  },
  {
    id: '2', slug: 'paz-space-studio', title: 'Paz Space Studio',
    description: 'Identidad visual y landing page para estudio creativo emergente. Branding minimalista con paleta monocromática.',
    coverImage: '', techUsed: ['Figma', 'Next.js', 'Tailwind'],
    metrics: { 'Tiempo desarrollo': '3 sem', 'Páginas diseñadas': '5' },
    category: 'Branding', clientType: 'BRAND' as const, featured: false, isActive: true,
  },
  {
    id: '3', slug: 'casa-raiz', title: 'Casa RAÍZ',
    description: 'Construcción de marca para proyecto de vivienda comunitaria. Logo, manual de marca y sistema visual completo.',
    coverImage: '', techUsed: ['Illustrator', 'Figma', 'Photoshop'],
    metrics: { 'Variantes logo': '4', 'Páginas manual': '32' },
    category: 'Branding', clientType: 'NGO' as const, featured: false, isActive: true,
  },
  {
    id: '4', slug: 'evento-corporativo-2024', title: 'Evento Corporativo 2024',
    description: 'Cobertura audiovisual completa de evento empresarial para 200 personas. Video highlight, fotografía y reels.',
    coverImage: '', techUsed: ['Premiere Pro', 'After Effects', 'Lightroom'],
    metrics: { 'Asistentes': '200', 'Piezas entregadas': '45', 'Horas grabación': '8' },
    category: 'Video', clientType: 'EVENT' as const, featured: false, isActive: true,
  },
  {
    id: '5', slug: 'reels-marca-personal', title: 'Reels — Marca Personal',
    description: 'Pack de 12 reels para coach de negocios. Edición dinámica, motion graphics y subtítulos animados.',
    coverImage: '', techUsed: ['Premiere Pro', 'After Effects', 'CapCut'],
    metrics: { 'Vistas promedio': '+15K', 'Reels entregados': '12', 'Tiempo entrega': '1 sem' },
    category: 'Video', clientType: 'CREATOR' as const, featured: false, isActive: true,
  },
  {
    id: '6', slug: 'landing-fintech', title: 'Launchpad — App Fintech',
    description: 'Landing de preventa para app fintech colombiana. Diseño inmersivo con animaciones GSAP y captación de leads.',
    coverImage: '', techUsed: ['Next.js', 'GSAP', 'Tailwind', 'Resend'],
    metrics: { 'Leads capturados': '340', 'Conversión': '12%', 'Tiempo al mercado': '2 sem' },
    category: 'Web', clientType: 'BRAND' as const, featured: true, isActive: true,
  },
]

const CAT_FILTERS = [
  { value: 'ALL', label: 'Todos' }, { value: 'Branding', label: 'Branding' },
  { value: 'Web',  label: 'Web'  }, { value: 'Video',    label: 'Video'    },
]
const CLI_FILTERS = [
  { value: 'ALL',     label: 'Todos'     }, { value: 'BRAND',   label: 'Empresas'  },
  { value: 'CREATOR', label: 'Creadores' }, { value: 'NGO',     label: 'ONGs'      },
  { value: 'EVENT',   label: 'Eventos'   },
]
const TYPE_COLORS: Record<string, string> = {
  BRAND: 'var(--imi-accentOrange)', CREATOR: 'var(--imi-securityTeal)',
  NGO:   'var(--imi-innovationBlue)', EVENT: '#FFD700',
}

function shuffleArray<T>(arr: T[]): T[] {
  const seed   = Math.floor(Date.now() / (1000 * 60 * 60))
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.abs(Math.floor(Math.sin(seed + i) * 10000)) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function PortfolioGrid() {
  const [catFilter,    setCatFilter]    = useState('ALL')
  const [clientFilter, setClientFilter] = useState('ALL')
  const [selected,     setSelected]     = useState<typeof PROJECTS[0] | null>(null)
  const sectionRef = useScrollReveal({ stagger: 0.06 })
  const shuffled   = useMemo(() => shuffleArray(PROJECTS), [])

  const filtered = shuffled.filter(p =>
    (catFilter    === 'ALL' || p.category   === catFilter) &&
    (clientFilter === 'ALL' || p.clientType === clientFilter) &&
    p.isActive
  )

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} id="portfolio" className="py-36 px-6" style={{ background: 'var(--imi-bgAbsolute)' }}>
      <div className="max-w-7xl mx-auto">

        <div className="mb-12" data-reveal>
          <p className="font-mono-data text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--imi-accentOrange)' }}>◆ Trabajo real</p>
          <h2 className="font-authority text-5xl md:text-7xl leading-none mb-8" style={{ color: 'var(--imi-textPrimary)' }}>
            PORTFOLIO<br /><span style={{ color: 'var(--imi-securityTeal)' }}>& CASOS.</span>
          </h2>
          <div className="flex flex-col gap-4">
            <FilterTabs options={CAT_FILTERS} active={catFilter}    onChange={setCatFilter}    color="var(--imi-accentOrange)" />
            <FilterTabs options={CLI_FILTERS} active={clientFilter}  onChange={setClientFilter} color="var(--imi-securityTeal)" />
          </div>
        </div>

        {/* Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((project, i) => (
            <div key={project.id} data-reveal className="break-inside-avoid">
              <button onClick={() => setSelected(project)} className="w-full text-left group">
                <div
                  className="relative border rounded-sm overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
                  style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-cardBg)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = TYPE_COLORS[project.clientType]
                    el.style.boxShadow   = `0 0 20px ${TYPE_COLORS[project.clientType]}30`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--imi-gridBorder)'
                    el.style.boxShadow   = 'none'
                  }}
                >
                  {/* Placeholder imagen */}
                  <div
                    className="w-full flex items-center justify-center relative"
                    style={{
                      height:     i % 3 === 0 ? '240px' : '180px',
                      background: `linear-gradient(135deg, var(--imi-cardBg), ${TYPE_COLORS[project.clientType]}20)`,
                    }}
                  >
                    <p className="font-authority text-4xl opacity-20" style={{ color: TYPE_COLORS[project.clientType] }}>
                      {project.title.slice(0, 2).toUpperCase()}
                    </p>
                    {project.featured && (
                      <div className="absolute top-3 left-3 font-mono-data text-[10px] tracking-widest uppercase px-2 py-1 rounded"
                        style={{ background: 'var(--imi-accentOrange)', color: '#000' }}>
                        Destacado
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="font-mono-data text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border inline-block mb-2"
                      style={{ color: TYPE_COLORS[project.clientType], borderColor: `${TYPE_COLORS[project.clientType]}40`, background: `${TYPE_COLORS[project.clientType]}10` }}>
                      {project.category}
                    </span>
                    <h3 className="font-authority text-xl tracking-wider mb-2 group-hover:text-[var(--imi-accentOrange)] transition-colors"
                      style={{ color: 'var(--imi-textPrimary)' }}>
                      {project.title}
                    </h3>
                    <p className="font-readability text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--imi-textMuted)' }}>
                      {project.description}
                    </p>
                    <div className="flex gap-1 flex-wrap mt-3">
                      {project.techUsed.slice(0, 3).map(tech => (
                        <span key={tech} className="font-mono-data text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <div className="w-full h-48 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, var(--imi-cardBg), ${TYPE_COLORS[selected.clientType]}20)` }}>
              <p className="font-authority text-6xl opacity-20" style={{ color: TYPE_COLORS[selected.clientType] }}>
                {selected.title.slice(0, 2).toUpperCase()}
              </p>
            </div>
            <div className="p-8">
              <h2 className="font-authority text-4xl tracking-wider mb-3" style={{ color: 'var(--imi-textPrimary)' }}>
                {selected.title}
              </h2>
              <p className="font-readability text-sm leading-relaxed mb-6" style={{ color: 'var(--imi-textMuted)' }}>
                {selected.description}
              </p>
              {Object.keys(selected.metrics).length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6 p-6 rounded-sm border"
                  style={{ borderColor: 'var(--imi-gridBorder)', background: 'var(--imi-bgAbsolute)' }}>
                  {Object.entries(selected.metrics).map(([key, val]) => (
                    <div key={key}>
                      <p className="font-authority text-2xl mb-1" style={{ color: 'var(--imi-accentOrange)' }}>{val}</p>
                      <p className="font-mono-data text-xs" style={{ color: 'var(--imi-textMuted)' }}>{key}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {selected.techUsed.map(tech => (
                  <span key={tech} className="font-mono-data text-xs px-3 py-1 rounded border"
                    style={{ borderColor: 'var(--imi-gridBorder)', color: 'var(--imi-textMuted)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
