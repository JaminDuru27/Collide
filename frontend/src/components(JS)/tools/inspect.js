import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Inspect(Collide){
    const res = {
        name: `Inspect`,
        load(){},
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
                    
            const target = Collide.highlight.target
            const imageobj = Collide.images.image
            const layer = Scene().imageLayers.currentLayer
            if(!imageobj)return
            if(!target)return
            if(!layer)return
            const tile = layer.tiles.find(t=> t.indx === target.indx && t.indy === target.indy)
            if(!tile)return
            if(!tile.sprite)return
            if(!tile.sprite.imageobj)return
            if(!Collide.images?.image)return
            const tileimageobj = tile.sprite.imageobj
            const findimageobject = Collide.images.array.find(img=> img.id === tileimageobj.id)
            if(!findimageobject)return

            Collide.images.switch(findimageobject.id)

            Collide.images.grid.nx = tile.sprite.imageobj.$nx
            Collide.images.grid.ny = tile.sprite.imageobj.$ny
            Collide.images.grid.w = tile.sprite.imageobj.$w
            Collide.images.grid.h = tile.sprite.imageobj.$h

            Collide.images.select.boxes = []
            
            const x = Collide.images.grid.x
            const y = Collide.images.grid.y
            const w = tile.sprite.imageobj.$w / tile.sprite.imageobj.$nx
            const h = tile.sprite.imageobj.$h / tile.sprite.imageobj.$ny
            const sindx = tile.sprite.sindx
            const sindy = tile.sprite.sindy
            console.log(sindx,sindy)
            const selectbox = {
                indx: tileimageobj.targetindx,
                indy: tileimageobj.targetindy,
                rindx: 0,
                rindy: 0,
                indw: tileimageobj.targetindw,
                indh: tileimageobj.targetindh,
                x: (w * sindx) + x,
                y: (h * sindy) + y,
                w, h
            }
            Collide.images.select.boxes.push(selectbox)
            Collide.images.grid.populate()
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}