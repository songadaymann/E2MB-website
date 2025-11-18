import { Box, Flex, Text, Button, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import Square from './components/Square'
import SquareModal from './components/SquareModal'
import MintModal from './components/MintModal'
import ImageModal from './components/ImageModal'
import BurnProjectModal from './components/BurnProjectModal'
import BurnLeaderboardModal from './components/BurnLeaderboardModal'
import { burnSquaresData, burnEmptySquaresCount } from './burn-squares-data.jsx'
import { burnProjectDetails } from './burn-projects-data.js'
import { useInteractiveMelody } from './hooks/useInteractiveMelody'
import { BurnWalletProvider, useBurnWallet } from './context/BurnWalletContext'
import { assetPath } from './lib/assetPath'

function BurnView() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure()
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()
  const { isOpen: isProjectOpen, onOpen: onProjectOpen, onClose: onProjectClose } = useDisclosure()
  const { isOpen: isLeaderboardOpen, onOpen: onLeaderboardOpen, onClose: onLeaderboardClose } = useDisclosure()
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedProjectKey, setSelectedProjectKey] = useState(null)
  const triggerMelody = useInteractiveMelody({ transpose: 7 })
  const { walletAddress, notes } = useBurnWallet()

  const handleSquareClick = (squareData) => {
    if (squareData.showMintModal) {
      onMintOpen()
    } else if (squareData.showImageModal) {
      setSelectedImage(squareData.image)
      onImageOpen()
    } else if (squareData.showLeaderboardModal) {
      onLeaderboardOpen()
    } else if (squareData.modalKey) {
      setSelectedProjectKey(squareData.modalKey)
      onProjectOpen()
    } else if (
      squareData.navigateTo &&
      window.location.pathname.replace(/\/+$/, '') !== squareData.navigateTo
    ) {
      window.location.href = squareData.navigateTo
    } else {
      setSelectedSquare(squareData)
      onOpen()
    }
  }

  const squares = burnSquaresData.map(square => {
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

  const allSquares = [
    ...squares,
    ...Array.from({ length: burnEmptySquaresCount }, (_, i) => ({
      id: burnSquaresData.length + i + 1,
      type: 'empty',
      content: '',
    })),
  ]

  const filteredSquares = allSquares.filter((square) => !(square.requiresWallet && !walletAddress))

  const noteSquares = walletAddress
    ? notes.map((note, index) => {
        const noteId = 33 + index
        return {
          id: noteId,
          customContent: true,
          clickable: true,
          modalTitle: `Note #${note.tokenId}`,
          modalContent: `Reveal target: ${note.revealYear}. ${
            note.hasSevenWords ? 'Seven words set.' : 'Seven words pending.'
          }`,
          content: (
            <Box
              width="100%"
              height="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              padding="1rem"
              border="1px solid rgba(255,255,255,0.25)"
            >
              <Text fontSize="xs" letterSpacing="0.3em" textTransform="uppercase" color="#FCB53B">
                note #{note.tokenId}
              </Text>
              <Text fontSize="1.8rem" fontWeight="900">
                {note.label}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                reveal target • {note.revealYear}
              </Text>
            </Box>
          ),
        }
      })
    : []

  const displayedSquares = [...filteredSquares, ...noteSquares]

  return (
    <Box minH="100vh" bg="black" p={2}>
      <Flex align="center" mb={4} px={1}>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: 'rgba(255,255,255,0.05)' }}
          onClick={() => {
            window.location.href = assetPath('')
          }}
        >
          &larr; back
        </Button>
      </Flex>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, 256px)"
        gap={2}
        gridAutoRows="256px"
      >
        {displayedSquares.map((square) => {
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
                onClick={
                  square.clickable
                    ? () => handleSquareClick(square)
                    : undefined
                }
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

      <BurnProjectModal
        isOpen={isProjectOpen}
        onClose={() => {
          onProjectClose()
          setSelectedProjectKey(null)
        }}
        projectKey={selectedProjectKey}
        project={selectedProjectKey ? burnProjectDetails[selectedProjectKey] : null}
      />

      <BurnLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={onLeaderboardClose}
      />
    </Box>
  )
}

function Burn() {
  return (
    <BurnWalletProvider>
      <BurnView />
    </BurnWalletProvider>
  )
}

export default Burn
