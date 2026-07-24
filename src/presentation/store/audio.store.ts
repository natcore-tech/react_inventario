// src/presentation/store/audio.store.ts
import { create } from 'zustand'
import { audioService } from '@/presentation/utils/audio.service'

interface AudioState {
  enabled: boolean
  toggleAudio: () => void
}

export const useAudioStore = create<AudioState>((set) => ({
  enabled: audioService.isEnabled(),
  toggleAudio: () =>
    set((state) => {
      const next = !state.enabled
      audioService.setEnabled(next)
      if (next) {
        audioService.playClick()
      }
      return { enabled: next }
    }),
}))
