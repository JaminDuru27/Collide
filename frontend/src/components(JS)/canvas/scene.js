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
        findscenegrid(sceneid){
            let sceneref;
            Collide?.scenes?.lockers?.forEach(locker=>{
                locker.scenes.forEach(scene=>{if(scene.id === sceneid)sceneref = scene})
            })
            return sceneref?.grid
        },
        join(sceneid, dir){
            this.resetjoins()
            this.dir = dir
            this.refsceneid = sceneid
            if(dir===`right`){
                this.getpos = ()=>({x: this.findscenegrid(sceneid)?.x + this.findscenegrid(sceneid)?.w , y: this.findscenegrid(sceneid)?.y})
        
                // scene.joinleft = this.id ;this.joinright = scene.id
            }
            if(dir===`top`){
                this.getpos = ()=>({x: this.findscenegrid(sceneid)?.x , y: this.findscenegrid(sceneid)?.y - this.grid.h})
                // scene.joinbottom = this.id ;this.jointop = scene.id
            }
            if(dir===`left`){
                this.getpos = ()=>({x: this.findscenegrid(sceneid)?.x - this.grid.w, y: this.findscenegrid(sceneid)?.y})
                // scene.joinright = this.id ;this.joinleft = scene.id
            }
            if(dir===`bottom`){
                this.getpos = ()=>({x: this.findscenegrid(sceneid)?.x, y: this.findscenegrid(sceneid)?.y + this.findscenegrid(sceneid)?.h})
                // scene.jointop = this.id ;this.joinbottom = scene.id
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
            this.imageLayers = ImageLayers(this, Collide,Collide.select, this.grid, this.selectoperations)
            this.selectoperations = SelectOperations(Collide, this, sets)

            this.bodyLayers = BodyLayers(Collide, this)

            this.updates.push(
                this.imageLayers,
                this.grid,this.positions,
                Collide.select, 
                this.bodyLayers,
            )

        },
        getData(){
            const data = {
                data: {
                    locked: this.locked, color: this.color,
                    refsceneid: this.refsceneid, dir: this.dir, 
                    id: this.id,
                    // joinleft:this.joinleft,jointop:this.jointop,
                    // joinright:this.joinright,joinbottom:this.joinbottom,
                },
                positions: this.positions.getData(),
                grid: {ny: this.grid.ny, nx: this.grid.nx, cw: this.grid.cw, ch: this.grid.ch},
                layers: [],
                bodyLayers: this.bodyLayers.getData(),
            }
            this.imageLayers.layers.forEach(layer=>{
                const lydata = layer.getData()
                data.layers.push({...lydata})
            })
            return data
        },
        revertData(sceneData){
            this.color = sceneData.data.color
            this.id = sceneData.data.id
            this.grid.nx = sceneData.grid.nx
            this.grid.ny = sceneData.grid.ny
            this.grid.cw = sceneData.grid.cw
            this.grid.ch = sceneData.grid.ch
            this.grid.color = this.color
            this.grid.populate()
            
            this.resetjoins()
            this.imageLayers.array = []
            this.imageLayers.currentLayer = []
            sceneData.layers.forEach(layerdata=>{
                if(Object.keys(layerdata.data).length === 0)return
                const layer  = this.imageLayers.add(`test`)
                layer.revertData(layerdata)
            })
            this.positions.revertData(sceneData.positions)
            this.bodyLayers.revertData(sceneData.bodyLayers)
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