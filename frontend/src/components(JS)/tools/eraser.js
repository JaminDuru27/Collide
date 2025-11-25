import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Eraser(Collide){
    const res = {
        name: `Eraser`,
        load(){},
        on(){
            const target = Collide.highlight?.target
            const tiles = Collide.imageLayers?.currentLayer?.tiles
            if(tiles && target){
                tiles.forEach(tile=>{
                    if(tile.indx === target.indx && tile.indy === target.indy){
                        tile.delete = true
                    }
                })
            }
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}