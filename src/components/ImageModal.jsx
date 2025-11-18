import { useCallback, useEffect, useRef } from 'react'
import { Modal, ModalOverlay, ModalContent, Box } from '@chakra-ui/react'
import { assetPath } from '../lib/assetPath'

const README_IMAGE_SRC = assetPath('images/readme.png')
const README_AUDIO_SRC = assetPath('audio/makesong.mp3')

function ImageModal({ isOpen, onClose, imageSrc }) {
  const audioRef = useRef(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const shouldPlayReadmeAudio = isOpen && imageSrc === README_IMAGE_SRC

    if (shouldPlayReadmeAudio) {
      const audio = audioRef.current ?? new Audio(README_AUDIO_SRC)
      audioRef.current = audio
      audio.currentTime = 0
      const playPromise = audio.play()

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {})
      }
    } else {
      stopAudio()
    }

    return () => {
      stopAudio()
    }
  }, [imageSrc, isOpen, stopAudio])

  const handleClose = useCallback(() => {
    stopAudio()
    onClose()
  }, [onClose, stopAudio])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent bg="transparent" boxShadow="none">
        <Box
          width="100%"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleClose}
          cursor="pointer"
        >
          <img 
            src={imageSrc} 
            alt="" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default ImageModal
