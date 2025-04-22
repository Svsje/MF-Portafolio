class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    this.add.text(300, 200, 'GAME OVER', { fontSize: '48px', fill: '#ff0000' });
    this.add.text(280, 280, `Puntos: ${this.finalScore}`, { fontSize: '32px', fill: '#fff' });
    this.add.text(220, 350, 'Presiona cualquier tecla para volver al inicio', { fontSize: '20px', fill: '#fff' });

    this.input.keyboard.once('keydown', () => {
      this.scene.start('StartScene');
    });
  }
}
