import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Eraser(Collide){
    const res = {
        name: `Eraser`,
        load(){},
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            const target = Collide.highlight?.target
            const layer = Scene().imageLayers?.currentLayer
            if(layer && target){
                const m = Collide.mouse
                layer[`tiles`].map(tile=>{
                    if(
                        tile.onHover() &&
                        tile.plugins.length <=0 &&
                        tile.mods.length <= 0
                    ){
                        tile.remove() 
                        layer.target = undefined
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