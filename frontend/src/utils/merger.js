import { DisposableCanvas } from "./disposablecanvas"
import { Grid } from "../components(JS)/canvas/grid"
import { IoEllipseSharp } from "react-icons/io5"

export function Merger(canvasRef, imagesInfo){
    const res = {
        images: [],
        title: `image-merge`,
        showGrid: false,
        cellw: 50,
        cellh: 50,
        wrap: 4,
        save(collide){
            if(!this.currentoperation)return
            const url = canvasRef[`current`].toDataURL(`image/png`)
            const imgobj = collide.images.add(url)
            const {maxindx, maxindy} = this.getMaxIndex()
            imgobj.$nx = maxindx
            imgobj.$ny = maxindy
            imgobj.$w = 200
            imgobj.$h = 200
            imgobj.setinfo({
                name: this.title,type: `image/png`,
                size: `unknown`, url
            })
        },
        download(){
            if(!this.currentoperation)return
            const url = canvasRef[`current`].toDataURL(`image/png`)
            const a = document.createElement(`a`)
            a.href = url
            a.download = this.title + `.png`
            a.click()
        },
        setWrap(v){
            if(!this.currentoperation)return
            this.wrap = v
            if(this.currentoperation)
            this.setOperation(this.currentoperation)
        },
        setcellW(v){
            if(!this.currentoperation)return
            this.cellw = v
            if(this.currentoperation)
            this.setOperation(this.currentoperation)
        },
        setcellH(v){
            if(!this.currentoperation)return
            this.cellh = v
            if(this.currentoperation)
            this.setOperation(this.currentoperation)
        },
        load(){
            // this.grid = Grid(canvas).basedOnSize()
            // this.grid.cw = this.cellw
            // this.grid.ch = this.cellh
            // this.grid.populate()
            this.operations = {
                'Horizontal': this.Horizontal.bind(this),
                'Vertical': this.Vertical.bind(this),
                'Compact': this.Compact.bind(this),
                'X': this.X.bind(this),
                'Y': this.Y.bind(this),
            }
            DisposableCanvas(this, canvasRef).onupdate((p)=>{
                this.images.forEach(image=>{
                    if(image.allLoaded()){
                        image.drawChunks(p, this)
                    }
                })
                // this.grid.update(p)
            }).update()
            this.parseImagesInfo()
        },
        setOperation(name){
            this.currentoperation = name
            this.operations[name]()
            this.wrapCanvas()
            
        },
        Horizontal(){
            this.images.forEach((imgobj, y)=>{
                imgobj.chunks.map((chunk, x)=>chunk.indx = x)
                imgobj.chunks.map((chunk, x)=>chunk.indy = y)
            })
        },
        Vertical(){
            this.images.forEach((imgobj, x)=>{
                imgobj.chunks.map((chunk, y)=>chunk.indy = y)
                imgobj.chunks.map((chunk, y)=>chunk.indx = x)
            })

        },
        Compact(){
            let indx = -1
            let indy =  0
            this.images.forEach(imgobj=>{
                imgobj.chunks.map((chunk, y)=>chunk.indy = 0)
            })
            this.images.forEach((imgobj)=>{
                imgobj.chunks.map((chunk, x)=>{
                    
                    if(indx >= this.wrap-1){indx = -1    ;indy ++}
                    // else 
                    indx++
                    chunk.indx = indx
                    chunk.indy = indy
                })
            })
        },
        X(){
            let ind = -1
            this.images.forEach((imgobj)=>{
                imgobj.chunks.map((chunk, y)=>chunk.indy = 0)
                imgobj.chunks.map((chunk, x)=>{ind++;chunk.indx = ind})
            })
        },
        Y(){
            let ind = -1
            this.images.forEach((imgobj)=>{
                imgobj.chunks.map((chunk, y)=>chunk.indx = 0)
                imgobj.chunks.map((chunk, x)=>{ind++;chunk.indy = ind})
            })
        },
        createImage(info){
            return {
                ...info,   
                chunks:[],
                allLoaded(){return this.chunks.every(c=>c.loaded)},
                splitToChunks(){
                    const cb = (w, h)=>{
                        const cw = w/this.nx
                        const ch = h/this.ny
                        for(let y=0; y< this.ny; y++){
                            for(let x=0; x< this.nx; x++){
                                const canvas = document.createElement(`canvas`)
                                canvas.width = cw ;canvas.height = ch 
                                const ctx = canvas.getContext(`2d`)
                                let sw = cw 
                                let sh = ch 
                                let sx = (sw === Infinity)?0 : sw
                                let sy = (sh === Infinity)?0 : sh
                                ctx.clearRect(0, 0, canvas.width, canvas.height)
                                console.log(w, sw, this.nx)
                                ctx.drawImage(
                                    this.image,
                                    sw * x, sh * y, 
                                    sw, sh,
                                    0, 0, sw,sh
                                )
                                const url = canvas.toDataURL(`image/png`)
                                const newimage = new Image()
                                const chunk={
                                    cw, ch, indx: 0, indy: 0,
                                    img: newimage, rindx: x, rindy: y,
                                }
                                newimage.onload = ()=>{chunk.loaded = true; chunk.imgw; newimage.width; chunk.imgh; newimage.height}
                                newimage.src = url
                                this.chunks.push(chunk)
                            }
                             
                        }

                    }
                    this.image = new Image()
                    this.image.onload = ()=>{
                        this.imgw = this.image.width
                        this.imgh = this.image.height
                        cb(this.image.width, this.image.height)
                    }
                    this.image.src = this.url
                    return this
                },
                drawChunks({ctx}, obj){
                    this.chunks.forEach(chunk=>{
                        ctx.imageSmoothingEnabled = false
                        ctx.drawImage(
                            chunk.img,
                            chunk.indx * obj.cellw,
                            chunk.indy * obj.cellh,
                            obj.cellw, obj.cellh
                        )
                    })
                }
            }
        },
        getMaxIndex(){
            const allchunks = []
            this.images.map(imgobj=>imgobj.chunks.map(chunk=>{allchunks.push(chunk)}))
            const maxindx = Math.max(...allchunks.map(chunk=>chunk.indx + 1))
            const maxindy = Math.max(...allchunks.map(chunk=>chunk.indy + 1))
            return {maxindx, maxindy,}
        },
        wrapCanvas(){
            const {maxindx, maxindy} = this.getMaxIndex()
            const w = maxindx  * this.cellw
            const h = maxindy * this.cellh
            canvasRef[`current`].width = w 
            canvasRef[`current`].height = h
            canvasRef[`current`].style.width = w + `px`
            canvasRef[`current`].style.height = h + `px`
        },

        parseImagesInfo(){
            this.images = []
            imagesInfo.forEach(data=>{
                const image = this.createImage(data).splitToChunks() 
                this.images.push(image)
            })
        }
    }
    res.load()
    return res
}