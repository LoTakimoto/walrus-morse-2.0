// morse decoding tree
// EACH NODE has a letter and TWO possible children (dot, dash)
// null means that path doesnt lead to a letter

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

// Walks the tree and calculates x or y positions for every node + the lines connecting each node to its parent

function layoutTree(node, xMin, xMax, level, dy, nodes, lines, parentX, parentY) {
    if (!node) return;

    const x = (xMin + xMax) / 2;
    const y = level * dy + 30;

    nodes.push({x, y, letter: node.letter});
    lines.push({x1: parentX, y1: parentY, x2: x, y2: y});

    layoutTree(node.dot, xMin, x, level + 1, dy, nodes, lines, x, y);
    layoutTree(node.dash, x, xMax, level + 1, dy, nodes, lines, x, y);
}