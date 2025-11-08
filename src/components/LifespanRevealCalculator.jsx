import { useMemo, useState } from 'react'
import lifeExpectancyData from '../data/life-expectancy-2025.json'

const GLOBAL_EXPECTANCY = 73.5
const CURRENT_YEAR = new Date().getFullYear()

const expectancyLookup = lifeExpectancyData.reduce((acc, entry) => {
  acc[entry.country.toLowerCase()] = entry
  return acc
}, {})

const sortedCountries = lifeExpectancyData
  .map((entry) => entry.country)
  .sort((a, b) => a.localeCompare(b))

function getExpectancy(country, gender) {
  if (!country) return null
  const record = expectancyLookup[country.toLowerCase()]
  if (!record) return null

  if (gender === 'female') return record.lifeExpectancyFemale
  if (gender === 'male') return record.lifeExpectancyMale
  return record.lifeExpectancyBoth
}

function formatYears(value) {
  if (Number.isNaN(value)) return '0'
  return value.toFixed(1).replace(/\\.0$/, '')
}

function LifespanRevealCalculator() {
  const [ageInput, setAgeInput] = useState('')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [country, setCountry] = useState('')
  const [gender, setGender] = useState('both')
  const [result, setResult] = useState(null)

  const numericAge = useMemo(() => {
    const parsed = parseFloat(ageInput)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN
  }, [ageInput])

  const expectancy = useMemo(() => {
    const advancedValue = isAdvanced ? getExpectancy(country, gender) : null
    return advancedValue ?? GLOBAL_EXPECTANCY
  }, [country, gender, isAdvanced])

  const hasValidAge = Number.isFinite(numericAge)
  const yearsLeft = hasValidAge ? expectancy - numericAge : NaN
  const deadlineYear = Number.isFinite(yearsLeft)
    ? CURRENT_YEAR + Math.max(0, Math.ceil(yearsLeft))
    : null

  const lifeStatus =
    Number.isFinite(yearsLeft) && yearsLeft < 0
      ? `you've outlived the average by ${formatYears(Math.abs(yearsLeft))} years. every unlock is bonus time.`
      : Number.isFinite(yearsLeft)
      ? `average lifespan${isAdvanced && country ? ` in ${country}` : ''}${
          isAdvanced ? ` (${gender})` : ''
        } is ${expectancy.toFixed(1)} years. you have ${formatYears(
          Math.max(yearsLeft, 0)
        )} years left.`
      : 'enter a non-negative age first.'

  const handleCalculate = () => {
    setResult({
      lifeStatus,
      deadlineYear: Number.isFinite(yearsLeft) ? deadlineYear : null,
      yearsLeft,
    })
  }

  const modeLabel = isAdvanced ? 'basic mode' : 'advanced mode'
  const modeHelper = isAdvanced
    ? 'dial it in with country + gender'
    : 'assumes global average lifespan 73.5 years'

  const displayStatus = result ? result.lifeStatus : 'enter your age and tap calculate.'
  const shouldShowDeadline =
    result && Number.isFinite(result.yearsLeft) && result.yearsLeft >= 0 && result.deadlineYear

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        padding: '.02rem 2rem 1rem',
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '2rem',
          fontWeight: 800,
          opacity: 0.9,
        }}
      >
        will you hear your note before you die?
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.2rem',
          alignItems: 'flex-end',
          marginTop: '0',
        }}
      >
        <button
          type="button"
          onClick={handleCalculate}
          style={{
            background: 'linear-gradient(120deg, #A72703, #FCB53B)',
            border: 'none',
            borderRadius: '999px',
            padding: '0.85rem 2.25rem',
            color: 'white',
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            fontWeight: 700,
            cursor: 'pointer',
            minWidth: '200px',
          }}
        >
          calculate
        </button>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            minWidth: '250px',
            alignItems: 'flex-end',
            flex: '1 1 320px',
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>your age</span>
            <input
              type="number"
              min="0"
              value={ageInput}
              onChange={(event) => setAgeInput(event.target.value)}
              placeholder="43"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                padding: '0.75rem',
                color: 'white',
                fontSize: '1.25rem',
              }}
            />
          </label>

          {isAdvanced && (
            <>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '220px' }}>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>country</span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '0.65rem',
                    color: 'white',
                  }}
                >
                  <option value="">select country</option>
                  {sortedCountries.map((name) => (
                    <option key={name} value={name} style={{ color: 'black' }}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '220px' }}>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>gender</span>
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    padding: '0.65rem',
                    color: 'white',
                  }}
                >
                  <option value="both">all</option>
                  <option value="female">female</option>
                  <option value="male">male</option>
                </select>
              </label>
            </>
          )}
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            minWidth: '180px',
            alignItems: 'flex-end',
          }}
        >
          <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>mode</span>
          <button
            type="button"
            onClick={() => setIsAdvanced((prev) => !prev)}
            style={{
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: isAdvanced ? '#84994F' : 'transparent',
              color: 'white',
              padding: '0.5rem 1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {modeLabel}
          </button>
          <span style={{ fontSize: '0.8rem', opacity: 0.65, textAlign: 'right' }}>{modeHelper}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: '0.35rem',
          padding: '.5rem 1.25rem 1.35rem',
          border: '2px solid rgba(255,255,255,0.35)',
          borderRadius: '12px',
          backgroundColor: 'rgba(0,0,0,0.25)',
          minHeight: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '1rem',
          flex: '1 1 auto',
          position: 'relative',
          boxShadow: '0 0 25px rgba(0,0,0,0.35)',
          marginBottom: '0',
        }}
      >
        <div>{displayStatus}</div>
        {shouldShowDeadline && (
          <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            one of your notes must be revealed by{' '}
            <span style={{ color: '#FCB53B' }}>{result.deadlineYear}</span> for you to hear it.
          </div>
        )}
      </div>
    </div>
  )
}

export default LifespanRevealCalculator
