import { drawCircle,drawText} from "./util.js"

class Bomb{
    constructor(x,y){
        this.x = x
        this.y = y
        this.particles = []
        this.grow = true
        this.bombSize = 30
        this.hitBy = false
    }
}

Bomb.prototype.draw = function(ctx){
   if(!this.hitBy){
    if(this.grow){
        this.bombSize += 0.2
        if(this.bombSize >= 32)
          this.grow = false
     }
     else{
        this.bombSize -= 0.2
        if(this.bombSize < 30)
        this.grow = true
     }
    drawText(ctx,this.x,this.y+30, "💣",this.bombSize)
   }
   else{
        this.drawParticle(ctx)
   }
}

Bomb.prototype.createParticle = function(){
   for(let i=0;i<200;i++){
      this.particles.push(
        new Particle(
            this.x+15,this.y+20,1,"yellow",Math.floor(Math.random()*360),(Math.random()*1)+1
        )
      )
   }
}

Bomb.prototype.drawParticle = function(ctx){
    this.particles.forEach((particle,index)=>{
        particle.draw(ctx)
        particle.update()
        if(particle.distance(this.x+15,this.y+20,30))
           this.particles.splice(index,1)
    })
}

Bomb.prototype.isDelet = function(){
    if(this.hitBy && this.particles.length===0)
      return true
    return false
}

class Particle{
    constructor(x,y,r,color,angle,speed){
         this.x = x
         this.y = y
         this.color = color
         this.angle = angle 
         this.speed = speed
         this.r = r
    }
}

Particle.prototype.draw = function(ctx){
   drawCircle(ctx,this.x,this.y,this.r,this.color)
}

Particle.prototype.update = function(){
    this.x += this.speed * Math.cos(this.angle*(Math.PI/180))
    this.y += this.speed * Math.sin(this.angle*(Math.PI/180))
}

Particle.prototype.distance = function(x,y,checkDis){
   const dis = Math.sqrt(Math.pow(this.x-x,2)+Math.pow(this.y-y,2))
   if(dis > checkDis)
     return true
   return  false
}








export {Bomb}