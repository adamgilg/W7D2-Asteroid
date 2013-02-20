var AsteroidGame = (function() {
  function Asteroid(x, y, radius, color, velocity) {
    var that = this;
    that.posX = x;
    that.posY = y;
    that.radius = radius;
    that.color = color;
    that.velocity = velocity;
// that offscreen method does not work yet
    that.offScreen = function() {
      if (that.posX > 600 || that.posX < 0) {
        return true
      }
      else if (that.posY > 600 || that.posY < 0) {

        return true
      }
      else {
        return false;
      }
    }


    that.draw = function(ctx) {
      ctx.fillStyle = that.color;
      ctx.beginPath();
      ctx.arc(that.posX, that.posY, that.radius, 0, Math.PI*2, false);
      ctx.fill();
    };

    that.update = function() {
      that.posX += that.velocity[0];
      that.posY += that.velocity[1];
    }

  }


  Asteroid.randomAsteroid = function() {

    var posX = Math.floor((Math.random()*600)+1);
    var posY = Math.floor((Math.random()*600)+1);
    var veloX = (Math.random()*10)-5;
    var veloY = (Math.random()*10)-5;
    var velocity = [veloX, veloY]

    return new Asteroid(posX, posY, 20, 'red', velocity)
  }


  function Ship(x, y, game) {
    var that = this;
    that.posX = x;
    that.posY = y;
    that.velocity = [-2, -2]

    that.draw = function(ctx) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(that.posX, that.posY, 10, 0, Math.PI*2, false)
      ctx.fill();
    };

    that.isHit = function() {
      return _.some(game.asteroids, function(ast) {
        var distance = Math.sqrt(Math.pow((that.posX - ast.posX), 2) + Math.pow((that.posY - ast.posY), 2));
        if (distance < (10 + ast.radius)) {
          console.log("A HIT");
          return true;
        } else {
          return false;
        }
      });
    };

    that.update = function() {
      that.posX += that.velocity[0];
      that.posY += that.velocity[1];
    };
  }


  function Game(ctx) {
    var that = this;
    that.asteroids = [];
    that.ship = new Ship(300, 300, that);
    var intervalTimer = null;

    that.initialize = function() {
      for (var i = 0; i < 10; i++) {
        var ast = Asteroid.randomAsteroid();
        that.asteroids.push(ast);
      }
    };

    that.draw = function(ast) {
      ctx.clearRect(0, 0, 600, 600)
      that.asteroids.forEach(function(ast) {
        ast.draw(ctx);
      })
      that.ship.draw(ctx);
    };

    that.update = function() {
      that.asteroids.forEach(function(asteroid) {
        asteroid.update();
        if (asteroid.offScreen()) {
          that.asteroids = _.without(that.asteroids, asteroid);
        }
      })
      that.ship.update()

      if (that.ship.isHit()) {
        alert("GAME OVER")
        that.stop();
      }
    };

    that.start = function() {
      intervalTimer = setInterval(function() {
        that.update();
        that.draw();
      }, 1000/40);
    };

    that.stop = function() {
      clearInterval(intervalTimer);
    };
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
