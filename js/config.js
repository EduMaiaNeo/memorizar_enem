const config = {
    type: Phaser.AUTO,
    width: 360, // Largura fixa
    height: 640, // Altura fixa (proporção 9:16)
    parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Boot, GameScene],
    backgroundColor: '#999999', // Fundo cinza médio
    fontFamily: 'Merriweather',
    buttonColor: '#D3D3D3' // Cinza claro
};

const game = new Phaser.Game(config);
