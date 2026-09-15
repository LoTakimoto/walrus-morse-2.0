// morse decoding tree 
// EACH NODE has a letter and TWO possible children (dot, dash) 
// null means that path doesnt lead to a letter 
 
const morseTree = { 
  dot: {
    letter: 'E', 
    dot: { 
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
 
const COL_SPACING = 66; // horizontal dist.  
const ROW_SPACING = 76; // vertical dista.when a branch drops down 
 
const MIN_NODE_SEPARATION = 42;

function isTooClose(x, y) {
    for (let i = 0; i < treeNodes.length; i++) {
        const dx = treeNodes[i].x - x;
        const dy = treeNodes[i].y - y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_NODE_SEPARATION) {
            return true;
        }
    }
    return false;
}

function buildOrthogonalLayout(node, x, y, horizontalSymbol, horizontalSign, sequence = '') {
    if (!node) {
        return;
    }

    treeNodes.push({
        x: x,
        y: y,
        letter: node.letter,
        sequence: sequence
    });

    const verticalSymbol = horizontalSymbol === 'dot' ? 'dash' : 'dot';

    const horizontalChild = node[horizontalSymbol];
    const verticalChild = node[verticalSymbol];

    if (horizontalChild) {
        let childX = x + horizontalSign * COL_SPACING;
        let childY = y;

        while (isTooClose(childX, childY)) {
            childY += ROW_SPACING;
        }

        treeLines.push({
            x1: x,
            y1: y,
            x2: childX,
            y2: childY,
            type: horizontalSymbol,
            sequence: sequence + horizontalSymbol
        });

        buildOrthogonalLayout(
            horizontalChild,
            childX,
            childY,
            horizontalSymbol,
            horizontalSign,
            sequence + horizontalSymbol
        );
    }

    if (verticalChild) {
        let childX = x;
        let childY = y + ROW_SPACING;

        while (isTooClose(childX, childY)) {
            childY += ROW_SPACING;
        }

        treeLines.push({
            x1: x,
            y1: y,
            x2: childX,
            y2: childY,
            type: verticalSymbol,
            sequence: sequence + verticalSymbol
        });

        buildOrthogonalLayout(
            verticalChild,
            childX,
            childY,
            horizontalSymbol,
            horizontalSign,
            sequence + verticalSymbol
        );
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
 
    const rootX = 450; 
    const rootY = 30; 
    const spineY = rootY + 55; // E and T sit diagonal 
 
    const eX = rootX - COL_SPACING; 
    const tX = rootX + COL_SPACING; 
 
     
    // funnel shape at the top 
    treeLines.push({ x1: rootX, y1: rootY, x2: eX, y2: spineY, type: 'dot' }); 
    treeLines.push({ x1: rootX, y1: rootY, x2: tX, y2: spineY, type: 'dash' }); 
 
    buildOrthogonalLayout(morseTree.dot, eX, spineY, 'dot', -1, 'dot'); 
    buildOrthogonalLayout(morseTree.dash, tX, spineY, 'dash', 1, 'dash');
 
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

    let maxY = rootY;

    for (let i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].y > maxY) {
            maxY = treeNodes[i].y;
        }
    }

    treeArea.style.height = (maxY + 40) + 'px';
} 

drawTree();
 
//--------- 
// keyboard 
// dot = short press / dash = long press (a "hold") 
// we dont know which one it is when the finger/mouse goes down ->>> we only find out once it comes back UP, by checking how much TIME passed in between 
 
const DASH_THRESHOLD_MS = 200; 
// holds shorter than this = dot / longer = dash 
 
const LETTER_PAUSE_MS = 1000;
const WORD_PAUSE_MS = 2000;

let pressStartTime = null;
let currentSequence = [];
let sentence = '';
let letterTimeoutId = null;
let spaceTimeoutId = null;
 
const morseKeyButton = document.getElementById('morse-key'); 
const keyCodeDisplay = document.getElementById('key-code-display'); 
const keyLetterDisplay = document.getElementById('key-letter-display'); 
const sentenceDisplay = document.getElementById('sentence-display');
 
function handlePressStart() { 
    if (pressStartTime !== null) { 
        return; 
    } 
    pressStartTime = Date.now(); 
    morseKeyButton.classList.add('active'); 

    clearTimeout(letterTimeoutId);
    clearTimeout(spaceTimeoutId);
}


 
function handlePressEnd() { 
    if (pressStartTime === null) { 
        return; 
    } 
 
    const pressDuration = Date.now() - pressStartTime; 
    pressStartTime = null; 
    //reset for the next press 
    morseKeyButton.classList.remove('active'); 
  
    const signal = pressDuration < DASH_THRESHOLD_MS ? 'dot' : 'dash'; 
    currentSequence.push(signal); 
  
    updateDisplays(); 
    scheduleAutoCommit();
} 
 
function decodeSequence(sequence) { 
    let node = morseTree; 
 
    for (let i = 0; i < sequence.length; i++) { 
        if (!node) { 
            return null; 
        } 
        node = node[sequence[i]]; 
    } 
 
    return node ? node.letter : null; 
} 
 
function updateDisplays() { 
    const symbols = currentSequence.map(function (signal) { 
        return signal === 'dot' ? '.' : '-'; 
    }); 

    keyCodeDisplay.textContent = symbols.join(' '); 
  
    const decodedLetter = decodeSequence(currentSequence); 
    keyLetterDisplay.textContent = decodedLetter || (currentSequence.length ? '?' : '');

    updateTreePath();
}
function updateTreePath() {
    const lines = document.querySelectorAll('.tree-line');
    const pegs = document.querySelectorAll('.tree-peg');
    const nodes = document.querySelectorAll('.tree-node');

    const currentPath = currentSequence.join('');

    for (let i = 0; i < lines.length; i++) {
        const line = treeLines[i];

        if (currentPath.length > 0 && currentPath.startsWith(line.sequence)) {
            lines[i].classList.add('active');
            pegs[i].classList.add('active');
        } else {
            lines[i].classList.remove('active');
            pegs[i].classList.remove('active');
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        const node = treeNodes[i];

        if (currentPath.length > 0 && node.sequence === currentPath) {
            nodes[i].classList.add('active');
        } else {
            nodes[i].classList.remove('active');
        }
    }
}

function updateSentenceDisplay() {
    sentenceDisplay.textContent = sentence;
}

function commitLetterToSentence() {
    if (currentSequence.length === 0) {
        return;
    }

    const decodedLetter = decodeSequence(currentSequence);

    sentence += decodedLetter || '?';
    currentSequence = [];

    updateDisplays();
    updateSentenceDisplay();
}

function commitSpaceToSentence() {
    if (sentence.length > 0 && sentence.charAt(sentence.length - 1) !== ' ') {
        sentence += ' ';
        updateSentenceDisplay();
    }
}

function scheduleAutoCommit() {
    clearTimeout(letterTimeoutId);
    clearTimeout(spaceTimeoutId);

    letterTimeoutId = setTimeout(commitLetterToSentence, LETTER_PAUSE_MS);
    spaceTimeoutId = setTimeout(commitSpaceToSentence, WORD_PAUSE_MS);
}

function clearSequence() { 
    currentSequence = []; 
    sentence = '';

    clearTimeout(letterTimeoutId);
    clearTimeout(spaceTimeoutId);

    updateDisplays();
    updateSentenceDisplay(); 
} 
 
function backspaceSequence() {
    if (currentSequence.length > 0) {
        currentSequence.pop();
        updateDisplays();
    } else {
        sentence = sentence.slice(0, -1);
        updateSentenceDisplay();
    }
}
 
// mouse/touch 
morseKeyButton.addEventListener('pointerdown', handlePressStart); 
morseKeyButton.addEventListener('pointerup', handlePressEnd); 
 
 
//if the pointer is released outside the button or leaves while held, treat it the same as releasing (so it doesnt get stuck mid press) 
morseKeyButton.addEventListener('pointerleave', handlePressEnd); 
 
document.addEventListener('keydown', function (event) { 
    if (event.code === 'Space') { 
        event.preventDefault(); // stop the page from scrolling 
        if (!event.repeat) { 
            handlePressStart(); 
        } 
    }

    if (event.code === 'Backspace') {
        event.preventDefault();
        backspaceSequence();
    }
});
  
document.addEventListener('keyup', function (event) { 
    if (event.code === 'Space') { 
        event.preventDefault(); 
        handlePressEnd(); 
    } 
}); 
  
document.getElementById('btn-backspace').addEventListener('click', backspaceSequence); 
document.getElementById('btn-clear').addEventListener('click', clearSequence);