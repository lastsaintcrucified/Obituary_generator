"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ObituaryState {
  obituaries: string[]
  freePreviewUsed: boolean
  selectedObituaryIndex: number
  setObituaries: (obituaries: string[]) => void
  setFreePreviewUsed: (used: boolean) => void
  setSelectedObituaryIndex: (index: number) => void
  resetState: () => void
}

export const useObituaryStore = create<ObituaryState>()(
  persist(
    (set) => ({
      obituaries: [],
      freePreviewUsed: false,
      selectedObituaryIndex: 0,
      setObituaries: (obituaries) => set({ obituaries }),
      setFreePreviewUsed: (used) => set({ freePreviewUsed: used }),
      setSelectedObituaryIndex: (index) => set({ selectedObituaryIndex: index }),
      resetState: () => set({ obituaries: [], freePreviewUsed: false, selectedObituaryIndex: 0 }),
    }),
    {
      name: "obituary-storage",
    },
  ),
)
