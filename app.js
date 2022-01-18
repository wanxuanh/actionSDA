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
const menu = document.querySelector('#menu')
const gameOver = document.querySelector('#gameOver')

let frame = 0;

let images = []

const playerImage = new Image()
playerImage.src = 'images/guard.jpg'


const projectileImg = [];
const projectile1 = new Image();
projectile1.src = "images/syring.png"
projectileImg.push(projectile1)

const gameLoadAudio = new Audio(src = 'https://www.myinstants.com/media/sounds/the-pink-panther-theme-song-original-version.mp3')
const gameOverAudio = new Audio(src = 'sounds/gameover.wav')

function bubbleAudio() {
  let sound = new Audio(src = 'sounds/barcode.mp3')
  sound.load()
  sound.play()
  sound.volume = 0.3
}


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
    this.projectileImg = projectileImg[0];

  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  update() {
    this.draw()
    c.drawImage(this.projectileImg,10,10,40,40)

    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    //if(this.frameX < this.maxFrame) this.frameX++;
    //else this.frameX = this.minFrame;

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
    c.rect(this.x, this.y, 20, 20)
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 1.2, 2)
    c.fillStyle = `hsl(${Math.random() * 360},70%,40%)`
    //c.fillStyle = this.color
    c.fill()
    //c.stroke() = 'black'
    //c.drawImage(enemyImage,50,50)
    c.restore()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX - this.minFrame
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


let player = new Player(canvas.width / 2,
  canvas.height / 7, 120, 'transparent')


let projectiles = [] //array to loop in animate (management of instances of multiple)
let enemies = []
let particles = []

//********************************************************
//INIT
//********************************************************

function init() {
  images = []
  //player = new Player(300, y, 30, 'black')
  projectiles = [] //array to loop in animate (management of instances of multiple)
  enemies = []
  particles = []
  score = 0
  scoreEl.innerHTML = score
  bigScoreEl.innerHTML = score
  gameLoadAudio.play()


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

    //let enemy = new Enemy()

    // if (Math.random() < 0.5) {
    //   x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //left side
    //   //y = Math.random() * canvas.height
    //   y = 200
    // }
    // else {
    //  x = Math.random() * canvas.width
    //  //y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    //   y = 200
    // }
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //left side
    y = Math.random() * canvas.height

    let color = `hsl(${Math.random() * 360},50%,40%)`

    //angle where the enemy spawn towards
    const angle = Math.atan2(
      800 - canvas.height,
      canvas.width
    )
    // const angle = Math.atan2( //angle based on x and y
    //   y - canvas.height, canvas.width / 2
    // ) //displays radian


    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    //enemies.push(new Enemy())
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 400)
}

let animationId
let score = 0

//********************************************************
//ANIMATE
//********************************************************
function attachImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  c.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}
function animate() {
  animationId = requestAnimationFrame(animate)
  //c.fillstyle = 'orange'
  c.clearRect(0, 0, canvas.width, canvas.height)
  //c.drawImage(playerImage, this.x, this.y, this.size, this.size))
  attachImage(playerImage, 50, 80, 630, 820,
    canvas.width / 2.5, -80, 260, 280)// sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
  //player.draw() //draw in the animate as calling outside will disappear
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
    // enemy.draw()
    // attachEnemy(enemyImage,40,40)
    //console.log(enemy, index)

    enemy.update()

    //distance between player and enemy
    const dist = Math.hypot(player.x - enemy.x,
      player.y - enemy.y)

    //end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      bigScoreEl.style.display = "flex"
      scoreEl.style.display = "flex"
      modaelEl.style.display = 'flex'
      bigScoreEl.innerHTML = score
      gameOver.style.display = "flex"
      gameOverAudio.play()
      gameLoadAudio.pause()

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
        if (enemy.radius - 10 > 15) { //remove those too small
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
    event.clientY - canvas.height / 2 + 70, event.clientX - canvas.width / 2 + 20
  ) //displays radian

  // console.log(angle)

  //object

  //change the interval
  const velocity = {
    x: Math.cos(angle) * 50,
    y: Math.sin(angle) * 50
  }
  projectiles.push(
    new Projectile(canvas.width / 2,
      canvas.height / 10, 5, 'rgb(153, 0, 0)', velocity)
  )

  bubbleAudio()

})

bigScoreEl.style.display = "none"
gameOver.style.display = "none"

//endingText.style.display = "none"

startGame.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()


  //scoreEl.style.display = "none"
  modaelEl.style.display = "none"
  menu.style.display = "none"
  gameOver.style.display = "none"
  gameLoadAudio.play()
  gameLoadAudio.loop = true;


  //addEventListener("mousemove", onMouseMove);
  //addEventListener("mousedown", onMouseDown);
  //bigScoreEl.style.display = "none"
})
 