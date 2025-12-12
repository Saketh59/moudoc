import { useEffect, useMemo, useRef, useState } from 'react'

function daysRemaining(expiryDate) {
  const expirationDateObj = new Date(expiryDate)
  const currentDate = new Date()
  const timeDifference = expirationDateObj - currentDate
  return Math.ceil(timeDifference / (1000 * 3600 * 24))
}

export default function useExpiryReminders(items = [], options = {}) {
  const { thresholdDays = 30, intervalMs = 60_000 } = options
  const [expiringItems, setExpiringItems] = useState([])
  const intervalRef = useRef(null)
  const notifiedRef = useRef(false)

  const computeExpiring = useMemo(() => {
    return () =>
      (items || []).filter((it) => {
        if (!it?.expiryDate) return false
        return daysRemaining(it.expiryDate) <= thresholdDays
      })
  }, [items, thresholdDays])

  useEffect(() => {
    // initial compute on mount or when items change
    setExpiringItems(computeExpiring())

    // clear previous interval (if any) then start a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setExpiringItems(computeExpiring())
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [computeExpiring, intervalMs])

  const expiringCount = expiringItems.length

  const notifyIfAllowed = async (title, body) => {
    try {
      if (!('Notification' in window)) return false
      // Avoid spamming: once per session for the same positive state
      if (notifiedRef.current) return false

      let permission = Notification.permission
      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }
      if (permission === 'granted') {
        new Notification(title || 'MoU Expiry Reminder', {
          body: body || `${expiringCount} MoU(s) expiring within ${thresholdDays} days`,
        })
        notifiedRef.current = true
        return true
      }
    } catch (_) {
      // ignore
    }
    return false
  }

  return { expiringItems, expiringCount, notifyIfAllowed }
}
