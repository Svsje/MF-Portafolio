class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.multiShot = false;
  }

  preload() {
    this.load.image('player', './assets/sprites/player.png');
    this.load.image('bullet', './assets/sprites/bullet.png');
    this.load.image('alien', './assets/sprites/invader.png');
    this.load.image('enemyBullet', './assets/sprites/enemy-bullet.png');
    this.load.image('powerup', './assets/sprites/powUp.png');

    this.load.audio('playerShoot', './assets/audio/shoot.wav');
    this.load.audio('enemyShoot', './assets/audio/shoot-enemy.wav');
    this.load.audio('explosion', './assets/audio/explosion.wav');
  }

  create() {
    this.player = this.physics.add.sprite(400, 550, 'player').setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image });
    this.lastFired = 0;

    this.enemyBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image });
    this.enemyFireTimer = this.time.addEvent({
      delay: 1000,
      callback: this.enemyShoot,
      callbackScope: this,
      loop: true
    });

    this.createAliens();
    this.spawnPowerupTimer();

    this.playerShootSound = this.sound.add('playerShoot');
    this.enemyShootSound = this.sound.add('enemyShoot');
    this.explosionSound = this.sound.add('explosion');

    this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '20px', fill: '#fff' });
    this.livesText = this.add.text(16, 40, 'Vidas: 3', { fontSize: '20px', fill: '#fff' });

    this.physics.add.overlap(this.bullets, this.aliens, this.hitAlien, null, this);
    this.physics.add.overlap(this.enemyBullets, this.player, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.aliens, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
  }

  createAliens() {
    if (this.aliens && this.aliens.clear) {
      this.aliens.clear(true, true);
    }

    this.aliens = this.physics.add.group();
    const cols = 10;
    const rows = 3 + this.level;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.aliens.create(80 + x * 60, 100 + y * 50, 'alien');
      }
    }

    this.enemyDirection = 1;
    this.physics.add.overlap(this.bullets, this.aliens, this.hitAlien, null, this);
  }

  spawnPowerupTimer() {
    this.powerups = this.physics.add.group();
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        const powerup = this.powerups.create(Phaser.Math.Between(50, 750), 0, 'powerup');
        powerup.setVelocityY(100);
      },
      loop: true
    });
  }

  update(time) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.space.isDown && time > this.lastFired) {
      this.firePlayerBullet();
      this.lastFired = time + 300;
    }

    this.bullets.children.each(b => {
      if (b.active && b.y < 0) b.setActive(false).setVisible(false);
    });

    this.enemyBullets.children.each(b => {
      if (b.active && b.y > 600) b.setActive(false).setVisible(false);
    });

    this.powerups.children.each(p => {
      if (p.active && p.y > 600) p.destroy();
    });

    let reachedEdge = false;
    let alienReachedBottom = false;

    this.aliens.children.each(alien => {
      alien.x += this.enemyDirection;

      if (alien.x >= 760 || alien.x <= 40) {
        reachedEdge = true;
      }

      if (alien.y >= 540) {
        alienReachedBottom = true;
      }
    });

    if (reachedEdge) {
      this.enemyDirection *= -1;
      this.aliens.children.each(alien => { alien.y += 10; });
    }

    if (alienReachedBottom) {
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    if (this.aliens.countActive() === 0) {
      this.level++;
      this.createAliens();
    }
  }

  firePlayerBullet() {
    const shoot = (xOffset = 0) => {
      const bullet = this.bullets.get(this.player.x + xOffset, this.player.y - 20, 'bullet');
      if (bullet) {
        bullet.setActive(true).setVisible(true);
        bullet.body.velocity.y = -400;
        this.playerShootSound.play();
      }
    };

    shoot();
    if (this.multiShot) {
      shoot(-15);
      shoot(15);
    }
  }

  hitAlien(bullet, alien) {
    bullet.setActive(false).setVisible(false);
    alien.disableBody(true, true);
    this.explosionSound.play();

    this.score += 10;
    this.scoreText.setText('Puntos: ' + this.score);
  }

  hitPlayer(player, object) {
    object.disableBody(true, true);
    this.explosionSound.play();

    this.lives--;
    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }
    this.livesText.setText('Vidas: ' + this.lives);
  }

  enemyShoot() {
    const aliensArray = this.aliens.getChildren().filter(a => a.active);
    if (aliensArray.length === 0) return;

    const shooter = Phaser.Utils.Array.GetRandom(aliensArray);
    const bullet = this.enemyBullets.get(shooter.x, shooter.y + 20, 'enemyBullet');

    if (bullet) {
      bullet.setActive(true).setVisible(true);
      bullet.enableBody(true, shooter.x, shooter.y + 20, true, true);
      bullet.body.setVelocityY(150 + this.level * 10);
      this.enemyShootSound.play();
    }
  }

  collectPowerup(player, powerup) {
    powerup.destroy();
    this.multiShot = true;
    this.time.delayedCall(8000, () => this.multiShot = false);
  }
}
