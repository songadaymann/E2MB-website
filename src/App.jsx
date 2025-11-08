import { Box, useDisclosure } from '@chakra-ui/react'
import Square from './components/Square'
import SquareModal from './components/SquareModal'
import MintModal from './components/MintModal'
import ImageModal from './components/ImageModal'
import Countdown from './components/Countdown'
import { useState } from 'react'
import { squaresData, emptySquaresCount } from './squares-data.jsx'
import { useInteractiveMelody } from './hooks/useInteractiveMelody'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure()
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const triggerMelody = useInteractiveMelody()

  const handleSquareClick = (squareData) => {
    if (squareData.showMintModal) {
      onMintOpen()
    } else if (squareData.showImageModal) {
      setSelectedImage(squareData.image)
      onImageOpen()
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
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, 256px)"
        gap={2}
        gridAutoRows="256px"
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
              height="100%"
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

      <MintModal
        isOpen={isMintOpen}
        onClose={onMintClose}
      />

      <ImageModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageSrc={selectedImage}
      />

    </Box>
  )
}

export default App
