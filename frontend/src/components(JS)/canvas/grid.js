export function Grid(canvas, Collide, gridtranslate = false){
    const res  = {
        x: 0, y: 0,
        w: 100, h: 100,
        nx: 20, ny: 20,
        cw: 20, ch:20,
        alpha: 0.1, color: `#fff`,
        boxes2d: [], boxes:[],
        $ontranslate: [],
        $onpopulate: [],
        ontranslate(cb){this.$ontranslate.push(cb);return this},
        onpopulate(cb){this.$onpopulate.push(cb);return this},
        call(name){this[`$${name}`].forEach(cb=>cb())},
        load(){
            this.populate = this.populateBasedOnNumber
            this.populate()
            this.center()
            if(gridtranslate)this.events()
            else this.events2()
        },
        basedOnNumber(){
            this.populate = this.populateBasedOnNumber
            return this
        },
        basedOnSize(){
            this.populate = this.populateBasedOnSize
            return this
        },
        events2(){
            let dx=0, dy = 0
            canvas.addEventListener(`mousedown`, (e)=>{
                if(e.button !== 2)return
                const b = canvas.getBoundingClientRect()
                dx = Collide.tx - e.clientX
                dy = Collide.ty - e.clientY
            })
            canvas.addEventListener(`pointermove`, (e)=>{
                const b = canvas.getBoundingClientRect()
                if(dx && dy){
                    Collide.tx = e.clientX + dx
                    Collide.ty = e.clientY + dy
                    this.call(`ontranslate`)
                }
            })
            canvas.addEventListener(`mouseup`, (e)=>{
                if(e.button !== 2)return
            })
            canvas.addEventListener(`pointerup`, (e)=>{
                dx= null
                dy= null
            })
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
                    this.call(`ontranslate`)
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
            if(!gridtranslate){
                Collide.tx = (window.innerWidth /2) - (this.w /2)
                Collide.ty = (window.innerHeight /2) - (this.h /2)
            }else{
                this.x = canvas.width/2 - this.w/2 
                this.y = canvas.height/2 - this.h/2
            }
        },
        populateBasedOnSize(){this.boxes2d = []
            this.boxes = []
            if(!this.w && !this.h)return
            const cw= this.w/this.nx
            const ch= this.h/this.ny
            for(let y =0; y< this.ny; y++){
                const arr= []
                for(let x =0; x< this.nx; x++){
                    const box = {
                        indx: x, indy: y, cw, ch,
                        inveiw:()=>{
                            const px = this.x + (x * cw)
                            const py = this.y + (y * ch)
                            return(
                                (px + cw > 0 &&
                                py + ch > 0) &&
                                (py + ch < window.innerHeight &&
                                px + cw < window.innerWidth
                                )
                            )
                        },
                    }
                    arr.push(box)
                }
                if(arr.length > 0)this.boxes2d.push(arr)
            }
            this.boxes = this.boxes2d.flat()
            this.call(`onpopulate`)
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
                    const box = {indx: x, indy: y, cw, ch,
                        inveiw:()=>{
                            const px = this.x + (x * cw)
                            const py = this.y + (y * ch)
                            return(
                                (px + cw > 0 &&
                                py + ch > 0) &&
                                (py + ch < window.innerHeight &&
                                px + cw < window.innerWidth
                                )
                            )
                        },
                    }
                    arr.push(box)
                }
                if(arr.length > 0)this.boxes2d.push(arr)
            }
            this.boxes = this.boxes2d.flat()
            this.call(`onpopulate`)

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
            this.boxes.map(box=>{
                // console.log(box.inveiw())
                if(!box.inveiw()){box.hidden = true;return}
                else box.hidden = false
                ctx.globalAlpha = this.alpha
                ctx.strokeStyle =this.color
                ctx.strokeRect(box.indx * box.cw, box.indy * box.ch, box.cw, box.ch)

            })
            ctx.restore()
        },
    }
    res.load()
    return res
}