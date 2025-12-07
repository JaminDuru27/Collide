import { genId } from "../../utils/genid"
import { getRandomHexColor } from "../../utils/randomcolor"
import { BodyLayers } from "./bodies"
import { Grid } from "./grid"
import { Highlight } from "./highlight"
import { Images } from "./images"
import { ImageLayers } from "./layers"
import { Mouse } from "./mouse"
import { PositionPoints } from "./positions"
import { Select } from "./select"
import { SelectOperations } from "./selectoperations"
import { TileOperations } from "./tileoperations"
let s = 0
export function Scene(name, Collide, sets,gets){
    const res = {
        name,
        updates:[],
        color: getRandomHexColor(),
        id: `scene`+ genId(),
        load(){
            this.canvas = Collide.canvas
            this.grid = Grid(this.canvas, Collide.mouse).basedOnNumber()
            this.grid.x = s * this.grid.w ;this.grid.y = 0
            s += 1
            this.grid.color = this.color
            this.positions = PositionPoints(Collide, Collide.shortcuts, this.grid, Collide.tools, Collide.mouse)
            this.grid.onpopulate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            this.grid.ontranslate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            this.highlight = Highlight(Collide.mouse, this.grid, sets)

            this.imageLayers = ImageLayers(Collide.select, this.grid, this.selectoperations)
            this.images  = Images()
            this.selectoperations = SelectOperations(Collide, this,this.images, sets)

            this.bodyLayers = BodyLayers()

            this.updates.push(
                this.imageLayers,
                this.grid,this.positions, this.highlight, 
                Collide.select, 
                this.bodyLayers,
            )

        },
        update(p){
            this.updates.forEach(obj=>{
                obj.update(p)
            })
 
        },
    }
    res.load()
    return res
}