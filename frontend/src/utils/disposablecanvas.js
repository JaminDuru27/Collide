export function DisposableCanvas(object, canvas){
    const res = {

        load(){
            object.ctx = canvas.getContext(`2d`) 
            canvas.width = canvas.clientWidth 
            canvas.height = canvas.clientHeight 

            window.addEventListener(`resize`, ()=>{
            canvas.width = canvas.clientWidth 
            canvas.height = canvas.clientHeight 
                if(object.onresize)object.onresize
            })
            object.clear = this.clear.bind(this)
            object.dispose = this.dispose.bind(this)
            object.update = this.update.bind(this)
        },
        clear(){object.ctx.clearRect(0, 0, canvas.width, canvas.height); return this},
        hardimage(){object.ctx.imageSmoothingEnabled = false},
        $onupdate:[],
        onupdate(cb){this.$onupdate.push(cb);return this},
        update(){
            this.animate = ()=>{
                if(object.ctx){
                    this.clear()
                    this.hardimage()
                    const props = {ctx: object.ctx}
                    this.$onupdate.map(cb=>cb(props))
                }
            }
            this.interval = setInterval(()=>{this.animate()}, 1000/60)
            return this
        },
        dispose(){
            clearInterval(this.interval)
        },
    }
    res.load()
    return res
}