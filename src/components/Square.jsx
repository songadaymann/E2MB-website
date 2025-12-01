import { Box } from '@chakra-ui/react'
import { useState } from 'react'

function Square({ square, onClick, onInteract }) {
  const [isHovered, setIsHovered] = useState(false)

  const content = square.type === 'hover' && isHovered
    ? square.hoverContent
    : square.type === 'hover'
      ? square.defaultContent
      : square.content

  const handlePointerEnter = (event) => {
    setIsHovered(true)
    if (onInteract && (event.pointerType === 'mouse' || event.pointerType === 'pen')) {
      onInteract(event.clientX, event.clientY)
    }
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch') {
      setIsHovered(true)
      if (onInteract) {
        onInteract(event.clientX, event.clientY)
      }
    }
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
  }

  const clickableStyles = square.clickable
    ? {
      bgGradient: {
        base: 'linear(to-br, rgba(252,181,59,0.16), rgba(0,0,0,0.85))',
      },
      borderColor: { base: 'rgba(252,181,59,0.7)', md: 'white' },
      boxShadow: {
        base: 'inset 0 0 12px rgba(252,181,59,0.25)',
        md: 'none',
      },
    }
    : {}

  return (
    <Box
      width="100%"
      height="100%"
      bg={!square.clickable ? 'black' : undefined}
      border="2px solid white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor={square.clickable ? 'pointer' : 'default'}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      _hover={
        square.clickable
          ? {
            bgGradient: {
              base: 'linear(to-br, rgba(252,181,59,0.22), rgba(0,0,0,0.8))',
            },
            borderColor: { base: '#FCB53B', md: 'white' },
            boxShadow: {
              base: 'inset 0 0 18px rgba(252,181,59,0.35)',
              md: 'none',
            },
          }
          : {}
      }
      transition="background 0.2s, border-color 0.2s, box-shadow 0.2s"
      overflow="hidden"
      position="relative"
      fontSize={{ base: 'sm', md: 'md' }}
      {...clickableStyles}
    >
      {typeof content === 'string' ? (
        <Box
          p={{ base: 3, md: 4 }}
          fontSize={{ base: 'sm', md: 'xl' }}
          lineHeight={{ base: '1.1', md: '1.2' }}
          textAlign="center"
          whiteSpace="pre-line"
        >
          {content}
        </Box>
      ) : (
        content
      )}
    </Box>
  )
}

export default Square
