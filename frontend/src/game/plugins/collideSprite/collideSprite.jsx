import { DisposableCanvas } from "../../../utils/disposablecanvas.js"
import { genId } from "../../../utils/genid.js"
import { CollideSpriteUI } from "./collideSpriteUI.jsx"
export function CollideSprite({Scene, Collide, Tile}){
    const res = {
        name: `CollideSprite`,
        toggle: true,
        clips: [],
        delaytime: 1,
        loop: true,
        roffsetx: 0, roffsety: 0, roffsetw: 0, roffseth: 0,
        offsetx:0, offsety: 0, offsetw: 0, offseth: 0,
        x: 0, y: 0, w: 0, h: 0, 
        spw: 100, sph: 100,
        minframe: 0, maxframe: 0,
        framex: 0, framey: 0,
        frame:0,
        imageid: Tile.sprite.imageobj.id,
        sw:Tile.sprite.sw, sh: Tile.sprite.sh,
        
        // requirements(){return Tile.collisionplugin !== undefined},
        requirements(){return true},
        requiredMessage: `CollideSprite plugin requires CollideBody plugin to be added to the tile first.`,
        save(){
            const data = {
                vars:{
                    name: this.name,
                    toggle: this.toggle, imageid:this.imageid,
                    sw: this.sw, sh: this.sh, 
                    minframe: this.minframe,
                    maxframe: this.maxframe
                },
                clips: [...this.clips.map(clip=>({
                    delaytime: clip.delaytime,
                    name: clip.name,
                    from: clip.from,
                    to: clip.to,
                    loop: clip.loop,
                    id: clip.id,
                }))],
            }
            return data
        },
        revert(save){
            for(let x in save.vars){
                this[x] = save.vars[x]
            }
            this.clips = []
            this[`currentclip`] = undefined
            save.clips.forEach(clipdata=>{
                const clip = this.createclip(clipdata.name)
                for(let i in clipdata){
                    clip[i] = clipdata[i]
                }
            })
            if(this.setrefresh)this.setrefresh(p=>!p)
            
        },
        downloaddata(name = `preset`){
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
        open(canvasRef, setrefresh){
            this.setrefresh = setrefresh
            this.canvas = canvasRef[`current`]
            this.opened = true
            this.disposableCanvas = DisposableCanvas(this, canvasRef).onupdate((p)=>{
                if(!this.toggle)return
                if(this.propsavailable() && this.opened){
                    this.drawrefs(p)
                    this.drawdim(p)
                    this.drawbib(p, this.spx,this.spy,this.spw,this.sph)
                    this.updateframes()
                    if(this.currentclip)this.currentclip.update()

                }
            }).update()
            this.calcdim()
            if(!this.ratio){
                this.reassignratiofromrefdim()
                this.resetdimfromratio()
                
            }
        },
        
        close(){
            this.disposableCanvas.dispose()
            this.opened = false 
            console.log(`closed sprite editor`, Tile)
        },
        load(){
            if(!this.requirements())return
            Tile[`sprite`] = undefined
            Tile[`sprite`] = this 
            this.ui = <CollideSpriteUI object = {this}/>
            this.image = Collide.images.array.find(e=>e.id=== this.imageid)?.image
            this.calcnxny()
        },
        calcnxny(){
            this.nx = Math.floor(this.image.width / this.sw)
            this.ny = Math.floor(this.image.height / this.sh)
            if(!this.maxframe || this.maxframe > this.nx * this.ny){
                this.maxframe = this.nx * this.ny
            }
        },
        propsavailable(){
            return (
                this.image && this.imageid && this.sw && this.sh
                && this.nx && this.ny
            )
        },
        scale: 1,
        tileref(){return Tile}, 
        getrefdim(){
            if(!this.collisionbodyref){
                return {x: this.tilx, y: this.tily, w: this.tilw, h: this.tilh}
            }
        },
        reassignratiofromrefdim(){
            const {x, y, w, h} = this.getrefdim()
            if(!this.collisionbodyref){
                this.ratio = {
                    x: this.spx / w,
                    y: this.spy / h,
                    w: this.spw / w,
                    h: this.sph / h,
                }
            }
        },
        resetdimfromratio(){
            if(this.ratio){
                const {x,y, w, h} = this.getrefdim()
                this.spx = this.ratio.x * w   
                this.spy = this.ratio.y * h
                this.roffsetx = this.ratio.x * this.w   
                this.roffsety = this.ratio.y * this.h   
                console.log(this.ratio, this.spx, this.roffsetx)
            }
        },
        drawdim({ctx}){
            const scale = this.scale
            ctx.fillStyle = `gold`
            ctx.globalAlpha  = 0.4
            ctx.fillRect(this.spx, this.spy, this.w, this.h)
            ctx.globalAlpha  = 1
            ctx.lineWidth = 2
            ctx.setLineDash([4, 3])
            ctx.strokeStyle = `yellow`
            ctx.globalAlpha  = 0.4
            ctx.strokeRect(this.spx, this.spy, this.spw, this.sph)
            ctx.globalAlpha  = 1
            ctx.setLineDash([])

        },
        drawrefs({ctx}){
            const {x,y, w, h} = this.tileref()
            const scale = this.scale
            ctx.fillStyle = `#fff`
            ctx.globalAlpha  = 0.2
            ctx.fillRect(this.tilx, this.tily, this.tilw, this.tilh)
            ctx.globalAlpha  = 1
        },
        drawbib({ctx}, x, y, w, h){
            ctx.save()
            ctx.drawImage(
                this.image,
                this.sw * this.framex, 
                this.sh * this.framey,
                this.sw, this.sh,                
                x, y, w,h,
            )
            ctx.restore()
        },
        createclip(name){
            const data = {
                from: 0, to: this.maxframe -1,
                delaytime: 100, loop:true,
                id: `clip${genId()}`,
                name: name || `clip${this.clips.length +1}`,
                $onframe: [],
                onframe(frame, cb){this.$onframe.push({frame, cb}); return this},
                updateFromMain:()=>{
                    data.delaytime = this.delaytime
                    data.from = this.minframe
                    data.to = this.maxframe
                    data.loop = this.loop
                },
                update:(p)=>{
                    data.$onframe.forEach(of=>{
                        if(of.frame === this.frame){
                            of.cb()
                        }
                    })
                }
            }
            data.updateFromMain.bind(this)
            this.clips.push(data)
            this.setcurrentclip(data)
            return data
        },
        setcurrentclip(clip){
            this.currentclip = clip
        },
        playclip({id}){
            this.clips.forEach(c=>{
                if(c.id === id){
                    this.clip(c.from, c.to)
                    this.delaytime = c.delaytime
                    this.loop = c.loop
                }
            })

        },
        clip(from, to){
            this.maxframe = to
            this.minframe = from
            this.frame = from
        },   
        update(p){
            if(!this.propsavailable())return
            if(!this.ratio)return
            this.x = Tile.x + this.roffsetx
            this.y = Tile.y + this.roffsety
            this.w = Tile.w
            this.h = Tile.h
            this.drawbib(p, 
            this.x, 
            this.y,
            this.w,
            this.h
            )
            if(!this.opened){
                this.updateframes()
                if(this.currentclip)this.currentclip.update()
            }
        },
        remove(){
            Tile.sprite = undefined

        },

        updateframes(){
            if(this.frame >= this.maxframe){
                if(this.loop)this.frame = this.minframe
                else this.frame = this.maxframe
            }else {
                this.delay(100, ()=>{
                    this.framey = Math.floor(this.frame/this.ny)
                    this.framey = Math.min(this.ny -1, this.framey)
                    this.framex = this.frame  - this.framey * this.nx
                    this.frame++
                })
            }
        },
        calcdim(){
            this.x = Tile.x + this.roffsetx
            this.y = Tile.y + this.roffsety
            this.w = Tile.w + this.roffsetw
            this.h = Tile.h + this.roffseth
            this.spx = this.canvas.width/2 - (this.w/2)
            this.spy = this.canvas.height/2 - (this.h/2)
            this.tilx = this.canvas.height/2 - (this.h/2)
            this.tily = this.canvas.height/2 - (this.h/2)
            this.tilw = this.spw; this.tilh = this.sph
        },
        n:0,
        delay(delay, callback){
            if(this.n >= delay){
                callback()
                this.n = 0
            }
            this.n ++ 
        },
        mouseOnSprite(){
            return (
                this.mx > this.spx &&
                this.my > this.spy && 
                this.mx < this.spx + this.spw &&
                this.my < this.spy + this.sph
            )
        },
        updatemouse(x, y){
            this.mx = x
            this.my = y
            if(this.md){
                this.spx = this.mx - (this?.d?.x || 0)
                this.spy = this.my - (this?.d?.y || 0)
                this.reassignratiofromrefdim()
            }
        },
        mouseup(e){this.md = false; this.resetdimfromratio()},
        mousedown(e){
            if(this.mouseOnSprite()){
                this.md = true
                this.d = {x: this.mx - this.spx, y: this.my - this.spy}
            }else this.md = false
        },
    }
    res.load()
    return res
}
CollideSprite.prototype.info =()=> ({
    name: `CollideSprite`,
    thumbnailSource: `/plugins/ui1thumb.jpg`,
    descr: 'animate spritesheets with this plugin. Bring yout characters to life!',
    id: `93i0j30djd9n'ddjdi/Colllide-1122334455`,//id is id/enfineid for verification 
    type: `tile`,
    genre: `All`,
})