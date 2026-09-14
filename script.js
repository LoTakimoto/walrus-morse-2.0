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

// --------

// each half of the tree has ONE symbol that keeps a straight line going in a 'spine', and the OTHER symbol drops down at a right angle to start a new spine.

const treeNodes = []; // {x, y, letter} for every letter
const treeLines = []; // {x1, y1, x2, y2, type} for every connecting segment

const COL_SPACING = 48; // horizontal dist. 
const ROW_SPACING = 55; // vertical dista.when a branch drops down

function buildOrthogonalLayout(node, x, y, side) {
    if (!node) {
        return; // no letter down this path
    }

    treeNodes.push({ x: x, y: y, letter: node.letter });

    const horizontalSymbol = side === 'right' ? 'dot' : 'dash';
    const verticalSymbol = side === 'right' ? 'dash' : 'dot';
    const horizontalSign = side === 'right' ? 1 : -1;

    const horizontalChild = node[horizontalSymbol];
    const verticalChild = node[verticalSymbol];

    if (horizontalChild) {
        const childX = x + horizontalSign * COL_SPACING;
        const childY = y;
        treeLines.push({ x1: x, y1: y, x2: childX, y2: childY, type: horizontalSymbol });
        buildOrthogonalLayout(horizontalChild, childX, childY, side);
    }

    if (verticalChild) {
        const childX = x;
        const childY = y + ROW_SPACING;
        treeLines.push({ x1: x, y1: y, x2: childX, y2: childY, type: verticalSymbol });
        buildOrthogonalLayout(verticalChild, childX, childY, side);
    }
}

// --------
// TURNING ALL THOSE POSITIONS INTO ACTUAL ELEMENTS on the page

function createLineElement(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    const lineElement = document.createElement('div');
    lineElement.className = 'tree-line';
    lineElement.style.left = x1 + 'px';
    lineElement.style.top = y1 + 'px';
    lineElement.style.width = length + 'px';
    lineElement.style.transform = 'rotate(' + angleInDegrees + 'deg)';

    return lineElement;
}

// the peg in the middle of a connection

function createPegElement(x1, y1, x2, y2, type) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const angleInDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const pegElement = document.createElement('div');
    pegElement.className = type === 'dash' ? 'tree-peg tree-peg-dash' : 'tree-peg tree-peg-dot';
    pegElement.style.left = midX + 'px';
    pegElement.style.top = midY + 'px';
    pegElement.style.transform = 'translate(-50%, -50%) rotate(' + angleInDegrees + 'deg)';

    return pegElement;
}

function drawTree() {
    const treeArea = document.getElementById('tree-area');
    treeArea.innerHTML = '';

    treeNodes.length = 0;
    treeLines.length = 0;

    const rootX = 480;
    const rootY = 20;
    const spineY = rootY + 45; // E and T sit diagonal

    const eX = rootX + COL_SPACING;
    const tX = rootX - COL_SPACING;

    
    // funnel shape at the top
    treeLines.push({ x1: rootX, y1: rootY, x2: eX, y2: spineY, type: 'dot' });
    treeLines.push({ x1: rootX, y1: rootY, x2: tX, y2: spineY, type: 'dash' });

    buildOrthogonalLayout(morseTree.dot, eX, spineY, 'right');
    buildOrthogonalLayout(morseTree.dash, tX, spineY, 'left');

    // connecting lines firstr
    for (let i = 0; i < treeLines.length; i++) {
        const line = treeLines[i];
        const lineElement = createLineElement(line.x1, line.y1, line.x2, line.y2);
        treeArea.appendChild(lineElement);
    }

    // pegs on top --- marking dot vs dash for each connection
    for (let i = 0; i < treeLines.length; i++) {
        const line = treeLines[i];
        const pegElement = createPegElement(line.x1, line.y1, line.x2, line.y2, line.type);
        treeArea.appendChild(pegElement);
    }

    //  marker for the tart of the tree
    const rootMarker = document.createElement('div');
    rootMarker.className = 'tree-root-marker';
    rootMarker.style.left = rootX + 'px';
    rootMarker.style.top = rootY + 'px';
    treeArea.appendChild(rootMarker);

    // draw every letter as a circle with the letter written inside it
    for (let i = 0; i < treeNodes.length; i++) {
        const node = treeNodes[i];
        const nodeElement = document.createElement('div');

        nodeElement.className = 'tree-node';
        nodeElement.style.left = node.x + 'px';
        nodeElement.style.top = node.y + 'px';
        nodeElement.textContent = node.letter;
        treeArea.appendChild(nodeElement);
    }
}

drawTree();

//---------
// keyboard
// dot = short press / dash = long press (a "hold")
// we dont know which one it is when the finger/mouse goes down ->>> we only find out once it comes back UP, by checking how much TIME passed in between

const DASH_THRESHOLD_MS = 200;
// holds shorter than this = dot / longer = dash

let pressStartTime = null;
let currentSequence = [];

const morseKeyButton = document.getElementById('morse-key');
const translationBar = document.getElementById('translation-bar');

function handlePressStart() {
    pressStartTime = Date.now();
}

function handlePressEnd() {
    if (pressStartTime === null) {
        return;
    }

    const pressDuration = Date.now() - pressStartTime;
    pressStartTime = null;
    //reset for the next press

    const signal = pressDuration < DASH_THRESHOLD_MS ? 'dot' : 'dash';
    currentSequence.push(signal);

    updateTranslationBar();
}

function updateTranslationBar() {
    const symbols = currentSequence.map(function (signal) {
        return signal === 'dot' ? '.' : '-';
    });
    translationBar.textContent = symbols.join(' ');
    // shows the sequence as . and - symbols
}

function clearSequence() {
    currentSequence = [];
    updateTranslationBar();
}

function backspaceSequence() {
    currentSequence.pop();
    //removes the last entry (if any)
    updateTranslationBar();
}

morseKeyButton.addEventListener('pointerdown', handlePressStart);
morseKeyButton.addEventListener('pointerup', handlePressEnd);

//--

//if the pointer is released outside the button or leaves while held, treat it the same as releasing (so it doesnt get stuck mid press)
morseKeyButton.addEventListener('pointerleave', handlePressEnd);

document.getElementById('btn-backspace').addEventListener('click', backspaceSequence);
document.getElementById('btn-clear').addEventListener('click', clearSequence);