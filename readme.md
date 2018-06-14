# Connect 4 by Marc Cooperstein

## Instructions

### To play game in a web browser, open the HTML file or go to the following link: [play connect four]: http://www.reddit.com

## **Quick Summary of Project/Code**
-------------------------

#### I started out by creating the board using HTML divs for the rows and columns. I also added custom data attributes for col and row to each div in order to track each individual cell by its col and row later on. I opted to use jQuery, since it could help me with selecting elements from the DOM and I knew that I could use some of its helper methods (addClass, removeClass, attr, etc.) to dynamically change the DOM elements based on user interactions. I then added event listeners for mouseenter, mouseleave, and click in order to program what should happen as the users move their mouse to select where they will drop a coin. When the user clicks to select where they will drop their coin, the coin is placed in the position of the last empty cell in that column. The program then checks to see if that player now has 4 in a row of that color. If there are four in a row, the game ends and a message is displayed that states who wins. If there are not four in a row, the color changes (players switch turns) and the game continues.
