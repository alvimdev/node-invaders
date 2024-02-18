const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const score_s = document.querySelector('#score-s')
console.log(score_s)

canvas.width = innerWidth
canvas.height = innerHeight

var isGamePaused = false;

class Grid {
    constructor() {
        this.pos = {
            x: 0,
            y: 0
        }

        this.vel = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 10)
        const rows = Math.floor(Math.random() * 6 + 5)

        this.width = columns * 30

        for (let X = 0; X < columns; X++) {
            for (let Y = 0; Y < rows; Y++)
                this.invaders.push(new Invaders({
                    pos: {
                        x: X * 30 ,
                        y: Y * 30
                    }
                }))
        }
        
    }

    update(gridIndex) {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        this.vel.y = 0

        if (this.pos.x + this.width >= canvas.width || this.pos.x <= 0){
            this.vel.x = -this.vel.x
            this.vel.y = 20
        }
        
        this.invaders.forEach((invader, i) => {
            invader.update({ vel: this.vel });

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.pos.y - projectile.radius <= invader.pos.y + invader.height &&
                    projectile.pos.x >= invader.pos.x &&
                    projectile.pos.x <= invader.pos.x + invader.width
                ) {
                    // Remover invasor e projetil
                    this.invaders.splice(i, 1);
                    projectiles.splice(j, 1);

                    score += 100
                    score_s.innerHTML = score
                }
            });
        });
    }
}

class Invaders {
    constructor({pos}) {

        this.vel = {
            x: 0,
            y: 0
        }

        const img = new Image()
        img.src = '../assets/invader.png'
        img.onload = () => {
            const scale = 2.4/100
            this.img = img
            this.width = img.width * scale
            this.height = img.height * scale

            this.pos = {
                x: pos.x,
                y: pos.y
            }
        }

        this.shootInterval = Math.floor(Math.random() * 2000 + 1000); // Intervalo de tempo entre os tiros (em milissegundos)
        this.framesSinceLastShot = 0; // Contador para controlar o intervalo entre os tiros
    }

    shoot() {
        invaderProjectiles.push(
            new InvaderProjectile({
                pos: {
                    x: this.pos.x + this.width / 2,
                    y: this.pos.y + this.height
                },
                vel: {
                    x: 0,
                    y: 5
                }
            })
        );
        console.log(projectiles.length);
    }

    draw() {
        c.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);
    }
    
    update({ vel }) {
        if (this.img) {
            this.draw();
            this.pos.x += vel.x;
            this.pos.y += vel.y;

            // Incrementa o contador de frames desde o último tiro
            this.framesSinceLastShot++;

            // Se o contador atingir o intervalo de tiro, dispara um projétil
            if (this.framesSinceLastShot >= this.shootInterval) {
                this.shoot();
                this.framesSinceLastShot = 0; // Reinicia o contador
            }
        }
    }
}

class InvaderProjectile {
    constructor({ pos, vel }) {
        this.pos = pos;
        this.vel = vel;

        this.radius = 3;
        this.color = 'white';
    }

    draw() {
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        if (this.vel) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
        }
    }
}

class Player {
    constructor() {

        this.vel = {
            x: 0,
            y: 0
        }

        this.lives = 3;

        this.rotation = 0

        const img = new Image()
        img.src = '../assets/spaceship.png'
        img.onload = () => {
            const scale = 25/100
            this.img = img
            this.width = img.width * scale
            this.height = img.height * scale

            this.pos = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height + (3)
            }
        }
    }

    draw() {
        c.save();
        c.translate(player.pos.x + player.width / 3.5, player.pos.y + player.width / 3)

        c.rotate(this.rotation)

        c.translate(-player.pos.x - player.width / 3.5, -player.pos.y - player.width / 3)
        
        c.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);
        c.restore()
    }
    
    update() {
        if(this.img) {
            this.draw()
            this.pos.x += this.vel.x
        }

        invaderProjectiles.forEach((invaderProjectile, j) => {
            if (
                invaderProjectile.pos.y + invaderProjectile.radius >= this.pos.y && // Colisão na vertical
                invaderProjectile.pos.y - invaderProjectile.radius <= this.pos.y + this.height && // Colisão na vertical
                invaderProjectile.pos.x + invaderProjectile.radius >= this.pos.x && // Colisão na horizontal
                invaderProjectile.pos.x - invaderProjectile.radius <= this.pos.x + this.width // Colisão na horizontal
            ) {
                // Reduz o número de vidas do jogador
                this.lives--;

                // Remove o tiro do invasor
                invaderProjectiles.splice(j, 1);

                console.log("Player lives:", this.lives);

                // Verifica se o jogador perdeu todas as vidas
                if (this.lives === 0) {
                    gameover()
                    //window.alert('agjksd')
                }
            }
        });
    }
}

class Projectile {
    constructor({pos, vel}) {
        this.pos = pos
        this.vel = vel

        this.radius = 2
    }

    draw(){
        c.beginPath()
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#0bda51'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw();
        if (this.vel) { // Verifica se 'this.vel' está definido
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
        }
    }
}

let score = 0;

const grids = []
const player = new Player()
const keys = {
    l: { pressed: false },
    r: { pressed: false },
    s: { pressed: false }
}
const projectiles = []
const invaderProjectiles = []

let frames = 0
interval = Math.floor(Math.random() * 500 + 400)

function shoot() {
    projectiles.push(
        new Projectile({
            pos: {
                x: player.pos.x + player.width / 2,
                y: player.pos.y
            },
            vel: {
                x: 0,
                y: -10
            }
        })
    )
}

function animate() {
    if (!isGamePaused){
        requestAnimationFrame(animate)

        c.clearRect(0, 0, canvas.width, canvas.height); // Add this line

        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)

        player.update()

        if (Array.isArray(projectiles) && projectiles.length > 0) {
            // Filtra apenas os objetos que têm o método 'update'
            const validProjectiles = projectiles.filter(projectile => typeof projectile.update === 'function')

            validProjectiles.forEach((projectile, index) => {

                if(projectile.pos.y + projectile.radius <= 0)
                    setTimeout(() => {
                        projectiles.splice(index, 1)
                    }, 0)
                else projectile.update()

                projectile.update()
            })
        }

        if (Array.isArray(invaderProjectiles) && invaderProjectiles.length > 0) {
            // Filtra apenas os objetos que têm o método 'update'
            const validInvaderProjectiles = invaderProjectiles.filter(projectile => typeof projectile.update === 'function')
        
            validInvaderProjectiles.forEach((projectile, index) => {
        
                if(projectile.pos.y + projectile.radius <= 0)
                    setTimeout(() => {
                        invaderProjectiles.splice(index, 1)
                    }, 0)
                else projectile.update()
        
                projectile.update()
            })
        }

        grids.forEach((grid, gridIndex) => {
            grid.update()
        })

        if(keys.l.pressed && player.pos.x >= 0){
            player.vel.x = -6
            player.rotation = -0.15
        }
        else if (keys.r.pressed && player.pos.x + player.width <= canvas.width){
            player.vel.x = 6
            player.rotation = 0.15
        }
        else{ 
            player.vel.x = 0 
            player.rotation = 0
        }

        if (frames % interval === 0)
            grids.push(new Grid())
        frames++

        //gameInterval = requestAnimationFrame(animate)
    }
}

animate()

addEventListener('keydown', ({ key }) => { 
    if(key == 'a' || key == 'ArrowLeft')
        keys.l.pressed = true
    else if(key == 'd' || key == 'ArrowRight')
        keys.r.pressed = true   
    else if(key == 'w' || key == 'ArrowUp')
        shoot()
    else if(key == ' ' || key == '0')
        shoot()
})

addEventListener('keyup', ({ key }) => { 
    if(key == 'a' || key == 'ArrowLeft')
        keys.l.pressed = false
    if(key == 'd' || key == 'ArrowRight')
        keys.r.pressed = false   
    if(key == 'w' || key == 'ArrowUp')
        keys.s.pressed = false
    if(key == ' ' || key == '0')
        keys.s.pressed = false
})

function gameover() {
    isGamePaused = true

    var gameOverDiv = document.getElementById("game-over")
    gameOverDiv.style.display = "block"

    //cancelAnimationFrame(gameInterval)
}

function restart() {
    grids.length = 0
    grids.push(new Grid())
    
    invaderProjectiles.length = 0

    player.lives = 3

    var gameOverDiv = document.getElementById("game-over")
    gameOverDiv.style.display = "none"

    save()

    score = 0;
    
    isGamePaused = false;

    requestAnimationFrame(animate)
}

function back() {
    save()
    window.location.href = "../index.html"
}

function save() {
    const nick = document.getElementById("username-input").value;

    // Verifica se o nome de usuário não está vazio
    if (nick.trim() === "") {
        alert("Please enter a username");
        return;
    }

    // Verifica se a pontuação é um número válido
    if (isNaN(score)) {
        alert("Invalid score.");
        return;
    }

    // Verifica se o navegador suporta o armazenamento local
    if (typeof(Storage) !== "undefined") {
        // Recupera os dados do armazenamento local ou inicializa um novo objeto vazio
        const userData = JSON.parse(localStorage.getItem("userData")) || {}

        console.log(userData[nick])

        if (userData[nick] !== undefined) {
            // Adiciona a pontuação ao objeto de dados do usuário
            if(userData[nick] < score)
                userData[nick] = score
            else alert("Low score detected, maintaining the previous one")
        } else
            userData[nick] = score
        
        // Salva os dados atualizados de volta no armazenamento local
        localStorage.setItem("userData", JSON.stringify(userData))

        console.log('Pontuação adicionada com sucesso.')
    } else {
        // Caso o navegador não suporte o armazenamento local
        alert("Sorry, your browser does not support web storage...")
        return;
    }
}
