import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material'
import { Lock, Unlock } from 'lucide-react'
import { SHARED_PASSWORD, LETTERS } from '../config'
import { useNavigate } from 'react-router-dom'
import { loadProgress, saveProgressPartial, saveDayReply } from '../utils/progress'

interface Calendar100Props {
  className?: string
}

const DAY_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

const formatDuration = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const Calendar100: React.FC<Calendar100Props> = ({ className }) => {
  const navigate = useNavigate()
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set())
  const [openDay, setOpenDay] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [lastOpenAt, setLastOpenAt] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState<number>(Date.now())
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetPassword, setResetPassword] = useState('')
  const [replyText, setReplyText] = useState('')
  const [savingReply, setSavingReply] = useState(false)
  const [replies, setReplies] = useState<Record<string, string>>({})

  // Initial load from Firestore
  useEffect(() => {
    let mounted = true
    loadProgress().then((p) => {
      if (!mounted) return
      setUnlocked(new Set(p.unlockedDays))
      if (p.lastOpenAt) setLastOpenAt(p.lastOpenAt)
      if (p.replies) setReplies(p.replies)
    }).catch((error) => {
      console.warn('⚠️ Failed to load progress from Firebase:', error)
      // Continue without progress (fresh start)
    })
    return () => { mounted = false }
  }, [])

  // Reset timer when unlocked days change (when days are deleted from Firebase)
  useEffect(() => {
    const checkProgress = async () => {
      try {
        const p = await loadProgress()
        const currentUnlocked = new Set(p.unlockedDays)
        const currentLastOpenAt = p.lastOpenAt
        const currentReplies = p.replies || {}

        // If unlocked days decreased, reset timer
        if (currentUnlocked.size < unlocked.size) {
          console.log('🔄 Days deleted from Firebase, resetting timer')
          setUnlocked(currentUnlocked)
          setLastOpenAt(null) // Reset timer
        }
        // If lastOpenAt changed, update it
        else if (currentLastOpenAt !== lastOpenAt) {
          setLastOpenAt(currentLastOpenAt)
        }
        // If replies changed, update them
        if (JSON.stringify(currentReplies) !== JSON.stringify(replies)) {
          setReplies(currentReplies)
        }
      } catch (error) {
        console.warn('⚠️ Failed to check progress:', error)
      }
    }

    // Check every 5 seconds for changes
    const interval = setInterval(checkProgress, 5000)
    return () => clearInterval(interval)
  }, [unlocked.size, lastOpenAt])

  // Tick clock for countdown display
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const msUntilNextUnlock = useMemo(() => {
    if (!lastOpenAt) return 0 // No previous unlock, can unlock immediately
    const nextAt = lastOpenAt + DAY_MS
    const remain = nextAt - nowMs
    return remain > 0 ? remain : 0
  }, [lastOpenAt, nowMs])

  // Can unlock if no previous unlock OR 24h has passed
  const canUnlockNow = !lastOpenAt || msUntilNextUnlock === 0

  const handleTileClick = (day: number) => {
    if (unlocked.has(day)) {
      setOpenDay(day)
      setPassword('')
      setError('')
      setReplyText(replies[String(day)] || '')
      setShowDialog(true)
      return
    }

    // Check if trying to unlock the next sequential day
    const maxUnlocked = unlocked.size > 0 ? Math.max(...Array.from(unlocked)) : 0
    const nextDay = maxUnlocked + 1

    if (day !== nextDay) {
      setOpenDay(null)
      setError(`Chỉ có thể mở ngày ${nextDay} tiếp theo thôi! 💖`)
      setShowDialog(true)
      return
    }

    if (!canUnlockNow) {
      setOpenDay(null)
      setError('Cần chờ đủ 24 giờ để mở ô tiếp theo 💖')
      setShowDialog(true)
      return
    }

    setOpenDay(day)
    setPassword('')
    setError('')
    setShowDialog(true)
  }

  const handleUnlock = async () => {
    if (openDay == null) return
    if (password.trim() !== SHARED_PASSWORD) {
      setError('Mật khẩu chưa đúng rồi 🥺')
      return
    }
    const next = new Set(unlocked)
    next.add(openDay)

    // Update state first
    setUnlocked(next)

    // Then save to Firebase with the new set
    const ts = Date.now()
    setLastOpenAt(ts)

    try {
      await saveProgressPartial(Array.from(next), ts)
    } catch (error) {
      console.warn('⚠️ Failed to save progress to Firebase:', error)
    }

    setError('')
    // preload reply text from stored replies if available
    const existing = replies[String(openDay)] || ''
    setReplyText(existing)
    // Keep dialog open to show the letter immediately
    // setShowDialog(false)
  }

  const handleSaveReply = async () => {
    if (openDay == null) return
    const text = replyText.trim()
    if (!text) return
    setSavingReply(true)
    try {
      await saveDayReply(openDay, text)
      setReplies({ ...replies, [String(openDay)]: text })
    } catch (e) {
      console.warn('⚠️ Failed to save reply:', e)
    } finally {
      setSavingReply(false)
    }
  }

  const closeDialog = () => {
    setShowDialog(false)
    setPassword('')
    setError('')
  }

  const handleResetTime = async () => {
    if (resetPassword.trim() !== 'ducnhan') {
      setError('Mật khẩu reset chưa đúng!')
      return
    }

    try {
      // Reset lastOpenAt to null
      setLastOpenAt(null)
      await saveProgressPartial(Array.from(unlocked), null)
      setShowResetDialog(false)
      setResetPassword('')
      setError('')
    } catch (error) {
      console.error('Error resetting time:', error)
      setError('Có lỗi xảy ra khi reset thời gian!')
    }
  }

  const closeResetDialog = () => {
    setShowResetDialog(false)
    setResetPassword('')
    setError('')
  }

  return (
    <div className={`${className} min-h-screen overflow-y-auto`}>
      <div className="max-w-6xl mx-auto text-center mb-8 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-dancing font-bold text-purple-700 mb-4">
            100 Bức Thư Cho Em
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Mỗi 24 giờ chỉ mở 1 ô. Dùng mật khẩu là tên em để mở.
          </p>

          {lastOpenAt && !canUnlockNow && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 shadow-md"
            >
              <div className="text-lg font-poppins text-orange-700 font-semibold">
                ⏰ Còn {formatDuration(msUntilNextUnlock)} để mở ô tiếp theo
              </div>
            </motion.div>
          )}

          {!lastOpenAt && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 shadow-md"
            >
              <div className="text-lg font-poppins text-green-700 font-semibold">
                🎉 Có thể mở ô đầu tiên ngay bây giờ!
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center justify-center gap-3 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Button
                variant="contained"
                onClick={() => setShowResetDialog(true)}
                className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🔄 Reset thời gian
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Button
                variant="contained"
                onClick={() => navigate('/storage')}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                📦 Kho lưu trữ
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4 px-6 pb-8">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((day) => {
          const isUnlocked = unlocked.has(day)
          const maxUnlocked = unlocked.size > 0 ? Math.max(...Array.from(unlocked)) : 0
          const nextDay = maxUnlocked + 1
          const isNextDay = day === nextDay && canUnlockNow
          const isFutureDay = day > nextDay

          const isMilestone5 = [10,20,30,40,50].includes(day)
          const isMilestone10 = [60,70,80,90,100].includes(day)

          let lockColorClass = ''
          if (isUnlocked) {
            lockColorClass = ''
          } else if (isNextDay) {
            lockColorClass = 'text-yellow-500' // Can unlock now
          } else if (isFutureDay) {
            lockColorClass = 'text-gray-400' // Future day
          } else {
            lockColorClass = 'text-red-500' // Past day, can't unlock
          }

          return (
            <motion.button
              key={day}
              onClick={() => handleTileClick(day)}
              className={`relative aspect-square rounded-2xl shadow-lg flex items-center justify-center font-bold select-none transition-all duration-300 ${
                isUnlocked
                  ? 'bg-gradient-to-br from-green-200 to-emerald-300 text-green-800 shadow-green-200'
                  : isNextDay
                    ? 'bg-gradient-to-br from-yellow-200 to-orange-300 text-orange-800 shadow-orange-200'
                    : 'bg-gradient-to-br from-pink-200 to-purple-300 text-purple-800 shadow-pink-200'
              } ${isMilestone5 ? 'ring-4 ring-pink-300 ring-offset-2 ring-offset-white' : ''} ${isMilestone10 ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-white shadow-2xl' : ''}`}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: day * 0.01 }}
            >
              {/* Static highlight only for milestone days, no blinking */}
              <div className="absolute top-1 right-1">
                {isUnlocked ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Unlock className="w-5 h-5 text-green-600" />
                  </motion.div>
                ) : (
                  <Lock className={`w-5 h-5 ${lockColorClass}`} />
                )}
              </div>
              <span className="text-xl font-bold">{day}</span>
              {isNextDay && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-1 text-xs text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded-full"
                >
                  Tiếp theo
                </motion.div>
              )}
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      <Dialog open={showDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl"
        >
          <DialogTitle className="text-center font-dancing text-3xl text-purple-700 bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-3xl p-6">
            {openDay ? ` Ngày ${openDay} ` : '📢 Thông báo'}
          </DialogTitle>
          <DialogContent className="p-6">
            <AnimatePresence mode="wait">
              {openDay != null && unlocked.has(openDay) ? (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-lg border border-pink-200"
                >
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg font-poppins">
                    {LETTERS[openDay - 1]}
                  </div>
                  <div className="mt-6 space-y-4">
                    <TextField
                      label="Phản hồi của bạn"
                      fullWidth
                      multiline
                      minRows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: 'white' } }}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        variant="outlined"
                        onClick={closeDialog}
                        className="rounded-xl px-6 py-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        Đóng
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveReply}
                        disabled={savingReply || !replyText.trim()}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl px-6 py-2 font-semibold disabled:opacity-60"
                      >
                        {savingReply ? 'Đang lưu...' : 'Gửi phản hồi'}
                      </Button>
                    </div>
                    {replies[String(openDay)] && (
                      <div className="text-sm text-gray-600">
                        Phản hồi đã lưu: <span className="font-medium text-gray-800">{replies[String(openDay)]}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : openDay != null ? (
                <motion.div
                  key="unlock"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="text-lg text-gray-700 mb-4">
                      🔐 Nhập mật khẩu để mở ô ngày {openDay}
                    </div>
                  </div>
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleUnlock}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl w-full py-3 font-bold"
                  >
                    🔓 Mở khóa
                  </Button>
                  {error && <div className="text-center text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">{error}</div>}
                </motion.div>
              ) : (
                <motion.div
                  key="notice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6"
                >
                  <div className="text-gray-700 text-lg">{error || '—'}</div>
                  <div className="mt-6">
                    <Button
                      variant="outlined"
                      onClick={closeDialog}
                      className="rounded-xl px-6 py-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      Đóng
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </motion.div>
      </Dialog>

      {/* Reset Time Dialog */}
      <Dialog open={showResetDialog} onClose={closeResetDialog} maxWidth="sm" fullWidth>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-2xl"
        >
          <DialogTitle className="text-center font-dancing text-3xl text-orange-700 bg-gradient-to-r from-orange-100 to-red-100 rounded-t-3xl p-6 relative overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-2 right-2 text-2xl opacity-30"
            >
              🔄
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              🔄 Reset thời gian
            </motion.div>
          </DialogTitle>
          <DialogContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">
                  ⚠️ Nhập mật khẩu để reset thời gian chờ
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Sau khi reset, bạn có thể mở ô tiếp theo ngay lập tức
                </div>
              </div>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu reset"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="rounded-xl"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                  }
                }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  onClick={handleResetTime}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl w-full py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  startIcon={
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="text-xl"
                    >
                      🔄
                    </motion.div>
                  }
                >
                  Reset thời gian
                </Button>
              </motion.div>
              {error && <div className="text-center text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">{error}</div>}
            </motion.div>
          </DialogContent>
        </motion.div>
      </Dialog>
    </div>
  )
}

export default Calendar100
