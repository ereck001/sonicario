var canvas,rot,img,record,ctx, ALTURA, LARGURA, maxPulos = 3,velocidade = 6
var estadoAtual = 0
var estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
}
var chao = {
    y:550,
    x:0,
    altura: 50,

    atualiza: function(){
      this.x -= velocidade
      if(this.x <= -30){
          this.x = 0
      }
    },
    
    desenha: function(){
        spriteChao.desenha(this.x,this.y)
        spriteChao.desenha(this.x + spriteChao.largura,this.y)
    }
}
var bloco ={
    x: 50,
    y:0,
    altura: spriteBoneco.altura,
    largura:spriteBoneco.largura,
    gravidade:1.5,
    velocidade:0,
    forcaPulo:25,
    qntPulos:0,
    score:0,
    rotacao:0,

    atualiza:function(){
        this.velocidade += this.gravidade
        this.y += this.velocidade
        this.rotacao += Math.PI / 180 * velocidade

        if(this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
            this.y = chao.y - this.altura
            this.qntPulos = 0
            this.velocidade = 0
        }
    },
    pula: function(){
       if(this.qntPulos < maxPulos) {this.velocidade = - this.forcaPulo
        this.qntPulos++}
    },
    reset: function(){
        this.velocidade = 0
        this.y = 0
        this.score = 0
    },

    desenha: function() {
        ctx.save()
        ctx.translate(this.x + this.largura / 2,this.y + this.altura / 2)
        if(rot == 1){ctx.rotate(this.rotacao)}
        spriteBoneco.desenha(-this.largura / 2,- this.altura / 2)
        ctx.restore()
    }
}
var obstaculos={
    _obs: [],
    _sprites:[redOstacle,pinkOstacle,blueOstacle,greenOstacle,yellowOstacle],
    tempoInsere:0,

    insere: function(){
        let n = Math.floor(31 * Math.random())
        this._obs.push({
            x: LARGURA,
            y:chao.y - Math.floor(20 + Math.random() * 100),
            largura: 30 + Math.floor(30),
            //altura: 30 + Math.floor(120 * Math.random()),
            sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
        })

        this.tempoInsere = 40 + n
    },
    atualiza: function(){
        if (this.tempoInsere == 0 ){
            this.insere()
        }else{
            this.tempoInsere--
        }
    
        for(var i = 0, tam = this._obs.length;i< tam ; i++){
            var obs = this._obs[i]
            obs.x -= velocidade

            if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x &&
                 bloco.y + bloco.altura >= obs.y){
                estadoAtual = estados.perdeu
            }else if(obs.x == 0) {
                bloco.score++
            }else if(obs.x <= -obs.largura){
                this._obs.splice(i,1)
                tam--
                i--
            }
        }
    },

    limpa: function(){
        this._obs = []
    },
    desenha:function(){
        for(var i = 0, tam = this._obs.length; i < tam ;i++){
            var obs = this._obs[i]
            obs.sprite.desenha(obs.x,obs.y)
        }
    }
}

function click(event){
    if (estadoAtual == estados.jogando){
         bloco.pula()
    }else if (estadoAtual == estados.jogar){
        estadoAtual = estados.jogando
    }else if (estadoAtual == estados.perdeu && bloco.y >= 5 * ALTURA){
        estadoAtual = estados.jogar
        obstaculos.limpa()
        bloco.reset() 
    }
}
function main(){
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth
    if(LARGURA >= 500){
        LARGURA = 600
        ALTURA = 600
    }
    canvas = document.createElement("canvas")
    canvas.width = LARGURA
    canvas.height = ALTURA
    canvas.style.border = "1px solid #000"

    ctx = canvas.getContext("2d")
    document.body.appendChild(canvas)
    document.addEventListener("mousedown", click)

    estadoAtual == estados.jogar

    record = localStorage.getItem("record")
    if (record == null){
        record = 0
    }

    img = new Image()
    img.src = "imagens/sheet.png"

    roda()
}
function roda(){
    atualiza()
    desenha()

    window.requestAnimationFrame(roda)
}
function atualiza(){
    
    bloco.atualiza()
    if (estadoAtual == estados.jogando){        
        obstaculos.atualiza()    
        chao.atualiza()
        //bloco.atualiza() 
 } 
}
function desenha(){
    bg.desenha(0,0)
  

    ctx.fillStyle = "#fff"
    ctx.font = "50px Arial"
    ctx.fillText(bloco.score,25,58)

    if (estadoAtual == estados.jogar){
        jogar.desenha(LARGURA/2-jogar.largura/2,ALTURA/2-jogar.altura/2)

    }else if (estadoAtual == estados.perdeu){
        perdeu.desenha(LARGURA/2-perdeu.largura/2,ALTURA/2-perdeu.altura/2)
        spriteRecord.desenha(LARGURA/2-perdeu.largura/2,ALTURA/2-perdeu.altura/2-50)
        ctx.fillStyle = "orange"
        ctx.font = "70px Arial"
        if(bloco.score < 100){
            ctx.fillText(bloco.score,405,455)
        }else if(bloco.score <= 1000 && bloco.score>99){
        ctx.fillText(bloco.score,425,455)
        }
        if(bloco.score >= record) {
            ctx.fillText(record, 430, 150) 
            record = bloco.score
            let blc =`NOVO RECORD!`
            ctx.fillStyle = "green"
            ctx.fillText(blc,35,510)

        }else if(bloco.score < record){
            ctx.fillText(record, 430, 150)
           
        }
        rot = 0
       
    }else if (estadoAtual == estados.jogando){
    obstaculos.desenha()
    rot = 1
}
    
    bloco.desenha()
    chao.desenha()
}


main()