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

// we walk through the tree one branch at a time. Everytime we go one level deeper, we SPLIT the horizontal space we have in HALF
// dot child: left half; dash child: right half ---> this spreads the letters into a tree shape 


const treeNodes = []; //hold {x, y, letter} for every LETTER
const treeLines = []; // hold {x1, y1, x2, y2} for every connecting line

function findNodePositions(node, leftEdge, rightEdge, level, parentX, parentY) {
    if (!node) {
    return;
}
 
    //if -> branch doesnt lead to a letter -> null
    

    const rowHeight = 75;
    const nodeX = (leftEdge + rightEdge) / 2;
    const nodeY = level * rowHeight + 30;

    treeNodes.push({x: nodeX, y: nodeY, letter: node.letter});
    treeLines.push({x1: parentX, y1: parentY, x2: nodeX, y2: nodeY});

    // dot child gets the left half
    findNodePositions(node.dot, leftEdge, nodeX, level + 1, nodeX, nodeY);
    // dash child gets the right half
    findNodePositions(node.dash, nodeX, rightEdge, level + 1, nodeX, nodeY);
}

// --------
// TURNING ALL THOSE POSITIONS INTO ACTUAL ELEMENTS on the page
// instead of drawing -->> small <div> for every letter and connecting line and position with css manually

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

function drawTree() {
    const treeArea = document.getElementById('tree-area');
    treeArea.innerHTML = ''; 
    //clears anything drawn before

    const imageWidth = 800;
    const imageHeight = 340;
    const rootX = imageWidth / 2;
    const rootY = 15;

    //start fresh
    treeNodes.length = 0;
    treeLines.length = 0;

    findNodePositions(morseTree.dot, 0, imageWidth / 2, 1, rootX, rootY);
    findNodePositions(morseTree.dash, imageWidth / 2, imageWidth, 1, rootX, rootY);

    //draw the CONNECTING LINES first
    for (let i = 0; i < treeLines.length; i++) {
        const line = treeLines[i];
        const lineElement = createLineElement(line.x1, line.y1, line.x2, line.y2);
        treeArea.appendChild(lineElement);
    }

    // circle marking the start of the tree
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

drawTree()

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
 