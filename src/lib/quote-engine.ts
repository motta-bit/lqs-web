import type { Currency } from '@/types'
import type { QuoterService, QuoterResult } from '@/store/quoterStore'

export function calculateQuote(params: {
  services:    QuoterService[]
  urgencyDays: number
  clientType:  string
  currency:    Currency
}): QuoterResult {
  const { services, urgencyDays, currency } = params

  let multiplier     = 1.0
  let discountFrac   = 0
  if      (urgencyDays <= 5)  multiplier = 1.5
  else if (urgencyDays <= 10) multiplier = 1.25
  else if (urgencyDays <= 15) multiplier = 1.0
  else                        { multiplier = 0.95; discountFrac = 0.05 }

  const subtotal = services.reduce((acc, s) => acc + s.basePrice, 0)
  const totalCOP = Math.round(subtotal * multiplier)
  const total    = currency === 'USD' ? Math.round(totalCOP / 4000) : totalCOP

  const breakdown = services.map((s) => ({
    serviceName: s.name,
    subtotal:    s.basePrice,
  }))

  let suggestedPackage: QuoterResult['suggestedPackage']
  if (services.length >= 5) {
    suggestedPackage = { name: 'Ultra Completo', discount: 0.20 }
  } else if (services.length >= 3) {
    suggestedPackage = { name: 'Paquete Esencial', discount: 0.10 }
  }

  return { total, totalCOP, discount: discountFrac, breakdown, suggestedPackage }
}

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style:                'currency',
      currency:             'COP',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
  }).format(amount)
}
