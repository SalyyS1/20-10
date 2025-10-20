import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material'
import api from '../utils/api'
import { saveGiftSubmission } from '../utils/progress'

interface GiftBox3DProps {
  boxNumber: number
  color: string
  onSelect: (boxNumber: number) => void
}

const GiftBox3D: React.FC<GiftBox3DProps> = ({ boxNumber, color, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    note: '',
    favoriteGenre: '',
  })

  const giftType = () => {
    switch (boxNumber) {
      case 1: return 'Gấu bông'
      case 2: return 'Vòng tay'
      case 3: return 'Sách'
      default: return 'Quà bí mật'
    }
  }

  const getGiftIcon = () => {
    switch (boxNumber) {
      case 1: return '🧸'
      case 2: return '💍'
      case 3: return '📚'
      default: return '🎁'
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    // Show gift after opening
    setTimeout(() => setShowGift(true), 1000)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsSubmitted(false)
    setShowGift(false)
    setFormData({
      name: '',
      phone: '',
      address: '',
      dob: '',
      note: '',
      favoriteGenre: '',
    })
  }

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.dob) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsSubmitting(true)

    try {
      // Try to save to Firebase first (optional)
      try {
        await saveGiftSubmission({
          boxNumber,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          dob: formData.dob,
          giftType: giftType(),
          favoriteGenre: boxNumber === 3 ? formData.favoriteGenre : undefined,
          note: formData.note || undefined,
          timestamp: new Date().toISOString(),
        })
        console.log('✅ Saved to Firebase successfully')
      } catch (firebaseError) {
        console.warn('⚠️ Firebase save failed, continuing with GitHub:', firebaseError)
      }

      // Always save to GitHub (main method)
      const result = await api.submitGiftSelection({
        boxNumber,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
        timestamp: new Date().toISOString(),
        giftType: giftType(),
        favoriteGenre: boxNumber === 3 ? formData.favoriteGenre : undefined,
        note: formData.note || undefined,
      })

      if (result.success) {
        setIsSubmitted(true)
        // Show success animation for 1.5 seconds then transition
        setTimeout(() => {
          setIsOpen(false)
          onSelect(boxNumber)
        }, 1500)
      } else {
        throw new Error(result.message || 'Failed to submit')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBoxGradient = () => {
    switch (color) {
      case 'pink':
        return 'from-pink-400 to-pink-600'
      case 'blue':
        return 'from-blue-400 to-blue-600'
      case 'purple':
        return 'from-purple-400 to-purple-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getBoxShadow = () => {
    switch (color) {
      case 'pink':
        return 'shadow-pink-500/50'
      case 'blue':
        return 'shadow-blue-500/50'
      case 'purple':
        return 'shadow-purple-500/50'
      default:
        return 'shadow-gray-500/50'
    }
  }

  return (
    <>
      {/* 3D Gift Box */}
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: boxNumber * 0.2 }}
      >
        {/* Box Base */}
        <div className={`relative w-48 h-48 bg-gradient-to-br ${getBoxGradient()} rounded-lg shadow-2xl ${getBoxShadow()}`}>
          {/* Box Ribbon */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/30 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-white/30 transform -translate-x-1/2"></div>

          {/* Box Bow */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-red-500 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-400 rounded-full"></div>
            </div>
          </div>

          {/* Box Content - Hidden until opened */}
          <div className="absolute inset-4 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-2"
            >
              🎁
            </motion.div>
            <div className="text-white text-sm font-bold text-center opacity-90">
              Quà bí mật
            </div>
          </div>

          {/* Box Label */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
              Hộp {boxNumber}
            </span>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Floating Hearts around box */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 20}%`,
                fontSize: '12px',
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dialog with 3D Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Dialog Header with 3D Effect */}
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 text-center relative">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl mb-2"
                >
                  🎁
                </motion.div>
                <DialogTitle className="text-2xl font-dancing font-bold text-purple-700">
                  {isSubmitted ? 'Cảm ơn bạn!' : (
                    <div className="flex items-center justify-center gap-2">
                      <motion.span
                        className="text-3xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={showGift ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        {showGift ? getGiftIcon() : '🎁'}
                      </motion.span>
                      <span>
                        {showGift ? `Điền thông tin nhận quà ${giftType()}` : 'Mở hộp quà bí mật'}
                      </span>
                    </div>
                  )}
                </DialogTitle>
              </div>

              <DialogContent className="p-6 overflow-y-auto max-h-[60vh]">
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        rotate: [0, 360, 0]
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-lg text-green-600 font-semibold"
                    >
                      Thông tin của bạn đã được gửi thành công!
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="text-sm text-gray-500 mt-2"
                    >
                      Đang chuyển đến lịch 100 ngày...
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Gift reveal animation */}
                    {showGift && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl"
                      >
                        <div className="text-6xl mb-2">{getGiftIcon()}</div>
                        <div className="text-xl font-bold text-purple-700">{giftType()}</div>
                        <div className="text-sm text-gray-600 mt-1">Món quà đặc biệt dành cho em!</div>
                      </motion.div>
                    )}

                    <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit() }} className="flex flex-col gap-4 min-h-0">
                      <TextField
                        label="Tên của bạn"
                        value={formData.name}
                        onChange={handleChange('name')}
                        fullWidth
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <TextField
                        label="Số điện thoại"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        fullWidth
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <TextField
                        label="Địa chỉ nhận quà"
                        value={formData.address}
                        onChange={handleChange('address')}
                        fullWidth
                        variant="outlined"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <TextField
                        label="Ngày sinh (DD/MM/YYYY)"
                        value={formData.dob}
                        onChange={handleChange('dob')}
                        fullWidth
                        variant="outlined"
                        placeholder="VD: 20/10/2000"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      {boxNumber === 3 && (
                        <TextField
                          label="Thể loại sách yêu thích"
                          value={formData.favoriteGenre}
                          onChange={handleChange('favoriteGenre')}
                          fullWidth
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            }
                          }}
                        />
                      )}
                      <TextField
                        label="Ghi chú (tùy chọn)"
                        value={formData.note}
                        onChange={handleChange('note')}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl w-full py-3 font-bold text-lg shadow-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Đang gửi...' : '🎁 Gửi thông tin'}
                        </Button>
                      </motion.div>
                    </Box>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4"
                >
                  <Button
                    onClick={handleClose}
                    color="primary"
                    fullWidth
                    className="rounded-xl py-2"
                  >
                    {isSubmitted ? 'Tiếp tục' : 'Hủy'}
                  </Button>
                </motion.div>
              </DialogContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GiftBox3D
