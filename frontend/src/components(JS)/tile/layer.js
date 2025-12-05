import { getRandomHexColor } from "../../utils/randomcolor"

export function ImageLayer({Collide,Layers,name}){
    const res = {
        name,
        hidden: false,
        tiles: [],
        color: getRandomHexColor(),
        target:undefined,
        load(){},
        rename(name){this.name = name},
        moveup(){},
        movedown(){},
        consolidate(){
            Layers.currentLayer = this
            Collide.select.all()
            Collide.selectoperations.performOperation(`consolidate`)
        },
        indicateTarget({ctx}){
            if(!this.target)return
            const grid = Collide.grid
            const x = (this.target.indx * grid.cw) + grid.x  
            const y = (this.target.indy * grid.ch) + grid.y  
            const w = (this.target.sprite.indw * grid.cw) 
            const h = (this.target.sprite.indh * grid.ch) 
            ctx.save()
            ctx.strokeStyle = `blue`
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, w, h)
            ctx.restore()
        },
        update(props){
            if(this.hidden)return
            this.tiles.forEach((t,x)=>{
                if(t.delete)this.tiles.splice(x, 1)
                t.update(props)
            })
            this.indicateTarget(props)
        },
    }
    res.load()
    return res
}