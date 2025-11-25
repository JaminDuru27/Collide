import { Eraser } from "../tools/eraser"
import { Fill } from "../tools/fill"
import { Inspect } from "../tools/inspect"
import { Mark } from "../tools/mark"
import { Pencil } from "../tools/pencil"

export function Tools(canvas, Collide ){
    const res ={
        load(){
            this.array = [
                Pencil(Collide),
                Eraser(Collide),
                Fill(Collide),
                Inspect(Collide),
                Mark(Collide),
            ]
            this.setTool(`Pencil`)
            this.events()
        },
        events(){
            canvas.addEventListener(`mousedown`, ()=>{
                this.startdraw = true
            })
            canvas.addEventListener(`mouseup`, ()=>{
                this.startdraw = false
            })
        },
        setTool(name){
            const find = this.array.find(e=>e.name === name)
            if(find){
                if(this.tool && this?.tool?.leave)this.tool.leave()
                this.tool = find
                if(this.tool?.enter)this.tool.enter()
            }
        },
        update(props){
            this?.tool?.update(props)
            if(this.startdraw)(this.tool.on)?this.tool.on():null
            if(!this.startdraw)(this.tool.off)?this.tool.off():null
        }
    }
    res.load()
    return res
}