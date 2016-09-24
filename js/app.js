// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,

    this.sprite = 'images/enemy-bug.png';
    
    // The current location for our enemies, represented as x-y coordinates
    // This x-y is attached to the left-top corner of the sprite.
    // Initial location: 
    this.x = columnToX(-1);  // just before column 0
    this.y = rowToY(randInt(1, 4)); // random row from [1..3]
    
    // The speed for our enemies, each enemy is moving horizontally with 
    // different speed. When an enemy is created, choose a random speed
    this.speed = 150 + Math.random() * 300; // random ~ 150 - 450 pixels/sec
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    // Enemy moves along x-axis at its speed
    this.x += this.speed * dt;
    if (this.x > columnToX(5)) {
        // Enemy moves beyond the canvas, replace it with a new enemy
        var idx = allEnemies.indexOf(this);
        allEnemies[idx] = new Enemy();
    }
    
    // Test collision with the player:
    // Locate the cell where the enemy is currently on
    var col = xToColumn(this.x);
    var row = yToRow(this.y);
    
    // Check if the enemy is in the same cell with the player
    if (col == player.col && row == player.row) {
        // Reduce player's score, and reset player's position
        player.scores--;
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    // Use an image as player's sprite
    this.sprite = 'images/char-boy.png';
    // Player's scores:
    // Increase everytime the player reaches the water,
    // Decrease everytime the player collides with an enemy
    this.scores = 10;  // initially give the player some points
    // Count collectible items
    this.itemCount = 0;
    // Call reset to set player's position for a new game
    this.reset();
};

// Does nothing, but required method for game.
Player.prototype.update = function() {
};

// Reset player's position
Player.prototype.reset = function() {
    this.row = 5;
    this.col = 2;
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    // Player's sprite is drawn a bit above an enemy's sprite in the same row
    ctx.drawImage(Resources.get(this.sprite), 
        columnToX(this.col), rowToY(this.row) - 20);
        //columnToX(this.col), rowToY(this.row));

    // Draw player's scores
    ctx.font = '30px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Scores: ' + this.scores, 20, 581);
    
    // Draw player's collectible items
    ctx.fillText('Items: ' + this.itemCount, 360, 581);
};

// Handle user input a key to control the player:
// Move the player up/down/left/right corresponding to the key pressed,
// make sure the player is moving within the boundary, and also check
// if the player reaches the top row.
Player.prototype.handleInput = function(key) {
    
    // Change player's position according to the key pressed,
    // and the player does not move beyond the boundary.
    if (key == 'left' && this.col > 0) {
        this.col--;
    }
    if (key == 'right' && this.col < 4) {
        this.col++;
    }
    if (key == 'up' && this.row > 0) {
        this.row--;
        // Check if the player reaches the top row, 
        // then increase the score and reset for a new game
        if (this.row == 0) {
            this.scores++;
            this.reset();
        }
    }
    if (key == 'down' && this.row < 5) {
        this.row++;
    }
};

// Represent collectible items.
var Item = function() {
    
    // choose a random item of some predifine items
    var items = ['Heart', 'Key', 'Rock', 'Star'];
    var idx = randInt(0, items.length);
    this.sprite = 'images/' + items[idx] + '.png';

    // Place item randomly in the playing grid, make sure it does not get placed in the same
    // position with ohter items
    var found = true;
    while (found) {
        this.col = randInt(0, 5);
        this.row = randInt(1, 4);
        found = false;
        if (allItems) {
            for (var i = 0; i < allItems.length; i++) {
                if (this.col == allItems[i].col && 
                        this.row == allItems[i].row) {
                    found = true;
                    break;
                }
            }
        }
    }
};

// Update method, required method for game:
// This method checks the collision of the item with the player
Item.prototype.update = function() {
    // Test collision with the player:
    // Check if the item is in the same cell with the player
    if (this.col == player.col && this.row == player.row) {
        // Count player's collectible items
        player.itemCount++;
        // Replace the collected item with a new item
        var idx = allItems.indexOf(this);
        allItems[idx] = new Item();
    }
};

// Draw the item on the screen, required method for game
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 
            columnToX(this.col), rowToY(this.row) - 20);
        //  columnToX(this.col), rowToY(this.row) );

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
// Place the player object in a variable called player
var player = new Player();
// Place all collectible items in an array call allItems
var allItems = [new Item(), new Item()];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// Helper functions: 
//
// Convert column-row position into x-y coordinates, and vice versa

// Return the x-coordinate starting the given column.
function columnToX(col) {
    return col * 101;
}
// Return the y-coordinate starting the given row.
function rowToY(row) {
    // Minus an offset where an enemy or player's sprite should be drawn
    return row * 83 - 20;
   // return row * 83 ;
}
// Return the column where the given x-coordinate lies on 
function xToColumn(x) {
    return Math.floor(x / 101);
}
// Return the row where the given y-coordinate lies on 
function yToRow(y) {
    return Math.floor((y + 20) / 83);
   // return Math.floor(y  / 83);
}

// Return a random integer between a (inclusive) and b (exclusive)
function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}
