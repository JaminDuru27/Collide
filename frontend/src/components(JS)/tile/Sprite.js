export function Sprite(Tile,Collide, Scene){
    const res = {
        indx: 0, indy: 0, 
        indw: 1, indh: 1, 
        load(){
            this.imageobj = {...Collide.images.image, altered :true}
            if(!this.imageobj) {this.delete = true;Tile.delete = true;return}
            // if(!devmode)Tile.delete = true
            this.indx = Tile.indx
            this.indy = Tile.indy
            this.indw = Tile.indw
            this.indh = Tile.indh
            this.sx = this.imageobj.sx
            this.sy = this.imageobj.sy

            if(!this.sx && !this.sy && this.sx !== 0 && this.sy !== 0 ){this.delete = true;Tile.delete = true;return}
            this.sw = this.imageobj.$sw
            this.sh = this.imageobj.$sh
            this.loaded= true
        },
        update(props){
            if(!this?.imageobj?.loaded)return
            if(!this.loaded)return
            const ctx = props.ctx
            const x = Scene.grid.x
            const y = Scene.grid.y
            const cw = Scene.grid.cw
            const ch = Scene.grid.ch
            ctx.save()
            ctx.translate(x, y)
            ctx.drawImage(this.imageobj.image,
                this.sx, this.sy, 
                this.sw, this.sh,                
                this.indx * cw, 
                this.indy * ch, 
                cw * this.indw,
                ch * this.indh,
 
            )
            ctx.restore()
        }
    }
    res.load()
    return res
}