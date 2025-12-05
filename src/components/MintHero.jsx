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
    Flex,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'

function MintHero({ mintedCount = 0 }) {
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

    const getProgressParams = (current) => {
        if (current < 100) return { min: 0, max: 100 }
        if (current < 1000) return { min: 0, max: 1000 }
        if (current < 10000) return { min: 0, max: 10000 }

        const milestones = [
            10000, 20000, 40000, 80000, 100000, 200000, 500000, 1000000
        ]

        // Add millions up to a reasonable amount
        for (let i = 2; i <= 100; i++) {
            milestones.push(i * 1000000)
        }

        for (let i = 0; i < milestones.length - 1; i++) {
            if (current < milestones[i + 1]) {
                return { min: milestones[i], max: milestones[i + 1] }
            }
        }

        return { min: 0, max: 1000000 } // Fallback
    }

    const { min, max } = getProgressParams(totalYears)
    const progressPercent = Math.min(((totalYears - min) / (max - min)) * 100, 100)

    return (
        <Box
            w="100%"
            h="100%"
            bg="black"
            borderBottom={{ base: "1px solid white", md: "none" }}
            border={{ md: "2px solid white" }}
            mb={{ base: 8, md: 0 }}
            pt={{ base: 8, md: 0 }}
            pb={{ base: 12, md: 0 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
        >
            <Container maxW="container.xl">
                <Box textAlign="center" mb={10} mt={-4}>
                    <Text fontSize={{ base: '2xl', md: '4.5vh' }} fontWeight="bold" textTransform="uppercase" letterSpacing="0.1em" lineHeight="1.2">
                        EVERY TWO MILLION BLOCKS
                    </Text>
                    <Text fontSize={{ base: 'lg', md: '2.2vh' }} fontWeight="bold" color="white" mt={2} letterSpacing="0.05em">
                        an onchain, algorithmic song about time
                    </Text>
                    <Box mt={6} fontSize={{ base: 'sm', md: '1.8vh' }} color="gray.300" letterSpacing="0.05em" lineHeight="1.6">
                        <Text>each nft is one note in the song</Text>
                        <Text>the length of the song will be determined by how many notes are minted</Text>
                    </Box>
                </Box>

                <Box textAlign="center" maxW="800px" mx="auto">
                    <Text fontSize={{ base: '5xl', md: '7vh' }} fontWeight="bold" mb={2}>
                        {quantity.toLocaleString()} {quantity === 1 ? 'year' : 'years'}
                    </Text>

                    <Text fontSize={{ base: 'sm', md: '1.8vh' }} color="gray.300" mb={6}>
                        how long do you want to extend the song?
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
                    </Box>

                    <Box
                        bg="gray.900"
                        border="2px solid white"
                        p={6}
                        mb={6}
                        borderRadius="md"
                    >
                        <Text fontSize={{ base: '2xl', md: '3vh' }} fontWeight="bold">
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
                        fontSize={{ base: '2xl', md: '2.5vh' }}
                        py={8}
                        mb={6}
                    >
                        MINT
                    </Button>
                </Box>

                <Box textAlign="center" mt={8}>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
                        a total of <Text as="span" color="white" fontWeight="bold">{mintedCount.toLocaleString()}</Text> notes have been minted.
                    </Text>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
                        the song will end in the year <Text as="span" color="white" fontWeight="bold">{2026 + mintedCount}</Text>
                    </Text>
                </Box>
            </Container>
        </Box>
    )
}

export default MintHero
