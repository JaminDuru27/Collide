export function Select(Collide, canvas, shortcuts, sets, ){
    const res = {
        targetA: undefined,
        targetB: undefined,
        shouldupdate: false,
        targetScene:undefined,
        boxes:[],
        load(){
            //if no shortcut or set value, it means its just a test canvas
            this.Scene = (!sets && !shortcuts)?()=>Collide:()=>Collide.scenes?.currentLocker?.currentScene
            this.events()
            if(shortcuts)
            this.shortcuts()
        },
        shortcuts(){
            shortcuts.add(`a`).cb(()=>{
                this.all()
            })
        },
        all(){
            const bx = {
                x: this.Scene().grid.x,
                y: this.Scene().grid.y,
                w: this.Scene().grid.w,
                h: this.Scene().grid.h,
                indx: 0,
                indy: 0,
                indw: this.Scene().grid.nx, 
                indh: this.Scene().grid.ny, 
                rindx: 0, rindy: 0 //relative index
            }
            this.boxes.push(bx)
            if(this.boxes.length >0){
                if(sets)
                sets.setselectoptions(true)
            }

        },
        forEachBox(cb){
            const boxes = []
            this.boxes.forEach(box=>{
                for(let y = 0; y<box.indh;y++){
                    for(let x = 0; x<box.indw;x++){

                        const bx = {
                            indx: box.indx + x,
                            indy: box.indy + y,
                            indw: 1, cw: this.Scene().grid.cw,
                            indh: 1, ch: this.Scene().grid.ch,
                            rindx: x, rindy: y, //relative index
                            ref: box, //reference to original box
                        }
                        bx.x = this.Scene().grid.x + bx.indx * bx.cw 
                        bx.y = this.Scene().grid.y + bx.indy * bx.ch 
                        boxes.push(bx)
                    }
                }
            })
            boxes.map(box=>cb(box))
            return boxes
        },
        events(){
            if(!canvas)return
            canvas.addEventListener(`mousedown`, ()=>{
                if(!this.shouldupdate)return
                if(!this.targetA && Collide.highlight.target)
                this.targetA = Collide.highlight.target 
                this.targetScene = this.Scene() 
            })
            canvas.addEventListener(`dblclick`, ()=>{
                this.boxes = []
                if(sets)
                sets.setselectoptions(false)
            
                //reset layer target
                if(!this.Scene().layers)return
                const layer = this.Scene().layers.currentLayer
                if(layer){
                    layer.target = undefined
                    sets.setTile(null)
                }
            })
            canvas.addEventListener(`pointermove`, (e)=>{
                if(!this.shouldupdate)return
                if(!this.targetScene)return
                if(this.targetA){
                    const {indx, indy, cw, ch} = Collide.highlight.target
                    const up = ()=> indy - this.targetA.indy < 0
                    const left = ()=> indx - this.targetA.indx < 0
                    const right = ()=> indx - this.targetA.indx > 0
                    const bottom = ()=> indy - this.targetA.indy > 0
                    const none = ()=> indy - this.targetA.indy === 0
                    
                    if(right()){
                        this.targetB = {indx: indx + 1, indy: indy, cw,ch}
                    }
                    if(right() && bottom()){
                        this.targetB = {indx: indx + 1, indy: indy + 1, cw,ch}
                    }
                    if(left() && bottom()){
                        this.targetB = {indx: indx , indy: indy +1 , cw,ch}
                    }
                    if(left() && up()){
                        this.targetB = {indx: indx , indy: indy, cw,ch}
                    }
                    if(none()){
                        this.targetB = {indx: indx +1, indy: indy+1, cw,ch}
                    }

                    if(!this.targetB)
                    this.targetB = {indx: indx , indy: indy, cw,ch}
                
                }
            })
            canvas.addEventListener(`pointerup`, ()=>{
                if(this.targetA && this.targetB && this.shouldupdate){
                    const {x, y, w, h, indx, indy, indw, indh} = this.render()
                    this.boxes = [{x, y, w, h,indx, indy, indw, indh}]
                    if(sets){
                        sets.setselectoptions(true)
                    }
                }
                this.targetA = undefined 
                this.targetB = undefined
                this.targetScene = undefined
                this.ctrl = false
            })
            canvas.addEventListener(`pointerdown`, ()=>{
                if(this.ctrl && Collide.highlight.target){
                    this.pushtarget()
                }
                if(this.boxes.length >0){
                    if(sets)
                    sets.setselectoptions(true)
                }
            })
            window.addEventListener(`keydown`, (e)=>{
                if(e.key === `Control`){
                    this.ctrl = true
                }
            })
        },
        pushtarget({indx, indy, indw = 1, indh = 1}){
            const box  = {
                x: this.Scene().grid.x + (indx || Collide.highlight.target.indx) * Collide.highlight.target.cw,
                y: this.Scene().grid.y + (indy || Collide.highlight.target.indy) * Collide.highlight.target.ch,
                w: (Collide.highlight.target.cw * indw),
                h: (Collide.highlight.target.ch * indh),
                indx: (indx || Collide.highlight.target.indx),
                indy: (indy || Collide.highlight.target.indy),
                indw: 1, indh: 1,
            }
            this.boxes.push(box)
            if(this.boxes.length >0){
                if(sets)
                sets.setselectoptions(true)
            }
        },
        render(){
            if(!this.targetA || !this.targetB || !Collide.highlight.target)return{x: 0, y: 0, w: 0, h:0}
            const tAx = this.targetA.indx  * this.targetA.cw + this.Scene().grid.x
            const tAy = this.targetA.indy  * this.targetA.ch + this.Scene().grid.y
            const tBx = this.targetB.indx  * this.targetB.cw + this.Scene().grid.x
            const tBy = this.targetB.indy  * this.targetB.ch + this.Scene().grid.y
            const w = tBx - tAx  
            const h = tBy - tAy

            const wAbs = Math.abs(w)
            const hAbs = Math.abs(h)
            const x = (w < 0)?tAx - wAbs: tAx
            const y = (h < 0)?tAy - hAbs: tAy
            const maxX = Math.max(this.targetA.indx, this.targetB.indx)
            const minX = Math.min(this.targetA.indx, this.targetB.indx)
            const maxY = Math.max(this.targetA.indy, this.targetB.indy)
            const minY = Math.min(this.targetA.indy, this.targetB.indy)
            const indw = maxX - minX
            const indh = maxY - minY
            return {x, y, w:wAbs, h: hAbs, indx: this.targetA.indx, indy: this.targetA.indy, indw, indh}
        },
        draw(ctx){
            if(this.boxes){
                this.boxes.forEach(box=>{
                    ctx.save()
                    ctx.globalAlpha = 0.5
                    ctx.lineWidth = 2
                    ctx.fillStyle = `#0b0a49`
                    ctx.strokeStyle = `#0378c6`
                    //  ctx.setLineDash(2,2)
                    ctx.fillRect(box.x, box.y, box.w, box.h)
                    ctx.strokeRect(box.x, box.y, box.w, box.h)
                    ctx.restore()
                })
            }
            
            
            if(!this.targetA)return
            if(!this.targetB)return
            const tAx = this.targetA.indx  * this.targetA.cw + this.Scene().grid.x
            const tAy = this.targetA.indy  * this.targetA.ch + this.Scene().grid.y
            const tBx = this.targetB.indx  * this.targetB.cw + this.Scene().grid.x
            const tBy = this.targetB.indy  * this.targetB.ch + this.Scene().grid.y
            const w = tBx - tAx 
            const h = tBy - tAy
            ctx.fillStyle = `#0b0a49`
            ctx.fillRect(tAx, tAy, w, h)

            
        },
        update({ctx}){
            this.draw(ctx)
        },
    }
    res.load()
    return res
}