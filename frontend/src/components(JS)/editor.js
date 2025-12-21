import { createProject } from "../utils/addProject"
import { DisposableCanvas } from "../utils/disposablecanvas"
import { getProfile } from "../utils/getProfile"
import { updateProject } from "../utils/updatproject"
import { CollisionBodyFactory } from "./canvas/collisionbodyfactory"
import { Highlight } from "./canvas/highlight"
import { Images } from "./canvas/images"
import { Mouse } from "./canvas/mouse"
import { pluginsModsFinder } from "./canvas/pluginsModsFinder"
import { State } from "./canvas/savestate"
import { Scenes } from "./canvas/scenes"
import { Select } from "./canvas/select"
import { ShortCuts } from "./canvas/shortcuts"
import { TileOperations } from "./canvas/tileoperations"
import { Tools } from "./canvas/tools"
import planck from 'plank-js'

export function Collide(canvasRef,gets, info, sets){
    const res= {
        projectName: info.projectname,
        engineid: `Collide-1122334455`,
        id: `Collide-${info.projectid}`,
        scale: 30,
        updates:[],
        plugins: [],
        mods: [],
        mtopx(v){return v * 30},
        pxtom(){return v /30},
        addPlugin(info){
            const plugin = this.pluginsmodshandler.getPlugin(info)()
            this.pluginsmodshandler.openPlugin(plugin)
            this.plugins.push(plugin)
        },
        load(){
            this.loadElements()
            this.loadPlugins()
            this.setupPlanck()
            this.state = State(this, sets)
            
            const data = this.state.save(false)
            sets.setprogresslist(p=>([...p, {title:`initalizing...`, complete:false}]))
            
            if(info.usermode !== `visit`)
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
            else {sets.setprogresslist(p=>([...p, {title:`Thanks For Visiting, Be Sure To Create An Account Later`, complete:true}]));setTimeout(()=>{sets.setToggle(false)}, 3000)}
        },
        setupPlanck(){
            this.pl = planck
            this.world = new pl.World({
                gravity: pl.Vec2(0, -10)
            })

        },
        loadPlugins(genre = `All`){
            this.pluginsmodshandler = pluginsModsFinder(sets).loadplugins(genre) 
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
        drawBodies(){
            if(!this.world)return
            for(let body = this.world.getBodyList(); body; body = body.getNext()){
                for(let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()){
                    this.drawFixture(body, fixture)
                }
            }
        },
        drawFixture(body, fixture){
            const shape = fixture.getShape()
            const shapeType = shape.getType()
            const pos = body.getPosition()
            const angle = body.getAngle()
            
            this.ctx.save()
            this.ctx.translate(pos.x * this.scale, -pos.y * this.scale)
            this.ctx.rotate(-angle)
            this.ctx.strokeStyle = '#fff'
            this.ctx.lineWidth = 2
            
            if(shapeType === 'polygon'){
                const vertices = shape.getVertices()
                this.ctx.beginPath()
                if(vertices && vertices.length > 0){
                    this.ctx.moveTo(vertices[0].x * this.scale, -vertices[0].y * this.scale)
                    for(let i = 1; i < vertices.length; i++){
                        this.ctx.lineTo(vertices[i].x * this.scale, -vertices[i].y * this.scale)
                    }
                    this.ctx.closePath()
                }
                this.ctx.stroke()
            }
            else if(shapeType === 'circle'){
                const radius = shape.getRadius()
                this.ctx.beginPath()
                this.ctx.arc(0, 0, radius * this.scale, 0, Math.PI * 2)
                this.ctx.stroke()
            }
            else if(shapeType === 'edge'){
                const vertices = shape.getVertices()
                if(vertices && vertices.length >= 2){
                    this.ctx.beginPath()
                    this.ctx.moveTo(vertices[0].x * this.scale, -vertices[0].y * this.scale)
                    this.ctx.lineTo(vertices[1].x * this.scale, -vertices[1].y * this.scale)
                    this.ctx.stroke()
                }
            }
            
            this.ctx.restore()
        },
        start(){
            const animate = (p) => {
                this.ctx = p.ctx
                if(!this.ctx)return
                this.updates.forEach(obj=>{
                    obj.update({ctx: this.ctx})
                    if(this.world){
                        this.world.set(1/60)
                        this.drawBodies()
                    }
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