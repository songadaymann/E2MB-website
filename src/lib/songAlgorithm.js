const DIATONIC_CHORDS = [6, 9, 11, 16, 20, 1, 5];

const QUARTER = 480;
const DOTTED_QUART = 720;
const HALF_NOTE = 960;
const WHOLE = 1920;
const EIGHTH = 240;
const SIXTEENTH = 120;
const PHRASE_LEN = 8;

const LEAD_MIN = 48;
const LEAD_MAX = 70;
const BASS_MIN = 24;
const BASS_MAX = 46;

function toUint32(value) {
  return value >>> 0;
}

function getDiatonicChord(index) {
  return DIATONIC_CHORDS[(index % DIATONIC_CHORDS.length + DIATONIC_CHORDS.length) % DIATONIC_CHORDS.length];
}

function getDiatonicIndex(chordIdx) {
  const idx = DIATONIC_CHORDS.indexOf(chordIdx);
  return idx === -1 ? 0 : idx;
}

function phraseType(position) {
  const m = Math.trunc(position / PHRASE_LEN) % 7;
  if (m === 0 || m === 3 || m === 6) return 0;
  if (m === 1 || m === 4) return 1;
  if (m === 2) return 2;
  return 3;
}

function adv(state, seedMod) {
  const next = (state * 1664525 + 1013904223 + seedMod) >>> 0;
  return next;
}

export function mixSeeds(a, b) {
  let s = (a ^ ((b * 0x9e3779b9) >>> 0)) >>> 0;
  s ^= (s << 13) >>> 0;
  s ^= s >>> 17;
  s ^= (s << 5) >>> 0;
  return s >>> 0;
}

function diatonicNeighbors(chordIdx) {
  const out = new Array(6).fill(getDiatonicChord(0));
  let currentPos = 0;
  for (let i = 0; i < 7; i += 1) {
    if (getDiatonicChord(i) === chordIdx) {
      currentPos = i;
      break;
    }
  }

  let count = 0;
  for (let offset = -2; offset <= 2; offset += 1) {
    if (offset === 0 || count >= 6) continue;
    const neighborPos = (currentPos + offset + 7) % 7;
    out[count] = getDiatonicChord(neighborPos);
    count += 1;
  }

  if (chordIdx === 6 && count < 6) {
    out[count] = 9;
    count += 1;
    if (count < 6) {
      out[count] = 16;
      count += 1;
    }
  } else if (chordIdx === 20 && count < 6) {
    out[count] = 6;
    count += 1;
    if (count < 6) {
      out[count] = 1;
      count += 1;
    }
  } else if (chordIdx === 16 && count < 6) {
    out[count] = 6;
    count += 1;
    if (count < 6) {
      out[count] = 20;
      count += 1;
    }
  }

  while (count < 6) {
    out[count] = getDiatonicChord(0);
    count += 1;
  }

  return out;
}

function preferredAreas(phrase) {
  if (phrase === 0) return [6, 20, 16];
  if (phrase === 1) return [6, 1, 11];
  if (phrase === 2) return [9, 20, 1];
  return [16, 6, 20];
}

function chooseHarmonicMovement(currentChord, phrase, rngState, seed) {
  const nbrs = diatonicNeighbors(currentChord);
  const pref = preferredAreas(phrase);
  let newState = adv(rngState, seed);
  let nextChord = currentChord;

  if (phrase === 0) {
    if ((newState & 7) === 0) {
      const matches = nbrs.filter((n) => pref.includes(n));
      if (matches.length > 0) {
        const idx = newState % matches.length;
        nextChord = matches[idx];
      } else {
        nextChord = nbrs[newState % nbrs.length];
      }
    }
  } else if (phrase === 1) {
    if ((newState & 3) === 0) {
      nextChord = nbrs[newState % nbrs.length];
    }
  } else if (phrase === 2) {
    nextChord = nbrs[newState % nbrs.length];
  } else {
    const strong = [6, 16, 20];
    const pool = nbrs.filter((n) => strong.includes(n));
    if (pool.length > 0) {
      nextChord = pool[newState % pool.length];
    } else {
      nextChord = nbrs[newState % nbrs.length];
    }
  }

  return { nextChord, newState };
}

function ebMajorScale(degree) {
  const scale = [3, 5, 7, 8, 10, 0, 2];
  return scale[(degree % 7 + 7) % 7];
}

function chordIdxToScaleDegree(idx) {
  switch (idx) {
    case 6:
      return 0;
    case 9:
      return 1;
    case 11:
      return 2;
    case 16:
      return 3;
    case 20:
      return 4;
    case 1:
      return 5;
    case 5:
      return 6;
    default:
      return 0;
  }
}

function chordToPitches(chordIdx, octave) {
  const tones = [0, 0, 0];
  const scaleDegree = chordIdxToScaleDegree(chordIdx);
  const base = octave * 12;

  const root = ebMajorScale(scaleDegree);
  const third = ebMajorScale((scaleDegree + 2) % 7);
  const fifth = ebMajorScale((scaleDegree + 4) % 7);

  tones[0] = base + root;
  tones[1] = base + third;
  tones[2] = base + fifth;

  if (tones[1] < tones[0]) tones[1] += 12;
  if (tones[2] < tones[1]) tones[2] += 12;

  for (let i = 0; i < 3; i += 1) {
    while (tones[i] < LEAD_MIN) tones[i] += 12;
    while (tones[i] > LEAD_MAX) tones[i] -= 12;
  }

  return tones;
}

function bassChordToPitches(chordIdx, octave) {
  const tones = new Array(8).fill(0);
  const scaleDegree = chordIdxToScaleDegree(chordIdx);
  const base = octave * 12;

  tones[0] = base + ebMajorScale(scaleDegree);
  tones[1] = base + ebMajorScale((scaleDegree + 3) % 7);
  tones[2] = base + ebMajorScale((scaleDegree + 4) % 7);
  tones[3] = base + ebMajorScale((scaleDegree + 5) % 7);
  tones[4] = base + ebMajorScale((scaleDegree + 1) % 7);
  tones[5] = base + ebMajorScale((scaleDegree + 3) % 7);
  tones[6] = base + ebMajorScale((scaleDegree + 2) % 7);
  tones[7] = base + ebMajorScale((scaleDegree + 6) % 7);

  for (let i = 1; i < tones.length; i += 1) {
    if (tones[i] < tones[0]) tones[i] += 12;
  }

  for (let i = 0; i < tones.length; i += 1) {
    while (tones[i] < BASS_MIN) tones[i] += 12;
    while (tones[i] > BASS_MAX) tones[i] -= 12;
  }

  return tones;
}

function getDurationLead(phrase, rngState) {
  const r = rngState % 6;
  if (phrase === 0) {
    if (r < 3) return QUARTER;
    if (r < 5) return EIGHTH;
    return DOTTED_QUART;
  }
  if (phrase === 1) {
    const rr = rngState % 3;
    if (rr === 0) return EIGHTH;
    if (rr === 1) return QUARTER;
    return DOTTED_QUART;
  }
  if (phrase === 2) {
    const rr = rngState % 4;
    if (rr === 0) return SIXTEENTH;
    if (rr === 1) return EIGHTH;
    if (rr === 2) return QUARTER;
    return HALF_NOTE;
  }
  const rr = rngState % 3;
  if (rr === 0) return QUARTER;
  if (rr === 1) return DOTTED_QUART;
  return HALF_NOTE;
}

function getDurationBass(position) {
  const patternPos = position % 4;
  if (patternPos === 0) return HALF_NOTE;
  if (patternPos === 1) return QUARTER;
  if (patternPos === 2) return HALF_NOTE;
  return EIGHTH;
}

function getRestDuration(phrase, rngState) {
  const r = rngState & 3;
  if (phrase === 2 || phrase === 3) {
    if (r === 0) return QUARTER;
    if (r === 1) return DOTTED_QUART;
    return HALF_NOTE;
  }
  return (r & 1) === 0 ? QUARTER : DOTTED_QUART;
}

function leadShouldRest(phrase, posInPhrase, notesSinceRest, rngState) {
  if (notesSinceRest >= 8) return true;
  if (notesSinceRest < 4) return false;

  let restChance;
  if (posInPhrase === 3) restChance = 6;
  else if (posInPhrase === 7) restChance = 3;
  else if (phrase === 0) restChance = 12;
  else if (phrase === 1) restChance = 16;
  else if (phrase === 2) restChance = 10;
  else restChance = 8;

  return (rngState & (restChance - 1)) === 0;
}

function chooseChordToneImproved(posInPhrase, rngState) {
  const r = rngState & 7;
  if (posInPhrase === 0) {
    if (r < 4) return 0;
    if (r < 6) return 2;
    return 1;
  }
  if (posInPhrase === 1) {
    if (r === 0) return 2;
    return r % 3;
  }
  if (posInPhrase === PHRASE_LEN - 1) {
    return (r & 1) === 0 ? 0 : 2;
  }
  return r % 3;
}

function chooseBasstone(position, rngState, previousPitch, pitches) {
  const r = rngState & 15;
  if (previousPitch !== null) {
    for (let i = 0; i < pitches.length; i += 1) {
      if (pitches[i] === previousPitch && r < 12) {
        return i;
      }
    }
  }

  const weights = [8, 6, 7, 4, 2, 1, 2, 1];
  const totalWeight = weights.reduce((acc, value) => acc + value, 0);
  const randWeight = Math.floor((rngState >>> 4) % totalWeight);
  let cumulative = 0;

  for (let i = 0; i < weights.length; i += 1) {
    cumulative += weights[i];
    if (randWeight < cumulative) {
      return i;
    }
  }

  return 0;
}

function leadGenerateStep(position, tokenSeed, state) {
  const nextState = { ...state };
  const phrase = phraseType(position);
  const posInPhrase = position % PHRASE_LEN;

  if (position % 50 === 0) {
    nextState.chord = 0;
    nextState.rng = adv(nextState.rng, tokenSeed ^ 0x5050);
  } else if (position % PHRASE_LEN === 0 || position % 4 === 0) {
    nextState.rng = adv(nextState.rng, tokenSeed ^ 0x1234);
    const nbrs = diatonicNeighbors(getDiatonicChord(nextState.chord));
    nextState.chord = getDiatonicIndex(nbrs[nextState.rng % nbrs.length]);
  }

  if (leadShouldRest(phrase, posInPhrase, nextState.notesSinceRest, nextState.rng)) {
    const restDur = getRestDuration(phrase, nextState.rng);
    nextState.notesSinceRest = 0;
    return [{ pitch: -1, duration: restDur }, nextState];
  }

  const currentChordIdx = getDiatonicChord(nextState.chord);
  const { nextChord, newState } = chooseHarmonicMovement(currentChordIdx, phrase, nextState.rng, tokenSeed);
  nextState.rng = newState;
  nextState.chord = getDiatonicIndex(nextChord);

  const octave = phrase === 1 || phrase === 3 ? 6 : 5;
  const tones = chordToPitches(getDiatonicChord(nextState.chord), octave);

  let toneIndex = 0;
  if (phrase === 2) {
    nextState.rng = adv(nextState.rng, tokenSeed * 2);
    const r = nextState.rng & 7;
    if (r < 2) toneIndex = 0;
    else if (r < 5) toneIndex = 1;
    else toneIndex = 2;
  } else {
    nextState.rng = adv(nextState.rng, tokenSeed * 2);
    toneIndex = chooseChordToneImproved(posInPhrase, nextState.rng);
  }

  const duration = getDurationLead(phrase, nextState.rng);
  const event = { pitch: tones[toneIndex % 3], duration };
  nextState.notesSinceRest += 1;
  return [event, nextState];
}

function bassGenerateStep(position, tokenSeed, state) {
  const nextState = { ...state };
  const phrase = phraseType(position);

  if (position % 50 === 0) {
    nextState.chord = 0;
    nextState.rng = adv(nextState.rng, tokenSeed ^ 0x5050);
  } else if (position % PHRASE_LEN === 0 || position % 4 === 0) {
    nextState.rng = adv(nextState.rng, tokenSeed ^ 0x1234);
    const nbrs = diatonicNeighbors(getDiatonicChord(nextState.chord));
    nextState.chord = getDiatonicIndex(nbrs[nextState.rng % nbrs.length]);
  }

  const currentChordIdx = getDiatonicChord(nextState.chord);
  const { nextChord, newState } = chooseHarmonicMovement(currentChordIdx, phrase, nextState.rng, tokenSeed);
  nextState.rng = newState;
  nextState.chord = getDiatonicIndex(nextChord);

  const octave = phrase === 1 ? 5 : 4;
  const pitches = bassChordToPitches(getDiatonicChord(nextState.chord), octave);

  nextState.rng = adv(nextState.rng, tokenSeed * 2);
  const toneIdx = chooseBasstone(position, nextState.rng, nextState.previousPitch, pitches);
  const duration = getDurationBass(position);
  const chosenPitch = pitches[toneIdx];
  nextState.previousPitch = chosenPitch;

  return [{ pitch: chosenPitch, duration }, nextState];
}

export function generateBeat(beat, tokenSeedInput) {
  const tokenSeed = toUint32(tokenSeedInput);
  const leadState = { chord: 0, rng: 0xcafebabe >>> 0, notesSinceRest: 0 };
  const bassState = { chord: 0, rng: 0xdeafbeef >>> 0, previousPitch: null };

  const effectiveBeat = beat % 365;

  let lead = leadState;
  let bass = bassState;
  for (let i = 0; i < effectiveBeat; i += 1) {
    const seed = mixSeeds(tokenSeed, i >>> 0);
    [, lead] = leadGenerateStep(i, seed, lead);
    [, bass] = bassGenerateStep(i, seed ^ 0x7777, bass);
  }

  const currentSeed = mixSeeds(tokenSeed, effectiveBeat >>> 0);
  const [leadEvent, leadOut] = leadGenerateStep(effectiveBeat, currentSeed, lead);
  const [bassEvent, bassOut] = bassGenerateStep(effectiveBeat, currentSeed ^ 0x7777, bass);

  return {
    lead: leadEvent,
    bass: bassEvent,
    state: {
      lead: leadOut,
      bass: bassOut,
    },
  };
}

export const durations = {
  QUARTER,
  DOTTED_QUART,
  HALF_NOTE,
  WHOLE,
  EIGHTH,
  SIXTEENTH,
};
