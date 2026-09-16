'use client'

/**
 * Field measurement of Core Web Vitals (decision D-05).
 *
 * Lighthouse CI guards the lab in `.github/workflows/performance.yml`, but INP
 * is not measurable in lab conditions — it needs real interactions. The budget
 * in the brief is stated at p75 of field data, so this is the half that
 * actually proves the rule.
 *
 * Kept deliberately dumb: no analytics vendor wired yet. Phase 1 points
 * `send` at the real endpoint once the city is navigable and there is
 * something worth measuring.
 */

import { useReportWebVitals } from 'next/web-vitals'

const BUDGET = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1,
} as const

function isOverBudget(name: string, value: number): boolean {
  return name in BUDGET && value > BUDGET[name as keyof typeof BUDGET]
}

function report(metric: { name: string; value: number; rating: string; id: string }) {
  if (process.env.NODE_ENV === 'development' && isOverBudget(metric.name, metric.value)) {
    // Loud in dev, silent in prod: catching a regression while writing the
    // feature is the entire point of a budget.
    console.warn(
      `[CWV] ${metric.name} = ${Math.round(metric.value * 1000) / 1000} — fuera de presupuesto (${metric.rating})`,
    )
  }
}

export function WebVitals() {
  useReportWebVitals(report)
  return null
}

export default WebVitals
