import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast-context'

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message = '', type = 'info', duration = 3200 }) => {
      const id = ++toastId
      setToasts((current) => [...current, { id, title, message, type }])
      window.setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast],
  )

  const value = useMemo(
    () => ({
      showToast,
      success: (title, message = '') => showToast({ title, message, type: 'success' }),
      error: (title, message = '') => showToast({ title, message, type: 'error', duration: 4200 }),
      info: (title, message = '') => showToast({ title, message, type: 'info' }),
      removeToast,
    }),
    [removeToast, showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100%-32px))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-950'
                : toast.type === 'error'
                  ? 'border-red-200 bg-red-50/95 text-red-950'
                  : 'border-slate-200 bg-white/95 text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-xs leading-5 opacity-80">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full p-1 text-current/70 transition hover:bg-black/5 hover:text-current"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
