import { assetPath } from './lib/assetPath'

// Edit this file to add content to your squares!
// Each square can have:
// - text: simple text string
// - clickable: true (makes it open a modal when clicked)
// - modalContent: text to show in the modal
// - type: 'title' or 'countdown' for special squares

export const squaresData = [
  {
    id: 1,
    type: 'title',
    // Don't edit this one - it's the EVERY TWO MILLION BLOCKS title
  },
  {
    id: 2,
    type: 'countdown',
    // Don't edit this one - it's the countdown
  },
  {
    id: 3,
    text: 'i am obsessed with time.',
  },
  {
    id: 4,
    type: 'image',
    image: assetPath('images/nippur-cuniform.png'),
    clickable: true,
    modalContent: 'This is a drawing of a cuniform tablet containing musical instructions from Babylonia circa ~2000 BCE. No one can quite agree on how exactly to read it.',
  },
  {
    id: 5,
    text: "← that is the oldest known written music.\n\nit's about 4000 years old",
  },
  {
    id: 6,
    text: 'i am obsessed with dates.',
    // Empty square - leave text as empty string
  },
  // Add more squares below - just copy and paste this template:
  {
    id: 7,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '1.2rem' }}>january 1</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>2009</div>
      </div>
    ),
    clickable: true,
    modalTitle: 'Song a Day Gallery',
    modalUrl: 'http://gallery.songaday.world',
  },
  
]

// How many total empty squares to add after your custom ones
export const emptySquaresCount = 54
