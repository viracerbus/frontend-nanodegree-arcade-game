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
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.movement * dt;
    if (this.x >= 505) {
        this.reset();
    };
    if (this.collide()) {
        //-------------------------------------------CAN ADD MORE HERE---------------------------------------------
    }
}

Enemy.prototype.collide = function() {
    if (this.y === player.y && Math.abs(this.x - player.x * 101) <= 50) {
        return true;
    }
    return false;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y * 83 + 50);
}

Enemy.prototype.reset = function() {
    this.movement = Math.floor(Math.random() * this.baseSpeed * 50 + this.baseSpeed * 50);
    this.y = Math.floor(Math.random() * 3);
    this.x = Math.floor(Math.random() * (-404) - 101);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.x = 2;
    this.y = 4;
    this.listOfChar = ['images/char-horn-girl.png', 'images/char-cat-girl.png', 'images/char-boy.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.sprite = 'images/char-boy.png';
    this.score = 0;
}

Player.prototype.update = function () {
    for (var enemy in allEnemies) {
        if (allEnemies[enemy].y === this.y && Math.abs(allEnemies[enemy].x - this.x * 101) <=50) {
            this.score = Math.max(0, this.score - 3);
            this.reset();
        }
    }
}

Player.prototype.render = function() {
    if (charSelected && difficultySelected) {
        ctx.font = '20px Verdana';
        ctx.fillText('Score: ' + this.score, 0, 575);
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 + 50);
    }
    else if (!charSelected) {
        ctx.font = '30px Verdana';
        ctx.fillText('Please select a character', 50, 175);
        ctx.font = '20px Verdana';
        ctx.fillText('Select with space...', 150, 200);
        ctx.drawImage(Resources.get('images/Selector.png'), this.x * 101, 4 * 83 + 50);
        for (var option in this.listOfChar) {
            ctx.drawImage(Resources.get(this.listOfChar[option]), option * 101, 382);
        }
    }
    else {
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
}

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
}

Player.prototype.scorePoint = function () {
    bonusPoint = true;
    for (var gem in allGems) {
        bonusPoint = (bonusPoint && !allGems[gem].visible);
    }
    if (bonusPoint === true) {
        this.score += 2;
    } 
    this.score ++;
    this.reset();
}

Player.prototype.reset = function() {
    this.x = 2;
    this.y = 4;
    allGems.forEach(function(gem) {
        gem.reset();
    });
}

var spawnEnemies = function () {
    allEnemies.push(new Enemy());
    allEnemies.push(new Enemy());
    allEnemies.push(new Enemy());
    if (difficulty > 1) {
        allEnemies.push(new Enemy());
        if (difficulty > 2) {
            allEnemies.push(new Enemy());
        }
    }
}

var spawnGems = function () {
    allGems.push(new GemBlue());
    allGems.push(new GemGreen());
    allGems.push(new GemOrange());
}

var Gem = function (img) {
    this.x = Math.floor(Math.random() * 5);
    this.y = Math.floor(Math.random() * 3);
    this.visible = true;
    this.sprite = img;
}

Gem.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 + 50);
    }
}

Gem.prototype.update = function() {
    if (this.collide()) {
        this.visible = false;
    }
}

Gem.prototype.collide = function() {
    if (this.y === player.y && this.x === player.x) {
        return true;
    }
    return false;
}

Gem.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5);
    this.y = Math.floor(Math.random() * 3);
    this.visible = true;
}

var GemBlue = function() {
    Gem.call(this, 'images/Gem Blue.png');
}
GemBlue.prototype = Object.create(Gem.prototype);

var GemGreen = function() {
    Gem.call(this, 'images/Gem Green.png');
}
GemGreen.prototype = Object.create(Gem.prototype);

var GemOrange = function() {
    Gem.call(this, 'images/Gem Orange.png');
}
GemOrange.prototype = Object.create(Gem.prototype);


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

