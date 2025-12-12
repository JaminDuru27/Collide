import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function Fill(Collide){
    const res = {
        name: `Fill`,
        load(){},
        enter(){
            Collide.select.shouldupdate = true
        },
        leave(){
            Collide.select.shouldupdate = false
        },
        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
                    
            const select = Collide.select
            const imageobj = Collide.images.image
            if(!imageobj)return
            select.forEachBox(box=>{
                const tile = Tile(Scene(), Collide)
                if(!Collide.images?.select){tile.delete = true;return}
                if(!Collide.highlight.target){tile.delete = true;return}

                tile.indx = box.indx
                tile.indy = box.indy
                tile.sprite = Sprite(tile, Collide, Scene())
                tile.updateEliminateDuplicate()

            })
        },
        off(){},
        update(){}
    }
    res.load()
    return res
}