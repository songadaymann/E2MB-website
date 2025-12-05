import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Button, Input, Text, VStack, HStack, Grid, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react'
import abcjs from 'abcjs'
import * as Tone from 'tone'
import { generateBeat, mixSeeds } from '../lib/songAlgorithm'

// Helper to convert string to 32-bit integer seed
function stringToSeed(str) {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
}

function midiToAbc(midiPitch, duration = 480) {
    if (!midiPitch || midiPitch < 0) return 'z' // Rest

    // Prefer flats to match the Eb key signature
    const noteNames = ['C', '_D', 'D', '_E', 'E', 'F', '_G', 'G', '_A', 'A', '_B', 'B']
    const pitchClass = midiPitch % 12
    const octave = Math.floor(midiPitch / 12) - 1

    let noteName = noteNames[pitchClass]

    // Adjust for octave
    // Base octave (4) is "C"
    // Octave 3 is "C,"
    // Octave 2 is "C,,"
    // Octave 5 is "c"
    // Octave 6 is "c'"

    if (octave === 3) noteName += ","
    else if (octave === 2) noteName += ",,"
    else if (octave === 5) noteName = noteName.toLowerCase()
    else if (octave === 6) noteName = noteName.toLowerCase() + "'"

    // Duration mapping (assuming 480 is quarter note)
    let durationStr = ""
    if (duration === 960) durationStr = "2" // Half
    else if (duration === 1920) durationStr = "4" // Whole
    else if (duration === 240) durationStr = "/2" // Eighth
    else if (duration === 120) durationStr = "/4" // Sixteenth
    else if (duration === 720) durationStr = "3/2" // Dotted Quarter

    return noteName + durationStr
}

function midiToFrequency(pitch) {
    return 440 * Math.pow(2, (pitch - 69) / 12)
}

function AlgoDemo() {
    const [words, setWords] = useState(Array(7).fill(''))
    const [isStarted, setIsStarted] = useState(false)
    const [seed, setSeed] = useState(null)
    const [beat, setBeat] = useState(0)
    const [abcNotes, setAbcNotes] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)

    const notationRef = useRef(null)
    const leadSynthRef = useRef(null)
    const bassSynthRef = useRef(null)
    const transportRef = useRef(null)
    const dynamicSeedRef = useRef(null)

    // Initialize Synths (copied from useInteractiveMelody)
    const initSynths = useCallback(async () => {
        await Tone.start()

        if (leadSynthRef.current) return // Already initialized

        const leadSynth = new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 5,
            modulationIndex: 8,
            oscillator: { type: 'sine' },
            modulation: { type: 'triangle' },
            envelope: { attack: 0.002, decay: 0.32, sustain: 0.18, release: 0.55 },
            modulationEnvelope: { attack: 0.005, decay: 0.22, sustain: 0.08, release: 0.25 },
        })
        leadSynth.volume.value = -12

        const leadFilter = new Tone.Filter({ type: 'lowpass', frequency: 900, rolloff: -24, Q: 0.7 })
        const leadChorus = new Tone.Chorus({ frequency: 1.1, delayTime: 3.2, depth: 0.25, type: 'sine', spread: 60 }).start()
        const masterReverb = new Tone.Reverb({ decay: 1.25, preDelay: 0.02, wet: 0.15 }).toDestination()

        leadSynth.chain(leadFilter, leadChorus, Tone.Destination)
        leadChorus.connect(masterReverb)

        const bassSynth = new Tone.FMSynth({
            harmonicity: 1.5,
            modulationIndex: 4.5,
            oscillator: { type: 'triangle' },
            modulation: { type: 'square' },
            envelope: { attack: 0.001, decay: 0.19, sustain: 0.65, release: 0.4 },
            modulationEnvelope: { attack: 0.006, decay: 0.16, sustain: 0.12, release: 0.25 },
        })
        bassSynth.volume.value = -14

        const bassFilter = new Tone.Filter({ type: 'lowpass', frequency: 520, rolloff: -24, Q: 0.8 })
        const bassFeedbackDelay = new Tone.FeedbackDelay({ delayTime: 0.08, feedback: 0.1, wet: 0.15 })
        const bassDrive = new Tone.Gain(1.0)

        bassSynth.connect(bassFilter)
        bassFilter.connect(bassDrive)
        bassDrive.connect(bassFeedbackDelay)
        bassDrive.connect(Tone.Destination) // add dry tap so bass is clearly audible
        bassFeedbackDelay.connect(Tone.Destination)
        bassFeedbackDelay.connect(masterReverb)

        leadSynthRef.current = leadSynth
        bassSynthRef.current = bassSynth
    }, [])

    const handleWordChange = (index, value) => {
        const newWords = [...words]
        newWords[index] = value
        setWords(newWords)
    }

    const handleStart = () => {
        const combinedString = words.join(' ')
        const newSeed = stringToSeed(combinedString)
        setSeed(newSeed)
        dynamicSeedRef.current = newSeed
        setIsStarted(true)
        setBeat(0)
        setAbcNotes([])
        initSynths()
    }

    const handleReset = () => {
        handleStop()
        setIsStarted(false)
        setSeed(null)
        dynamicSeedRef.current = null
        setBeat(0)
        setAbcNotes([])
    }

    const handleNextNote = () => {
        const baseSeed = dynamicSeedRef.current ?? seed ?? 0
        const timeSalt = (typeof performance !== 'undefined' ? performance.now() : Date.now()) >>> 0
        const noisySeed = mixSeeds(baseSeed, (timeSalt ^ beat) >>> 0)
        dynamicSeedRef.current = noisySeed

        const { lead, bass } = generateBeat(beat, noisySeed)
        const abcLead = midiToAbc(lead.pitch, 480)
        const abcBass = midiToAbc(bass.pitch, 480)

        // Store raw MIDI data for playback
        setAbcNotes(prev => [...prev, {
            lead: abcLead,
            bass: abcBass,
            leadMidi: lead.pitch,
            bassMidi: bass.pitch
        }])
        setBeat(prev => prev + 1)
    }

    const handlePlay = async () => {
        await initSynths()
        if (abcNotes.length === 0) return

        setIsPlaying(true)
        Tone.Transport.cancel()
        Tone.Transport.stop()

        // Schedule notes
        abcNotes.forEach((note, index) => {
            const time = index * 0.5 // Play every 0.5 seconds (120 BPM quarter notes)

            Tone.Transport.schedule((t) => {
                // Play Lead
                if (note.leadMidi >= 0 && leadSynthRef.current) {
                    leadSynthRef.current.triggerAttackRelease(
                        midiToFrequency(note.leadMidi),
                        "4n",
                        t
                    )
                }
                // Play Bass
                if (note.bassMidi >= 0 && bassSynthRef.current) {
                    bassSynthRef.current.triggerAttackRelease(
                        midiToFrequency(note.bassMidi),
                        "4n",
                        t
                    )
                }

                // Highlight logic could go here if we had a way to map it back to abcjs
            }, time)
        })

        // Schedule stop at the end
        Tone.Transport.schedule(() => {
            setIsPlaying(false)
            Tone.Transport.stop()
        }, abcNotes.length * 0.5 + 1)

        Tone.Transport.start()
    }

    const handleStop = () => {
        setIsPlaying(false)
        Tone.Transport.stop()
        Tone.Transport.cancel()
    }

    useEffect(() => {
        if (notationRef.current) {
            const PAGE_MEASURES = 24
            const BEATS_PER_MEASURE = 4
            const totalMeasuresUsed = Math.ceil(abcNotes.length / BEATS_PER_MEASURE)
            const remainingMeasures = Math.max(0, PAGE_MEASURES - totalMeasuresUsed)

            const buildMeasures = (key) => {
                const measures = []
                abcNotes.forEach((note, idx) => {
                    const measureIndex = Math.floor(idx / BEATS_PER_MEASURE)
                    if (!measures[measureIndex]) measures[measureIndex] = []
                    measures[measureIndex].push(key === 'lead' ? note.lead : note.bass)
                })
                // Pad with silent measures to keep the staff wide and balanced
                for (let i = 0; i < remainingMeasures; i++) {
                    measures.push(['z4'])
                }
                if (measures.length === 0) {
                    measures.push(['z4'])
                }
                return measures
            }

            const formatMeasures = (measures) =>
                measures.map(m => `${(m.length ? m.join(' ') : 'z4')} |`).join(' ')

            const leadContent = formatMeasures(buildMeasures('lead'))
            const bassContent = formatMeasures(buildMeasures('bass'))

            const abcString = `X:1
M:4/4
L:1/4
K:Eb
V:1 clef=treble name="Lead"
${leadContent} |]
V:2 clef=bass name="Bass"
${bassContent} |]`

            abcjs.renderAbc(notationRef.current, abcString, {
                responsive: 'resize',
                add_classes: true,
                staffwidth: 1000, // Wider staff
                wrap: { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
            })
        }
    }, [abcNotes, isStarted])

    // Cleanup
    useEffect(() => {
        return () => {
            handleStop()
            // Don't dispose synths here strictly if we want to reuse them, 
            // but good practice to clean up if component unmounts.
            if (leadSynthRef.current) leadSynthRef.current.dispose()
            if (bassSynthRef.current) bassSynthRef.current.dispose()
        }
    }, [])

    return (
        <VStack spacing={8} align="stretch" width="100%" py={{ base: 4, md: 6 }} px={{ base: 2, md: 4 }} bg="gray.900">
            <Grid templateColumns={{ base: "1fr", md: "1fr 1.1fr" }} gap={{ base: 6, md: 10 }} alignItems="start" width="100%">
                <VStack align="stretch" spacing={6}>
                    <VStack align="stretch" spacing={3}>
                        <Text fontSize={{ base: "2xl", md: "3xl" }} color="white" fontWeight="black" lineHeight={1.1}>
                            the song is generated by an algorithm called a markov chain.
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} color="gray.200" lineHeight={1.5}>
                            when your note is ready to be revealed, you or your descendants will hit a button that triggers the algorithm to run onchain.
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} color="gray.200" lineHeight={1.5}>
                            the resulting note will be determined by a combination of many things including: the previous notes, the transaction hash of hitting the button and seven words that you commit to the note.

                        </Text>
                    </VStack>

                    {/* Controls Area */}
                    <Box p={{ base: 4, md: 5 }} border="1px solid" borderColor="gray.700" borderRadius="lg" bg="gray.800" width="100%" boxShadow="0 0 24px rgba(0,0,0,0.45)">
                        <Text mb={3} fontSize={{ base: "md", md: "lg" }} color="gray.300" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">
                            enter seven words:
                        </Text>
                        <Grid templateColumns="repeat(7, 1fr)" gap={3} mb={4}>
                            {words.map((word, i) => (
                                <Input
                                    key={i}
                                    value={word}
                                    onChange={(e) => handleWordChange(i, e.target.value)}
                                    size="md"
                                    fontSize="lg"
                                    textAlign="center"
                                    bg="gray.700"
                                    border="1px solid"
                                    borderColor="gray.600"
                                    _focus={{ borderColor: "green.400" }}
                                    color="white"
                                    isDisabled={isStarted}
                                />
                            ))}
                        </Grid>

                        {!isStarted ? (
                            <Button
                                onClick={handleStart}
                                colorScheme="green"
                                size="md"
                                width="100%"
                                fontFamily="monospace"
                                textTransform="uppercase"
                                fontSize="lg"
                                py={6}
                            >
                                [initialize algorithm]
                            </Button>
                        ) : (
                            <HStack spacing={4}>
                                <Button
                                    onClick={handleNextNote}
                                    colorScheme="blue"
                                    size="md"
                                    flex={1}
                                    fontFamily="monospace"
                                    textTransform="uppercase"
                                    fontSize="md"
                                    py={5}
                                >
                                    [generate next note]
                                </Button>
                                <Button
                                    onClick={isPlaying ? handleStop : handlePlay}
                                    colorScheme={isPlaying ? "yellow" : "green"}
                                    size="md"
                                    flex={1}
                                    fontFamily="monospace"
                                    textTransform="uppercase"
                                    fontSize="md"
                                    py={5}
                                    isDisabled={abcNotes.length === 0}
                                >
                                    [{isPlaying ? "stop" : "play"}]
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    colorScheme="red"
                                    variant="outline"
                                    size="md"
                                    fontFamily="monospace"
                                    textTransform="uppercase"
                                    fontSize="md"
                                    py={5}
                                >
                                    [reset]
                                </Button>
                            </HStack>
                        )}
                    </Box>
                </VStack>

                {/* Sheet Music Container */}
                <Box
                    width="100%"
                    minH={{ base: "380px", md: "520px" }}
                    bg="white"
                    p={{ base: 5, md: 7 }}
                    boxShadow="0 0 20px rgba(0,0,0,0.5)"
                    position="relative"
                    overflow="hidden"
                    borderRadius="md"
                >
                    {/* Header on the paper */}
                    <Text color="black" fontSize={{ base: "2xl", md: "3xl" }} fontFamily="serif" textAlign="center" mb={8} fontWeight="bold" letterSpacing="0.04em">
                        Algorithm Demo
                    </Text>

                    <Box
                        ref={notationRef}
                        width="100%"
                        color="black"
                    >
                        {/* Notation renders here */}
                    </Box>

                    {/* Footer on the paper */}
                    <Text position="absolute" bottom={4} right={8} color="black" fontSize="sm" fontFamily="serif">
                        Generated by Song A Day
                    </Text>
                </Box>
            </Grid>
        </VStack>
    )
}

export default AlgoDemo
