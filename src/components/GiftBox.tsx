import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material'
import { Heart } from 'lucide-react'
import api from '../utils/api'
import { saveGiftSubmission } from '../utils/progress'

interface GiftBoxProps {
  boxNumber: number
  color: string
  onSelect: (boxNumber: number) => void
}

const GiftBox: React.FC<GiftBoxProps> = ({ boxNumber, color, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const giftType = useMemo(() => {
    switch (boxNumber) {
      case 1: return 'Gấu bông'
      case 2: return 'Vòng tay'
      case 3: return 'Sách'
      default: return 'Bí mật'
    }
  }, [boxNumber])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    favoriteGenre: '',
    note: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleBoxClick = () => {
    setIsOpen(true)
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
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
          giftType,
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
        giftType,
        favoriteGenre: boxNumber === 3 ? formData.favoriteGenre : undefined,
        note: formData.note || undefined,
      })

      if (result.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsOpen(false)
          onSelect(boxNumber)
        }, 2000)
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
        return 'from-pink-300 to-pink-500'
      case 'purple':
        return 'from-purple-300 to-purple-500'
      case 'blue':
        return 'from-blue-300 to-blue-500'
      default:
        return 'from-gray-300 to-gray-500'
    }
  }

  const getBoxIcon = () => {
    switch (boxNumber) {
      case 1:
        return '💝'
      case 2:
        return '🎀'
      case 3:
        return '💐'
      default:
        return '🎁'
    }
  }

  return (
    <>
      <motion.div
        className={`w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br ${getBoxGradient()} rounded-2xl shadow-lg cursor-pointer flex flex-col items-center justify-center relative overflow-hidden`}
        data-testid={`gift-box-${boxNumber}`}
        onClick={handleBoxClick}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          rotateX: 5
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: boxNumber * 0.2 }}
      >
        {/* Box pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M10 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Box content */}
        <div className="text-4xl md:text-5xl mb-2 z-10">
          {getBoxIcon()}
        </div>

        <div className="text-white font-poppins font-bold text-lg md:text-xl z-10">
          Hộp {boxNumber}
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + (i * 30)}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Form Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => !isSubmitting && setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={window.innerWidth < 768}
      >
        <DialogTitle className="text-center font-dancing text-2xl text-pink-600">
          Bạn đã mở hộp {boxNumber}: {giftType}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 p-4 text-container">
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.name}
              onChange={handleInputChange('name')}
              variant="outlined"
              disabled={isSubmitting}
              className="!mb-4"
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              variant="outlined"
              disabled={isSubmitting}
              className="!mb-4"
            />
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={formData.dob}
              onChange={handleInputChange('dob')}
              variant="outlined"
              disabled={isSubmitting}
              className="!mb-4"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={handleInputChange('address')}
              variant="outlined"
              multiline
              rows={3}
              disabled={isSubmitting}
              className="!mb-6"
            />

            {boxNumber === 3 && (
              <TextField
                fullWidth
                label="Thể loại sách yêu thích"
                value={formData.favoriteGenre}
                onChange={handleInputChange('favoriteGenre')}
                variant="outlined"
                disabled={isSubmitting}
                className="!mb-4"
                placeholder="Ví dụ: Tiểu thuyết, Khoa học, Tâm lý..."
              />
            )}

            <TextField
              fullWidth
              label="Ghi chú"
              value={formData.note}
              onChange={handleInputChange('note')}
              variant="outlined"
              multiline
              rows={3}
              disabled={isSubmitting}
              placeholder="Bạn có muốn nhắn gì thêm không?"
              className="!mb-4"
            />

            <AnimatePresence>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-lg font-poppins text-green-600 font-semibold">
                    Món quà của bạn đã được ghi nhận!
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Chuyển đến quyển sách trong 3 giây...
                  </p>
                </motion.div>
              ) : (
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outlined"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    sx={{
                      borderColor: '#f9a8d4',
                      color: '#ec4899',
                      '&:hover': {
                        borderColor: '#f472b6',
                        backgroundColor: 'rgba(244, 114, 182, 0.1)',
                      },
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                      background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                      },
                    }}
                    startIcon={isSubmitting ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Heart className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GiftBox
