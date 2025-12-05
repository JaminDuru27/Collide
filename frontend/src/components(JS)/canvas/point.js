import { genId } from "../../utils/genid";
import { getRandomHexColor } from "../../utils/randomcolor"
let now = 0
export function Point(Positions, Collide){
    const res = {
        x:0, y: 0,
        dx:0, dy: 0,
        color: getRandomHexColor(),
        name: Positions.array.length + 1,
        hidden: false,
        gridw: Collide.grid.w, 
        gridh: Collide.grid.h, 
        id: `points` + genId(),
        load(){},
        set(x, y){
            this.x = x; this.y = y
            this.dx = x; this.dy = y
            this.calcratio()
            this.setpos()
        },
        calcratio(){
            this.ratio = {
                x: (this.x - Collide.grid.x)/ this.gridw,
                y: (this.y - Collide.grid.y)/ this.gridh,
            }
        },
        setpos(){
            this.x = Collide.grid.x + this.ratio.x * this.gridw 
            this.y = Collide.grid.y + this.ratio.y * this.gridh 
            this.lx = this.x + 5
            this.ly = this.y - 20
        },
        lerp(a, b, t){return a + (b - a) * t},
        rename(name){this.name = name},
        draw({ctx, alpha}){
            if(Positions.hidden)return
            if(this.hidden)return
            ctx.save()
            ctx.setLineDash([])
            ctx.globalAlpha = 0.5
            ctx.fillStyle = this.color
            ctx.strokeStyle = this.color
            ctx.lineWidth  = 1
            ctx.beginPath()    
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.dx, this.dy)
            ctx.stroke();ctx.closePath()
            const sin = Math.sin(alpha)  
            const cos = Math.cos(alpha)
            this.sin = sin
            this.cos = cos

            ctx.beginPath()    
            this.dx = this.lerp(this.dx + this.cos, this.lx, 0.2)
            this.dy = this.lerp(this.dy + this.sin, this.ly, 0.2)
            ctx.arc(this.dx, this.dy , Positions.size, 0, Math.PI * 2)
            ctx.fill();ctx.stroke();ctx.closePath()

            ctx.globalAlpha = 1
            ctx.fillStyle = this.color
            ctx.strokeStyle = `black`
            ctx.lineWidth = 2
            ctx.beginPath()    
            ctx.arc(this.dx , this.dy , Positions.size, 0, Math.PI * 2)
            ctx.stroke();ctx.closePath()
            ctx.restore()

            ctx.fillStyle = this.color
            ctx.beginPath()    
            ctx.arc(this.dx , this.dy , Positions.size- 6, 0, Math.PI * 2)
            ctx.fill();ctx.closePath()
            ctx.restore()

            

        },
        update(p){
            this.draw(p)
        },
    }
    res.load()
    return res
}