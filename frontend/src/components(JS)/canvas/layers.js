import { ImageLayer } from "../tile/layer"

export function ImageLayers(grid){
    const res = {
        layers: [],
        currentLayer:undefined,
        add(name){
            const layer = ImageLayer({grid,name: name??`Layer ${this.layers.length + 1}`, })
            this.layers.push(layer)
            this.currentLayer = layer
            // console.log(layer)
        },
        
        load(){
            this.add()
            this.events()
        },
        events(){
        },
        update(props){
            this.layers.forEach((layer, x)=>{
                layer.update(props)
                if(layer.delete)this.layers.splice(x, 1)
            })
        },
    }
    res.load()
    return res
}