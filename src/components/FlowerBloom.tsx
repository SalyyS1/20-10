import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlowerBloomProps {
  durationMs?: number
  onComplete?: () => void
}

const petals = Array.from({ length: 16 }, (_, i) => i)

const FlowerBloom: React.FC<FlowerBloomProps> = ({ durationMs = 1800, onComplete }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
      onComplete && onComplete()
    }, durationMs)
    return () => clearTimeout(t)
  }, [durationMs, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-80 h-80">
            {/* Outer petals */}
            {petals.map((p) => {
              const angle = (p / petals.length) * Math.PI * 2
              const x = Math.cos(angle) * 80
              const y = Math.sin(angle) * 80
              return (
                <motion.div
                  key={p}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0.6, rotate: 0 }}
                  animate={{ x, y, scale: 1, opacity: 1, rotate: angle * (180 / Math.PI) }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: p * 0.05 }}
                >
                  <div className="w-12 h-20 rounded-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 shadow-lg" />
                </motion.div>
              )
            })}

            {/* Inner petals */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const x = Math.cos(angle) * 40
              const y = Math.sin(angle) * 40
              return (
                <motion.div
                  key={`inner-${i}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0.7, rotate: 0 }}
                  animate={{ x, y, scale: 1, opacity: 1, rotate: angle * (180 / Math.PI) }}
                  transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                >
                  <div className="w-8 h-14 rounded-full bg-gradient-to-b from-pink-200 to-pink-400 shadow-md" />
                </motion.div>
              )
            })}

            {/* Center */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-400 shadow-xl" />
            </motion.div>

            {/* Sparkle effects */}
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 60}%`,
                  top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.8 + i * 0.1, repeat: 1 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FlowerBloom
