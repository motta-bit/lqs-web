import { create } from 'zustand'
import type { Currency } from '@/types'

export interface QuoterService {
  id:          string
  slug:        string
  name:        string
  nameEn:      string
  category:    string
  basePrice:   number
  unitType:    string
  description: string
  descriptionEn: string
  isActive:    boolean
  order:       number
  createdAt:   Date
}

export interface QuoterResult {
  total:    number
  totalCOP: number
  discount: number
  breakdown: Array<{ serviceName: string; subtotal: number }>
  suggestedPackage?: { name: string; discount: number }
}

interface QuoterStore {
  isOpen:           boolean
  step:             number
  totalSteps:       number
  isEvent:          boolean
  clientType:       string | null
  selectedServices: QuoterService[]
  urgencyDays:      number
  currency:         Currency
  quoteResult:      QuoterResult | null
  contactData:      { name: string; email: string } | null

  openPanel:     () => void
  closePanel:    () => void
  nextStep:      () => void
  prevStep:      () => void
  setClientType: (value: string, isEvent?: boolean) => void
  toggleService: (service: QuoterService) => void
  setUrgency:    (days: number) => void
  setCurrency:   (currency: Currency) => void
  setQuoteResult:(result: QuoterResult | null) => void
  setContactData:(data: { name: string; email: string }) => void
  reset:         () => void
}

export const useQuoterStore = create<QuoterStore>((set, get) => ({
  isOpen:           false,
  step:             1,
  totalSteps:       6,
  isEvent:          false,
  clientType:       null,
  selectedServices: [],
  urgencyDays:      30,
  currency:         'COP',
  quoteResult:      null,
  contactData:      null,

  openPanel:     () => set({ isOpen: true, step: 1, selectedServices: [], clientType: null, isEvent: false, quoteResult: null }),
  closePanel:    () => set({ isOpen: false }),
  nextStep:      () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps) })),
  prevStep:      () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  setClientType: (value, isEvent = false) => set({ clientType: value, isEvent }),
  toggleService: (service) =>
    set((s) => ({
      selectedServices: s.selectedServices.some((sv) => sv.id === service.id)
        ? s.selectedServices.filter((sv) => sv.id !== service.id)
        : [...s.selectedServices, service],
    })),
  setUrgency:    (days) => set({ urgencyDays: days }),
  setCurrency:   (currency) => set({ currency }),
  setQuoteResult:(quoteResult) => set({ quoteResult }),
  setContactData:(contactData) => set({ contactData }),

  reset: () =>
    set({
      isOpen: false, step: 1, isEvent: false, clientType: null,
      selectedServices: [], urgencyDays: 30, currency: 'COP',
      quoteResult: null, contactData: null,
    }),
}))
