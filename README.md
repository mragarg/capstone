# PicMe – Draw with Friends, Anywhere!

## Play Here: https://picme.seilcho7.dev/


<img src="./src/img/picme-logo.png" width="500">


## What is it? 
PicMe is an interactive, multiplayer game which involves challenging players to draw weird, funny and sometimes ridiculous prompts on their personal devices. The drawings are shown live on a host screen, as the player is drawing. Other users are able to view the drawing from the host screen and submit a guess as to what the user is drawing. After 25 seconds, the user that was drawing is shown all the submitted answers. He/she is required to select one that they like best (similar to Cards Against Humanity), which then gives that user a point. This is considered the end of one round of gameplay; the next round then starts with another person drawing a new image.

## How did we make it?
* Frontend:
    * React.js
    * Websockets
    * CSS3
    * HTML5 
    * React-Sketch
    * React-Confetti
    * React-Countdown-Clock
    * React-Router-Dom
    * Styled-Component
* Backend:
    * PostgreSQL
    * Express.js
    * Node.js

## What were our headaches?
A major challenge was having the ability for the drawing to be accurate on personal devices (especially on iOS devices). For example, the lines were off by a millimeter based on the user’s touch as well as the Sketchfield component would move around while the user drew. This issue was detrimental in having a flawless user experience, thus we converted our drawing field from react-canvas-draw to react-sketch. However, this created another problem that we needed to solve – the drawings that appeared “live” on the host page were now delayed. With a few tweaks, we were able to have the user drawing appear live on the host page so everyone can view and guess in real time.

## Login screen
![](https://media.giphy.com/media/L2qL4iryo1IwCZWPn9/giphy.gif)
## PicMe demo 
![](https://media.giphy.com/media/STkUz4JLF50xQ1qet3/giphy.gif)