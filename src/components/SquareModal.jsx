import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from '@chakra-ui/react'

function parseYouTubeTime(value) {
  if (!value) return null
  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const regex = /(\d+)(h|m|s)/g
  let match
  let totalSeconds = 0

  while ((match = regex.exec(value)) !== null) {
    const amount = Number(match[1])
    const unit = match[2]

    if (unit === 'h') {
      totalSeconds += amount * 3600
    } else if (unit === 'm') {
      totalSeconds += amount * 60
    } else if (unit === 's') {
      totalSeconds += amount
    }
  }

  return totalSeconds || null
}

function SquareModal({ isOpen, onClose, square }) {
  if (!square) return null

  const isAlgoModal = square.modalTitle === 'The Algorithm'

  const resolveIframeSrc = (url) => {
    if (!url) return null

    try {
      const parsed = new URL(url)
      const host = parsed.hostname.replace(/^www\./, '')

      const normaliseYouTubeParams = (searchParams) => {
        const params = new URLSearchParams(searchParams)
        const rawTime = params.get('t')
        if (rawTime) {
          const startSeconds = parseYouTubeTime(rawTime)
          params.delete('t')
          if (startSeconds !== null) {
            params.set('start', String(startSeconds))
          }
        }
        params.delete('si')
        return params.toString()
      }

      if (host === 'youtu.be') {
        const videoId = parsed.pathname.slice(1)
        const query = normaliseYouTubeParams(parsed.searchParams)
        return `https://www.youtube.com/embed/${videoId}${
          query ? `?${query}` : ''
        }`
      }

      if (host.endsWith('youtube.com')) {
        // Handle watch URLs, shorts, and playlist params gracefully
        if (parsed.pathname === '/watch') {
          const videoId = parsed.searchParams.get('v')
          if (videoId) {
            parsed.searchParams.delete('v')
            const query = normaliseYouTubeParams(parsed.searchParams)
            return `https://www.youtube.com/embed/${videoId}${
              query ? `?${query}` : ''
            }`
          }
        } else if (parsed.pathname.startsWith('/shorts/')) {
          const parts = parsed.pathname.split('/')
          const videoId = parts[2]
          if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`
          }
        } else if (parsed.pathname.startsWith('/embed/')) {
          return url
        }
      }

      return url
    } catch (error) {
      return url
    }
  }

  const iframeSrc = resolveIframeSrc(square.modalUrl)
  const stringModalContent =
    typeof square.modalContent === 'string' ? square.modalContent : null
  const shouldRenderSupplementalContent =
    stringModalContent && (iframeSrc || square.image)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isAlgoModal ? 'full' : 'xl'}>
      <ModalOverlay />
      <ModalContent
        bg="black"
        border="2px solid white"
        maxW={isAlgoModal ? '1600px' : undefined}
        maxH={isAlgoModal ? '88vh' : undefined}
        mt={isAlgoModal ? 6 : undefined}
        mb={isAlgoModal ? 6 : undefined}
        px={isAlgoModal ? 1 : undefined}
      >
        {!isAlgoModal && <ModalHeader>{square.modalTitle || 'Details'}</ModalHeader>}
        <ModalCloseButton top={isAlgoModal ? 3 : undefined} right={isAlgoModal ? 3 : undefined} />
        <ModalBody
          whiteSpace="pre-line"
          overflowY="auto"
          px={{ base: 4, md: isAlgoModal ? 6 : 6 }}
          py={{ base: 4, md: isAlgoModal ? 4 : 6 }}
        >
          {isAlgoModal && square.modalTitle && (
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" pr={{ base: 8, md: 10 }}>
              <Box fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
                {square.modalTitle}
              </Box>
            </Box>
          )}
          {iframeSrc ? (
            <iframe 
              src={iframeSrc} 
              style={{ 
                width: '100%', 
                height: '500px', 
                border: 'none' 
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={square.modalTitle || 'Content'}
            />
          ) : square.image ? (
            <img 
              src={square.image} 
              alt="" 
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          ) : stringModalContent ? (
            <Box dangerouslySetInnerHTML={{ __html: stringModalContent }} />
          ) : (
            square.modalContent || square.content
          )}
          {shouldRenderSupplementalContent && (
            <Box mt={4} dangerouslySetInnerHTML={{ __html: stringModalContent }} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SquareModal
