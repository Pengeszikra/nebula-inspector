# Playn'GO client developer task Budapest

Create a browser game with JavaScript or TypeScript, without using any third party game frameworks (i.e phaser, construct, rpg maker, unity). An exception to this is PixiJS, using it is recommended, but not mandatory. 

## Specification 
  - the game should work on most modern browsers on desktop 
  - the game should be 800x600 px in size, it is not necessary to handle resizing
  - at start, a Splash screen is shown for 2 seconds, then fades out and the game continues to the main screen 
  - Main screen elements: 
    - background with some animation to make the view more interesting 
    - 4 buttons placed in the middle, from top to bottom: GAME1, GAME2, GAME3 and EXIT 
    - clicking the EXIT button navigates somewhere 
    - clicking any of the GAME buttons takes the user to the game 
    - a logo above the buttons 
  - the Game screen is a simple side scroller shoot’em up with space ships
    - the space ship can move around the game area
    - it can shoot rockets
    - the game’s background moves from right to left, with a parallax scrolling effect
    - every 2 seconds, an enemy space ship arrives
    - the enemy space ships move in some randomized way
    - if the projectile of the player's space ship hits an enemy, the enemy blows up and disappears, emitting particles - if the player's space ship collides with an enemy object, it blows up, and the game ends, going back to the main menu
    
  ## Scoring

  The quality of the graphics is not counted towards the score. Additional score is awarded for using ES6+, TypeScript, or PixiJS. You can submit the task by uploading it to github/bitbucket, or by simply sending us the source by e-mail.