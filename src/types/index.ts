/* ─── Primitivos ─────────────────────────────────────────────────────── */

export type SeasonalTheme = 'default' | 'halloween' | 'winter'
export type ClientType   = 'brand' | 'creator' | 'event'
export type Category     = 'MEDIA' | 'GROWTH' | 'IDEATION'
export type Currency     = 'COP' | 'USD'
export type Language     = 'es' | 'en'
export type LeadStatus   = 'new' | 'contacted' | 'qualified' | 'closed'
export type PackageType  = 'starter' | 'pro' | 'enterprise'

/* ─── Tema ───────────────────────────────────────────────────────────── */

export interface Theme {
  name:        SeasonalTheme
  label:       { es: string; en: string }
  bg:          string
  accent:      string
  secondary:   string
  startMonth:  number
  endMonth:    number
}

/* ─── Servicios & Paquetes ───────────────────────────────────────────── */

export interface Service {
  id:           string
  slug:         string
  name:         { es: string; en: string }
  description:  { es: string; en: string }
  category:     Category
  basePrice:    number
  deliveryDays: number
  tags:         string[]
  isActive:     boolean
}

export interface Package {
  id:           string
  slug:         string
  name:         { es: string; en: string }
  description:  { es: string; en: string }
  type:         PackageType
  services:     Service[]
  totalPrice:   number
  discountPct:  number
  clientTypes:  ClientType[]
  isHighlighted: boolean
  isActive:     boolean
}

/* ─── Portfolio ─────────────────────────────────────────────────────── */

export interface PortfolioProject {
  id:          string
  slug:        string
  title:       string
  client:      string
  category:    Category
  thumbnail:   string
  images:      string[]
  year:        number
  tags:        string[]
  isFeatured:  boolean
  isPublished: boolean
}

/* ─── Leads ─────────────────────────────────────────────────────────── */

export interface Lead {
  id:         string
  name:       string
  email:      string
  phone?:     string
  company?:   string
  clientType: ClientType
  services:   string[]
  budget?:    number
  message?:   string
  status:     LeadStatus
  createdAt:  Date
}

/* ─── Cotizador ─────────────────────────────────────────────────────── */

export interface QuoteItem {
  serviceId:  string
  name:       string
  basePrice:  number
  quantity:   number
}

export interface QuoteBreakdown {
  subtotal:          number
  urgencyMultiplier: number
  urgencySurcharge:  number
  packageDiscount:   number
  total:             number
}

export interface QuoteResult {
  items:           QuoteItem[]
  breakdown:       QuoteBreakdown
  currency:        Currency
  isEvent:         boolean
  appliedPackage?: Package
  generatedAt:     Date
}

/* ─── Contacto ──────────────────────────────────────────────────────── */

export interface ContactData {
  name:     string
  email:    string
  phone?:   string
  company?: string
  message:  string
}

/* ─── Feed / Nav / FAQ ──────────────────────────────────────────────── */

export interface FeedItem {
  id:         string
  type:       'instagram' | 'tiktok' | 'youtube'
  thumbnail:  string
  url:        string
  likes?:     number
  views?:     number
}

export interface NavItem {
  label:      { es: string; en: string }
  href:       string
  isExternal?: boolean
}

export interface FAQ {
  id:       string
  question: { es: string; en: string }
  answer:   { es: string; en: string }
  order:    number
}
