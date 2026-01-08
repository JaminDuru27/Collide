import { BsHouseSlash } from "react-icons/bs"
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
import { TileRef } from "./canvas/tileRef"
import { Tools } from "./canvas/tools"
import planck from 'planck-js'
import { PluginsModsPreset } from "./canvas/pluginspresets"
import { SelectOperations } from "./canvas/selectoperations"

export function Collide(canvasRef,gets, info, sets){
    const res= {
        projectName: info.projectname,
        engineid: `Collide-1122334455`,
        id: `Collide-${info.projectid}`,
        scale: 20,
        sx: 1, sy: 1,
        tx: 0, ty: 0,
        pl: null,
        world: null,
        updates:[],
        plugins: [],
        mods: [],
        devmodecbs: [],
        drawmodecbs: [],
        onplaycbs: [],
        onpausecbs: [],
        state: null,
        mode: `draw`,
        devstate: `pause`,
        // UTILS
        $ontileswitch: [],
        ontileswitch(cb){this.$ontileswitch.push(cb)},
        ontileswitchcb(t){this.$ontileswitch.forEach(cb=>{cb(t); console.log(t)})},

        mtopx(m){return this.scale * m},
        pxtom(px){return px / this.scale},
        addPlugin(info){
            const plugin = this.pluginsmodshandler.getPlugin(info)()
            this.pluginsmodshandler.openPlugin(plugin)
            this.plugins.push(plugin)
        },
        //
        ondevmode(cb){this.devmodecbs.push(cb)},
        ondrawmode(cb){this.drawmodecbs.push(cb)},
        onplay(cb){this.onplaycbs.push(cb)},
        onpause(cb){this.onpausecbs.push(cb)},
        setMessage(props ){if(props)sets.setFeedInfo(props)},
        startVariableOptions(varhandler, p){
            sets.setVarHandler({varhandler, ...p})
        },
        switchmode(mode){
            if(mode === `draw`){this.mode = `draw`;this.drawmodecbs.forEach(cb=>cb());sets.setMode(mode)}
            if(mode === `dev`){this.mode = `dev`;this.devmodecbs.forEach(cb=>cb());sets.setMode(mode)}
        },
        setdevstate(state){
            if(state === `play`){this.devstate = `play`;this.onplaycbs.forEach(cb=>cb())}
            if(state === `pause`){this.devstate = `pause`;this.onpausecbs.forEach(cb=>cb())}
        },
        load(){
            this.loadPlugins()
            this.loadElements()
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
            this.world = new this.pl.World({
                gravity: this.pl.Vec2(0, 0)
            })
            this.ondrawmode(()=>{
                this.setdevstate(`pause`)
                this.world.setGravity(this.pl.Vec2(0, 0))
                sets.setupdateAll(p=>!p)
            })
            this.onplay(()=>{
                this.world.setGravity(this.pl.Vec2(0, -1))
            })
            this.onpause(()=>{
                this.world.setGravity(this.pl.Vec2(0, 0))
            })
            

        },
        loadPlugins(genre = `All`){
            this.pluginsmodspreset = PluginsModsPreset()
            this.pluginsmodshandler = pluginsModsFinder(sets).loadplugins(genre) 
        },
        loadElements(){
            this.getCanvas()
            this.shortcuts = ShortCuts()
            this.tools = Tools(this.canvas, this, sets)
            this.mouse = Mouse(this.canvas, this)
            this.select= Select(this,this.canvas, this.shortcuts,sets,)
            this.selectoperations = SelectOperations(this, sets)
            
            this.tileoperations  = TileOperations(this,this.select,sets)
            this.images = Images()
            this.scenes = Scenes(this, sets, gets)
            this.highlight = Highlight(this.mouse, this,)
            this.collisionbodyfactory  = CollisionBodyFactory(this, sets)
            this.tileReference = TileRef(this, sets)
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
            const c = ()=>{
                const scenes  = this.scenes.currentLocker.scenes
                if(scenes)
                scenes.forEach(scene=>{
                    const layer = scene.imageLayers.currentLayer
                    if(layer)
                    layer?.tiles?.forEach(tile=>tile.resetdim())
                    layer.target = undefined

                    const grid = scene.grid
                    grid.hidden = false

                })

            }
            const cc = ()=>{
                const scenes  = this.scenes.currentLocker.scenes
                if(scenes)
                scenes.forEach(scene=>{
                    const grid = scene.grid
                    grid.hidden = true
                }) 
            }
            this.onpause(()=>{c()})
            this.onplay(()=>{cc()})
            this.ondrawmode(()=>{c()})
            this.shortcuts.add('`').cb(()=>{
                if(this.mode === `dev`)this.switchmode(`draw`)
                else if(this.mode === `draw`)this.switchmode(`dev`)
                console.log(this.mode)
            })
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
            this.ctx.translate(this.mtopx(pos.x), -this.mtopx(pos.y) )
            this.ctx.rotate(-angle)
            this.ctx.strokeStyle = '#fff'
            this.ctx.lineWidth = 2
            if(shapeType === 'polygon' || shapeType === this.pl.Shape.Type.POLYGON){
                // Polygon fixture: convert local vertices to world coordinates
                const vertices = shape.m_vertices || (shape.getVertices && shape.getVertices())
                if (vertices && vertices.length > 0){
                    this.ctx.beginPath()
                    const wv0 = body.getWorldPoint(vertices[0])
                    // console.log(this.mtopx(wv0.x))
                    this.ctx.moveTo(this.mtopx(vertices[0].x),  -this.mtopx(vertices[0].y))
                    // this.ctx.moveTo(this.mtopx(wv0.x),  this.mtopx(wv0.y))
                    for(let i = 1; i < vertices.length; i++){
                        const wv = body.getWorldPoint(vertices[i])
                        this.ctx.lineTo(this.mtopx(vertices[i].x), -this.mtopx(vertices[i].y))
                        // this.ctx.lineTo(this.mtopx(wv.x),  this.mtopx(wv.y))
                    }
                    this.ctx.closePath()
                    this.ctx.globalAlpha = 0.4;this.ctx.stroke()
                    
                    const color = body?.info?.hidden?`transparent`:body?.info?.color || 'rgba(255,255,255,1)'
                    this.ctx.globalAlpha = 0.3;this.ctx.fillStyle = color
                    this.ctx.fill()
                    this.ctx.globalAlpha = 1
                }
            }
            
            else if(shapeType === 'circle'){
                const radius = shape.getRadius()
                this.ctx.beginPath()
                this.ctx.arc(0, 0, this.mtopx(radius), 0, Math.PI * 2)
                this.ctx.stroke()
            }
            else if(shapeType === 'edge'){
                const vertices = shape.getVertices()
                if(vertices && vertices.length >= 2){
                    this.ctx.beginPath()
                    this.ctx.moveTo(this.mtopx(vertices[0].x), -this.mtopx(vertices[0].y))
                    this.ctx.lineTo(this.mtopx(vertices[1].x), -this.mtopx(vertices[1].y))
                    this.ctx.stroke()
                }
            }
            
            this.ctx.restore()
        },
        start(){
            const animate = (p) => {
                this.ctx = p.ctx
                if(!this.ctx)return
                this.ctx.scale(this.sx, this.sy)
                this.ctx.translate(this.tx, this.ty)
                this.updates.forEach(obj=>{
                    if(this.world){
                        this.world.step(1/60)
                        this.drawBodies()
                    }
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