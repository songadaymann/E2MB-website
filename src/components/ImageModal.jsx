import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal, ModalOverlay, ModalContent, Box } from '@chakra-ui/react'
import { assetPath } from '../lib/assetPath'

const README_IMAGE_SRC = assetPath('images/readme.png')
const README_AUDIO_SRC = assetPath('audio/makesong.mp3')

function ImageModal({ isOpen, onClose, imageSrc }) {
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

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

      if (!isMuted) {
        audio.currentTime = 0
        const playPromise = audio.play()
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => { })
        }
      } else {
        audio.pause()
      }
    } else {
      stopAudio()
    }

    return () => {
      stopAudio()
    }
  }, [imageSrc, isOpen, stopAudio, isMuted])

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
          <Box position="relative" display="inline-block">
            <img
              src={imageSrc}
              alt=""
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            {imageSrc === README_IMAGE_SRC && (
              <Box
                position="absolute"
                top={1}
                right={2}
                zIndex={10}
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMuted(!isMuted)
                }}
                color={isMuted ? "red.500" : "gray.500"}
                bg="transparent"
                p={2}
                borderRadius="full"
                transition="all 0.2s"
                _hover={{ color: isMuted ? "red.600" : "black" }}
              >
                {isMuted ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2a7 7 0 0 1 .4-2.31"></path>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default ImageModal
