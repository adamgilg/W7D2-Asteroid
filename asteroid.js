var AsteroidGame = (function() {
  function Asteroid(x, y, radius, color, velocity) {
    var that = this;
    this.posx = x;
    this.posy = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
// this offscreen method does not work yet
    this.offScreen = function() {
      if (that.posx > 600 || that.posx < 0) {
        return true
      }
      else if (that.posy > 600 || that.posy < 0) {
        return true
      }
      else {
        return false
      }
    }


    this.draw = function(ctx) {
      ctx.fillStyle = that.color;
      ctx.beginPath();
      ctx.arc(that.posx, that.posy, that.radius, 0, Math.PI*2, false);
      ctx.fill();
    };

    this.update = function() {
      that.posx += that.velocity[0];
      that.posy += that.velocity[1];
    }

  }

  Asteroid.randomAsteroid = function() {

    var posx = Math.floor((Math.random()*600)+1);
    var posy = Math.floor((Math.random()*600)+1);
    var veloX = (Math.random()*10)-5;
    var veloY = (Math.random()*10)-5;
    var velocity = [veloX, veloY]

    return new Asteroid(posx, posy, 20, 'red', velocity)
  }

  function Game(ctx) {
    var that = this;
    this.asteroids = [];


    this.initialize = function() {
      for (var i = 0; i < 10; i++) {
        var ast = Asteroid.randomAsteroid();
        that.asteroids.push(ast);
      }
    };

    this.draw = function(ast) {
      ctx.clearRect(0, 0, 600, 600)
      that.asteroids.forEach(function(ast) {
        ast.draw(ctx);
      })
    };

    this.update = function() {
      that.asteroids.forEach(function(asteroid) {
        asteroid.update();
        // if (asteroid.offScreen) {
        //   // not sure how to be removing these yet - offScreen is not currently functional
        //   // that.asteroids.remove(i)
        // }
      })
    };

    this.start = function() {
      setInterval(function() {
        that.update();
        that.draw();
      }, 1000/40);
    }
  }


  return {
    Game: Game
  }
})();

$(function(){
  var canvas = document.getElementById('game-screen');
  var ctx = canvas.getContext('2d');
  game = new AsteroidGame.Game(ctx)
  game.initialize();
  game.start();

})
