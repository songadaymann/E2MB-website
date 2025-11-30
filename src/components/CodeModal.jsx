import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
} from '@chakra-ui/react'

function CodeModal({ isOpen, onClose, title, description, code }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent bg="black" border="2px solid white" color="white">
                <ModalHeader textTransform="uppercase" letterSpacing="0.1em">
                    {title}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {description && (
                        <Text mb={6} fontSize="lg" lineHeight="1.6">
                            {description}
                        </Text>
                    )}

                    <Box
                        bg="gray.900"
                        p={4}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.700"
                        overflowX="auto"
                        fontFamily="monospace"
                        fontSize="sm"
                    >
                        <pre style={{ margin: 0 }}>
                            <code>{code}</code>
                        </pre>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default CodeModal
