const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Invaders {
    constructor() {

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
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height / 2
            }
        }
    }

    draw() {
        c.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);
    }
    
    update() {
        if(this.img) {
            this.draw()
            this.pos.x += this.vel.x
            this.pos.y += this.vel.y
        }
    }
}

class Player {
    constructor() {

        this.vel = {
            x: 0,
            y: 0
        }

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

const invader = new Invaders()
const player = new Player()
const keys = {
    l: { pressed: false },
    r: { pressed: false },
    s: { pressed: false }
}
const projectiles = []

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
    requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    invader.update()

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
