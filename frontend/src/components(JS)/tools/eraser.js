import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Eraser(Collide){
    const res = {
        name: `Eraser`,
        load(){},
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            const target = Scene().highlight?.target
            const tiles = Scene().imageLayers?.currentLayer?.tiles
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