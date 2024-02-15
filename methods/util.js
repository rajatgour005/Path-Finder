const canvaSetup = (width,height,color,parent)=>{
   const canvas = document.createElement("canvas")
   const ctx = canvas.getContext("2d")
   canvas.width = width
   canvas.height = height
   canvas.style.backgroundColor = color
   parent.append(canvas)
   return canvas
}


const drawImage = function(img,ctx,x,y,sizex,sizey=sizex){
   ctx.drawImage(img,x,y,sizex,sizey)
}


function indexFinder(i,j,col,row){
    if(i<0||j<0||i>col-1||j>row-1)
    return -1
    return i+j*col
  }


function rect(ctx,x,y,w,h,color){
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h) 
}

function drawCircle(ctx,x,y,r,color){
   ctx.save()
   ctx.beginPath()
   ctx.fillStyle = color
   ctx.arc(x,y,r,0,Math.PI*2)
   ctx.fill()
   ctx.restore()
}

function drawText(ctx,x,y,str,fontSize,color){
   ctx.save()
   ctx.font = `${fontSize}px Arial`;
   ctx.fillStyle = color
   ctx.fillText(str,x,y);
   ctx.restore()
}

export {canvaSetup,drawImage,indexFinder,rect,drawCircle,drawText}
