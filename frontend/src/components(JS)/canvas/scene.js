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
        locked: false,
        updates:[],
        color: getRandomHexColor(),
        id: `scene`+ genId(),
        joinleft: undefined,joinright: undefined,
        jointop: undefined, joinbottom: undefined,
        join(scene, dir){
            this.resetjoins()
            if(dir===`right`){
                scene.getpos = ()=>({x: this.grid.x + this.grid.w, y: this.grid.y})
                scene.joinleft = this ;this.joinright = scene
            }
            if(dir===`top`){
                scene.getpos = ()=>({x: this.grid.x, y: this.grid.y - scene.grid.h})
                scene.joinbottom = this ;this.jointop = scene
            }
            if(dir===`left`){
                scene.getpos = ()=>({x: this.grid.x - scene.grid.w, y: this.grid.y})
                scene.joinright = this ;this.joinleft = scene
            }
            if(dir===`bottom`){
                scene.getpos = ()=>({x: this.grid.x, y: this.grid.y + this.grid.h})
                scene.jointop = this ;this.joinbottom = scene
            }
        },
        resetjoins(){
            this.joinleft= undefined;this.joinright= undefined;
            this.jointop= undefined; this.joinbottom= undefined;
        },
        getpos(){return {x: this.grid.x, y: this.grid.y}},
        load(){
            this.canvas = Collide.canvas
            this.grid = Grid(this.canvas, Collide.mouse).basedOnNumber()
            this.grid.color = this.color
            this.positions = PositionPoints(Collide, Collide.shortcuts, this.grid, Collide.tools, Collide.mouse)
            this.grid.onpopulate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            this.grid.ontranslate(()=>{this.bodyLayers.getallbodies().map(body=>body.calcpos())})
            this.imageLayers = ImageLayers(Collide.select, this.grid, this.selectoperations)
            this.selectoperations = SelectOperations(Collide, this, sets)

            this.bodyLayers = BodyLayers()

            this.updates.push(
                this.imageLayers,
                this.grid,this.positions,
                Collide.select, 
                this.bodyLayers,
            )

        },
        update(p){
            if(this.grid){
                const {x, y}= this.getpos()
                this.grid.x = x ;this.grid.y = y
            }

            this.updates.forEach(obj=>{
                obj.update(p)
            })
 
        },
    }
    res.load()
    return res
}