import { ImageObject } from "../canvas/image";

export function Sprite(Tile,Collide, Scene){
    const res = {
        indx: 0, indy: 0, 
        indw: 1, indh: 1, 
        targetimg:undefined,
        load(){
            const img  = Collide.images.image
            this.imageobj = {
                sx: img.sx, sy: img.sy,sw: img.$sw,
                sh: img.$sh, sindx: img.sindx,sindy: img.sindy,
                loaded: img.loaded, image: img.image, id: img.id,
            }
            if(!this.imageobj) {this.delete = true;Tile.delete = true;return}
            // if(!devmode)Tile.delete = true
            this.indx = Tile.indx
            this.indy = Tile.indy
            this.indw = Tile.indw
            this.indh = Tile.indh
            this.sx = this.imageobj.sx
            this.sy = this.imageobj.sy
            this.sindx = this.imageobj.sindx
            this.sindy = this.imageobj.sindy

            if(!this.sx && !this.sy && this.sx !== 0 && this.sy !== 0 ){this.delete = true;Tile.delete = true;return}
            this.sw = this.imageobj.sw
            this.sh = this.imageobj.sh
            this.loaded= true
        },
        getData(){
            const data = {
                data: {
                    sx: this.sx, sy: this.sy, sw: this.sw, sh: this.sh,
                    sindx: this.sindx, sindy: this.sindy, indx: this.indx,
                    indy: this.indy, indw: this.indw, indh: this.indh,
                },
                imgobjref: {...this.imageobj, image:undefined, loaded: false},
            }
            
            return data
        },
        revertData({data, imgobjref}){
            for(let x in data){
                this[x] = data[x]
            }
            const img = Collide.images.array.find(img=>img.id === imgobjref.id )
            const obj = ImageObject(Collide.images, img.dataurl)
            for(let x in imgobjref){
                if(x === `info`)continue
                obj[x] = imgobjref[x]
            }
            obj.setinfo(imgobjref.info)
            this.imageobj = obj
        },
        drawbib({ctx}, x, y, w, h){
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate = this.angle
            if(this.targetimg && this.targetimg.loaded)
            ctx.drawImage(
                this.targetimg.image,
                this.sx, this.sy, 
                this.sw, this.sh,                
                0, 0, w,h,
            )
            ctx.restore()
        },
        angle :0,
        degtorag(deg){return deg * Math.PI * 180},
        draw({ctx}){
            const x = Scene.grid.x
            const y = Scene.grid.y
            const cw = Scene.grid.cw
            const ch = Scene.grid.ch
            ctx.save()
            ctx.translate(x + Tile.x, y + Tile.y)
            ctx.translate(Tile.w/2, Tile.h/2)//centering
            
            if(!this.targetimg){
                const img = Collide.images.array.find(img=>img.id === this.imageobj.id )
                this.targetimg = img 
            }
            ctx.rotate(this.degtorag(this.angle))
            this.angle += 0.01

            if(this.targetimg && this.targetimg.loaded)
            ctx.drawImage(this.targetimg.image,
                this.sx, this.sy, 
                this.sw, this.sh,                
                -Tile.w/2, 
                -Tile.h/2, 
                Tile.w,
                Tile.h
            )
            ctx.restore()
        },
        update(props){
            if(!this?.imageobj?.loaded)return
            if(!this.loaded)return
            this.draw(props)
        },
        select(){
        },
        unselect(){
        },
    }
    res.load()
    return res
}