import { Cell } from "./cell.js"
import { Player } from "./player.js"
import { Enmy } from "./enmy.js"
import { Bomb } from "./bomb.js"


import { drawImage,indexFinder } from "./util.js"

class Game{
   constructor(w,h){
      this.bricks = document.getElementById("bricks")
      this.playerImg = document.getElementById("player")
      this.enmy = document.getElementsByClassName("enmy")
      this.dollar = document.getElementById("dollar")
      this.doors = document.getElementsByClassName("doors")
      this.lifeDis = document.getElementById("life")
      this.levelDis = document.getElementById("level")
      this.bombDis = document.getElementById("bomb")
      this.scoreCard = document.getElementById("scorecard")
      this.lIndicator = document.getElementById("lindicator")
      this.gameOverCard = document.getElementById("gameover")
      this.restartBtn = document.getElementById("restart")
      this.bonusDis = document.getElementById("bonusholder")
      this.w = w
      this.h = h
      this.level = 1
      this.gameOver = true
      this.blockSize = 60
      this.col = Math.floor(w/this.blockSize)
      this.row = Math.floor(h/this.blockSize)
      this.player = null
      this.playerLifeCount = 3
      this.blocks = []
      this.bonus = []
      this.bounusCount = 10
      this.dollarcount = 0
      this.enmies = []
      this.enmyCount = 3
      this.bomb = []
      this.totalBomb = 5
      this.frameCount = 0
      this.mCount = 0
      this.message = true
   }
  
  animate(ctx){
    if(!this.gameOver){
      this.drawBlocks(ctx)
      this.drawDoor(ctx)
      this.drawPlayer(ctx)
      this.drawEnmy(ctx)
      this.drawBonus(ctx)
      this.drawBomb(ctx)
      this.playerHitEnmy()
      this.bombWithEnmy()
      this.isGameover()
      this.checkWin()
      this.getBonus()
      if(this.frameCount % 20 ===0) this.emyMove()
      this.frameCount +=1
      if(this.frameCount===0) this.frameCount = 0
    }
    else{
      if(this.message){
         this.lIndicator.style.display = "block"
         this.lIndicator.innerText = `level - ${this.level}`
         this.mCount+=1
         if(this.mCount === 50){
            this.lIndicator.style.display = "none"
            this.gameOver = false
            this.mCount = 0
            this.scoreCard.style.display = "flex"
            this.message = false
         }
      }
      else{
            this.gameOverCard.style.display = "grid"
      }
    }
  }


  getStarted(){
    this.createBlocks()
    this.mazePathGenrator()
    this.setPlayer()
    this.createEnmy()
    this.createBonus()
    this.addEvent()
    this.setScoreCard()
  }


   drawBlocks(ctx){
      this.blocks.forEach(block=>{
         block.drawWalls(ctx)
      })
   }

   drawPlayer(ctx){
      this.player.draw(ctx)
      if(this.player.fall(5,this.h)){
         this.setPlayer()
         this.playerLifeCount -= 1
         this.handlePlayerLife(this.lifeDis,"remove")
      }
   }


  drawEnmy(ctx){
      this.enmies.forEach(enmy=>{
       enmy.draw(ctx)
      })
  }

   drawBomb(ctx){
      this.bomb.forEach((b,bIndex)=>{
         b.draw(ctx)
         if(b.isDelet()) this.bomb.splice(bIndex,1)
      })
   }   

   drawBonus(ctx){
      this.bonus.forEach(obj=>{
         drawImage(this.dollar,ctx,obj.x+20,obj.y+20,25)
      })
   }

   drawDoor(ctx){
      if(this.dollarcount !== this.bounusCount){
         drawImage(this.doors[0],ctx,this.blocks[this.blocks.length-1].x+14,this.blocks[this.blocks.length-1].y+14,45)
      }
      else{
         drawImage(this.doors[1],ctx,this.blocks[this.blocks.length-1].x+14,this.blocks[this.blocks.length-1].y+14,45)
      }
   }

   createBlocks(){
      for(let i=0;i<this.row;i++){
         for(let j=0;j<this.col;j++){
            this.blocks.push(
               new Cell(j,i,this.blockSize,this.bricks)
            )
         }
      }
   }
   
   
   
   createBonus(){
      while(this.bonus.length < this.bounusCount){
         const index = Math.floor((Math.random()*(this.blocks.length-3))+1)
         this.bonus.push(
            {
               x:this.blocks[index].x,
               y:this.blocks[index].y,
               index:index
            }
            )
         }
      }


      
 createEnmy(){
   while(this.enmies.length < this.enmyCount){
      const index = Math.floor((Math.random()*(this.blocks.length-3))+3)
      const cell = this.blocks[index]
      this.enmies.push(
           new Enmy(
            cell.i,
            cell.j,
            this.blocks,
            this.enmy[Math.floor(Math.random()*this.enmy.length)]
           )
      )
   }
 }


 createBomb(){
   if(this.totalBomb > 0 && !this.player.hit){
     this.bomb.push(
        new Bomb(
          this.player.x,
          this.player.y
        )
      )
      this.totalBomb -=1
      this.bombDis.innerText = `💣: ${this.totalBomb}`
   }
}
      
      setPlayer(){
         let current = this.blocks[0]
         this.player = new Player(
            current.i,current.j,this.blocks,this.playerImg
            )
         }
      
      draw(ctx){
         this.blocks.forEach(block=>{
         block.drawWalls(ctx)
      })

      this.player.draw(ctx)
      if(this.player.fall(5,this.h)){
         this.setPlayer()
         this.playerLifeCount -= 1
         this.handlePlayerLife(this.lifeDis,"remove")
      }

      this.bomb.forEach((b,bIndex)=>{
         b.draw(ctx)
         if(b.isDelet()) this.bomb.splice(bIndex,1)
      })
   }

   mazePathGenrator(){
      let current = this.blocks[0]
      let check = false
      const stack = []
      current.visited = true
      while(!check){
       const n = current.neighbours(this.blocks,this.col,this.row)
           if(n.length > 0){
               const next = n[Math.floor(Math.random()*n.length)]
               next.visited = true
               this.wallRemover(current,next)
               current = next
               stack.push(current)
           }
           else{
               if(stack.length > 0){
               const next = stack.pop()
               this.wallRemover(current,next)
               current = next
               }
       
           }
           check = this.blocks.every(cell=>cell.visited)
      }
 
   }

    wallRemover(current,next){
      if(current.i-next.i===1){
          current.walls[3]=false
          next.walls[1]=false
      }
      else if(current.i-next.i===-1){
          next.walls[3] = false
          current.walls[1] = false
      }
      else if(current.j-next.j===1){
          current.walls[0] = false
          next.walls[2] = false
      }
      else if(current.j-next.j===-1){
          current.walls[2] = false
          next.walls[0] = false
      }
  }



getBonus(){
   this.bonus.forEach((obj,index)=>{
      if(obj.index === indexFinder(this.player.i,this.player.j,this.col,this.row)){
         this.dollarcount+=1
         this.bonusDis.innerText = `${this.dollarcount}/${this.bounusCount}`
         this.bonus.splice(index,1)
         this.blocks = []
         this.createBlocks()
         this.mazePathGenrator()
         const pLocation = this.blocks[indexFinder(this.player.i,this.player.j,this.col,this.row)]
         this.player.cells = this.blocks
         this.enmies.forEach(enmy=>{
            enmy.cells = this.blocks
         })
   }
})
}

checkWin(){
   const pLocation = indexFinder(this.player.i,this.player.j,this.col,this.row)
   if(pLocation === this.blocks.length-1){
      if(this.dollarcount === this.bounusCount){
         this.nextLevel()
      }
   }
}


 emyMove(){
   this.enmies.forEach(enmy=>{
      enmy.move(this.col,this.row)
   })
 }

 playerHitEnmy(){
   this.enmies.forEach(enmy=>{
      const enmyL = indexFinder(enmy.i,enmy.j,this.col,this.row)
      const playerL = indexFinder(this.player.i,this.player.j,this.col,this.row)
      if(enmyL===playerL){
         this.player.hit = true
      }
   })
 }

 bombWithEnmy(){
   if(this.bomb.length > 0){
      this.bomb.forEach(b=>{
         const bombIndex = indexFinder(Math.floor(b.x/this.blockSize),Math.floor(b.y/this.blockSize),this.col,this.row)
         this.enmies.forEach((enmy,eIndex)=>{
            const enmyIndex = indexFinder(enmy.i,enmy.j,this.col,this.row)
            if(bombIndex === enmyIndex){
               b.hitBy = true
               b.createParticle()
               this.enmies.splice(eIndex,1)
               this.totalBomb +=1
               this.bombDis.innerText = `💣 : ${this.totalBomb}`
            }
         })
      })
   }
 }

 handlePlayerLife(parent,type){
     if(type==="add") parent.innerText = parent.innerText + "❤️"
     else parent.innerText = parent.innerText.replace("❤️","")
     
 }

 isGameover(){
    if(this.playerLifeCount === 0){
        this.gameOver = true
        this.scoreCard.style.display = "none"
    }
 }

nextLevel(){
   this.level += 1
   this.enmies = []
   this.bonus = []
   this.blocks = []
   this.bomb = []
   this.playerLifeCount = 3
   this.bounusCount = Math.floor((Math.random()*10)+10)
   this.enmyCount +=1
   this.totalBomb = 5
   this.dollarcount = 0
   this.createBlocks()
   this.mazePathGenrator()
   this.createBonus()
   this.createEnmy()
   this.setPlayer()
   this.setScoreCard()
   this.message = true
   this.gameOver = true
}

setScoreCard(){
  this.levelDis.innerText = `level - ${this.level}`
  this.lifeDis.innerText = "❤️❤️❤️"
  this.bombDis.innerText = "💣: 5"
  this.bonusDis.innerText = `${this.dollarcount}/${this.bounusCount}`
  this.scoreCard.style.display = "none"
}

restart(){
   this.blocks = []
   this.bonus = []
   this.enmies = []
   this.bomb = []
   this.totalBomb = 5
   this.dollarcount = 0
   this.playerLifeCount = 3
   this.createBlocks()
   this.mazePathGenrator()
   this.createBonus()
   this.createEnmy()
   this.setPlayer()
   this.setScoreCard()
   this.message = true
   this.gameOver = true
   this.gameOverCard.style.display = "none"
}


addEvent(){
   window.addEventListener("keydown",(e)=>{
     if(!this.game){
      const {key} = e
      switch(key){
         case "ArrowRight":
            this.player.move("R",this.col,this.row)
            break
         case "ArrowLeft":
            this.player.move("L",this.col,this.row)
            break
            
         case "ArrowUp":
            this.player.move("U",this.col,this.row)
            break
         case "ArrowDown":
            this.player.move("D",this.col,this.row)
            break
         case " ":
            this.createBomb()
             break
            
      }
     }
   })
   this.restartBtn.addEventListener("click",()=>{
     this.restart()
   })
}

}


export {Game}