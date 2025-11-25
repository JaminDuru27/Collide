import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Pencil(Collide){
    const res = {
        name: `Pencil`,
        load(){},
        draw(){
            Collide.images?.select?.forEachBox((box)=>{
                const imageobj = Collide.images.image
                if(!imageobj)return
                const tile = Tile(Collide)
                
                if(!Collide.images?.select){tile.delete = true;return}
                if(!Collide.highlight.target){tile.delete = true;return}

                tile.indx = box.rindx + Collide.highlight.target.indx
                tile.indy = box.rindy + Collide.highlight.target.indy
                tile.sprite = Sprite(tile, Collide)

                tile.sprite.sx = box.indx * imageobj.$sw 
                tile.sprite.sy = box.indy * imageobj.$sh
                tile.updateEliminateDuplicate()
            })
        },
        update(){}
    }
    res.load()
    return res
}