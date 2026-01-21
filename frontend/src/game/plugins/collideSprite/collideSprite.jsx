import { DisposableCanvas } from "../../../utils/disposablecanvas.js"
import { genId } from "../../../utils/genid.js"
import { CollideSpriteUI } from "./collideSpriteUI.jsx"
export default function CollideSprite({Scene, Collide, Tile}){
    const res = {
        name: `CollideSprite`,
        toggle: true,
        clips: [],
        delaytime: 1,
        loop: true,
        roffsetx: 0, roffsety: 0, roffsetw: 0, roffseth: 0,
        offsetx:0, offsety: 0, offsetw: 0, offseth: 0,
        x: 0, y: 0, w: 0, h: 0, 
        flipX: false, flipY: false,
        spw: 100, sph: 100,
        minframe: 0, maxframe: 0,
        framex: 0, framey: 0,
        angle: 0,
        frame:0,
        imageid: undefined,
        sw:undefined, sh: undefined,
        
        // requirements(){return Tile.collisionplugin !== undefined},
        requirements(){return true},
        requiredMessage: `CollideSprite plugin requires CollideBody plugin to be added to the tile first.`,
        save(){
            const data = {
                title: this.name,
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
        dispid: genId(),
        open(canvasRef, setrefresh){
            this.setrefresh = setrefresh
            this.canvas = canvasRef[`current`]
            this.opened = true
            this.disposableCanvas = DisposableCanvas(this, canvasRef, this.dispid).onupdate((p)=>{
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
            let imagemenu
            if(Tile.sprite){
                this.varnode = Tile.varHandler.getNode({name: ()=>this.name, src: `/plugins/collidespritethumb.png`})
                this.varnode.addvar({name:()=>`toggle`, id:`133-${this.name}`, set:(v)=>this.toggle = v, get:()=>this.toggle})
                this.varnode.addvar({name:()=>`flip X`, id:`1ef302ne5237flippxi-${this.name}`, set:(v)=>this.flipX = v, get:()=>this.flipX})
                this.varnode.addvar({name:()=>`flip Y`, id:`139g377g32psfliootpy33-${this.name}`, set:(v)=>this.flipY = v, get:()=>this.flipY})
                this.clipsfolder =this.varnode.createFolder({name:()=>`clips`})
                this.imageid= Tile?.sprite?.imageobj?.id
                this.sw=Tile?.sprite?.sw
                this.sh= Tile?.sprite?.sh
                this.image = Collide.images.array.find(e=>e.id=== this.imageid)?.image
                this.calcnxny()
            }else imagemenu = true
            this.ui = <CollideSpriteUI object = {this} Tile={Tile} imagemenu={imagemenu}/>

            if(this.propsavailable()){
                Tile[`sprite`] = undefined
                Tile[`sprite`] = this 
            }
            
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
        degtorad(deg){return deg * Math.PI * 180},
        getrefdim(){
            if(!this.collisionbodyref){
                return {x: this.tilx, y: this.tily, w: this.tilw, h: this.tilh}
            }
        },
        reassignratiofromrefdim(){
            const {x, y, w, h} = this.getrefdim()
            if(!this.collisionbodyref){
                this.ratio = {
                    x: (x- this.spx)  / w,
                    y: (y-this.spy) / h,
                    w: this.spw / w,
                    h: this.sph / h,
                }
            }
        },
        resetdimfromratio(){
            if(this.ratio){
                const {x,y, w, h} = this.getrefdim()
                this.spx = x - this.ratio.x * w   
                this.spy = y - this.ratio.y * h 
                this.roffsetx = this.ratio.x * w  
                this.roffsety = this.ratio.y * h   
            }
        },
        drawdim({ctx}){
            const scale = this.scale
            ctx.fillStyle = `gold`
            ctx.globalAlpha  = 0.4
            ctx.fillRect(this.spx, this.spy, this.spw, this.sph)
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
            const xm = (this.flipX)?-1: 1
            const ym = (this.flipY)?-1: 1
            ctx.scale(xm, ym)
            ctx.translate(xm * x, ym * y)
            ctx.translate(xm * w/2, ym * h/2)//centering
            ctx.rotate(Tile.angle)
            ctx.drawImage(
                this.image,
                this.sw * this.framex, 
                this.sh * this.framey,
                this.sw, this.sh,                
                xm * (-w/2), ym * (-h/2),xm * w, ym * h,
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
                remove:()=>{
                    data.flaggeddelete = true
                    this.clips.forEach((clip, i)=>{
                        if(clip === data){
                            this.clips.splice(i, 1)
                        }
                    })
                    if(data.folder){
                        this.clipsfolder.destroyFolder(data.folder)
                    }
                },
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
            data.folder = this?.clipsfolder?.createFolder({name: ()=>data.name});

            [`from`, `to`, `delaytime`, `name`, `loop`, `name`].map(x=>{
                data.folder.addvar({id: `${data.name}${x}`,name: ()=>x, set:(v)=>{if(v){data[x] = v}}, get: ()=>data[x]})
            })
            data.folder.addvar({id: `play${data.name}`, name:()=>`play`, 
            set:(v)=>{
                this.playclip(data)
            }, get: ()=>()=>{}})

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
        replay(){
            this.frame = this.minframe
        },
        replayfromframe(frame){
            if(frame < this.clip.from)return
            if(frame > this.clip.to)return
            
            this.frame = frame
        },
        update(p){
            if(!this.toggle)return
            if(!this.propsavailable())return
            if(!this.ratio)return
            this.w = Tile.w * this.ratio.w
            this.h = Tile.h * this.ratio.h

            this.x = Tile.x - this.roffsetx 
            this.y = Tile.y - this.roffsety 
            
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
            this.clips.forEach(clip=>{
                clip.remove()
            })
        },

        updateframes(){
            if(this.frame >= this.maxframe){
                if(this.loop)this.frame = this.minframe
                else this.frame = this.maxframe
            }else {
                this.delay(this.delaytime, ()=>{
                    this.framex = Math.floor(this.frame % this.nx)
                    this.framey = Math.floor(this.frame / this.nx)
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
            this.tilx = this.canvas.width/2 - (this.w/2)
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