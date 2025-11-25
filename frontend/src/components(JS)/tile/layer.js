import { getRandomHexColor } from "../../utils/randomcolor"

export function ImageLayer({name}){
    const res = {
        name,
        hidden: false,
        tiles: [],
        color: getRandomHexColor(),
        load(){},
        update(props){
            if(this.hidden)return
            this.tiles.forEach((t,x)=>{
                if(t.delete)this.tiles.splice(x, 1)
                t.update(props)
            })
        },
    }
    res.load()
    return res
}