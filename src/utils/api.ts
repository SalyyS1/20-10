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
      
      // Clean undefined values for Firestore
      const cleanData: any = {
        deviceId,
        boxNumber: data.boxNumber,
        name: data.name,
        phone: data.phone,
        address: data.address,
        dob: data.dob,
        timestamp: data.timestamp,
        submittedAt: serverTimestamp(),
      }

      // Only add optional fields if they exist and are not undefined
      if (data.giftType !== undefined && data.giftType !== '') {
        cleanData.giftType = data.giftType
      }
      if (data.favoriteGenre !== undefined && data.favoriteGenre !== '') {
        cleanData.favoriteGenre = data.favoriteGenre
      }
      if (data.note !== undefined && data.note !== '') {
        cleanData.note = data.note
      }
      
      await addDoc(collection(db, 'giftSubmissions'), cleanData)

      console.log('✅ Gift selection saved to Firebase:', cleanData)
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
