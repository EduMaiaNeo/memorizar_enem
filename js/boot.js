class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'Boot'
        });
    }

    preload() {
        this.load.image('logo', 'assets/img/logo.png'); // Carrega o logo
    }

    create() {
        this.scene.start('GameScene'); // Inicia a cena principal
    }
}
