// morse decoding tree
// EACH NODE has a latter and TWO possible children (dot, dash)
// null means that path doesnt lead to a standart english letter

const morseTree = {
  dot: { // E
    letter: 'E',
    dot: { // I
      letter: 'I',
      dot: { letter: 'S', dot: { letter: 'H' }, dash: { letter: 'V' } },
      dash: { letter: 'U', dot: { letter: 'F' }, dash: null }
    },
    dash: { // A
      letter: 'A',
      dot: { letter: 'R', dot: { letter: 'L' }, dash: null },
      dash: { letter: 'W', dot: { letter: 'P' }, dash: { letter: 'J' } }
    }
  },
  dash: {
    letter: 'T',
    dot: {
        letter: 'N',
        dot: { letter: 'D', dot: {letter: 'B'}, dash: {letter: 'X'} },
        dash: { letter: 'K', dot: { letter: 'C' }, dash: {letter: 'Y'} }
    },
    dash: {
        letter: 'M',
        dot: {letter: 'G', dot: {letter: 'Q'}, dash: {letter: 'Z'} },
        dash: {letter: 'O', dot: null, dash: null }
    }
  }
};