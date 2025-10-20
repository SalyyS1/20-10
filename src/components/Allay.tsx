import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import allayGif from '../assets/allay.gif'
import twoAllayGif from '../assets/2allay.gif'

interface AllayProps {
  onGiftGiven: () => void
}

const Allay: React.FC<AllayProps> = ({ onGiftGiven }) => {
  const [hasGivenGift, setHasGivenGift] = useState(false)
  const [isBlooming, setIsBlooming] = useState(false)

  const handleReceiveFlower = () => {
    if (!hasGivenGift) {
      setIsBlooming(true)
      setTimeout(() => setHasGivenGift(true), 900)
      setTimeout(() => onGiftGiven(), 1600)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[500px] relative w-full">
      <motion.div
        className="relative -mt-32"
        data-testid="allay"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-48 h-48 flex items-center justify-center drop-shadow-xl">
          <img
            src={allayGif}
            alt="Allay"
            className="w-full h-full object-contain"
          />
        </div>

        <AnimatePresence>
          {isBlooming && (
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
              initial={{ scale: 0.2, opacity: 0.6 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{ background: 'radial-gradient(closest-side, rgba(255,182,193,0.6), rgba(255,182,193,0))' }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay layer for sparkles/hints/messages */}
      <div className="absolute inset-0">
        {/* Flying Allays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 2 Allays flying together - Top left */}
          <motion.div
            className="absolute w-20 h-20"
            style={{
              left: '5%',
              top: '10%',
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -15, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src={twoAllayGif}
              alt="2 Flying Allays"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* 2 Allays flying together - Top right */}
          <motion.div
            className="absolute w-20 h-20"
            style={{
              right: '5%',
              top: '15%',
            }}
            animate={{
              x: [0, -25, 0],
              y: [0, -12, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          >
            <img
              src={twoAllayGif}
              alt="2 Flying Allays"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* Sparkles around Allay */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
              style={{
                left: `${30 + (i * 20)}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Dialogue + Click hint */}
        {!hasGivenGift && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="mb-2 text-sm font-poppins text-gray-700">
              Allay: Hãy xem món quà mình tặng bạn nè ✨
            </div>
            <button onClick={handleReceiveFlower} className="touch-button bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
              Mở quà
            </button>
            <div className="text-xs text-gray-600 mt-2">Bấm để mở, Allay sẽ cảm ơn bạn 💖</div>
          </motion.div>
        )}

        {/* Success message */}
        <AnimatePresence>
          {hasGivenGift && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-pink-200">
                <p className="text-xl font-poppins font-semibold text-green-600">Allay: Cảm ơn bạn! 🎁</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Allay
