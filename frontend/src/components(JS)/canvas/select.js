export function Select(canvas,highlight, grid){
    const res = {
        targetA: undefined,
        targetB: undefined,
        boxes:[],
        load(){
            this.events()
        },
        forEachBox(cb){
            const boxes = []
            this.boxes.forEach(box=>{
                for(let y = 0; y<box.indh;y++){
                    for(let x = 0; x<box.indw;x++){

                        const bx = {
                            indx: box.indx + x,
                            indy: box.indy + y,
                            indw: 1, cw: grid.cw,
                            indh: 1, ch: grid.ch,
                            rindx: x, rindy: y, //relative index
                        }
                        bx.x = grid.x + bx.indx * bx.cw 
                        bx.y = grid.y + bx.indy * bx.ch 
                        boxes.push(bx)
                    }
                }
            })
            boxes.forEach(box=>cb(box))
            return boxes
        },
        events(){
            canvas.addEventListener(`mousedown`, ()=>{
                if(!this.targetA && highlight.target)
                this.targetA = highlight.target 
            })
            canvas.addEventListener(`dblclick`, ()=>{
                this.boxes = []
            })
            canvas.addEventListener(`pointermove`, (e)=>{
                if(this.targetA){
                    const {indx, indy, cw, ch} = highlight.target
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
                if(this.targetA && this.targetB){
                    const {x, y, w, h, indx, indy, indw, indh} = this.render()
                    this.boxes = [{x, y, w, h,indx, indy, indw, indh}]
                }
                this.targetA = undefined 
                this.targetB = undefined
                this.ctrl = false
            })
            canvas.addEventListener(`pointerdown`, ()=>{
                if(this.ctrl && highlight.target){
                    const box  = {
                        x: grid.x + highlight.target.indx * highlight.target.cw,
                        y: grid.y + highlight.target.indy * highlight.target.ch,
                        w: highlight.target.cw,
                        h: highlight.target.ch,
                        indx: highlight.target.indx,
                        indy: highlight.target.indy,
                        indw: 1, indh: 1,
                    }
                    this.boxes.push(box)
                }
            })
            window.addEventListener(`keydown`, (e)=>{
                if(e.key === `Control`){
                    this.ctrl = true
                }
            })
        },
        render(){
            if(!this.targetA || !this.targetB || !highlight.target)return{x: 0, y: 0, w: 0, h:0}
            const tAx = this.targetA.indx  * this.targetA.cw + grid.x
            const tAy = this.targetA.indy  * this.targetA.ch + grid.y
            const tBx = this.targetB.indx  * this.targetB.cw + grid.x
            const tBy = this.targetB.indy  * this.targetB.ch + grid.y
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
            console.log(indw,indh)
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
            const tAx = this.targetA.indx  * this.targetA.cw + grid.x
            const tAy = this.targetA.indy  * this.targetA.ch + grid.y
            const tBx = this.targetB.indx  * this.targetB.cw + grid.x
            const tBy = this.targetB.indy  * this.targetB.ch + grid.y
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