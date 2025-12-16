import { ImageLayer } from "../tile/layer"

export function ImageLayers(Scene, Collide,select, grid, selectoperations){
    const res = {
        layers: [],
        currentLayer:undefined,
        add(name){
            const layer = ImageLayer({Scene, Collide,select, grid, selectoperations,Layers:this,name: name??`Layer ${this.layers.length + 1}`, })
            this.layers.push(layer)
            this.currentLayer = layer
            return layer
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