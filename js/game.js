class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        this.materiaSelecionada = null;
        this.faseAtual = 1;
        this.pontuacao = 0;
        this.questaoAtual = null;
        this.alternativas = [];
        this.botoesAlternativas = [];
    }

    init(data) {
        if (data && data.materia) {
            this.materiaSelecionada = data.materia;
        }
    }


    preload() {
        // Carregar assets (imagens, sons, etc.)
    }


    create() {
        this.cameras.main.setBackgroundColor(config.backgroundColor);

        if (!this.materiaSelecionada) {
            this.criarTelaSelecaoMateria();
        } else {
            this.criarTelaJogo();
        }
    }

    criarTelaSelecaoMateria() {
        const materias = ['Matemática', 'Linguagem', 'Natureza', 'Humanas', 'Redação'];
        let buttonHeight = 100; // Altura dos botões
        let startY = (this.cameras.main.height - (materias.length * buttonHeight)) / 2; // Posicionamento vertical centralizado

        materias.forEach((materia, index) => {
            const button = this.add.text(this.cameras.main.width / 2, startY + (index * buttonHeight), materia, {
                fontFamily: config.fontFamily,
                fontSize: '32px',
                color: '#000',
                backgroundColor: config.buttonColor,
                padding: {
                    x: 20,
                    y: 10
                },
                align: 'center'
            })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.materiaSelecionada = materia;
                    this.scene.restart({
                        materia: this.materiaSelecionada
                    }); // Reinicia a cena enviando a matéria selecionada
                });

            // Adiciona estilo de relevo (simples)
            button.setShadow(2, 2, '#333', 2, false, true);
        });
    }


    criarTelaJogo() {
        // Interface do Jogo
        this.add.text(20, 20, `${this.materiaSelecionada}`, {
            fontFamily: config.fontFamily,
            fontSize: '24px',
            color: '#fff'
        });

        this.barraNivel = this.add.graphics();
        this.barraNivel.fillStyle(0x333333, 1);
        this.barraNivel.fillRect(10, 60, 200, 10);

        this.nivelTexto = this.add.text(220, 55, `Nível ${this.faseAtual}`, {
            fontFamily: config.fontFamily,
            fontSize: '20px',
            color: '#fff'
        });

        this.caixaQuestao = this.add.rectangle(this.cameras.main.width / 2, 200, this.cameras.main.width * 0.8, 150, 0x666666);
        this.caixaQuestao.setOrigin(0.5);

        this.textoQuestao = this.add.text(this.cameras.main.width / 2, 200, 'Carregando...', {
            fontFamily: config.fontFamily,
            fontSize: '20px',
            color: '#fff',
            wordWrap: {
                width: this.cameras.main.width * 0.7
            },
            align: 'center'
        }).setOrigin(0.5);

        this.criarBotoesAlternativas();
        this.carregarQuestao();
    }

    criarBotoesAlternativas() {
        const buttonWidth = this.cameras.main.width * 0.8;
        const buttonHeight = 60;
        let startY = 350; // Posição inicial vertical dos botões

        for (let i = 0; i < 5; i++) {
            const button = this.add.rectangle(this.cameras.main.width / 2, startY + (i * buttonHeight), buttonWidth, buttonHeight, config.buttonColor);
            button.setStrokeStyle(2, 0x000000); // Adiciona borda preta
            button.setOrigin(0.5);
            button.setInteractive();

            const textoBotao = this.add.text(this.cameras.main.width / 2, startY + (i * buttonHeight), '', {
                fontFamily: config.fontFamily,
                fontSize: '18px',
                color: '#000'
            }).setOrigin(0.5);

            button.on('pointerdown', () => this.verificarResposta(i));

            this.botoesAlternativas.push({
                button: button,
                text: textoBotao
            });
        }
    }

    carregarQuestao() {
        // Substitua pelos IDs e nomes corretos
        const sheetName = `Fase ${this.faseAtual}`;

        obterDadosDoGoogleSheets(sheetName, this.materiaSelecionada)
            .then(data => {
                if (data && data.length > 0) {
                    // Escolhe uma questão aleatória
                    this.questaoAtual = data[Math.floor(Math.random() * data.length)];

                    // Define o texto da questão
                    this.textoQuestao.setText(this.questaoAtual.questao);

                    // Prepara as alternativas
                    this.alternativas = [
                        this.questaoAtual.resposta_correta,
                        this.questaoAtual.alternativa_1,
                        this.questaoAtual.alternativa_2,
                        this.questaoAtual.alternativa_3,
                        this.questaoAtual.alternativa_4
                    ];

                    // Embaralha as alternativas
                    Phaser.Utils.Array.Shuffle(this.alternativas);

                    // Atualiza o texto dos botões
                    for (let i = 0; i < this.botoesAlternativas.length; i++) {
                        this.botoesAlternativas[i].text.setText(this.alternativas[i]);
                    }
                } else {
                    this.textoQuestao.setText('Nenhuma questão encontrada nesta fase.');
                }
            })
            .catch(error => {
                console.error("Erro ao carregar a questão:", error);
                this.textoQuestao.setText('Erro ao carregar a questão.');
            });
    }

    verificarResposta(indiceSelecionado) {
        if (this.alternativas[indiceSelecionado] === this.questaoAtual.resposta_correta) {
            // Resposta correta
            this.pontuacao += 10;
            console.log("Resposta correta! Pontuação:", this.pontuacao);
        } else {
            // Resposta incorreta
            console.log("Resposta incorreta!");
        }

        this.avancarFase();
    }

    avancarFase() {
        if (this.faseAtual < 5) {
            this.faseAtual++;
            this.nivelTexto.setText(`Nível ${this.faseAtual}`);
            this.carregarQuestao(); // Carrega a próxima questão
        } else {
            // Fim do jogo
            this.textoQuestao.setText('Parabéns! Você completou todas as fases!');
        }
    }

}
