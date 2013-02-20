var AsteroidGame = (function() {
  function Asteroid(x, y, radius, color, velocity) {
    var that = this;
    that.posX = x;
    that.posY = y;
    that.radius = radius;
    that.color = color;
    that.velocity = velocity;

    that.offScreen = function() {
      if (that.posX > 600) {
        that.posX = 0
      }
      else if ( that.posX < 0) {
        that.posX = 600
      }
      if (that.posY > 600) {
        that.posY = 0
      }
      else if ( that.posY < 0) {
        that.posY = 600
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
    that.velocity = { x: 0, y: 0 };

    that.getSpeed = function() {
      that.speed = Math.sqrt(Math.pow(that.velocity.x, 2) + Math.pow(that.velocity.y, 2));
    };

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
          return true;
        } else {
          return false;
        }
      });
    };

    that.offScreen = function() {
      if (that.posX > 600) {
        that.posX = 0
      }
      else if ( that.posX < 0) {
        that.posX = 600
      }
      if (that.posY > 600) {
        that.posY = 0
      }
      else if ( that.posY < 0) {
        that.posY = 600
      }
    };

    that.update = function() {
      that.posX += that.velocity.x;
      that.posY += that.velocity.y;
      that.offScreen()
    };

    that.power = function(x, y) {
      that.velocity.x += x;
      that.velocity.y += y;
      if (that.velocity.x > 15) {
        that.velocity.x = 15;
      }
      else if (that.velocity.x < -15) {
        that.velocity.x = -15;
      }
      else if (that.velocity.y > 15) {
        that.velocity.y = 15;
      }
      else if (that.velocity.y < -15) {
        that.velocity.y = -15;
      }
    }

    that.fireMissile = function() {
      that.getSpeed();
      var direction = [(that.velocity.x / that.speed), (that.velocity.y / that.speed)];
      var missile = new Missile(that.posX, that.posY, direction);
      game.missiles.push(missile)
    }

  }

  function Missile(x, y, direction) {
    var that = this;
    that.posX = x;
    that.posY = y;
    that.velocity = { x: (direction[0] * 20), y: (direction[1] * 20)};

    that.draw = function(ctx) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(that.posX, that.posY, 2, 0, Math.PI*2, false);
      ctx.fill();
    };

    that.hitAsteroid = function() {
      return _.find(game.asteroids, function(ast) {
        var distance = Math.sqrt(Math.pow((that.posX - ast.posX), 2) + Math.pow((that.posY - ast.posY), 2));
        if (distance < (2 + ast.radius)) {
          console.log("A HIT");
          return true;
        } else {
          return false;
        }
      });
    };

    that.update = function() {
      that.posX += that.velocity.x;
      that.posY += that.velocity.y;
    };

    that.offScreen = function() {
      if (that.posX > 600 || that.posX < 0) {
        return true;
      }
      else if (that.posY > 600 || that.posY < 0) {
        return true;
      } else {
        return false;
      }
    };

  }


  function Game(ctx) {
    var that = this;
    that.asteroids = [];
    that.missiles = [];
    that.ship = new Ship(300, 300, that);
    var intervalTimer = null;

    that.setAsteroids = function() {
      // for (var i = 0; i < 10; i++) {
        var ast = Asteroid.randomAsteroid();
        that.asteroids.push(ast);
      // }

    };

    that.draw = function(ast) {
      ctx.clearRect(0, 0, 600, 600)
      that.asteroids.forEach(function(ast) {
        ast.draw(ctx);
      })
      that.ship.draw(ctx);
      that.missiles.forEach(function(missile) {
        missile.draw(ctx);
      })
    };

    that.update = function() {
      that.asteroids.forEach(function(asteroid) {
        asteroid.update();
        asteroid.offScreen();
      })

      that.ship.update()
      if (that.ship.isHit()) {
        alert("GAME OVER")
        that.stop();
      }

      that.missiles.forEach(function(missile) {
        missile.update();
        if (missile.offScreen()) {
          that.missiles = _.without(that.missiles, missile);
        }
        var isHit = missile.hitAsteroid();
        if !(isHit === undefined ) {
          that.missiles = _.without(that.missiles, missile);
          // that.asteroids - remove asteroids
        }
      })
    };

    that.bindKeys = function() {
      //currently has only absolute up/down - should be relative, only forward
      key('up', function() {
        that.ship.power(0, -2);
      });
      key('down', function() {
        that.ship.power(0, 2);
      });
      key('left', function() {
        that.ship.power(-2, 0);
      });
      key('right', function() {
        that.ship.power(2, 0);
      });
      key('space', function() {
        that.ship.fireMissile();
      })
    }

    that.stop = function() {
      clearInterval(intervalTimer);
    };

    that.start = function() {
      that.setAsteroids();
      that.bindKeys();
      intervalTimer = setInterval(function() {
        that.update();
        that.draw();
      }, 1000/40);
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
  game.start();

})
