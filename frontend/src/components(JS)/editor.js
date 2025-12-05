import { CollisionBodyFactory } from "./canvas/collisionbodyfactory"
import { Grid } from "./canvas/grid"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { ImageLayers } from "./canvas/layers"
import { Mouse } from "./canvas/mouse"
import { PositionPoints } from "./canvas/positions"
import { Select } from "./canvas/select"
import { SelectOperations } from "./canvas/selectoperations"
import { ShortCuts } from "./canvas/shortcuts"
import { TileOperations } from "./canvas/tileoperations"
import { Tools } from "./canvas/tools"

export function Collide(canvas,gets, sets){
    const res= {
        bodies:[],
        updates:[],
        load(){
            this.getCanvas()
            this.shortcuts = ShortCuts()
            this.mouse = Mouse(this.canvas)
            this.grid = Grid(this.canvas, this.mouse).basedOnNumber()
            this.grid.onpopulate(()=>{this.bodies.forEach(body=>body.calcpos())})
            this.grid.ontranslate(()=>{this.bodies.forEach(body=>body.calcpos())})

            this.highlight = Highlight(this.mouse, this.grid, sets)

            this.imageLayers = ImageLayers(this)
            this.positions = PositionPoints(this)

            this.select= Select({...this, sets})

            this.tools = Tools(this.canvas, this, sets)
            this.tileoperations  = TileOperations(this, sets)
            this.selectoperations = SelectOperations(this, sets)

            this.collisionbodyfactory  = CollisionBodyFactory(this, sets)
            this.updates.push(this.imageLayers, this.mouse, this.grid,this.positions, this.highlight, this.tools, this.select, this.collisionbodyfactory)

            //assets
            this.images = Images()

        },
        getCanvas(){
            this.canvas = canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            window.addEventListener(`resize`, ()=>{
                this.canvas.width = this.canvas.clientWidth
                this.canvas.height = this.canvas.clientHeight
                this.ctx = this.canvas.getContext(`2d`)
            })
        },
        start(){
            const animate = () => {
                if(!this.ctx)return
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)                
                this.ctx.imageSmoothingEnabled= false
                this.updates.forEach(obj=>{
                    obj.update({ctx: this.ctx})
                })
                this.bodies.forEach(obj=>{
                    obj.update({ctx: this.ctx})
                })
                requestAnimationFrame(animate)
            }
            animate()
        }
    }
    res.load()
    return res
}