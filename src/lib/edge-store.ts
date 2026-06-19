import { get } from '@vercel/edge-config'

export interface PortfolioItem {
  id:          string
  title:       string
  client:      string
  category:    'branding' | 'web' | 'video' | 'eventos'
  description: string
  imageUrl:    string
  tags:        string[]
  year:        number
  featured:    boolean
}

export interface ServiceItem {
  id:          string
  name:        string
  description: string
  category:    string
  price:       number
  currency:    'COP'
  active:      boolean
}

export interface ArchivoItem {
  id:          string
  nombre:      string
  url:         string
  tipo:        'image' | 'pdf' | 'otro'
  mime:        string
  tamaño:      number
  seccion:     string
  orden:       number
  titulo:      string
  descripcion: string
  subidoEn:    string
}

export interface SeccionContenido {
  visible:    boolean
  titulo:     string
  subtitulo:  string
  archivos:   string[]  // array de ArchivoItem.id
}

export type SectionesMap = Record<string, SeccionContenido>

export interface Lead {
  id:            string
  name:          string
  email:         string
  whatsapp?:     string
  clientType:    string
  services:      string[]
  totalEstimate: number
  currency:      string
  status:        'NEW' | 'REVIEWING' | 'PROPOSAL_SENT' | 'CLOSED_WON' | 'CLOSED_LOST'
  notes:         string
  createdAt:     string
}

export async function ecGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const val = await get<T>(key)
    return val ?? fallback
  } catch {
    return fallback
  }
}

export async function ecSet(key: string, value: unknown): Promise<{ ok: boolean; error?: string }> {
  const id    = process.env.EDGE_CONFIG_ID
  const token = process.env.VERCEL_API_TOKEN
  if (!id || !token) return { ok: false, error: 'Missing EDGE_CONFIG_ID or VERCEL_API_TOKEN' }

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${id}/items`, {
    method:  'PATCH',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: [{ operation: 'upsert', key, value }] }),
  })
  if (!res.ok) {
    const txt = await res.text()
    return { ok: false, error: txt }
  }
  return { ok: true }
}
