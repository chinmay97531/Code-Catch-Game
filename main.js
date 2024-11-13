import './style.css'
import Phaser, { Physics } from 'phaser'

const speedDown = 200
const sizes = {
  width: 500,
  height: 500
};

const gameStartDiv = document.querySelector('#gameStartDiv');
const gameStartBtn = document.querySelector('#startGameButton');
const gameEndDiv = document.querySelector('#gameEndDiv');
const gameWinLoseSpan = document.querySelector('#gameWinLoseSpan');
const gameEndScoreSpan = document.querySelector('#gameEndScoreSpan');

class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timeEvent;
    this.remainingTime;
    this.codeMusic;
    this.bgMusic;
    this.emitter;
  }

  preload() {
    this.load.image('dev', './assests/developer.png');
    this.load.image('laptop', './assests/laptop.jpeg');
    this.load.image('code', './assests/funcode.png');
    this.load.image('catch', './assests/coding.jpeg');
    this.load.audio('code', './assests/beepSound.mp3');
    this.load.audio('bgmusic', './assests/Tu_Hai_Kahan.mp3');
  }
  create() {
    this.scene.pause("gameScene");

    this.codeMusic = this.sound.add('code');
    this.bgMusic = this.sound.add('bgmusic');
    this.bgMusic.play();

    this.add.image(0, 0, 'dev').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
    this.player = this.physics.add.image(0, 380, 'laptop').setOrigin(0, 0).setScale(0.4);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(200, 20).setOffset(10, 70);

    this.target = this.physics.add.image(0, 50, 'code').setOrigin(0, 0).setScale(0.15);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width-120 , 10, 'Score: 0', { fontSize: '25px Arial', fill: '#000000' });
    this.textTime = this.add.text(10 , 10, 'Remaining Time: 00', { fontSize: '25px Arial', fill: '#000000' });

    this.timeEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    this.emitter = this.add.particles(0, 0, 'catch', {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 0.05,
      duration: 100,
      emitting: false
    });
  }
  update() {
    this.remainingTime = this.timeEvent.getRemainingSeconds();
    this.textTime.setText('Remaining Time: ' + Math.round(this.remainingTime).toString());

    if(this.target.y >= sizes.height) {
      this.target.setY(50);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    }
    else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    }
    else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX()  {
    return Math.floor(Math.random() * sizes.width);
  }
  
  targetHit() {
    this.codeMusic.play();
    this.emitter.setPosition(this.target.x, this.target.y);
    this.emitter.explode(5);
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText('Score: ' + this.points);
    this.textTime.setText('Remaining Time: ' + this.points);
  }
  
  gameOver() {
    console.log('Game Over 💀');
    this.sys.game.destroy(true);
    if(this.points > 12) {
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = 'Win! 🎉🐶';
    }
    else{
      gameEndScoreSpan.textContent = this.points;
      gameWinLoseSpan.textContent = 'Loose! 😭💀';
    }
    gameEndDiv.style.display = 'flex';
  }
}

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: speedDown },
            debug: true
        }
    },
    scene: [GameScene]
}

const game = new Phaser.Game(config)

gameStartBtn.addEventListener('click', () => {
  gameStartDiv.style.display = 'none';
  game.scene.resume('gameScene');
});