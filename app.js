//********************************************************
//DECLARATION
//********************************************************

//console.log('gsap')
const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGame = document.querySelector('#startGame')
const modaelEl = document.querySelector('#modaelEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

//********************************************************
//CLASS PLAYER
//********************************************************

class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

//********************************************************
//CLASS PROJECTILE
//********************************************************

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y

  }
}

//********************************************************
//ENEMY
//********************************************************
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
//********************************************************
//FRICTION
//********************************************************

//  does not slow down too quickly
const friction = 0.99

//********************************************************
//PARTICLE
//********************************************************

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1

  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

//********************************************************
//DECLARATION
//********************************************************

let x = canvas.width / 2
let y = canvas.height / 2

let images = []
let player = new Player(canvas.width / 2,
  canvas.height / 7, 100, 'transparent')

const playerImage = new Image()
playerImage.src = 'images/guard.jpg'

let projectiles = [] //array to loop in animate (management of instances of multiple)
let enemies = []
let particles = []

//********************************************************
//INIT
//********************************************************

function init() {
  image = []
  //player = new Player(300, y, 30, 'black')
  projectiles = [] //array to loop in animate (management of instances of multiple)
  enemies = []
  particles = []
  score = 0
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score

}

//********************************************************
//FUNCTION
//********************************************************

function spawnEnemies() {
  setInterval(() => {
    //const radius = Math.random() * (30 - 4) + 4 //play with the size of enemies (range from 5 - 30)
    const radius = 30

    let x
    let y //let it not be a const

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //left side
      y = Math.random() * canvas.height
    }
    else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    let color = `hsl(${Math.random() * 360},50%,50%)`

    //angle where the enemy spawn towards
    // const angle = Math.atan2(
    //   50 - canvas.height ,
    //   canvas.width
    // )
    const angle = Math.atan2( //angle based on x and y
      y - canvas.height, canvas.width / 2
    ) //displays radian


    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 400)
}

// function SpawnEnemies(){
//   setInterval(() =>{
//     const x = Math.random() * canvas.width
//     // const y = 100
//     // const radius = 30
//     // const color = 'green'

//     const angle = Math.atan2(canvas.height/2 - y,
//       canvas.width /2 - x)

//       const velocity = {
//         x: Math.cos(angle),
//         y: Math.sin(angle)
//       }
//       enemies.push(new Enemy(x,y,radius,color,
//         velocity))
//       },1000)

// }

// function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
//   ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
// }

let animationId
let score = 0

//********************************************************
//ANIMATE
//********************************************************

function animate() {
  animationId = requestAnimationFrame(animate)
  //c.fillstyle = 'orange'
  c.clearRect(0, 0, canvas.width, canvas.height)
  //c.drawImage(playerImage, this.x, this.y, this.size, this.size))
  c.drawImage(playerImage, 50,100,630,canvas.width / 2,
    canvas.width / 2.5,-100,260,280)// sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  player.draw() //draw in the animate as calling outside will disappear
  //console.log('go')
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0.4) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })

  projectiles.forEach((projectile, index) => {
    projectile.update()

    //remove from edges of screen
    if (projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height) {
      setTimeout(() => {

        projectiles.splice(index, 1)

      }, 0)
    }
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    //distance between player and enemy
    const dist = Math.hypot(player.x - enemy.x,
      player.y - enemy.y)

    //end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      modaelEl.style.display = 'flex'
      bigScoreEl.innerHTML = score
     // window.removeEventListener('click', animate)

      //console.log('end game')
    }
    //CHECK FOR COLLISION
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x,
        projectile.y - enemy.y)

      //console.log(dist)
      //WHEN projectiles touch enemy 

      if (dist - enemy.radius - projectile.radius < 1) {
        //score += 10
        //scoreEl.innerHTML = score
        //console.log(score);

        //create explosion effect
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(projectile.x,
            projectile.y, 3, enemy.color,
            {
              x: (Math.random() - 0.5 * (Math.random() * 1)),
              y: (Math.random() - 0.5 * (Math.random() * 1))
            }))
        } //hit those enemy become smaller
        if (enemy.radius - 10 > 5) { //remove those too small
          score += 10
          scoreEl.innerHTML = score


          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            //remove enemies once collide
            projectiles.splice(projectileIndex, 1)
            //console.log('remove from screen')
          }, 0)
        } else { //remove enemy from screen
          score += 25
          scoreEl.innerHTML = score

          setTimeout(() => {
            //remove enemies once collide
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
            //console.log('remove from screen')
          }, 0)
        }

      }
    })
  })
}
//********************************************************
//EVENT LISTENER
//********************************************************

//On click SHOOT
addEventListener('click', (event) => {
  //console.log(projectiles)
  const angle = Math.atan2( //angle based on x and y
    event.clientY - canvas.height /2 + 70, event.clientX - canvas.width /2 + 20
 ) //displays radian

  // console.log(angle)

  //object

  //change the interval
  const velocity = {
    x: Math.cos(angle) * 15,
    y: Math.sin(angle) * 15
  }

  projectiles.push(
    new Projectile(canvas.width / 2,
      canvas.height / 10, 2, 'black', velocity)
  )
})


startGame.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()

  //scoreEl.style.display = "none"
  modaelEl.style.display = "none"

  addEventListener("mousemove", onMouseMove);
  addEventListener("mousedown", onMouseDown);
  //bigScoreEl.style.display = "none"
})
    //console.log('go')