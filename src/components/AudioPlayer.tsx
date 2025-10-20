import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { IconButton } from '@mui/material'
import bgMusic from '../assets/background.mp3'

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.loop = true
      audio.volume = 0.3 // Gentle volume
      audio.muted = true // allow autoplay on most browsers

      // Try autoplay on mount (muted)
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Autoplay blocked silently; will start on user interaction
      })

      // On first user interaction, unmute
      const onFirstInteraction = () => {
        if (!audio) return
        audio.muted = false
        setIsMuted(false)
        // Ensure it's playing
        audio.play().catch(() => {})
        window.removeEventListener('pointerdown', onFirstInteraction)
      }
      window.addEventListener('pointerdown', onFirstInteraction, { once: true })

      return () => {
        window.removeEventListener('pointerdown', onFirstInteraction)
      }
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={bgMusic}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.warn('Audio file not found or failed to load:', e)
          setIsPlaying(false)
        }}
      />

      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="flex space-x-2">
          <IconButton
            onClick={togglePlay}
            className="!bg-white/20 !backdrop-blur-sm !text-white hover:!bg-white/30"
            size="small"
          >
            {isPlaying ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🔊
              </motion.div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </IconButton>

          <IconButton
            onClick={toggleMute}
            className="!bg-white/20 !backdrop-blur-sm !text-white hover:!bg-white/30"
            size="small"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </IconButton>
        </div>
      </motion.div>
    </>
  )
}

export default AudioPlayer
