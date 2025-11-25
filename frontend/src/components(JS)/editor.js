import { Grid } from "./canvas/grid"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { ImageLayers } from "./canvas/layers"
import { Mouse } from "./canvas/mouse"
import { Select } from "./canvas/select"
import { SelectOperations } from "./canvas/selectoperations"
import { Tools } from "./canvas/tools"

export function Collide(canvas,sets){
    const res= {
        updates:[],
        load(){
            this.getCanvas()
            this.mouse = Mouse(this.canvas)
            this.grid = Grid(this.canvas, this.mouse).basedOnNumber()
            this.highlight = Highlight(this.mouse, this.grid)
            this.select= Select(this.canvas,this.highlight, this.grid, sets)

            this.imageLayers = ImageLayers()

            this.tools = Tools(this.canvas, this)
            this.selectoperations = SelectOperations(this, sets)

            this.updates.push(this.imageLayers, this.mouse, this.grid, this.highlight, this.tools, this.select, )

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
                requestAnimationFrame(animate)
            }
            animate()
        }
    }
    res.load()
    return res
}