// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.baseSpeed = 3 + difficulty;
    this.movement = Math.floor(Math.random() * this.baseSpeed * 50 + this.baseSpeed * 50);
    this.y = Math.floor(Math.random() * 3);
    this.x = Math.floor(Math.random() * (-404) - 101);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.movement * dt;
    if (this.x >= 505) {
        this.reset();
    }
    //  if (this.collide()) {
    //      Nothing for now. Maybe something in the future
    //  }
};

// Collision detection for enemies
Enemy.prototype.collide = function() {
    if (this.y === player.y && Math.abs(this.x - player.x * 101) <= 50) {
        return true;
    }
    return false;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y * 83 + 50);
};

// Returns an enemy to the starting position
Enemy.prototype.reset = function() {
    this.movement = Math.floor(Math.random() * this.baseSpeed * 50 + this.baseSpeed * 50);
    this.y = Math.floor(Math.random() * 3);
    this.x = Math.floor(Math.random() * (-404) - 101);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.x = 2;
    this.y = 4;
    this.listOfChar = ['images/char-horn-girl.png', 'images/char-cat-girl.png', 'images/char-boy.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.sprite = 'images/char-boy.png';
    this.score = 0;
};

// Update method detects collisions with ememies
Player.prototype.update = function() {
    for (var enemy in allEnemies) {
        if (allEnemies[enemy].collide()) {
            this.score = Math.max(0, this.score - 3);
            this.reset();
        }
    }
};

// Draws player on screen
Player.prototype.render = function() {
    if (charSelected && difficultySelected) {
        ctx.font = '20px Verdana';
        ctx.fillText('Score: ' + this.score, 0, 575);
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 + 50);
    } else {
        this.displaySelection();
    }
};

// Renders the options for character avatar and difficulty setting.
Player.prototype.displaySelection = function() {
    if (!charSelected) {
        ctx.font = '30px Verdana';
        ctx.fillText('Please select a character', 50, 175);
        ctx.font = '20px Verdana';
        ctx.fillText('Select with space...', 150, 200);
        ctx.drawImage(Resources.get('images/Selector.png'), this.x * 101, 4 * 83 + 50);
        var length = this.listOfChar.length;
        for (var option = 0; option < length; option++) {
            ctx.drawImage(Resources.get(this.listOfChar[option]), option * 101, 382);
        }
    } else {
        ctx.drawImage(Resources.get(this.sprite), 202, 382);
        ctx.font = '30px Verdana';
        ctx.fillText('Please select a difficulty', 50, 175);
        ctx.font = '20px Verdana';
        ctx.fillText('Select with space...', 150, 200);
        ctx.drawImage(Resources.get('images/Selector.png'), this.x * 101, 299);
        ctx.font = '40px Verdana';
        for (var i = 0; i < 5; i++) {
            ctx.fillText(i + 1, i * 101 + 35, 425);
        }
    }
};

// Reads in player input and behaves accordingly (moving player around screen or selecting option)
Player.prototype.handleInput = function(input) {
    if (input === 'left') {
        this.x = Math.max(this.x - 1, 0);
    } else if (input === 'right') {
        this.x = Math.min(this.x + 1, 4);
    } else if (input === 'up') {
        this.y = this.y - 1;
        if (this.y < 0) {
            this.scorePoint();
        }
    } else if (input === 'down') {
        this.y = Math.min(this.y + 1, 4);
    } else if (input === 'space' && charSelected === false) {
        this.sprite = this.listOfChar[this.x];
        charSelected = true;
        this.reset();
    } else if (input === 'space' && difficultySelected === false) {
        difficulty = this.x + 1;
        difficultySelected = true;
        this.reset();
        spawnEnemies();
        spawnGems();
    }
};

// Increases the players score depending on Gems collected upon reaching the river
Player.prototype.scorePoint = function() {
    var bonusPoint = true;
    allGems.forEach(function(gem) {
        bonusPoint = (bonusPoint && !gem.visible);
    });
    if (bonusPoint === true) {
        this.score += 2;
    }
    this.score++;
    this.reset();
};

// Returns the player to home position and respawns gems
Player.prototype.reset = function() {
    this.x = 2;
    this.y = 4;
    allGems.forEach(function(gem) {
        gem.reset();
    });
};

// Spawns the enemies on the map depending on the difficulty
var spawnEnemies = function() {
    var limit = Math.min(5, difficulty + 2);
    for (var i = 0; i < limit; i++) {
        allEnemies.push(new Enemy());
    }
};

// Creates the Gems for the first time
var spawnGems = function() {
    allGems.push(new GemBlue());
    allGems.push(new GemGreen());
    allGems.push(new GemOrange());
};

// Gem items for added fun to the game
var Gem = function(img) {
    this.x = Math.floor(Math.random() * 5);
    this.y = Math.floor(Math.random() * 3);
    this.visible = true;
    this.sprite = img;
};

// Draws the gems on the map
Gem.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 + 50);
    }
};

// Hides the gem if the player comes in contact with it
Gem.prototype.update = function() {
    if (this.collide()) {
        this.visible = false;
    }
};

// Collision detection for the gem
Gem.prototype.collide = function() {
    if (this.y === player.y && this.x === player.x) {
        return true;
    }
    return false;
};

// Respawns the gem to a random spot behind enemy lines
Gem.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5);
    this.y = Math.floor(Math.random() * 3);
    this.visible = true;
};

// Subclasses for the Blue, Green and Orange gems (created as subclasses in case of future edits to Gem options)
var GemBlue = function() {
    Gem.call(this, 'images/Gem Blue.png');
};
GemBlue.prototype = Object.create(Gem.prototype);
GemBlue.prototype.constructor = GemBlue;

var GemGreen = function() {
    Gem.call(this, 'images/Gem Green.png');
};
GemGreen.prototype = Object.create(Gem.prototype);
GemGreen.prototype.constructor = GemGreen;

var GemOrange = function() {
    Gem.call(this, 'images/Gem Orange.png');
};
GemOrange.prototype = Object.create(Gem.prototype);
GemOrange.prototype.constructor = GemOrange;


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player = new Player();
var allGems = [];

var charSelected = false;
var difficultySelected = false;
var difficulty = 1;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});