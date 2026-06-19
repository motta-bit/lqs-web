import { create } from 'zustand'
import type { ClientType } from '@/types'

interface DiagnosisStore {
  clientType:       ClientType | null
  hasCompleted:     boolean
  setClientType:    (type: ClientType | null) => void
  setHasCompleted:  (val: boolean) => void
  reset:            () => void
}

export const useDiagnosisStore = create<DiagnosisStore>((set) => ({
  clientType:       null,
  hasCompleted:     false,
  setClientType:    (clientType) => set({ clientType }),
  setHasCompleted:  (hasCompleted) => set({ hasCompleted }),
  reset:            () => set({ clientType: null, hasCompleted: false }),
}))
