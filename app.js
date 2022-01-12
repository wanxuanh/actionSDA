
//console.log('gsap')
const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const starGame = document.querySelector('#startGame')
const modaelEl = document.querySelector('#modaelEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

    class Player {
      constructor(x,y,radius,color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
      }
      draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
      }
    }

    class Projectile{
      constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
      }
      draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
      }
      update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
  
      }
    }

    class Enemy {
      constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
      }
      draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
      }
      update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
      }
    }

    const friction = 0.99
    class Particle {
      constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1

      }
      draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
      }
      update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
      }
    }
    let x = canvas.width /2
    let y = canvas.height /2

    let player = new Player(x,y,20, 'white')
    let projectiles = [] //array to loop in animate (management of instances of multiple)
    let enemies = []
    let particles = []

    function init() {
     player = new Player(x,y,10,'black')
     projectiles = [] //array to loop in animate (management of instances of multiple)
     enemies = []
     particles = []
     score = 0
     scoreEl.innerHTML = score
     bigScoreEl.innerHTML = score
  }
    function spawnEnemies(){
      setInterval(() => {
        //const radius = Math.random() * (30 - 4) + 4 //play with the size of enemies (range from 5 - 30)
        const radius = 30

        let x
        let y //let it not be a const

        if(Math.random() < 0.5){
         x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius //left side
         y = Math.random() * canvas.height
      }
      else{
        x = Math.random() * canvas.width
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
      }
      const color = `hsl(${Math.random() * 360},50%,50%)`

        const angle = Math.atan2( //angle based on x and y
          canvas.height / 2 - y, canvas.width /2 - x
          ) //displays radian
 
          
        const velocity = {
          x: Math.cos(angle),
          y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
     },1000)
    }

    let animationId
    let score = 0

    function animate(){
      animationId = requestAnimationFrame(animate)
      c.fillstyle = 'orange'
      c.fillRect(0, 0,canvas.width, canvas.height)
      player.draw() //draw in the animate as calling outside will disappear
      //console.log('go')
      particles.forEach((particle,index)=>{
        if(particle.alpha <= 0.4){
          particles.splice(index, 1)
        } else
        {
        particle.update()
      }})
      
      projectiles.forEach((projectile, index) => {
      projectile.update()

      //remove from edges of screen
      if (projectile.x - projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height ){
        setTimeout(() => {
          
          projectiles.splice(index, 1)
          
        },0)
      }
      })

      enemies.forEach((enemy,index) => {
        enemy.update()

        //distance between player and enemy
        const dist = Math.hypot(player.x - enemy.x, 
          player.y - enemy.y)

        //end game
        if(dist - enemy.radius - player.radius < 1){
          cancelAnimationFrame(animationId)
          modaelEl.style.display ='flex'
          bigScoreEl.innerHTML = score

          //console.log('end game')
        }
        //CHECK FOR COLLISION
        projectiles.forEach((projectile, projectileIndex)=>{ 
          const dist = Math.hypot(projectile.x - enemy.x, 
            projectile.y - enemy.y)

            //console.log(dist)
//when projectiles touch enemy 

            if(dist - enemy.radius - projectile.radius < 1)
            {
              //score += 10
              //scoreEl.innerHTML = score
              //console.log(score);

              //create explosion effect
              for (let i = 0; i < 2; i++){
                projectiles.push(new Particle(projectile.x,
                  projectile.y, 3,enemy.color,
                   {
                    x: (Math.random() - 0.5 * (Math.random() * 3)), 
                    y: (Math.random() - 0.5 * (Math.random() * 3))
                  }))
              } //hit those enemy become smaller
              if(enemy.radius - 10 > 5){ //remove those too small
                score += 10
                scoreEl.innerHTML = score
          
                
                gsap.to(enemy,{
                  radius: enemy.radius - 10
                })
                setTimeout(() => {
                  //remove enemies once collide
                  projectiles.splice(projectileIndex, 1)
                  //console.log('remove from screen')
                }, 0)
              }else{ //remove enemy from screen
                score += 25
                scoreEl.innerHTML = score
                
                setTimeout(() => {
                  //remove enemies once collide
                  enemies.splice(index,1)
                  projectiles.splice(projectileIndex, 1)
                  //console.log('remove from screen')
                }, 0)
              }
             
          }
        })
    })
  }

//On click SHOOT
addEventListener('click',(event) => {
  //console.log(projectiles)
  const angle = Math.atan2( //angle based on x and y
    event.clientY - canvas.height / 2, event.clientX - canvas.width /2
    ) //displays radian
  
 // console.log(angle)

  //object

//change the speed
  const velocity = { 
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4
  }

  projectiles.push(
    new Projectile(canvas.width/2,
      canvas.height / 2, 10, 'black', velocity)
  )
})

 startGame.addEventListener('click',() => {
  init()
  animate()
  spawnEnemies()

  modaelEl.style.display = "none"
 })
    //console.log('go')