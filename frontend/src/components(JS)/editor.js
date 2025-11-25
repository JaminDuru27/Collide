import { Grid } from "./canvas/grid"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { ImageLayers } from "./canvas/layers"
import { Mouse } from "./canvas/mouse"
import { Select } from "./canvas/select"
import { Tools } from "./canvas/tools"

export function Collide(canvas){
    const res= {
        updates:[],
        load(){
            this.getCanvas()
            this.mouse = Mouse(this.canvas)
            this.grid = Grid(this.canvas, this.mouse).basedOnNumber()
            this.highlight = Highlight(this.mouse, this.grid)
            this.select= Select(this.canvas,this.highlight, this.grid)

            this.imageLayers = ImageLayers()

            this.tools = Tools(this.canvas, this)


            this.updates.push(this.mouse, this.grid, this.highlight, this.tools, this.select, this.imageLayers)

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