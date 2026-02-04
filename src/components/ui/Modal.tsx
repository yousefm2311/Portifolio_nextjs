'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 shadow-card"
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-6 no-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
