export function Grid(canvas, mouse){
    const res  = {
        x: 0, y: 0,
        w: 100, h: 100,
        nx: 10, ny: 10,
        cw: 20, ch:20,
        alpha: 0.1, color: `#fff`,
        boxes2d: [], boxes:[],
        load(){
            this.populate = this.populateBasedOnNumber
            this.populate()
            this.center()
            this.events()
        },
        basedOnNumber(){
            this.populate = this.populateBasedOnNumber
            return this
        },
        basedOnSize(){
            this.populate = this.populateBasedOnSize
            return this
        },
        events(){
            let dx=0, dy = 0
            canvas.addEventListener(`mousedown`, (e)=>{
                if(e.button !== 2)return
                const b = canvas.getBoundingClientRect()
                dx = e.clientX - this.x  + b.x
                dy = e.clientY - this.y + b.y
            })
            canvas.addEventListener(`pointermove`, (e)=>{
                const b = canvas.getBoundingClientRect()
                if(dx && dy){
                    this.x = (e.clientX + b.x) - dx
                    this.y = (e.clientY + b.y) - dy
                }
            })
            canvas.addEventListener(`mouseup`, (e)=>{
                if(e.button !== 2)return
                dx= null
                dy= null
            })
            // canvas.addEventListener(`pointerup`, (e)=>{
            //     dx= null
            //     dy= null
            // })
        },
        center(){
            this.x = canvas.clientWidth /   2 - this.w/2
            this.y = canvas.clientHeight /   2 - this.h/2
        },
        populateBasedOnSize(){this.boxes2d = []
            this.boxes = []
            if(!this.w && !this.h)return
            const cw= this.w/this.nx
            const ch= this.h/this.ny
            for(let y =0; y< this.ny; y++){
                const arr= []
                for(let x =0; x< this.nx; x++){
                    const box = {indx: x, indy: y, cw, ch,}
                    arr.push(box)
                }
                if(arr.length > 0)this.boxes2d.push(arr)
            }
            this.boxes = this.boxes2d.flat()
        },
        populateBasedOnNumber(){
            this.boxes2d = []
            this.boxes = []
            const cw = this.cw
            const ch = this.ch
            this.w = cw * this.nx
            this.h = ch * this.ny
            for(let y =0; y< this.ny; y++){
                const arr= []
                for(let x =0; x< this.nx; x++){
                    const box = {indx: x, indy: y, cw, ch,}
                    arr.push(box)
                }
                if(arr.length > 0)this.boxes2d.push(arr)
            }
            this.boxes = this.boxes2d.flat()
        },
        draw(){},
        update({ctx}){
            ctx.save()
            ctx.lineWidth = 1  
            ctx.strokeStyle = `white`
            ctx.strokeRect(this.x, this.y, this.w, this.h)
            ctx.restore()

            ctx.save()
            ctx.translate(this.x, this.y)
            this.boxes.forEach(box=>{
                ctx.globalAlpha = this.alpha
                ctx.strokeStyle = this.color
                ctx.strokeRect(box.indx * box.cw, box.indy * box.ch, box.cw, box.ch)

            })
            ctx.restore()
        },
    }
    res.load()
    return res
}