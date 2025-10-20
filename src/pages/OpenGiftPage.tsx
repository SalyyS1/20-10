import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GiftOpen3D from '../components/GiftOpen3D'
import FlowerBloom from '../components/FlowerBloom'
import { useNavigate } from 'react-router-dom'

const OpenGiftPage: React.FC = () => {
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const [showBloom, setShowBloom] = useState(false)

  const handleOpened = () => {
    setOpened(true)
    setShowBloom(true)
  }

  return (
    <div className="page-container relative bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-8 pb-4"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-dancing font-bold text-pink-600 mb-2">
            Mở hộp quà
          </h1>
          <p className="text-lg md:text-xl font-poppins text-gray-700">
            Click để mở, xem điều bất ngờ ✨
          </p>
        </motion.div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl mx-auto">
            <GiftOpen3D onOpened={handleOpened} />
          </div>
        </div>

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center pb-8"
            >
              <button
                className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
                onClick={() => navigate('/gift')}
              >
                Đi đến lịch 100 ngày
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showBloom && (
        <FlowerBloom onComplete={() => setShowBloom(false)} />
      )}
    </div>
  )
}

export default OpenGiftPage
