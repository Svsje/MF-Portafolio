class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.add.text(200, 250, 'Presiona cualquier tecla para empezar', { fontSize: '24px', fill: '#fff' });
    this.input.keyboard.once('keydown', () => {
      this.scene.start('GameScene');  
    });
  }
}
