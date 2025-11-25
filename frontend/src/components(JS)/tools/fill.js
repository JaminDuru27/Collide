import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Fill(Collide){
    const res = {
        name: `Fill`,
        load(){},
        on(){
                        
            const select = Collide.select
            const imageobj = Collide.images.image
            if(!imageobj)return
            Collide.select.forEachBox(box=>{
                const tile = Tile(Collide)
                if(!Collide.images?.select){tile.delete = true;return}
                if(!Collide.highlight.target){tile.delete = true;return}

                tile.indx = box.indx
                tile.indy = box.indy
                tile.sprite = Sprite(tile, Collide)
                

                tile.updateEliminateDuplicate()

            })
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}