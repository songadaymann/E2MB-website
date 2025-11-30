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

  return (
    <Box
      width="100%"
      height="100%"
      bg="black"
      border="2px solid white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor={square.clickable ? 'pointer' : 'default'}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      _hover={square.clickable ? { bg: 'gray.900' } : {}}
      transition="background 0.2s"
      overflow="hidden"
      position="relative"
      fontSize={{ base: 'sm', md: 'md' }}
    >
      {typeof content === 'string' ? (
        <Box
          p={{ base: 3, md: 4 }}
          fontSize={{ base: 'md', md: 'lg' }}
          lineHeight={{ base: '1.4', md: '1.6' }}
          textAlign="center"
          whiteSpace="pre-line"
        >
          {content}
        </Box>
      ) : (
        content
      )}
      {square.clickable && (
        <Box
          position="absolute"
          top={2}
          right={2}
          px={2}
          py={0.5}
          bg="rgba(255,255,255,0.85)"
          color="black"
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="0.08em"
          borderRadius="full"
          display={{ base: 'inline-flex', md: 'none' }}
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          tap
        </Box>
      )}
    </Box>
  )
}

export default Square
