import { Box, useDisclosure } from '@chakra-ui/react'
import Square from './components/Square'
import SquareModal from './components/SquareModal'
import MintHero from './components/MintHero'
import ImageModal from './components/ImageModal'
import CodeModal from './components/CodeModal'
import Countdown from './components/Countdown'
import { useState } from 'react'
import { squaresData, emptySquaresCount } from './squares-data.jsx'
import { useInteractiveMelody } from './hooks/useInteractiveMelody'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()
  const { isOpen: isCodeOpen, onOpen: onCodeOpen, onClose: onCodeClose } = useDisclosure()
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCode, setSelectedCode] = useState(null)
  const triggerMelody = useInteractiveMelody()

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
    <Box
      minH="100vh"
      bg="black"
      pt={2}
      px={2}
      pb={{ base: 2, md: 8 }}
      display={{ md: 'flex' }}
      height={{ md: '100vh' }}
      overflow={{ md: 'hidden' }}
      boxSizing="border-box"
    >
      <Box
        width={{ base: '100%', md: 'calc(100vh - 40px)' }}
        height={{ md: '100%' }}
        overflowY={{ md: 'auto' }}
        flexShrink={0}
        borderRight={{ md: '1px solid white' }}
      >
        <MintHero />
      </Box>

      <Box
        display="grid"
        flex={1}
        height={{ md: '100%' }}
        overflowX={{ md: 'auto' }}
        overflowY={{ md: 'hidden' }}
        gridTemplateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
          md: "none"
        }}
        gridAutoFlow={{ md: 'column' }}
        gridTemplateRows={{ md: "repeat(6, 1fr)" }}
        gridAutoColumns={{ md: "calc((100vh - 40px) / 6)" }}
        gap={0}
      >
        {allSquares.map((square) => {
          if (square.hidden) return null

          const gridColumn = square.colSpan ? `span ${square.colSpan}` : undefined
          const gridRow = square.rowSpan ? `span ${square.rowSpan}` : undefined

          return (
            <Box
              key={square.id}
              gridColumn={gridColumn}
              gridRow={gridRow}
              width="100%"
              sx={{ aspectRatio: '1 / 1' }}
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
