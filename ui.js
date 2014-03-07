(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

  var UI = SnakeGame.UI = function(w, h, scalar) {
    this.board = new SnakeGame.Board(w, h);
    this.board.init();
    this.scalar = scalar;
    this.prevHead = new SnakeGame.Coord(10, 10);
    this.prevTail = new SnakeGame.Coord(1, 1);
  };

  UI.prototype.init = function() {
    var gameEl = $("<div></div>");
    gameEl.addClass('game');
    var that = this;
    gameEl.css({
      'height': that.board.height * that.scalar,
      'width': that.board.width * that.scalar,
      'position': 'absolute',
      'border': '5px black solid'
    });

    $('#main').append(gameEl);

    for (var w = 0, wmax = this.board.width; w < wmax; w++) {
      for (var h = 0, hmax = this.board.height; h < hmax; h++) {
        var el = $('<div></div>');
        el.attr("data-x", w);
        el.attr("data-y", h);
        el.addClass('coord');
        el.css({
          'position': 'absolute',
          'bottom': h*that.scalar,
          'left': w*that.scalar,
          'width': that.scalar,
          'height': that.scalar
        });
        gameEl.append(el);
      }
    }
    that = this;
    this.board.snake.segments.forEach(function(seg){
      that.findByCoord(seg).css({ 'background-color': 'green' });
    });

    $(window).keydown(function(e){
      console.log(e.which);
      keys1 = {
        37: "W",
        38: "N",
        39: "E",
        40: "S",
        82: "R"
      };
      keys2 = {
        65: "W",
        87: "N",
        68: "E",
        83: "S"
      };

      if ( e.which > 36 && e.which < 41 ) {
        that.board.snake.turn(keys1[e.which]);
      } // else if (e.which == 82) {
//         that.resetGame();
//       }
      // else if ([65, 68, 83, 87].indexOf(e.which) !== -1) {
//         that.board.snake2.turn(keys2[e.which]);
//       }
    });

    this.id = setInterval(this.tick.bind(this), 50);
  };

  // UI.prototype.resetGame = function() {
  //   clearInterval(this.id);
  //   this.board.snake = new SnakeGame.Snake();
  //   this.board.init();
  //   this.init();
  // };

  UI.prototype.tick = function(){
    var cont = this.step();
    if (!cont) {
      clearInterval(this.id);
    }
  };

  UI.prototype.render = function(remove) {
    this.findByCoord(this.board.apple).css({
      'background-color': 'red',
      'border-radius': "50%"
    });

    var head = this.board.snake.getHead();
    this.findByCoord(this.prevHead).css({
      'border-radius': "0%"
    });
    this.prevHead = new SnakeGame.Coord(head.x, head.y);

    this.findByCoord(head).css({
      'background-color': 'green',
      'border-radius': "0%"
    });

    switch (this.board.snake.dir) {
    case "N":
      this.findByCoord(head).css({
        "border-top-left-radius": "50%",
        "border-top-right-radius": "50%"
      });
      break;
    case "S":
      this.findByCoord(head).css({
        "border-bottom-left-radius": "50%",
        "border-bottom-right-radius": "50%"
      });
      break;
    case "E":
      this.findByCoord(head).css({
        "border-top-right-radius": "50%",
        "border-bottom-right-radius": "50%"
      });
      break;
    case "W":
      this.findByCoord(head).css({
        "border-top-left-radius": "50%",
        "border-bottom-left-radius": "50%"
      });
      break;
    }

    var tail = this.board.snake.segments[0]
    this.prevTail = new SnakeGame.Coord(head.x, head.y);
    var beforeTail = this.board.snake.segments[1]
    var diff = tail.minusCoord(beforeTail);

    if (diff.x === 0 && diff.y === 1) {
      this.findByCoord(tail).css({
        "border-top-left-radius": "50%",
        "border-top-right-radius": "50%"
      });
    } else if (diff.x === 0 && diff.y === -1) {
      this.findByCoord(tail).css({
        "border-bottom-left-radius": "50%",
        "border-bottom-right-radius": "50%"
      });
    } else if (diff.x === 1 && diff.y === 0) {
      this.findByCoord(tail).css({
        "border-top-right-radius": "50%",
        "border-bottom-right-radius": "50%"
      });
    } else if (diff.x === -1 && diff.y === 0) {
      this.findByCoord(tail).css({
        "border-top-left-radius": "50%",
        "border-bottom-left-radius": "50%"
      });
    }



    if (remove !== null) {
      this.findByCoord(remove).css({ 'background-color': 'transparent' });
    }
  };

  UI.prototype.step = function() {
    var remove = this.board.isApple();
    if (this.board.lost()) {
      return false;
    } else {
      this.render(remove);
      return true;
    }
  };

  UI.prototype.findByCoord = function(seg) {
    return $('.coord[data-x="' + seg.x + '"][data-y="' + seg.y + '"]');
  };

})(this);