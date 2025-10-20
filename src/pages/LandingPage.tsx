import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import { Heart, Sparkles } from 'lucide-react'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGiftClick = () => {
    navigate('/gift')
  }

  return (
    <div className="page-container relative bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      {/* Floating Flower Petals - Minimal for performance */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-30"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 25}%`,
              fontSize: '12px',
            }}
            animate={{
              y: [0, -10, 0],
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

      {/* Floating Hearts - Minimal for performance */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-300 opacity-30"
            style={{
              left: `${30 + i * 40}%`,
              top: `${30 + i * 30}%`,
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

      {/* Floating Sparkles - Minimal for performance */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 opacity-40"
            style={{
              left: `${40 + i * 20}%`,
              top: `${40 + i * 20}%`,
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

      {/* Sparkle Effects - Minimal */}
      <div className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${50 + i * 30}%`,
              top: `${50 + i * 20}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ duration: 0.8, delay: 0.2, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            className="text-4xl md:text-6xl lg:text-7xl font-dancing font-bold text-pink-600 mb-6"
          >
            Chúc mừng ngày Phụ Nữ Việt Nam
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{ duration: 0.8, delay: 0.4, y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="text-2xl md:text-3xl lg:text-4xl font-dancing font-semibold text-purple-600 mb-8"
          >
            20 tháng 10
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl font-poppins text-gray-700 mb-12 leading-relaxed"
          >
            Anh có một món quà đặc biệt dành cho em
          </motion.p>

          {/* Gift Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                onClick={handleGiftClick}
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  padding: '16px 48px',
                  borderRadius: '50px',
                  minHeight: '60px',
                  minWidth: '300px',
                  boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                    boxShadow: '0 15px 35px rgba(168, 85, 247, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={<Heart className="w-6 h-6" />}
                endIcon={<Sparkles className="w-6 h-6" />}
              >
                Xem món quà đặc biệt này nhé
              </Button>

              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-lg opacity-30 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Decorative Hearts */}
          <div className="absolute top-20 left-10 md:left-20">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Heart className="w-8 h-8 text-pink-400 opacity-60" />
            </motion.div>
          </div>

          <div className="absolute top-32 right-10 md:right-20">
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1,
              }}
            >
              <Heart className="w-6 h-6 text-purple-400 opacity-60" />
            </motion.div>
          </div>

          <div className="absolute bottom-20 left-1/4">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2,
              }}
            >
              <Heart className="w-10 h-10 text-blue-400 opacity-50" />
            </motion.div>
          </div>

          <div className="absolute bottom-32 right-1/4">
            <motion.div
              animate={{
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 3,
              }}
            >
              <Heart className="w-7 h-7 text-pink-300 opacity-60" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ pointerEvents: 'none' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff69b4' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
    </div>
  )
}

export default LandingPage
