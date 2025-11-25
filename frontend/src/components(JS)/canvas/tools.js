import { Eraser } from "../tools/eraser"
import { Fill } from "../tools/fill"
import { Inspect } from "../tools/inspect"
import { Pencil } from "../tools/pencil"

export function Tools(canvas, Collide ){
    const res ={
        load(){
            this.array = [
                Pencil(Collide),
                Eraser(Collide),
                Fill(Collide),
                Inspect(Collide),
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
            if(find)this.tool = find
        },
        update(props){
            this?.tool?.update(props)
            if(this.startdraw)this.tool.draw()
        }
    }
    res.load()
    return res
}