import type { MainApi } from './types'

declare global {
  interface Window {
    api: MainApi
  }
}
