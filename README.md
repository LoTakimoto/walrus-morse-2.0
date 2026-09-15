# WALRUS MORSE 2.0

> This project used AI for improvement suggestions, debugging help, and quick fixes along the way.

After months of thinking about this project, thinking about the logic, imagining how I wanted it to work, and honesly being too lazy to actually start it, I finally decided to put my hands on it and make it!

### walrus i drew a few months ago on @LucasHT22 's ipad :) (it says "W" in morse code on its back) -->

<img src="assets/walrus.png">

I originally tried to make this project in **Godot** and i failed miserably :D

I struggled with the logic (still am), couldn't really get the project working the way I wanted, got mad, and eventually gave up on it entirely. 
After letting the idea sit in my head for a while, I decided to try again (this time as a web project)



---

This is an **interactive telegraph** with a **visual International Morse Code decoder**!

You can experience how a telegraph works and **visually** follow the code through a **Morse Tree**.

## How does it work?

The project is built around a **Morse Code Tree**.

<img src="assets/2.png">

Each letter in Morse code can be reached by following a path made of two possible signals:

- `.` = DOT
- `-` = DASH

For example, to write **A**, you use:

`.-`

The decoder follows those signals through the tree until it reaches the corresponding letter.

The tree is displayed visually on the page, each connection showing whether that step is a DOT or a DASH.

The tree is organized in a circuit-like layout. One symbol continues the horizontal spine while the other branches downward.

---

## The telegraph key

The large rectangle below the Morse Tree works as the **telegraph key**.

You can **interact** with it in TWO ways:

- **Click or hold the mouse**
- **Press or hold the spacebar**

<img src="assets/3.png">

The code measures how long the key was pressed:
- A short press becomes a **DOT (`.`)**
- A longer press becomes a **DASH (`-`)**

The current threshold is **200ms**.

---

## Real time decoding

The key area is divided into TWO sections:

- TOP section -> shows the morse code you have entered 
- BOTTOM section -> shows what that sequence translates to

- If the sequence doesn't correspond to a valid letter, the decoder displays: "?".

This is done by walking through the same morseTree used to create the visual tree.

## Editing the current code

There are two buttons below the telegraph:
- BACKSPACE (removes the last dot ot dash from the current sequence)
- CLEAR (Resets the current sequence)

<img src="assets/4.png">

---

## The MORSE TREE

The tree is stored as a JavaScript object where every NODE contains:

- a LETTER
- a DOT child
- a DASH child

For example:

dot: {
    letter: 'E',
    dot: {
        letter: 'I'
    }
}

This represents: 
. -> E
.. -> I

A null child means that there is no valid path in that direction!

---

## How to run It

I'm trying to make a Live version, but for the mean time:

Run it locally! -> 
1. Clone or download this repository
2. Open `index.html` in a browser

No built steps, dependencies or installation required.

<img src="assets/5.png">

## Other

THIS PROJECT IS MADE WITH:
- HTML, CSS, JavaScript 
[no external framework is required]

References: 

- [freecodecamp.org](https://www.freecodecamp.org/)
- [w3schools.com](https://www.w3schools.com/)
- [dev.to](https://dev.to/)
- [geeksforgeeks.org](https://www.geeksforgeeks.org/)
- [cssgradient.io](https://cssgradient.io/)










