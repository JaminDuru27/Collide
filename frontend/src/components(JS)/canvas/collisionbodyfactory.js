import { getRandomHexColor } from "../../utils/randomcolor"
import { CollisionBody } from "../tile/collision"
import { Grid } from "./grid"
import { Highlight } from "./highlight"
import { Mouse } from "./mouse"
import { Select } from "./select"

export function CollisionBodyFactory(Collide, sets){
    const res = {
        targetTiles:[],
        vertices: [],
        updates: [],
        points: [],
        color: Collide.scenes?.currentScene?.bodyLayers?.currentLayer?.color ?? getRandomHexColor(),
        alpha: 0.9,
        lineWidth: 0,
        pointersize: 7,
        finished: false,
        setupcanvas(canvas){
            this.canvas = canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            window.addEventListener(`resize`, ()=>{
                this.resizeOp()
            })
            this.setupupdates()
            this.setupevents()
        },
        checkshape(){
            if(!this.firstv)return
            if(!this.lastv)return
            if(this.firstv === this.lastv)return
            if(this.collision(this.lastv, this.firstv)){
                this.lastv.x = this.firstv.x
                this.lastv.y = this.firstv.y
                this.finished = true
            }
        },
        collision(pointA, pointB){
            const dx = pointA.x - pointB.x
            const dy = pointA.y - pointB.y
            const distancsquared  =  dy * dy + dx * dx
            const sumradii = this.pointersize
            const radiisqrd = sumradii * sumradii
            return(distancsquared <= radiisqrd)
        },
        setupevents(){
            this.canvas.addEventListener(`mousedown`,(e)=>{
                if(e.button === 0){
                    if(this.finished)return
                    const p ={x: e.clientX, y:e.clientY}
                    const obj = Point(this).setp(p.x, p.y, ()=>this.grid.x, ()=>this.grid.y,()=>this.grid.w, ()=>this.grid.h)
                    if(this.vertices.length <= 0) this.firstv = obj
                    this.vertices.push(obj)
                    this.lastv = obj
                    this.checkshape()
                }
            })
            window.addEventListener(`keyup`, (e)=>{
                this.mouse.unrestrict()
            })
            window.addEventListener(`keydown`,(e)=>{
                if(e.key === `x` || e.key === `X`){
                    if(!this.lastv)return; if(!this.firstv)return
                    this.mouse.x = this.lastv.x
                    this.mouse.unrestrictx()
                    this.mouse.restricty()
                }
                if(e.key === `y` || e.key === `Y`){
                    if(!this.lastv)return; if(!this.firstv)return
                    this.mouse.y = this.lastv.y
                    this.mouse.unrestricty()
                    this.mouse.restrictx()
                }
                if(e.key === `ArrowRight`){
                    if(!this.lastv)return; if(!this.firstv)return
                    const p = {x: this.lastv.x + this.grid.cw, y: this.lastv.y}
                    const obj = Point(this).setp(p.x, p.y, ()=>this.grid.x, ()=>this.grid.y,()=>this.grid.w, ()=>this.grid.h)
                    this.vertices.push(obj)
                    this.lastv = obj    
                }
                if(e.key === `ArrowLeft`){
                    if(!this.lastv)return; if(!this.firstv)return
                    const p = {x: this.lastv.x - this.grid.cw, y: this.lastv.y}
                    const obj = Point(this).setp(p.x, p.y, ()=>this.grid.x, ()=>this.grid.y,()=>this.grid.w, ()=>this.grid.h)
                    this.vertices.push(obj)
                    this.lastv = obj    
                }
                if(e.key === `ArrowUp`){
                    if(!this.lastv)return; if(!this.firstv)return
                    const p = {x: this.lastv.x , y: this.lastv.y -  this.grid.ch}
                    const obj = Point(this).setp(p.x, p.y, ()=>this.grid.x, ()=>this.grid.y,()=>this.grid.w, ()=>this.grid.h)
                    this.vertices.push(obj)
                    this.lastv = obj    
                }
                if(e.key === `ArrowDown`){
                    if(!this.lastv)return; if(!this.firstv)return
                    const p = {x: this.lastv.x , y: this.lastv.y +  this.grid.ch}
                    const obj = Point(this).setp(p.x, p.y, ()=>this.grid.x, ()=>this.grid.y,()=>this.grid.w, ()=>this.grid.h)
                    this.vertices.push(obj)
                    this.lastv = obj    
                }
            })
        },
        zoomin(){
            this.grid.cw += 10
            this.grid.ch += 10
            this.grid.populate()
            this.vertices.forEach(v=>v.calcpos())
        },
        zoomout(){
            this.grid.cw -= 10
            this.grid.ch -= 10
            this.grid.populate()
            this.vertices.forEach(v=>v.calcpos())
        },
        clear(){
            this.vertices  = []
            this.firstv = undefined
            this.lastv = undefined
            this.finished =false
        },
        addtoworld(){
            if(!this.finished){sets.setFeedInfo({message:`Complete polygon`, type   :'message'});return}
            sets.setFeedInfo(null)
            const body  = CollisionBody(Collide)
            body.color = this.color
            const array =[]
            this.vertices.forEach(v=>{
                array.push({
                    x: v.x - this.grid.x,// doesnt matter 
                    y: v.y - this.grid.y ,
                    ratio: v.ratio,
                })
            })
            const minx = Math.min(...this.targetTiles.map(e=>e.indx))
            const miny = Math.min(...this.targetTiles.map(e=>e.indy))
            body.addVertices(array)
            .setContainerIndex({indx: minx, indy:miny, indw: this.grid.nx, indh: this.grid.ny})
            .calcpos()
            if(Collide.bodyLayers.currentLayer)
            Collide.bodyLayers.currentLayer.addBody(body)
            sets.setbodyfactory(null)
            this.clear()
            this.targetTiles = []
        },
        resizeOp(){
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            if(this.grid)this.grid.center()
        },
        setupupdates(){
            this.mouse =  Mouse(this.canvas)
            this.mouse.size = 5
            this.grid = Grid(this.canvas, this.mouse).basedOnNumber()
            this.grid.cw = 10
            this.grid.ch = 10
            this.grid.populate()
            this.grid.ontranslate(()=>{
                this.vertices.forEach(v=>v.calcpos())
            })
            // this.grid.alpha = 0
            this.grid.center()
            this.highlight = Highlight(this.mouse, this.grid)
            this.updates = [this.mouse,this.grid, this.highlight]
                        
        },
        addtiles(tiles){
            this.targetTiles = tiles
            this.maxrindx = Math.max(...this.targetTiles.map(e=>e.rindx))
            this.maxrindy = Math.max(...this.targetTiles.map(e=>e.rindy))

            this.grid.nx = this.maxrindx + 1
            this.grid.ny = this.maxrindy + 1
            this.grid.populate()
        },
        load(){},
        draw(){
            this.targetTiles.forEach(tile=>{
                if(tile.sprite)
                this.ctx.drawImage(
                tile.sprite.imageobj.image,
                tile.sprite.sx,
                tile.sprite.sy,
                tile.sprite.sw,
                tile.sprite.sh,
                this.grid.x + tile.rindx * this.grid.cw,
                this.grid.y + tile.rindy * this.grid.ch,
                tile.indw * this.grid.cw,
                tile.indh * this.grid.ch,
            )
            })
        },
        drawvertices(){
            if(this.vertices.length <= 0)return
            this.ctx.save()
            this.ctx.globalAlpha = this.alpha
            this.ctx.lineWidth = this.lineWidth
            this.ctx.strokeStyle = this.color
            this.ctx.globalAlpha = (this.alpha -.2 <= 0)?0: this.alpha - .2 
            this.ctx.fillStyle = this.color
            this.ctx.beginPath()
            this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
            this.vertices.forEach((v, i)=>{
                if(i === 0 )return
                this.ctx.lineTo(v.x, v.y)
                if(!this.finished)this.ctx.stroke()
            })
            if(this.finished)this.ctx.stroke()
            if(this.finished)this.ctx.fill()
            this.ctx.closePath()
            this.ctx.restore()

            //updatepoint
            if(!this.finished)
            this.vertices.forEach((v, i)=>{
                v.update(this.ctx, (v === this.firstv)?`red`: this.color, this.alpha, this.pointersize)
                if(v.delete)this.vertices.splice(i, 1)
            })
 
        },
        drawGhost(){
            if(this.finished)return
            if(!this.lastv)return
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.globalAlpha = (this.alpha - 0.2 <= 0)?0 : this.alpha - 0.2
            this.ctx.strokeStyle = this.color
            this.ctx.moveTo(this.lastv.x, this.lastv.y)
            this.ctx.lineTo(this.mouse.x, this.mouse.y)
            this.ctx.stroke()
            this.ctx.closePath()
            this.ctx.restore()
        },
        update(p){
            if(!this.canvas)return
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.imageSmoothingEnabled = false
            this.ctx.globalCompositeOperation = `lighter`
        
            const props= {ctx: this.ctx}
            this.drawvertices()
            this.drawGhost()

            this.updates.forEach(obj=>{obj.update(props)})
 
            this.draw()

        }
    }
    res.load()
    return res
}


function Point(factory){
    const res ={
        setp(x, y,getparentx, getparenty, getparentw, getparenth){
            this.x = x; this.y = y;
            this.getparentw = getparentw; this.getparenth = getparenth;
            this.getparentx = getparentx; this.getparenty = getparenty;
            this.calcratio();
            return this
        },
        calcratio(){
            this.ratio = {
                x: (this.x - factory.grid.x) / factory.grid.w,
                y: (this.y - factory.grid.y) / factory.grid.h,
            }
        },
        calcpos(){
            this.x = factory.grid.x + this.ratio.x * this.getparentw()   
            this.y = factory.grid.y + this.ratio.y * this.getparenth()   
        },

        draw(ctx, color, alpha, size){
            if(!this.x && !this.y)return
            ctx.save()
            ctx.beginPath()
            ctx.globalAlpha  = alpha
            ctx.fillStyle =  color
            ctx.strokeStyle = color 
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        },
        remove(){this.delete = true},
        update(ctx, color  = `yellow`, alpha = 0.4, size = 5){
            this.draw(ctx, color, alpha, size)
        }
    }
    return res
}