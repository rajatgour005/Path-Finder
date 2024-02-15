import { indexFinder,drawImage } from "./util.js"



function Cell(i,j,size,img){
   this.i = i
   this.j = j
   this.size = size
   this.x = i*size
   this.y = j*size
   this.walls = [true,true,true,true]
   this.visited = false
   this.img = img
}

Cell.prototype.drawWalls = function(ctx){
    const imgSize = 13
    //top
    if(this.walls[0]){
       for( let i = this.x ; i < this.x + this.size ; i += imgSize){
            drawImage(this.img,ctx,i,this.y,imgSize)
       }
    }

    // rigth
    if(this.walls[1]){
        for( let i = this.y ; i < this.y + this.size ; i += imgSize){
          drawImage(this.img,ctx,this.x+this.size,i,imgSize)
      }
    }
    //bottom
    if(this.walls[2]){
        for( let i = this.x+this.size ; i>this.x  ; i -= imgSize){
            drawImage(this.img,ctx,i,this.y+this.size,imgSize)
      }
    }
   //left
   if(this.walls[3]){
    for( let i = this.y; i < this.y + this.size  ; i += imgSize){
        drawImage(this.img,ctx,this.x,i,imgSize)
  }
}
}

// unvisited neighbours

  Cell.prototype.neighbours = function(cells,col,row){
    const  p = []
    const top = cells[indexFinder(this.i,this.j-1,col,row)]
    const right = cells[indexFinder(this.i+1,this.j,col,row)]
    const bottom = cells[indexFinder(this.i,this.j+1,col,row)]
    const left = cells[indexFinder(this.i-1,this.j,col,row)]
    if(top&&!top.visited) p.push(top)
    if(right&&!right.visited) p.push(right)
    if(bottom&&!bottom.visited) p.push(bottom)
    if(left&&!left.visited) p.push(left)
    return p
}




export {Cell}