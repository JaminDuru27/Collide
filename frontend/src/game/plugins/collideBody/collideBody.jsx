import { DisposableCanvas } from "../../../utils/disposablecanvas"
import { genId } from "../../../utils/genid"
import { getRandomHexColor } from "../../../utils/randomcolor"
import { CollideBodyUI } from "./collideBodyUI"

export function CollideBody({Scene, Collide, Tile}){
    const res = {
        name:`CollideBody`,
        mode: undefined,
        vertices:[],
        shapes: [],
        size: 10,
        toggle: true,
        mx:0, my:0,
        targetShape: null,
        options: [],
        remove(){
            Tile.collisionplugin = undefined
            Tile.plugins.splice(Tile.plugins.indexOf(this), 1)
            this.shapes.forEach(shape=>{
                if(shape.body){
                    Collide.world.destroyBody(shape.body)
                }
            })
        },
        downloadJSON(name = `preset`){
            const save = this.save()
            const string = JSON.stringify(save, null, 2)
            const blob = new Blob([string], {
                contentType : `application/json`
            })
            const a = document.createElement(`a`)
            a.download = name.replace(/\s+/g, '')
            a.href = URL.createObjectURL(blob)
            a.click()
        },
        save(){
            const shapes = [
                ...this.shapes.map(e=>({
                    type: e.type, 
                    id: e.id, 
                    name: e.name, 
                    geometry: e.geometry, 
                    vertices: e.vertices, 
                    color: e.color, 
                    macros: e.macros, 
                }))
            ]
            const data = {
                vars: {name: this.name,size: this.size,},
                shapes
            }
            return data
        },
        revert(data){
            this.shapes = []
            this.targetShape = undefined
            this.name = data.vars.name; this.size = data.vars.size
            data?.shapes.forEach(shapedata=>{
                const d = this.createPolyBody({geometry: shapedata.geometry,type: shapedata.type})
                for(let x in shapedata){
                    d[x]  = shapedata[x]
                }
                this.shapes.push(d)
            })
        },
        downloaddata(){},
        load(){
            Tile.collisionplugin = this
            this.options = [
                {name: `macros`, cb:(id, setrefresh, setshowmacros)=>{
                    const find = this.shapes.find(shape=>shape.id === id)
                    if(find){
                        this.targetShape = find
                        setshowmacros(p=>true)
                    }
                } },
                {name: `clear`, cb:(id, setrefresh, setshowmacros)=>{
                    const find = this.shapes.find(shape=>shape.id === id)
                    if(find){
                        this.targetShape = find
                        this.targetShape.vertices = []
                    }
                } },
                {name: `delete`, cb:(id, setrefresh, setshowmacros)=>{
                    const find = this.shapes.find(shape=>shape.id === id)
                    if(find){
                        this.targetShape = find
                        this.targetShape.delete = true
                        this.shapes.splice(this.shapes.indexOf(this.targetShape), 1)
                        setrefresh(p=>!p)
                    }
                } },
            ]

            this.ui= <CollideBodyUI  object={this}/>
            this.variables = {}            
        },

        pointInPolygon(point, polygon){
            let inside = false
            for(let i= 0, j = polygon.length -1 ; i < polygon.length  - 1; j = i++){
                const xi = polygon[i].x, yi = polygon[i].y
                const xj = polygon[j].x, yj = polygon[j].y
                const intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
                if(intersect) inside = !inside
            }
            return inside
        },
        createPolyBody({geometry, type}){
            const data = {
                type: `dynamic`,
                geometry:`polygon`,
                id: genId(),
                color: getRandomHexColor(),
                vertices: [],
                name: `shape ${this.shapes.length + 1}`,
                macros: [
                    {name: `title`,  value:`shape ${this.shapes.length + 1}`},
                    {name: `offsetx`, value: 0, title:`x offset`},
                    {name: `offsety`, value: 0, title:`y offset`},
                    {name: `density`, var: `density`, value: 1, title:`density`},
                    {name: `restitution`, var: `restitution`, value:0.1},
                    {name: `friction`, var: `friction`, value:0.1},
                    {name: `air friction`, var: `frictionAir`, value:0.01, title:`air resistance`},
                    {name: `initial angle`, var: `angle`, value: 0},
                    {name: `angle damping`, var: `angleDamping`, value: 0, title:`angular damping`},
                    {name: `gravity scale`, var: `gravityScale`, value: 1, title:`weight effect`},
                    {name: `bullet`, var: `bullet`, value: false, title:`bullet mode`},
                    {name: `isSensor`, var: `isSensor`, value:false, title:`collision detection not physical`},
                    {name: `fixed rotation`, var: `fixedRotation`, value: false, title:`fixed rotation`},
                    {name: `display color`, value: getRandomHexColor()},
                    {name: `restrict rotation`, value: ()=>{
                        this.mode = `rotation`
                    }},
                ],
                updateFromMacros(){
                    console.log(`updating from macros`)
                    this.macros.forEach(m=>{
                        if(m.var === `density`){this.body?.getFixtureList().setDensity(m.value)}
                        if(m.var === `restitution`){this.body?.getFixtureList().setRestitution(m.value)}
                        if(m.var === `friction`){this.body?.getFixtureList().setFriction(m.value)}
                        if(m.var === `frictionAir`){this.body?.setLinearDamping(m.value)}
                        if(m.var === `angle`){this.body?.setAngle(m.value * Math.PI / 180)}
                        if(m.var === `angleDamping`){this.body?.setAngularDamping(m.value)}
                        if(m.var === `gravityScale`){this.body?.setGravityScale(m.value)}
                        if(m.var === `bullet`){this.body?.setBullet(m.value)}
                        if(m.var === `isSensor`){this.body?.getFixtureList().setSensor(m.value)}
                    })
                },
                rewriteBody(){
                    const cb = ()=>{
                        this.calcpos(true)
                        const ratiostopx = ()=>{
                            return this.vertices.map(v=>({
                                x: v.ratio.x * Tile.w - Tile.w / 2,
                                y: v.ratio.y * Tile.h - Tile.h / 2,
                            }))
                        }
                        function pxtom(verticespx){
                            return verticespx.map(v=>({
                                x: Collide.pxtom(v.x),
                                y: -Collide.pxtom(v.y),
                            })) 
                        }
                        const props = {}
                        this.macros.forEach(m=>{
                            if(m.var){
                                props[m.var] = (typeof m.value === `function`)? m.value() : m.value
                            }
                        })

                        const x = (Tile.x + Tile.w/2)
                        const y = -(Tile.y + Tile.h/2)

                        if(this.body){
                            Collide.world.destroyBody(this.body)
                        }
                        this.body = Collide.world.createBody({
                            type: `${type || `dynamic`}`,
                            position: Collide.pl.Vec2(Collide.pxtom(x), Collide.pxtom(y)),
                        })
                        this.body.info = {color: `red`}
                        const local = ratiostopx()
                        const vertices = pxtom(local)
                        this.body.createFixture(
                            Collide.pl.Polygon(vertices),
                            props
                        )
                        this.calcpos()
                    }
                    cb()
                },
                addvertex: (x, y)=>{
                    const v = {x, y}
                    v.ratio = {
                        x: (x-this.x) / this.w,
                        y: (y-this.y) / this.h,
                    }
                    data.vertices.push(v)
                },
                calcpos:(basedOnTile)=>{
                    const obj = (basedOnTile)? Tile : this
                    data.vertices.map(v=>{
                        v.x = obj.x + v.ratio.x * obj.w
                        v.y = obj.y + v.ratio.y * obj.h
                    })
                },
                update:()=>{
                    data.name = data.macros.find(e=>e.name === `title`)?.value
                    data.color = data.macros.find(e=>e.name === `display color`)?.value
                    if(data?.body?.info)
                    data.body.info.color = data.color

                },
            }
            return data
        },
        reset(){
            this.vertices = []; this.cv = 0; this.finished = false
        },
        addBody(info){
            this.reset()
            if(info.geometry === `polygon`){
                const b = this.createPolyBody({info})
                b.type = info.type; b.geometry = info.geometry
                this.shapes.push(b)
                this.targetShape = b
            }
            if(info.geometry === `square`){
                const b = this.createPolyBody({info})
                const vertices = [
                    {"x":251.73861694335938,"y":252.69317626953125},
                    {"x":353.7386169433594,"y":252.69317626953125},{"x":353.7386169433594,"y":354.69317626953125},
                    {"x":253.73861694335938,"y":354.69317626953125},{"x":252.73861694335938,"y":252.69317626953125}
                ]
                vertices.forEach(v=>{b.addvertex(v.x, v.y)})
                b.type = info.type; b.geometry = info.geometry
                this.shapes.push(b)
                this.targetShape = b
            }
            if(info.geometry === `triangle`){
                const b = this.createPolyBody({info})
                const vertices = [
                    {"x":254.73861694335938,"y":350.69317626953125},{"x":304.7386169433594,"y":253.69317626953125},
                    {"x":352.7386169433594,"y":348.69317626953125},{"x":254.73861694335938,"y":347.69317626953125}
                ]
                vertices.forEach(v=>{b.addvertex(v.x, v.y)})
                b.type = info.type; b.geometry = info.geometry
                this.shapes.push(b)
                this.targetShape = b
            }
        },
        
        updatemouse(x, y){
            this.mx = x; this.my = y
            const v = this.getHoveredVertice()
        },
        addvertice(){
            if(this?.targetShape?.geometry !== `polygon`)return            
            if(this.finished || !this.targetShape)return
            let is
            this.vertices.forEach(v=>{if(v.x === this.mx && v.y === this.my)is = true})
            if(is)return
            if(this.finished)return
            
            if(this.targetShape.vertices.length <= 8)
            if(this.targetShape.vertices.length >= 3){
                const first = this.targetShape.vertices[0]
                const dist = Math.hypot(first.x - this.mx, first.y - this.my)
                if(dist < 10){
                    this.targetShape.addvertex(first.x, first.y)
                    this.finished = true
                    return
                }
            }
            if(this.targetShape.vertices.length <= 8)
            this.targetShape.addvertex(this.mx, this.my)
        },
        onverticehover(){
            // returns the index of hovered vertice or -1 if none
            return (this.hoveredIndex != null) ? this.hoveredIndex : -1
        },
        findHoveredVertice(x, y){
            if(typeof x !== 'number' || typeof y !== 'number') return -1
            for(let i = 0; i < this.vertices.length; i++){
                const vx = this.vertices[i].x
                const vy = this.vertices[i].y
                const dist = Math.hypot(vx - x, vy - y)
                if(dist <= this.size) return i
            }
            return -1
        },
        getHoveredVertice(){
            const idx = this.onverticehover()
            return idx >= 0 ? this.vertices[idx] : null
        },
        mouseDown(e){
            if(e.button === 0){
                this.addvertice()
            }else{
                this.vertices.delete  = true
            }
        },
        saveshape(){
            this.finished = true
            this.targetShape.calcpos()
            this.targetShape.rewriteBody()
            console.log(JSON.stringify(this.targetShape.vertices))
            // this.reset()
        },
        editShape(shape){
            this.targetShape = this.shapes.find(s=>s.id === shape.id)
            if(!this.targetShape)return
            this.reset()
            this.vertices = this.targetShape.vertices
            this.finished = false
        },
        drawvertice({ctx}){
            
            this.shapes.forEach((shape, x)=>{
                
                if(shape.delete){
                    this.shapes.splice(x, 1)
                    return
                }
                shape.update()
                if(shape.vertices.length <= 0)return
                ctx.save()
                ctx.beginPath()
                ctx.strokeStyle = (shape.highlighted)?`yellow`:shape.color ||`white`
                ctx.fillStyle = shape.color || `red`
                ctx.globalAlpha = (shape.highlighted)? 1 : 0.5
                const v = shape.vertices[0]
                ctx.moveTo(v.x, v.y)

                shape.vertices.forEach(v=>{
                    ctx.lineTo(v.x, v.y)
                })
            
                if(this.targetShape && this?.targetShape.id === shape.id && this?.targetShape?.geometry === `polygon`){
                    if(this.targetShape.vertices.length <= 0)return
                    ctx.lineTo(this.mx, this.my)   
                }
                ctx.globalAlpha = 0.2
                ctx.fill()
                ctx.globalAlpha = 0.9
                ctx.stroke()
                ctx.globalAlpha = 0
                ctx.closePath()
                ctx.restore()        

                ctx.save()
                ctx.beginPath()
                ctx.globalAlpha = 0.7
                ctx.fillStyle = shape.color
                shape.vertices.forEach(v=>{
                    ctx.arc(v.x, v.y, this.size, 0, Math.PI * 2)
                })
                ctx.closePath()
                ctx.restore()

            })
        },
        updateDim(){
            this.w  = 100; this.h = 100
            this.x= this.canvas.width/2 - this.w/2
            this.y= this.canvas.height/2 - 100
        },
        drawTile(p){
            const ctx = p.ctx
            ctx.save()
            if(Tile.sprite){
                const x = this.x, y= this.y, w = this.w, h = this.h
                Tile.sprite.drawbib(p,x, x, w, h)
            }
            ctx.restore()
        },

        dethover(){
            if(this.targetShape){
                if(this.pointInPolygon({x: this.mx, y: this.my}, this.targetShape.vertices)){
                    this.targetShape.highlighted = true
                }else{
                    this.targetShape.highlighted = false
                }
            }
        },
        highlightHoveredShape({ctx}){
        },
        open(canvasRef){
            this.canvas = canvasRef[`current`]
            this.disposableCanvas = DisposableCanvas(this, canvasRef).onupdate((p)=>{
                if(!this.toggle)return
                this.drawTile(p)
                this.drawvertice(p)
                this.highlightHoveredShape(p)
                this.dethover()
            }).update()

            this.updateDim()

        },
        close(){
            this.disposableCanvas.dispose()
        },
    }
    res.load()
    return res
}
CollideBody.prototype.info = ()=> ({
    name: `CollideBody`,
    thumbnailSource: `/plugins/collide1thumb.png`,
    descr: 'Bring Characters into the world with this exciting plugin',
    id: `9392hdd-12288dhw8dpdq/Collide-1122334455`,//id is id/enfineid for verification 
    type: `tile`,
    genre: `All`
})