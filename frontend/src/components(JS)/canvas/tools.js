import { Eraser } from "../tools/eraser"
import { Fill } from "../tools/fill"
import { Inspect } from "../tools/inspect"
import { SelectTool } from "../tools/select"
import { Pencil } from "../tools/pencil"
import { Mark } from "../tools/mark"
import { Move } from "../tools/move"

export function Tools(canvas, Collide, sets){
    const res ={
        prevtool: undefined,
        load(){
            this.array = [
                Move(Collide),
                Pencil(Collide),
                Eraser(Collide),
                Fill(Collide),
                Inspect(Collide),
                Mark(Collide),
                SelectTool(Collide),
            ]
            this.setTool(`Pencil`)
            this.events()
            this.shortcuts()
        },
        shortcuts(){
            Collide.shortcuts.add(`d`).cb(()=>{
                this.setTool(`Move`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`b`).cb(()=>{
                this.setTool(`Pencil`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`e`).cb(()=>{
                this.setTool(`Eraser`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`g`).cb(()=>{
                this.setTool(`Fill`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`p`).cb(()=>{
                this.setTool(`Mark`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`p`, `alt`, ()=>{this.tool.name === `Mark`}).cb(()=>{
                this.setTool(`Mark`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`m`).cb(()=>{
                this.setTool(`Select`);
                sets.setupdatetools(p=>!p)
            })
            Collide.shortcuts.add(`alt`, ()=>this.tool.name !== `Mark`).cb(()=>{
                this.setTool(`Inspect`);
                sets.setupdatetools(p=>!p)
            })
            // .endcb(()=>{
            //     if(this.prevtool){
            //         this.setTool(this.prevtool.name)
            //         sets.setupdatetools(p=>!p)
            //     }
            // })
                
        },
        events(){
            canvas.addEventListener(`mousedown`, (e)=>{
                if(e.button === 0)
                this.startdraw = true
            })
            canvas.addEventListener(`mouseup`, ()=>{
                this.startdraw = false
            })
        },
        setTool(name){
            const find = this.array.find(e=>e.name === name)
            if(find){
                this.prevtool = this.tool
                if(this.tool && this?.tool?.leave)this.tool.leave()
                this.tool = find
                if(this.tool?.enter)this.tool.enter()
                if(!this.prevtool)this.prevtool = this.tool
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