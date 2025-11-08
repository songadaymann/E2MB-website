import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'

function Countdown() {
  const digitColumnsRef = useRef([])

  useEffect(() => {
    const TARGET_DATE = Date.UTC(2026, 0, 1, 0, 0, 0)
    const BLOCK_TIME = 12

    const positions = [
      [65, 80], [125, 80], [185, 80], [245, 80],
      [65, 140], [125, 140], [185, 140], [245, 140],
      [65, 200], [125, 200], [185, 200], [245, 200]
    ]

    const digitsContainer = document.getElementById('countdown-digits')
    digitColumnsRef.current = []

    positions.forEach((pos, i) => {
      const col = createDigitColumn(pos[0], pos[1], `col${i}`)
      digitsContainer.appendChild(col)
      digitColumnsRef.current.push(document.getElementById(`col${i}`))
    })

    function createDigitColumn(x, y, containerId) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('transform', `translate(${x}, ${y})`)
      g.setAttribute('clip-path', 'url(#digitWindow)')
      
      const innerG = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      innerG.id = containerId
      innerG.setAttribute('transform', 'translate(13, 0)')
      
      for (let i = 0; i <= 10; i++) {
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        use.setAttribute('href', `#d0`)
        use.setAttribute('y', i * 50)
        innerG.appendChild(use)
      }
      
      g.appendChild(innerG)
      return g
    }

    function updateDigit(container, digit) {
      const uses = container.querySelectorAll('use')
      for (let i = 0; i <= 10; i++) {
        const d = (digit - i + 20) % 10
        uses[i].setAttribute('href', `#d${d}`)
      }
      container.setAttribute('transform', 'translate(13, 0)')
    }

    function updateSmoothDigit(container, blocksRemaining) {
      const intBlocks = Math.floor(blocksRemaining)
      const ones = intBlocks % 10
      const next = (ones - 1 + 10) % 10

      const frac = blocksRemaining - intBlocks
      const progress = 1 - frac
      const yOffset = -progress * 50

      const uses = container.querySelectorAll('use')
      uses[0].setAttribute('href', `#d${ones}`)
      uses[1].setAttribute('href', `#d${next}`)
      container.setAttribute('transform', `translate(13, ${yOffset})`)
    }

    function updateCountdown() {
      const now = Date.now()
      const remainingMs = Math.max(0, TARGET_DATE - now)
      const blocksRemaining = remainingMs / 1000 / BLOCK_TIME
      const blocksInt = Math.floor(blocksRemaining)

      const blockStr = blocksInt.toString().padStart(12, '0')
      
      for (let i = 0; i < 12; i++) {
        const isOnesPlace = (i === 11)
        
        if (isOnesPlace) {
          updateSmoothDigit(digitColumnsRef.current[i], blocksRemaining)
        } else {
          updateDigit(digitColumnsRef.current[i], parseInt(blockStr[i], 10))
        }
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" width="256" height="auto">
        <defs>
          <g id="d0" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d1" transform="translate(4,0)"><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>
          <g id="d2" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d3" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d4" transform="translate(4,0)"><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>
          <g id="d5" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d6" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d7" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="16" y="4" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/></g>
          <g id="d8" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="-4" y="22" width="4" height="16"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <g id="d9" transform="translate(4,0)"><rect x="0" y="0" width="16" height="4"/><rect x="-4" y="4" width="4" height="16"/><rect x="16" y="4" width="4" height="16"/><rect x="0" y="18" width="16" height="4"/><rect x="16" y="22" width="4" height="16"/><rect x="0" y="36" width="16" height="4"/></g>
          <clipPath id="digitWindow" clipPathUnits="userSpaceOnUse"><rect x="0" y="0" width="50" height="50"/></clipPath>
        </defs>
        <rect width="100%" height="100%" fill="#000"/>
        <g id="countdown-digits" fill="#fff"></g>
      </svg>
    </Box>
  )
}

export default Countdown
