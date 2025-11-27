export function ImageObject(Images,url){
    const res= {
        $nx: 10,
        $ny: 10,
        $w: 100,
        $h: 100,
        $zoom: 1,
        $cw: 0,
        $ch: 0,
        $w: 0,
        $h: 0,
        id: Math.random().toString(36).substring(2,9),
        setinfo(obj){this.info = obj;return this},
        reassign(){
            Images.grid.nx = this.$nx
            Images.grid.ny = this.$ny
            Images.grid.w = this.$w
            Images.grid.h = this.$h    
            Images.grid.populate()
        },
        calccw(v){
            Images.grid.nx = Math.floor(this.imgw / v)
            this.$nx = Images.grid.nx
            Images.grid.populate()

        },
        calcch(v){
            Images.grid.ny = Math.floor(this.imgh / v)
            this.$ny = Images.grid.ny
            Images.grid.populate()
        },
        setnx(v){
            Images.grid.nx = v
            this.$nx = v
            Images.grid.populate()
        },
        setny(v){
            Images.grid.ny = v
            this.$ny = v
            Images.grid.populate()
        },
        calcnumber(nx, ny){
            this.$nx = nx
            this.$ny = ny
            return this
        },
        load(){
            this.parseurl()
            this.$w = Images.grid.w
            this.$h = Images.grid.h
            this.$nx = Images.grid.nx
            this.$ny = Images.grid.ny
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
            this.$w = Image?.grid?.w
            this.$h = Image?.grid?.h
            Images.grid.populate()
        },
        zoomout(rate){
            if(rate)
            this.$zoom = -  Math.abs(rate)
            if(this.$zoom < 1)this.$zoom = 1
            Images.grid.w += this.$zoom
            Images.grid.h += this.$zoom
            this.$w = Image?.grid?.w
            this.$h = Image?.grid?.h
            Images.grid.populate()
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
            this.$sw  = this?.imgw / this.$nx
            this.$sh  = this?.imgh / this.$ny
            this.sx = Images.select?.boxes[0]?.indx * this.$sw
            this.sy = Images.select?.boxes[0]?.indy * this.$sh
            
            if(Images.select?.boxes[0]?.indx === 0)this.sx = 0
            if(Images.select?.boxes[0]?.indy === 0)this.sy = 0


            this.targetindx = Images.select?.boxes[0]?.indx
            this.targetindy = Images.select?.boxes[0]?.indy
            this.targetindw = Images.select?.boxes[0]?.indw
            this.targetindh = Images.select?.boxes[0]?.indh
        },
    }
    res.load()
    return res
}