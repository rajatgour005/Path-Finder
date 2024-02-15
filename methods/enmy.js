import { indexFinder,drawImage } from "./util.js"

class Enmy{
    constructor(i,j,cells,img){
      this.i = i
      this.j = j
      this.x  = i*60+15
      this.y = j*60+15
      this.img = img
      this.cells = cells
      this.size = 40
      this.cellSize = 60
      this.dir = "L"
    }
}

Enmy.prototype.draw = function (ctx){
    drawImage(this.img,ctx,this.x,this.y,this.size)
}

Enmy.prototype.move = function(col,row){
    const cl = this.cells[indexFinder(this.i,this.j,col,row)]
    let nextCell = undefined
   switch(this.dir){
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
    this.changePos(nextCell.i,nextCell.j)
}
else{
    const arrDir = ["L","R","U","D"]
    const newDir = arrDir[Math.floor(Math.random()*arrDir.length)]
    if(newDir !== this.dir){
        this.dir = newDir
    }
}
}

Enmy.prototype.changePos = function (i,j){
    this.i = i
    this.j = j
    this.x = i*this.cellSize+15
    this.y = j*this.cellSize+15
}


export {Enmy}