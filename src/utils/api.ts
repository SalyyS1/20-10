// API utilities for GitHub integration
// This file handles API calls to GitHub through proxy endpoints

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.github.com'
  : '/api'

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

// Removed ProgressData and related book progress APIs

// Mock API responses for development
const isDevelopment = process.env.NODE_ENV === 'development'

export const api = {
  // Submit gift selection
  async submitGiftSelection(data: GiftFormData): Promise<{ success: boolean; message: string }> {
    if (isDevelopment) {
      // Mock response for development
      console.log('Mock API: Submitting gift selection', data)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Gift selection submitted successfully (mock)'
          })
        }, 1000)
      })
    }

    try {
      const response = await fetch(`${API_BASE_URL}/github-issue-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'create_issue',
          client_payload: data
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error submitting gift selection:', error)
      throw error
    }
  },

  // progress APIs removed
}

export default api
