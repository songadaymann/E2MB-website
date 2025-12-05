import { useEffect, useMemo, useState } from 'react'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const START_YEAR = 2009
const START_MONTH = 0 // January (0-indexed)
const START_DAY = 1

const startDateUTC = Date.UTC(START_YEAR, START_MONTH, START_DAY)

function getTodayUTC() {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

function hasHadAnniversaryThisYear(today = new Date()) {
  const month = today.getUTCMonth()
  const day = today.getUTCDate()
  return month > START_MONTH || (month === START_MONTH && day >= START_DAY)
}

function calculateStats() {
  const today = new Date()
  const todayUTC = getTodayUTC()

  if (todayUTC < startDateUTC) {
    return { years: 0, days: 0, songs: 0 }
  }

  const totalDays = Math.floor((todayUTC - startDateUTC) / MS_PER_DAY) + 1

  let years = today.getUTCFullYear() - START_YEAR
  if (!hasHadAnniversaryThisYear(today)) {
    years -= 1
  }

  const lastAnniversaryYear = START_YEAR + Math.max(years, 0)
  const lastAnniversaryUTC = Date.UTC(lastAnniversaryYear, START_MONTH, START_DAY)
  const daysIntoCurrentYear = Math.floor((todayUTC - lastAnniversaryUTC) / MS_PER_DAY)

  return {
    years: Math.max(years, 0),
    days: Math.max(daysIntoCurrentYear, 0),
    songs: totalDays,
  }
}

function SongADayTicker() {
  const [stats, setStats] = useState(() => calculateStats())

  useEffect(() => {
    const update = () => setStats(calculateStats())

    update()

    const now = new Date()
    const nextMidnightUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1
    )
    const delay = Math.max(nextMidnightUTC - now.getTime(), 0)

    let intervalId
    const timeoutId = window.setTimeout(() => {
      update()
      intervalId = window.setInterval(update, MS_PER_DAY)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  const songsFormatted = useMemo(
    () => new Intl.NumberFormat('en-US').format(stats.songs),
    [stats.songs]
  )

  const yearsLabel = stats.years === 1 ? 'year' : 'years'
  const daysLabel = stats.days === 1 ? 'day' : 'days'

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
        i've been writing a song a day for {stats.years} {yearsLabel} and {stats.days}{' '}
        {daysLabel}
      </div>
      <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 'bold', lineHeight: 1.2 }}>
        or {songsFormatted} songs.
      </div>
    </div>
  )
}

export default SongADayTicker
