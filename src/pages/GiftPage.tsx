import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Allay from '../components/Allay'
import Calendar100 from '../components/Calendar100'
import GiftBox3D from '../components/GiftBox3D'
import FlowerBloom from '../components/FlowerBloom'
import { checkGiftSubmitted } from '../utils/progress'
import mcGif from '../assets/mc.gif'

const GiftPage: React.FC = () => {
  const [showAllay, setShowAllay] = useState(true)
  const [showBloom, setShowBloom] = useState(false)
  const [showBoxes, setShowBoxes] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [giftAlreadySubmitted, setGiftAlreadySubmitted] = useState(false)

  useEffect(() => {
    // Check if gift already submitted
    checkGiftSubmitted().then((submitted) => {
      console.log('🎁 Gift already submitted:', submitted)
      setGiftAlreadySubmitted(submitted)
      if (submitted) {
        // Skip to calendar directly
        console.log('⏭️ Skipping to calendar')
        setShowAllay(false)
        setShowCalendar(true)
      } else {
        console.log('🎁 Showing gift selection flow')
      }
    }).catch((error) => {
      console.warn('⚠️ Failed to check gift status:', error)
      // If check fails, show gift selection flow
      console.log('🎁 Showing gift selection flow (fallback)')
    })
  }, [])

  const handleGiftGiven = () => {
    // If already submitted, skip to calendar
    if (giftAlreadySubmitted) {
      setShowAllay(false)
      setShowCalendar(true)
      return
    }

    // Sequence: bloom -> show boxes -> after submit -> calendar
    setShowAllay(false)
    setShowBloom(true)
    setTimeout(() => {
      setShowBloom(false)
      setShowBoxes(true)
    }, 1600)
  }

  const handleBoxSelect = (_boxNumber: number) => {
    // After successful submission, mark as submitted and show calendar
    setGiftAlreadySubmitted(true)
    setShowBoxes(false)
    setShowCalendar(true)
  }

  return (
    <div className="page-container relative bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 overflow-hidden">
      {/* Minecraft Background - Only when showing Allay */}
      <AnimatePresence>
        {showAllay && (
          <>
            {/* Minecraft Pixel Clouds - Parallax */}
            <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute text-white/20 text-4xl md:text-6xl"
                  style={{
                    left: `${10 + i * 25}%`,
                    top: `${15 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    x: [0, 20, 0],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 15 + i * 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  ☁️
                </motion.div>
              ))}
            </div>

            {/* Minecraft Grass/Dirt Footer */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
              {/* Grass blocks */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-600 to-green-500">
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-400"></div>
                {/* Grass texture pattern */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-300 opacity-60"></div>
              </div>
              {/* Dirt blocks */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-800 to-amber-700">
                {/* Dirt texture pattern */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600 opacity-40"></div>
              </div>
              {/* Grass details */}
              <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={`grass-${i}`}
                    className="text-green-500 text-xs"
                    animate={{
                      y: [0, -2, 0],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    |
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Minecraft HUD - Hearts */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.div
                    key={`heart-${i}`}
                    className="text-red-500 text-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Minecraft HUD - XP Bar */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/80 border-2 border-gray-600 px-2 py-1 rounded">
                <div className="text-yellow-400 text-xs font-bold" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                  Level 1
                </div>
                <div className="w-24 h-2 bg-gray-700 border border-gray-500 mt-1">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Normal Background particles - When not showing Allay */}
      <AnimatePresence>
        {!showAllay && (
          <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30"
                style={{
                  left: `${30 + i * 25}%`,
                  top: `${30 + i * 25}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 2,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Floating Flower Petals - Minimal */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-30"
            style={{
              left: `${25 + i * 30}%`,
              top: `${25 + i * 30}%`,
              fontSize: '12px',
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Floating Hearts - Minimal */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-300 opacity-30"
            style={{
              left: `${40 + i * 20}%`,
              top: `${40 + i * 20}%`,
              fontSize: '10px',
            }}
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 2.5,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* Floating Sparkles - Minimal */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 opacity-40"
            style={{
              left: `${50 + i * 20}%`,
              top: `${50 + i * 20}%`,
              fontSize: '8px',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">

        {/* Allay section */}
        <AnimatePresence>
          {showAllay && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Grass block under Allay */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-32 h-8 bg-gradient-to-t from-amber-800 to-amber-700 border-2 border-amber-900 rounded-sm">
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-500 border-b border-green-600"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 opacity-60"></div>
                {/* Grass details on block */}
                <div className="absolute -top-1 left-0 right-0 h-2 flex justify-between px-1">
                  {Array.from({ length: 8 }, (_, i) => (
                    <motion.div
                      key={`block-grass-${i}`}
                      className="text-green-500 text-xs"
                      animate={{
                        y: [0, -1, 0],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    >
                      |
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Minecraft Character waving at Allay */}
              <motion.div
                className="absolute bottom-0 left-1/6 transform -translate-x-1/2 translate-y-12 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <div
                  className="relative"
                >
                  <img
                    src={mcGif}
                    alt="Minecraft Character"
                    className="w-56 h-56 object-contain"
                  />
                </div>
              </motion.div>

              <Allay onGiftGiven={handleGiftGiven} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flower bloom overlay */}
        <AnimatePresence>
          {showBloom && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FlowerBloom />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift boxes section */}
        <AnimatePresence>
          {showBoxes && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="px-4 py-8"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center mb-12"
                >
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 shadow-lg max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-dancing font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                      🎁 Chọn hộp quà dành cho em 🎁
                    </h2>
                    <p className="text-lg md:text-xl font-poppins text-gray-700">

                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <span>Mỗi hộp chứa một món quà bất ngờ dành riêng cho em</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-12">
                  <GiftBox3D boxNumber={1} color="pink" onSelect={handleBoxSelect} />
                  <GiftBox3D boxNumber={2} color="purple" onSelect={handleBoxSelect} />
                  <GiftBox3D boxNumber={3} color="blue" onSelect={handleBoxSelect} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 100-day calendar section */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="px-4 py-8"
            >
              <div className="max-w-4xl mx-auto">
                <Calendar100 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 md:left-20">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <div className="text-3xl">🌸</div>
        </motion.div>
      </div>

      <div className="absolute top-40 right-10 md:right-20">
        <motion.div
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
        >
          <div className="text-2xl">🌺</div>
        </motion.div>
      </div>

      <div className="absolute bottom-20 left-1/4">
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 2,
          }}
        >
          <div className="text-4xl">🌼</div>
        </motion.div>
      </div>

      <div className="absolute bottom-32 right-1/4">
        <motion.div
          animate={{
            rotate: [0, -15, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 3,
          }}
        >
          <div className="text-3xl">🌻</div>
        </motion.div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff69b4' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </div>
  )
}

export default GiftPage
