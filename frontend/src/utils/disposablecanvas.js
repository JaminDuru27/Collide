export function DisposableCanvas(object, canvasRef){
    const res = {

        load(){
            object.ctx = canvasRef[`current`].getContext(`2d`) 
            canvasRef[`current`].width = canvasRef[`current`].clientWidth 
            canvasRef[`current`].height = canvasRef[`current`].clientHeight 

            window.addEventListener(`resize`, ()=>{
            canvasRef[`current`].width = canvasRef[`current`].clientWidth 
            canvasRef[`current`].height = canvasRef[`current`].clientHeight 
                if(object.onresize)object.onresize
            })
            object.clear = this.clear.bind(this)
            object.dispose = this.dispose.bind(this)
            object.updatedisposablecanvas = this.update.bind(this)
        },
        clear(){object.ctx.clearRect(0, 0, canvasRef[`current`]?.width, canvasRef[`current`]?.height); return this},
        hardimage(){object.ctx.imageSmoothingEnabled = false},
        $onupdate:[],
        onupdate(cb){this.$onupdate.push(cb.bind(object));return this},
        update(intervaltime = 1000/60){
            object.ctx = canvasRef[`current`]?.getContext(`2d`)
            if(!object.ctx)return 
            this.animate = ()=>{
                if(object.ctx){
                    object.ctx.canvas.width = canvasRef[`current`]?.clientWidth  ||  0
                    object.ctx.canvas.height = canvasRef[`current`]?.clientHeight || 0
                    
                    this.clear()
                    this.hardimage()
                    const props = {ctx: object.ctx}
                    this.$onupdate.map(cb=>cb(props))
                }
            }
            this.interval = setInterval(()=>{this.animate()}, intervaltime)
            return this
        },
        dispose(){
            clearInterval(this.interval)
        },
    }
    res.load()
    return res
}