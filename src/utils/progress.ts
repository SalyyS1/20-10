import { db } from './firebase'
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore'

export interface CalendarProgress {
  deviceId: string
  unlockedDays: number[]
  lastOpenAt: number | null
  // Map of day number to user's reply text
  replies?: Record<string, string>
}

export interface GiftSubmission {
  boxNumber: number
  name: string
  phone: string
  address: string
  dob: string
  giftType: string
  favoriteGenre?: string
  note?: string
  timestamp: string
  deviceId: string
}

const PROGRESS_COLLECTION = 'calendar_progress'
const GIFTS_COLLECTION = 'gift_submissions'

function getOrCreateDeviceId(): string {
  const key = 'calendar_device_id'
  // Use cookie (not localStorage) per user's preference
  const m = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'))
  if (m && m[1]) return decodeURIComponent(m[1])
  const id = crypto.randomUUID()
  document.cookie = `${key}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}`
  return id
}

export async function loadProgress(): Promise<CalendarProgress> {
  const deviceId = getOrCreateDeviceId()
  const ref = doc(db, PROGRESS_COLLECTION, deviceId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const data = snap.data() as any
        return {
          deviceId,
          unlockedDays: Array.isArray(data.unlockedDays) ? data.unlockedDays : [],
          lastOpenAt: typeof data.lastOpenAt === 'number' ? data.lastOpenAt : null,
          replies: data.replies && typeof data.replies === 'object' ? data.replies as Record<string, string> : {},
        }
  }
  // default
  return { deviceId, unlockedDays: [], lastOpenAt: null, replies: {} }
}

export async function saveProgressPartial(unlockedDays: number[], lastOpenAt: number | null): Promise<void> {
  const deviceId = getOrCreateDeviceId()
  const ref = doc(db, PROGRESS_COLLECTION, deviceId)

  const data: any = {
    unlockedDays,
    lastOpenAt,
    updatedAt: Date.now(),
  }

  try {
    await setDoc(ref, data, { merge: true })
  } catch (error) {
    console.error('❌ Error saving progress:', error)
    throw error
  }
}

/**
 * Save or update user's reply for a specific day.
 */
export async function saveDayReply(day: number, replyText: string): Promise<void> {
  const deviceId = getOrCreateDeviceId()
  const ref = doc(db, PROGRESS_COLLECTION, deviceId)

  const fieldPath = `replies.${day}`
  try {
    // Prefer updateDoc to avoid touching other fields like unlockedDays
    await updateDoc(ref, { [fieldPath]: replyText, updatedAt: Date.now() })
  } catch (error) {
    // If doc might not exist, fall back to setDoc with merge
    try {
      await setDoc(ref, { [fieldPath]: replyText, updatedAt: Date.now() }, { merge: true })
    } catch (inner) {
      console.error('❌ Error saving day reply:', inner)
      throw inner
    }
  }
}

export async function saveGiftSubmission(giftData: Omit<GiftSubmission, 'deviceId'>): Promise<void> {
  const deviceId = getOrCreateDeviceId()

  // Clean undefined values for Firestore
  const cleanGiftData: any = {
    boxNumber: giftData.boxNumber,
    name: giftData.name,
    phone: giftData.phone,
    address: giftData.address,
    dob: giftData.dob,
    giftType: giftData.giftType,
    timestamp: giftData.timestamp,
    deviceId
  }

  // Only add optional fields if they exist
  if (giftData.favoriteGenre) {
    cleanGiftData.favoriteGenre = giftData.favoriteGenre
  }
  if (giftData.note) {
    cleanGiftData.note = giftData.note
  }

  try {
    const docRef = await addDoc(collection(db, GIFTS_COLLECTION), cleanGiftData)
    console.log('✅ Gift submission saved with ID:', docRef.id)
  } catch (error) {
    console.error('❌ Error saving gift submission:', error)
    throw error
  }
}

export async function checkGiftSubmitted(): Promise<boolean> {
  try {
    const deviceId = getOrCreateDeviceId()
    console.log('🔍 Checking gift submission for deviceId:', deviceId)

    // Query gift_submissions collection for this device
    const giftsQuery = query(
      collection(db, GIFTS_COLLECTION),
      where('deviceId', '==', deviceId)
    )

    const querySnapshot = await getDocs(giftsQuery)
    const hasGifts = !querySnapshot.empty
    console.log('📊 Found', querySnapshot.size, 'gift submissions, hasGifts:', hasGifts)

    return hasGifts
  } catch (error) {
    console.warn('⚠️ Failed to check gift status:', error)
    // If permission denied or other error, assume no gifts submitted
    return false
  }
}
