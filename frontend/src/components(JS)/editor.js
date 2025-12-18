import { useNavigate } from "react-router-dom"
import { createProject } from "../utils/addProject"
import { DisposableCanvas } from "../utils/disposablecanvas"
import { genId } from "../utils/genid"
import { getProfile } from "../utils/getProfile"
import { updateProject } from "../utils/updatproject"
import { BodyLayers } from "./canvas/bodies"
import { CollisionBodyFactory } from "./canvas/collisionbodyfactory"
import { Grid } from "./canvas/grid"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { ImageLayers } from "./canvas/layers"
import { Mouse } from "./canvas/mouse"
import { pluginsModsFinder } from "./canvas/pluginsModsFinder"
import { PositionPoints } from "./canvas/positions"
import { State } from "./canvas/savestate"
import { Scenes } from "./canvas/scenes"
import { Select } from "./canvas/select"
import { SelectOperations } from "./canvas/selectoperations"
import { ShortCuts } from "./canvas/shortcuts"
import { TileOperations } from "./canvas/tileoperations"
import { Tools } from "./canvas/tools"

export function Collide(canvasRef,gets, info, sets){
    const res= {
        projectName: info.projectname,
        engineid: `Collide-1122334455`,
        id: `Collide-${info.projectid}`,
        updates:[],
        load(){
            this.loadElements()
            this.loadPlugins()
            this.state = State(this, sets)
            
            const data = this.state.save(false)
            sets.setprogresslist(p=>([...p, {title:`initalizing...`, complete:false}]))
            getProfile((userdata)=>{
                if(!userdata){sets.setprogresslist(p=>([...p, {title:`Failed To Find User...`, complete:false}]));return}
                sets.setprogresslist(p=>([...p, {title:`Created Project...`, complete:true}]))

                createProject(data, (d)=>{
                    if(d.success === false){
                        sets.setprogresslist(p=>([...p, {title:d.message, complete:false}]))
                        return
                    }
                    if(d.success){
                        const pdata =d.data.projectdata
                        this.state.revert(pdata)
                        sets.setprogresslist(p=>([...p, {title:`Updating Project...`, complete:false}]))
                        updateProject(pdata, ()=>{
                            sets.setprogresslist(p=>([...p, {title:`Updated Project Successfully`, complete:true}]))
                            sets.setprogresslist(p=>([...p, {title:`Done`, complete:true}]))
                            sets.setToggle(false)
                            
                        })
                    }
                })
            })
        },
        loadPlugins(genre = `All`){
            this.pluginsmodshandler = pluginsModsFinder().loadplugins(genre) 
        },
        loadElements(){
            this.getCanvas()
            this.shortcuts = ShortCuts()
            this.tools = Tools(this.canvas, this, sets)
            this.mouse = Mouse(this.canvas)
            this.select= Select(this,this.canvas, this.shortcuts,sets,)
            this.tileoperations  = TileOperations(this,this.select,sets)
            this.images  = Images()
            
            this.scenes = Scenes(this, sets, gets)
            this.highlight = Highlight(this.mouse, this,)
            this.collisionbodyfactory  = CollisionBodyFactory(this, sets)
            this.updates.push(
                this.mouse,
                this.scenes,
                this.tools, 
                this.select,
                this.highlight,
                this.collisionbodyfactory, 
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