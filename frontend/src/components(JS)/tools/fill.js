import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Fill(Collide){
    const res = {
        name: `Fill`,
        load(){},
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
                        
            const select = Scene().select
            const imageobj = Scene().images.image
            if(!imageobj)return
            Scene().select.forEachBox(box=>{
                const tile = Tile(Scene())
                if(!Scene.images?.select){tile.delete = true;return}
                if(!Scene.highlight.target){tile.delete = true;return}

                tile.indx = box.indx
                tile.indy = box.indy
                tile.sprite = Sprite(tile, Collide, Scene)
                

                tile.updateEliminateDuplicate()

            })
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}