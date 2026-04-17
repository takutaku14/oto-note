import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* ダイアログ本体 */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
              className="w-full max-w-sm bg-background-grouped-secondary rounded-2xl shadow-xl overflow-hidden pointer-events-auto"
            >
              <div className="p-6 text-center space-y-2">
                <h3 className="text-headline font-bold text-label">{title}</h3>
                <p className="text-subhead text-label-secondary">{message}</p>
              </div>
              <div className="flex border-t border-separator divide-x divide-separator">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 text-body font-normal text-tint active:bg-fill transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3 text-body font-bold active:bg-fill transition-colors ${
                    destructive ? 'text-red-500' : 'text-tint'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
