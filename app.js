const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

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
    const x = canvas.width /2
    const y = canvas.height /2

    const player = new Player(x,y,30,'blue')


    const projectiles = [] //array to loop in animate (management of instances of multiple)
    const enemies = []

    function spawnEnemies(){
      setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4 //play with the size of enemies (range from 5 - 30)

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
      const color = 'green'

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

    function animate(){
      requestAnimationFrame(animate)
      c.clearRect(0,0,canvas.width, canvas.height)
      player.draw() //draw in the animate as calling outside will disappear
      //console.log('go')
      projectiles.forEach((projectile) => {
      projectile.update()
      })

      enemies.forEach((enemy) => {
        enemy.update()
    })
  }

//On click
addEventListener('click',(event) => {
  const angle = Math.atan2( //angle based on x and y
    event.clientY - canvas.height / 2, event.clientX - canvas.width /2
    ) //displays radian
  
  console.log(angle)

  //object

  const velocity = { 
    x: Math.cos(angle),
    y: Math.sin(angle)
  }

  projectiles.push(
    new Projectile(canvas.width/2,
      canvas.height / 2, 5, 'red', velocity)
  )
})

    animate()
    spawnEnemies()
    //console.log('go')