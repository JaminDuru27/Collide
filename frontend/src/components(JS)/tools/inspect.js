import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Inspect(Collide){
    const res = {
        name: `Inspect`,
        load(){},
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
                        
            const target = Scene().highlight.target
            const imageobj = Scene().images.image
            const layer = Scene().imageLayers.currentLayer
            if(!imageobj)return
            if(!target)return
            if(!layer)return
            const tile = layer.tiles.find(t=> t.indx === target.indx && t.indy === target.indy)
            if(!tile)return
            if(!tile.sprite)return
            if(!tile.sprite.imageobj)return
            if(!Scene().images?.image)return
            const tileimageobj = tile.sprite.imageobj
            const findimageobject = Scene().images.array.find(img=> img.id === tileimageobj.id)
            if(!findimageobject)return

            Scene().images.switch(findimageobject.id)

            Scene().images.grid.nx = tile.sprite.imageobj.$nx
            Scene().images.grid.ny = tile.sprite.imageobj.$ny
            Scene().images.grid.w = tile.sprite.imageobj.$w
            Scene().images.grid.h = tile.sprite.imageobj.$h

            Scene().images.select.boxes = []
            const selectbox = {
                indx: tileimageobj.targetindx,
                indy: tileimageobj.targetindy,
                rindx: 0,
                rindy: 0,
                indw: tileimageobj.targetindw,
                indh: tileimageobj.targetindh,
                x: Scene().images.grid.x + findimageobject.targetindx * (tile.sprite.imageobj.$w / tile.sprite.imageobj.$nx),
                y: Scene().images.grid.y + findimageobject.targetindy * (tile.sprite.imageobj.$h / tile.sprite.imageobj.$ny),
                w: tile.sprite.imageobj.$w / tile.sprite.imageobj.$nx,
                h: tile.sprite.imageobj.$h / tile.sprite.imageobj.$ny,
            }
            Scene().images.select.boxes.push(selectbox)
            Scene().images.grid.populate()
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}