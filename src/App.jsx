import { Box, useDisclosure } from '@chakra-ui/react'
import Square from './components/Square'
import SquareModal from './components/SquareModal'
import MintHero from './components/MintHero'
import ImageModal from './components/ImageModal'
import CodeModal from './components/CodeModal'
import Countdown from './components/Countdown'
import { useEffect, useRef, useState } from 'react'
import { squaresData, emptySquaresCount } from './squares-data.jsx'
import { useInteractiveMelody } from './hooks/useInteractiveMelody'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()
  const { isOpen: isCodeOpen, onOpen: onCodeOpen, onClose: onCodeClose } = useDisclosure()
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCode, setSelectedCode] = useState(null)
  const gameboyAudioRef = useRef(null)
  const triggerMelody = useInteractiveMelody()

  useEffect(() => {
    gameboyAudioRef.current = new Audio('/audio/gameboy.mp3')
  }, [])

  const handleDropAnimationEnd = () => {
    const audio = gameboyAudioRef.current
    if (!audio) return

    audio.currentTime = 0
    audio.play().catch(() => {
      // Playback can fail if the user hasn't interacted yet; ignore silently.
    })
  }

  const handleSquareClick = (squareData) => {
    if (squareData.showImageModal) {
      setSelectedImage(squareData.image)
      onImageOpen()
    } else if (squareData.showCodeModal) {
      setSelectedCode(squareData)
      onCodeOpen()
    } else if (squareData.navigateTo) {
      window.location.href = squareData.navigateTo
    } else {
      setSelectedSquare(squareData)
      onOpen()
    }
  }

  // Build squares from the data file
  const squares = squaresData.map(square => {
    if (square.type === 'hover') {
      return square
    } else if (square.type === 'image') {
      return {
        ...square,
        content: (
          <Box
            as="img"
            src={square.image}
            alt=""
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
          />
        ),
      }
    } else if (square.customContent) {
      return square
    } else {
      return {
        ...square,
        content: square.text || '',
      }
    }
  })

  // Add empty squares
  const allSquares = [
    ...squares,
    ...Array.from({ length: emptySquaresCount }, (_, i) => ({
      id: squaresData.length + i + 1,
      type: 'empty',
      content: '',
    })),
  ]

  return (
    <Box minH="100vh" bg="black" p={2}>
      <MintHero />

      <Box
        display="grid"
        gridTemplateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
          md: "repeat(auto-fit, 256px)"
        }}
        gap={2}
      // gridAutoRows="256px" // Removed to allow aspect-ratio to control height
      >
        {allSquares.map((square) => {
          if (square.hidden) return null

          const gridColumn = square.colSpan ? `span ${square.colSpan}` : undefined
          const gridRow = square.rowSpan ? `span ${square.rowSpan}` : undefined

          // Add drop animation to the first square
          const isFirstSquare = square.id === 1
          const dropAnimation = isFirstSquare ? {
            '@keyframes dropIn': {
              '0%': {
                transform: 'translateY(-100vh)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
            },
            animation: 'dropIn 5s ease-out forwards',
          } : {}

          return (
            <Box
              key={square.id}
              gridColumn={gridColumn}
              gridRow={gridRow}
              width="100%"
              sx={{
                aspectRatio: '1 / 1',
                ...dropAnimation,
              }}
              onAnimationEnd={isFirstSquare ? handleDropAnimationEnd : undefined}
            >
              <Square
                square={square}
                onClick={square.clickable ? () => handleSquareClick(square) : undefined}
                onInteract={triggerMelody}
              />
            </Box>
          )
        })}
      </Box>

      <SquareModal
        isOpen={isOpen}
        onClose={onClose}
        square={selectedSquare}
      />

      <ImageModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageSrc={selectedImage}
      />

      <CodeModal
        isOpen={isCodeOpen}
        onClose={onCodeClose}
        title={selectedCode?.modalTitle}
        description={selectedCode?.modalDescription}
        code={selectedCode?.code}
      />

    </Box>
  )
}

export default App
