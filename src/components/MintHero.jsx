import {
    Box,
    Button,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Text,
    Container,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

function MintHero() {
    const snapPoints = useMemo(
        () => [1, 5, 10, 100, 500, 1000, 10000, 100000, 500000, 1000000],
        [],
    )
    const [quantity, setQuantity] = useState(1)
    const [sliderPosition, setSliderPosition] = useState(0) // log10 space (0 - 6)
    const pricePerNFT = 0.002
    const existingYears = 0 // Placeholder - replace with actual data
    const totalYears = existingYears + quantity

    const findClosestSnapPoint = (value) =>
        snapPoints.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        )

    const handleSliderChange = (value) => {
        setSliderPosition(value)
        const nextValue = Math.max(1, Math.min(1_000_000, Math.round(10 ** value)))
        setQuantity(nextValue)
    }

    const handleSliderChangeEnd = (value) => {
        const approx = Math.max(1, Math.min(1_000_000, Math.round(10 ** value)))
        const closest = findClosestSnapPoint(approx)

        // Calculate distance in log space (slider space)
        const currentLog = value
        const closestLog = Math.log10(closest)
        const distance = Math.abs(currentLog - closestLog)

        // Threshold for "soft snap" (e.g., 0.15 units in log space)
        const SNAP_THRESHOLD = 0.15

        if (distance < SNAP_THRESHOLD) {
            setQuantity(closest)
            setSliderPosition(closestLog)
        } else {
            setQuantity(approx)
            setSliderPosition(Math.log10(approx))
        }
    }

    const totalCost = (quantity * pricePerNFT).toFixed(3)
    const progressPercent = Math.min((totalYears / 1_000_000) * 100, 100)

    const formatMarker = (value) => {
        if (value >= 1_000_000) return '1M'
        if (value >= 100_000) return `${value / 1000}k`
        if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
        return value.toLocaleString()
    }

    const minorTickCount = 80
    const minorTicks = useMemo(
        () =>
            Array.from({ length: minorTickCount + 1 }, (_, i) => ({
                left: `${(i / minorTickCount) * 100}%`,
            })),
        [minorTickCount],
    )

    return (
        <Box w="100%" bg="black" borderBottom="1px solid white" mb={8} pt={8} pb={12}>
            <Container maxW="container.xl">
                <Box textAlign="center" mb={10}>
                    <Text fontSize={{ base: '2xl', md: '5xl' }} fontWeight="bold" textTransform="uppercase" letterSpacing="0.1em" lineHeight="1.2">
                        EVERY TWO MILLION BLOCKS
                    </Text>
                    <Box mt={6} fontSize={{ base: 'sm', md: 'xl' }} color="gray.300" letterSpacing="0.05em">
                        <Text>an onchain, algorithmic song about time</Text>
                        <Text></Text>
                        <Text>every mint extends the song by one year</Text>
                        <Text>mint or explore below</Text>

                    </Box>
                </Box>

                <Box textAlign="center" maxW="800px" mx="auto">
                    <Text fontSize="5xl" fontWeight="bold" mb={2}>
                        {quantity.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={6}>
                        {quantity !== 1 ? 's' : ''}
                    </Text>

                    <Box px={{ base: 2, md: 10 }} py={6} position="relative">
                        <Box
                            position="absolute"
                            top="50%"
                            left={0}
                            right={0}
                            height="4px"
                            bg="rgba(255,255,255,0.08)"
                            transform="translateY(-50%)"
                            borderRadius="full"
                            pointerEvents="none"
                        >
                            {minorTicks.map((tick) => (
                                <Box
                                    key={tick.left}
                                    position="absolute"
                                    top="50%"
                                    left={tick.left}
                                    width="1px"
                                    height="12px"
                                    bg="rgba(255,255,255,0.08)"
                                    transform="translate(-50%, -50%)"
                                />
                            ))}
                        </Box>

                        <Slider
                            value={sliderPosition}
                            min={0}
                            max={6}
                            step={0.001}
                            onChange={handleSliderChange}
                            onChangeEnd={handleSliderChangeEnd}
                            mb={12}
                            aria-label="Mint quantity selector"
                            focusThumbOnChange={false}
                        >
                            <SliderTrack bg="gray.700">
                                <SliderFilledTrack bg="white" />
                            </SliderTrack>
                            <SliderThumb boxSize={7} border="2px solid black" bg="white" />
                            {snapPoints.map((point, index) => (
                                <SliderMark
                                    key={point}
                                    value={Math.log10(point)}
                                    mt={index % 2 === 0 ? 5 : -8}
                                    fontSize="xs"
                                    color="gray.400"
                                    transform="translateX(-50%)"
                                    whiteSpace="nowrap"
                                >
                                    {formatMarker(point)}
                                </SliderMark>
                            ))}
                        </Slider>

                        <Box mt={6}>
                            <Box
                                bg="rgba(255,255,255,0.08)"
                                borderRadius="full"
                                height="12px"
                                position="relative"
                                overflow="hidden"
                            >
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    height="100%"
                                    width={`${progressPercent}%`}
                                    bgGradient="linear(to-r, #FCB53B, #FFFFFF)"
                                    transition="width 0.2s ease"
                                />
                            </Box>
                            <Text fontSize="sm" color="gray.300" mt={2}>
                                {totalYears.toLocaleString()} / 1,000,000 years
                            </Text>
                        </Box>
                    </Box>

                    <Box
                        bg="gray.900"
                        border="2px solid white"
                        p={6}
                        mb={6}
                        borderRadius="md"
                    >
                        <Text fontSize="2xl" fontWeight="bold">
                            {totalCost} ETH
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                            {pricePerNFT} ETH each
                        </Text>
                    </Box>

                    <Button
                        size="lg"
                        width="100%"
                        bg="white"
                        color="black"
                        _hover={{ bg: 'gray.200' }}
                        fontSize="2xl"
                        py={8}
                        mb={6}
                    >
                        MINT
                    </Button>
                </Box>

                <Box textAlign="center" pt={4} borderTop="1px solid" borderColor="gray.700" maxW="800px" mx="auto">
                    <Text fontSize="sm" color="gray.400" mb={1}>
                        Total song length
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold">
                        {totalYears.toLocaleString()} years
                    </Text>
                </Box>
            </Container>
        </Box>
    )
}

export default MintHero
