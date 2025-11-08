import SongADayTicker from './components/SongADayTicker'

const timeStackLayers = [
  { color: '#FFFFFF', opacity: 1 },
  { color: '#FFFFFF', opacity: 0.5 },
  { color: '#FFFFFF', opacity: 0.2 },
]

// Edit this file to add content to your squares!
// Each square can have:
// - text: simple text string
// - clickable: true (makes it open a modal when clicked)
// - modalContent: text to show in the modal
// - type: 'title' or 'countdown' for special squares

export const squaresData = [
  {
    id: 1,
    customContent: true,
    content: (
      <div style={{ 
        fontWeight: '900',
        fontSize: '3.2rem',
        lineHeight: '1.1',
        textAlign: 'left',
        padding: '13px',
        position: 'relative',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute',
            top: '-8px',
            left: '-9px',
            width: '231px',
            height: '158px',
            border: '2px solid white',
            zIndex: -1
          }} />
          <div style={{ display: 'block', letterSpacing: '0.27em' }}>EVERY</div>
          <div style={{ display: 'block', letterSpacing: '0.95em' }}>TWO</div>
          <div style={{ display: 'block', letterSpacing: '0' }}>MILLION</div>
          <div style={{ display: 'block', letterSpacing: '0.065em' }}>BLOCKS</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', color: '#84994F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '3rem' }}>mint</div>
      </div>
    ),
    clickable: true,
    showMintModal: true,
  },
  {
    id: 3,
    type: 'hover',
    defaultContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: '#FCB53B', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>readme</div>
      </div>
    ),
    hoverContent: (
      <div style={{ textAlign: 'center', padding: '.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', fontWeight: 'bold' }}>
        i'd like to make a song with you
      </div>
    ),
    clickable: true,
    showImageModal: true,
    image: '/images/readme.png',
  },
  {
    id: 4,
    text: 'i am obsessed with time.',
  },
  {
    id: 5,
    text: "in 2000 BCE somebody carved musical instructions into a stone tablet.",
  },
  {
    id: 6,
    type: 'image',
    image: '/images/nippur-cuniform.png',
    clickable: true,
    modalContent: 'This is a drawing of a cuniform tablet containing musical instructions from Babylonia circa ~2000 BCE. No one can quite agree on how exactly to read it.',
  },
  {
    id: 7,
    text: "i want to make a song that lasts forever.",
  },
  {
    id: 8,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝆶</div>
    
      </div>
    ),
  },
  {
    id: 9,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            letterSpacing: '0.35rem',
            textTransform: 'lowercase',
            background: 'linear-gradient(130deg, #A72703 0%, #FCB53B 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          burn
        </div>
      </div>
    ),
    clickable: true,
    navigateTo: '/burn',
    
  },
  {
    id: 10,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝇛</div>
    
      </div>
    ),
  },
  {
    id: 11,
    text: "in 1969, Young & Zazeela created dream house. \n\n dream house has now been running continuously in NYC since 1993",
    // Empty square - leave text as empty string
  },
  {
    id: 12,
    type: 'image',
    image: '/images/dream.png',
    clickable: true,
    modalContent: "the dream house is a long running site specific art piece by La Monte Young and Marian Zazeela. A constantly sounding chord of sine waves has been rinnging out since 1993. There is no set length. It could go forever. <a href=\"https://www.melafoundation.org/\" target=\"_blank\" rel=\"noreferrer\">You can even visit the dream house!</a>",
  },
  {
    id: 13,
    customContent: true,
    content: (
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '0.25rem',
        }}
      >
        {timeStackLayers.map(({ color, opacity }, index) => (
          <div
            key={index}
            style={{
              fontSize: '4rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.35rem',
              color,
              opacity,
              lineHeight: '1',
            }}
          >
            $time
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 14,
    type: 'hover',
    defaultContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '7rem', fontWeight: 'bold', margin: '0.5rem 0' }}>𝄐</div>
      </div>
    ),
    hoverContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', fontWeight: 'bold' }}>
        maybe it's a cult
      </div>
    )
  },// Add more squares below - just copy and paste this template:
  {
    id: 15,
    text: "in 1987, John Cage wrote the score for As Slow As Possible.",
    // Empty square - leave text as empty string
  },
  {
    id: 16,
    type: 'image',
    image: '/images/ASLSP.png',
    clickable: true,
    modalContent: "the score for John Cage's As Slow As Possible",
  },
  {
    id: 17,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝅁</div>
    
      </div>
    ),
  },
  {
    id: 18,
    text: "i've written 146 songs with the word 'time' in the title.",
  },
  {
    id: 19,
    text: "since 1996, Danny Hillis set out to create the Clock of the Long Now. \n\n\ it's meant to operate for 10,000 years",
    // Empty square - leave text as empty string
  },
  {
    id: 20,
    type: 'image',
    image: '/images/clock.png',
    clickable: true,
    modalTitle: 'the clock is still under construction and has been funded by Jeff Bezos.',
  
  },
  {
    id: 21,
    text: "in 2000, Jem Finer set in motion his song Longplayer, set to last 1000 years.",
    // Empty square - leave text as empty string
  },
  {
    id: 22,
    type: 'image',
    image: '/images/longplayer.png',
    clickable: true,
    modalTitle: 'Listen: Longplayer has been playing since 1/1/2000',
    modalUrl: 'http://icecast.spc.org:8000/longplayer',
  },
  
  {
    id: 23,
    text: "in 2001, the organ in this church began to play As Slow As Possible. \n\nthe performance is set to end in 2640",
    // Empty square - leave text as empty string
  },
  {
    id: 24,
    type: 'image',
    image: '/images/halberstadt.jpg',
    clickable: true,
    modalTitle: 'Listen: The note changing on this organ in 2024. The next change is 2026.',
    modalUrl: 'https://youtu.be/L1a1CpaBovQ?si=hmHKMbqE7oUVJdBK&t=1044',
    modalContent: 'The organ in this church has been continuously playing As Slow As Possible by John Cage for the last 24 years.',
  },
  {
    id: 25,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <SongADayTicker />
        <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', opacity: 0.8 }}>
        
        </div>
      </div>
    ),
    clickable: true,
    modalTitle: 'Song a Day Gallery',
    modalUrl: 'https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4'
    ,
  },
  {
    id: 26,
    customContent: true,
    content: (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
        <iframe
          src="https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4"
          title="Song a Day Gallery"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            transform: 'scale(1.05)',
            transformOrigin: 'center',
          }}
          allowFullScreen
        />
      </div>
    ),
    clickable: true,
    modalTitle: 'Song a Day Gallery',
    modalUrl: 'https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4',
  },
  {
    id: 27,
    text: "i am obsessed with death.",
    // Empty square - leave text as empty string
  },
  {
    id: 28,
    text: "in 2014, Bull of Heaven created a song that can last 3.343 quindecillion years \n\n ",
    // Empty square - leave text as empty string
  },
  {
    id: 29,
    type: 'image',
    image: '/images/bull.jpg',
    clickable: true,
    modalTitle: "listen to a small sammple of 310: ΩΣPx0(2^18×5^18)p*k*k*k",
    modalUrl: 'https://www.youtube.com/watch?v=OXHhc5PaFXw',
    modalContent: 'Bull of Heaven is a band known for releasing a lot of noise/drone music, much of lasting insanely long periods of time.',
    // Empty square - leave text as empty string
  },
  
  {
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝀸</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 28,
    text: "in 2021, Alvin Lucier died.\n\n in 2025, a brain organoid grown from his blood sent signals that played music on large brass plates. ",
    // Empty square - leave text as empty string
  },
  {
    id: 29,
    type: 'image',
    image: '/images/organoid.png',
    clickable: true,
    modalTitle: "Listen: A brain organoid grown from Alvin's blood triggers electical impulses that make sounds on the brass plates.",
    modalUrl: 'https://youtu.be/Xp1wgibBlMU?si=bzd09cp-GXJLMmrH',
    modalContent: 'When learning of this, his daughter said, "That is so my dad"',
    // Empty square - leave text as empty string
  },
  
  {
    id: 30,
    text: "in 2026, the first note of Every Two Million Blocks will begin playing for a year",
    // Empty square - leave text as empty string
  },
  {
    id: 31,
    text: "ethereum adds a new block every 12 seconds",
    // Empty square - leave text as empty string
  },
  {
    id: 32,
    type: 'image',
    image: '/images/notes.png',
    clickable: true,
    modalContent: 'Note a year',
  },
  {
    id: 33,
    text: "one note is revealed every 2 million blocks.",
    // Empty square - leave text as empty string
  },
  {
    id: 34,
    type: 'image',
    image: '/images/notes1.png',
    clickable: true,
    modalContent: 'Note a year',
  },
  {
    id: 35,
    text: "song a day \n: \nnote a year",
    // Empty square - leave text as empty string
  },
  {
    id: 36,
    text: "markov chain\nonchain",
    // Empty square - leave text as empty string
  },
  {
    id: 37,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 38,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 33,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 34,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 35,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 36,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 37,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 38,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 39,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 40,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 41,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 42,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 43,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 44,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 45,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 46,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 47,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 48,
    text: "every nft minted extends this song for a year.",
    // Empty square - leave text as empty string
  },
  {
    id: 49,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 50,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 51,
    text: "you + me + markov chain + ethereum = E2MB ",
    // Empty square - leave text as empty string
  },
  {
    id: 52,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 53,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 54,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 55,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 56,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 57,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 58,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 59,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 60,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 61,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 62,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 63,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 64,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 65,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 66,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 67,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 68,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 69,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 70,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 71,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 72,
    text: "",
    // Empty square - leave text as empty string
  },
  {
    id: 73,
    text: "",
    // Empty square - leave text as empty string
  },
  

  
]

// How many total empty squares to add after your custom ones
export const emptySquaresCount = 54
