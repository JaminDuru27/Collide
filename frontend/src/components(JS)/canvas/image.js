export function ImageObject(Images,url){
    const res= {
        $nx: 10,
        $ny: 10,
        $w: 100,
        $h: 100,
        $zoom: 1,
        $cw: 0,
        $ch: 0,
        setinfo(obj){this.info = obj;return this},
        reassign(){
            Images.grid.nx = this.$nx
            Images.grid.ny = this.$ny
            if(this.image){
                Images.grid.w = this.imgw
                Images.grid.h = this.imgh
                
            }
            Images.grid.populateBasedOnSize()
        },
        calccw(v){
            console.log(this.imgw, v, this.imgw / v)
            Images.grid.nx = Math.floor(this.imgw / v)
            Images.grid.populateBasedOnSize()
        },
        calcch(v){
            Images.grid.ny = Math.floor(this.imgh / v)
            Images.grid.populateBasedOnSize()
            console.log(`ny`, Images.grid.ny)
            
        },
        calcnumber(nx, ny){
            this.$nx = nx
            this.$ny = ny
            return this
        },
        load(){
            this.parseurl()
        },
        parseurl(){
            this.loaded = false
            this.image = new Image()
            this.image.onload= ()=>{
                this.loaded = true
                this.imgw = this.image.width
                this.imgh = this.image.height
            }
            this.image.src = url
        },
        zoomin(rate){
            if(rate)
            this.$zoom = Math.abs(rate)
            if(this.$zoom > 10)this.$zoom = 10
           
            Images.grid.w += this.$zoom
            Images.grid.h += this.$zoom
            Images.grid.populateBasedOnSize()
        },
        zoomout(rate){
            if(rate)
            this.$zoom = -  Math.abs(rate)
            if(this.$zoom < 1)this.$zoom = 1
            
            Images.grid.w += this.$zoom
            Images.grid.h += this.$zoom
            Images.grid.populateBasedOnSize()
        },
        draw(ctx){
            if(!this.loaded)return
            if(!Images.grid.w && !Images.grid.h)return
            ctx.save()
            ctx.drawImage(
                this.image,
                Images.grid.x,
                Images.grid.y,
                Images.grid.w,
                Images.grid.h,
            )
            ctx.restore()
            
        },
        update({ctx}){
            this.draw(ctx)
            this.$gridw = Images.grid.w
            this.$gridh = Images.grid.h
            this.$nx = Images.grid.nx
            this.$ny = Images.grid.ny
            this.$sw  = this?.imgw / this.$nx
            this.$sh  = this?.imgh / this.$ny
            this.sx = Images.select?.boxes[0]?.indx * this.$sw
            this.sy = Images.select?.boxes[0]?.indy * this.$sh
        },
    }
    res.load()
    return res
}