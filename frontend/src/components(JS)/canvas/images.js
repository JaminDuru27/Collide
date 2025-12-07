import { DisposableCanvas } from "../../utils/disposablecanvas"
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
        setup(canvasRef){
            this.setupcanvas(canvasRef)
            console.log(this.canvas)
            this.mouse =  Mouse(this.canvas)
            this.mouse.size = 5
            this.grid = Grid(this.canvas, this.mouse).basedOnSize()
            this.grid.cw = 10
            this.grid.ch = 10
            this.grid.populate()
            this.grid.center()
            this.highlight = Highlight(this.mouse, this.grid)
            this.select = Select(this, this.canvas, )
            this.select.shouldupdate = true
            this.updates = [this.mouse,this.grid, this.highlight, this.select]
            return this 
        },
        setupcanvas(canvasRef){
            this.canvasRef = canvasRef
            this.canvas = canvasRef[`current`]
            window.addEventListener(`resize`, ()=>{
                this.canvas.width = this.canvas.clientWidth
                this.canvas.height = this.canvas.clientHeight
                if(this.ctx)
                this.ctx = this.canvas.getContext(`2d`)
                
            })
        },
        start(){
            const update = (p)=>{
                this.ctx = p.ctx
                if(!this.ctx)return
                this.ctx.globalCompositeOperation = `lighter`
                this?.image?.update(p)
                this.updates.forEach(obj=>{obj.update(p)})
            }
            this.disposableCanvas = DisposableCanvas(this, this.canvasRef)
            .onupdate((p)=>{
                update(p)
            })
            .update() 
            return this
        }
    }
    res.load()
    return res
}