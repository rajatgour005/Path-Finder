import { canvaSetup,drawImage} from "./methods/util.js"
import { Game } from "./methods/base.js"


const width = 1215
const height = 515
const card = document.getElementById("card")
const startBtn = document.getElementById("start")
const rulesBtn = document.getElementById("rules")
const parent = document.getElementById("parent")
const canvas = canvaSetup(width,height,"transparent",parent)
const ctx = canvas.getContext("2d")
const game = new Game(width,height)


const animate = ()=>{
     ctx.clearRect(0,0,width,height)
     game.animate(ctx)
     requestAnimationFrame(animate)
}

startBtn.addEventListener("click",()=>{
     game.getStarted()
     card.style.display = "none"
     parent.style.display = "block"
     animate()
})

rulesBtn.addEventListener("click",()=>{
     const rulescard = document.getElementById("rulesdis")
     const closebtn  = document.getElementById("closebtn")
     rulescard.style.display = "grid"
    closebtn.addEventListener("click",()=>{
     rulescard.style.display = "none"
    })
})






