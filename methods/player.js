import {indexFinder} from "./util.js"


function Player(i,j,cells,img){
   this.i = i 
   this.j = j
   this.x  = i*60+15
   this.y = j*60+15
   this.size = 40
   this.cellSize = 60
   this.cells = cells
   this.img = img
   this.dir = null
   this.hit = false
}

Player.prototype.draw = function (ctx){
    if(this.dir==="L"){
        ctx.drawImage(this.img,0,110,109,110,this.x,this.y,this.size,this.size)
        return
    }
    ctx.drawImage(this.img,0,0,109,110,this.x,this.y,this.size,this.size)
}

Player.prototype.fall = function (speed,height){
   if(this.hit)
   this.y+=speed
  if(this.y > height){
    return true
  }
  return false
}

Player.prototype.move = function(dir,col,row){
    this.dir = dir
    const cl = this.cells[indexFinder(this.i,this.j,col,row)]
    let nextCell = undefined
   switch(dir){
    case "R":
        if(!cl.walls[1]){
             let check = this.cells[indexFinder(cl.i+1,cl.j,col,row)]        
             if(!check.walls[3])
               nextCell = check

        }
             
    break
    case "L":
        if(!cl.walls[3]){
             let check = this.cells[indexFinder(cl.i-1,cl.j,col,row)]
             if(!check.walls[1])
               nextCell = check
        }
        break
    case "U":
        if(!cl.walls[0]){
             let check = this.cells[indexFinder(cl.i,cl.j-1,col,row)]
             if(!check.walls[2])
               nextCell = check
        }
       break
   case "D":
    if(!cl.walls[2]){
         let check = this.cells[indexFinder(cl.i,cl.j+1,col,row)]
         if(!check.walls[0])
           nextCell = check
    }
    break
}
if(nextCell){
    if(!this.hit){
      this.changePos(nextCell.i,nextCell.j)
    }
}
}

Player.prototype.changePos = function (i,j){
       this.i = i
       this.j = j
       this.x = i*this.cellSize+15
       this.y = j*this.cellSize+15
}



export {Player}