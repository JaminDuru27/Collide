import { getRandomHexColor } from "../../utils/randomcolor"
import { Tile } from "./Tile";

export function ImageLayer({Scene, Collide,select, grid, selectoperations,Layers,name}){
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
        getData(){return {data:{id: this?.id, name: this.name, color: this.color, hidden: this.hidden}, tiles: [...this.tiles.map(tile=>tile.getData())]}},
        revertData(layerdata){
            this.color = layerdata.color; this.id = layerdata?.id
            this.hidden = layerdata?.hidden; this.name = layerdata.name

            this.tiles = []
            this.target = undefined
            layerdata.tiles.forEach(tiledata=>{
                const tile = Tile(Scene, Collide)
                tile.revertData(tiledata)
                this.tiles.push(tile)
            })
        },
        consolidate(){
            Layers.currentLayer = this
            select.all()
            selectoperations.performOperation(`consolidate`)
        },
        indicateTarget({ctx}){
            if(!this.target)return
            const grid = getRandomHexColor()
            const x = (this.target.indx * grid.cw) + grid.x  
            const y = (this.target.indy * grid.ch) + grid.y  
            const w = (this.target.indw * grid.cw) 
            const h = (this.target.indh * grid.ch) 
            ctx.save()
            ctx.strokeStyle = `blue`
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, w, h)
            ctx.restore()
        },
        higlightCurrentTile({ctx}){
            let t 
            this.tiles.forEach(tile=>{if(tile.onHover())t = tile})
            if(!t)return

            if(!t.lock)
            t.indication = true
            
            if(t.indication){
                ctx.save()
                ctx.strokeStyle = `orange`
                ctx.fillStyle = `#ffa50033`
                ctx.lineWidth = 1
                const p = 5
                ctx.strokeRect(t.x - p, t.y - p, t.w + p*2, t.h + p* 2)
                ctx.fillRect(t.x - p, t.y - p, t.w + p*2, t.h + p* 2)
                ctx.restore()

            }
        },
        update(props){
            if(this.hidden)return
            this.tiles.forEach((t,x)=>{
                if(t.delete){
                    this.target = undefined;
                    this.tiles = this.tiles.filter(e=>e !== t)
                    return
                }else t.update(props)

            })
            this.indicateTarget(props)
            this.higlightCurrentTile(props)
        },
    }
    res.load()
    return res
}