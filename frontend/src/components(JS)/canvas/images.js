import { Grid } from "./grid"
import { Highlight } from "./highlight"
import { ImageObject } from "./image"
import { Mouse } from "./mouse"
import { Select } from "./select"

export function Images(){
    const res = {
        load(){},
        array:[],
        updates: [],
        image: undefined,
        add(dataurl){
            const imgobj= ImageObject(this, dataurl)
            this.array.push(imgobj)
            return imgobj
        },
        deleteImage(imgobj){
            const temp = imgobj
            this.array.splice(this.array.indexOf(imgobj), 1)
            if(this.image === temp)this.image = undefined

        },
        switch(id){
            this.image = this.array.find(img=> img.id === id)
            this.image.reassign()
        },
        setup(canvas){
            this.setupcanvas(canvas)
            this.mouse =  Mouse(this.canvas)
            this.mouse.size = 5
            this.grid = Grid(this.canvas, this.mouse).basedOnSize()
            this.grid.cw = 10
            this.grid.ch = 10
            this.grid.populate()
            this.grid.center()
            this.highlight = Highlight(this.mouse, this.grid)
            this.select = Select(this)
            this.select.shouldupdate = true
            this.updates = [this.mouse,this.grid, this.highlight, this.select]
            return this 
        },
        setupcanvas(canvas){
            this.canvas = canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            window.addEventListener(`resize`, ()=>{
                this.canvas.width = this.canvas.clientWidth
                this.canvas.height = this.canvas.clientHeight
                this.ctx = this.canvas.getContext(`2d`)
            })
        },
        update(){
            const props= {ctx: this.ctx}
            this?.image?.update(props)
            this.updates.forEach(obj=>{obj.update(props)})
        },
        start(){
            this.interval = setInterval(()=>{
                if(!this.ctx)return
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.ctx.imageSmoothingEnabled = false
                this.ctx.globalCompositeOperation = `lighter`
                this.update()
            })
            return this
        }
    }
    res.load()
    return res
}