// API utilities for Firebase integration
// This file handles API calls to Firebase Firestore

import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getOrCreateDeviceId } from './progress'

export interface GiftFormData {
  boxNumber: number
  name: string
  phone: string
  address: string
  dob: string
  timestamp: string
  giftType?: string
  favoriteGenre?: string
  note?: string
}

export const api = {
  // Submit gift selection to Firebase
  async submitGiftSelection(data: GiftFormData): Promise<{ success: boolean; message: string }> {
    try {
      const deviceId = getOrCreateDeviceId()
      
      await addDoc(collection(db, 'giftSubmissions'), {
        deviceId,
        ...data,
        submittedAt: serverTimestamp(),
      })

      console.log('✅ Gift selection saved to Firebase:', data)
      return {
        success: true,
        message: 'Gift selection submitted successfully!'
      }
    } catch (error) {
      console.error('❌ Error submitting gift selection:', error)
      throw error
    }
  },
}

export default api
