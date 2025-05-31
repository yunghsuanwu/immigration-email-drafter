// Inspired by shadcn/ui toast implementation
import { useEffect, useState } from 'react'

const TOAST_TIMEOUT = 5000

interface Toast {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'info'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1))
    }, TOAST_TIMEOUT)

    return () => clearTimeout(timer)
  }, [toasts])

  function toast({ title, description, type = 'info' }: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    setToasts((toasts) => [...toasts, { id, title, description, type }])
  }

  return {
    toast,
    toasts,
    dismiss: (id: string) => setToasts((toasts) => toasts.filter((t) => t.id !== id)),
  }
} 