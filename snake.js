(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var Snake = SnakeGame.Snake = function () {
    this.dir = "N";
    this.segments = [];
    this.axis = true;
  };

  Snake.prototype.dirAxis = {
    "N" : true,
    "S" : true,
    "E" : false,
    "W" : false
  };

  Snake.prototype.dirVecs = {
    "N" : [0, 1],
    "S" : [0, -1],
    "E" : [1, 0],
    "W" : [-1, 0]
  };

  Snake.prototype.move = function(apple) {
    if (apple) {
      var removed = null;
    } else { var removed = this.segments.shift(); }
    this.segments.push(_.last(this.segments).clone());
    var vec = this.dirVecs[this.dir]
    _.last(this.segments).plus(vec[0], vec[1]);
    this.axis = this.dirAxis[this.dir];
    return removed;
  };

  Snake.prototype.turn = function(dir) {
    if (this.dirAxis[dir] !== this.axis) { this.dir = dir; }
  };

  Snake.prototype.getHead = function() {
    return _.last(this.segments);
  };



  var Coord = SnakeGame.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.plus = function(x, y) {
    this.x += x;
    this.y += y;
  };

  Coord.prototype.minusCoord = function(coord) {
    return new Coord(this.x - coord.x, this.y - coord.y);
  }

  Coord.prototype.clone = function() {
    return new Coord(this.x, this.y);
  };


  var Board = SnakeGame.Board = function (height, width) {
    this.snake = new Snake();
    this.height = height;
    this.width = width;
    this.randomApple();
  };

  Board.prototype.randomApple = function() {
    var x = this.getRandomInt(0, this.width);
    var y = this.getRandomInt(0, this.height);
    this.apple = new Coord(x, y);
  }

  Board.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  Board.prototype.init = function() {
    var h = this.height/2;
    var w = this.width/2;
    for (var i = 0; i < 5; i++) {
      var seg = new Coord(w, h+i)
      this.snake.segments.push(seg);
    }
  };

  Board.prototype.lost = function() {
    return this.snakeOutOfBounds() || this.snakeEatingSelf();
  }

  Board.prototype.snakeOutOfBounds = function() {
    var head = this.snake.getHead();
    return (head.x < 0 || head.x > this.width || head.y < 0 || head.y > this.height);
  };

  Board.prototype.snakeEatingSelf = function() {
    var head = this.snake.getHead();
    var body = this.snake.segments.slice(0, this.snake.segments.length-1);
    var len = body.length;
    for (var i = 0; i < len; i++) {
      var seg = body[i];
      if (seg.x === head.x && seg.y === head.y) { return true; }
    }
    return false;
  };

  Board.prototype.isApple = function() {
    var head = this.snake.getHead();
    var apple = false;
    if (head.x === this.apple.x && head.y === this.apple.y) {
      apple = true;
      this.randomApple();
    }
    return this.snake.move(apple);

  };

})(this);