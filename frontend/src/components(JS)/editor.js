import { DisposableCanvas } from "../utils/disposablecanvas"
import { BodyLayers } from "./canvas/bodies"
import { CollisionBodyFactory } from "./canvas/collisionbodyfactory"
import { Grid } from "./canvas/grid"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { ImageLayers } from "./canvas/layers"
import { Mouse } from "./canvas/mouse"
import { PositionPoints } from "./canvas/positions"
import { Scenes } from "./canvas/scenes"
import { Select } from "./canvas/select"
import { SelectOperations } from "./canvas/selectoperations"
import { ShortCuts } from "./canvas/shortcuts"
import { TileOperations } from "./canvas/tileoperations"
import { Tools } from "./canvas/tools"

export function Collide(canvasRef,gets, sets){
    const res= {
        updates:[],
        load(){
            this.getCanvas()
            this.shortcuts = ShortCuts()
            this.tools = Tools(this.canvas, this, sets)
            this.mouse = Mouse(this.canvas)
            this.select= Select(this,this.canvas, this.shortcuts,sets,)
            this.tileoperations  = TileOperations(this,this.select,sets)
            
            this.scenes = Scenes(this, sets, gets)
            this.collisionbodyfactory  = CollisionBodyFactory(this, sets)


            // this.mouse = Mouse(this.canvas)
            // this.grid = Grid(this.canvas, this.mouse).basedOnNumber()
            // this.positions = PositionPoints(this)
            // this.grid.onpopulate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            // this.grid.ontranslate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            // this.highlight = Highlight(this.mouse, this.grid, sets)
            // this.select= Select({...this, sets})
            // this.tileoperations  = TileOperations(this, sets)
            // this.selectoperations = SelectOperations(this, sets)

            this.updates.push(
                // this.imageLayers, this.mouse, 
                // this.grid,this.positions, this.highlight, 
                this.select,
                this.mouse,
                this.scenes,
                this.tools, 
                // this.select, 
                // this.collisionbodyfactory, 
                // this.bodyLayers
            )

            //assets
            this.images = Images()

            
        },
        getCanvas(){
            this.canvas = canvasRef[`current`]
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
            const animate = (p) => {
                this.ctx = p.ctx
                if(!this.ctx)return
                this.updates.forEach(obj=>{
                    obj.update({ctx: this.ctx})
                })
            }
            this.disposableCanvas = DisposableCanvas(this, canvasRef)
            .onupdate(animate)
            .update()
        }
    }
    res.load()
    return res
}