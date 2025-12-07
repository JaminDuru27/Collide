import { genId } from "../../utils/genid"
import { getRandomHexColor } from "../../utils/randomcolor"

export function BodyLayers(){
    const res = {
        layers:[],
        addLayer(){
            const layer = BodyLayer(`Body Layer ${this.layers.length + 1}`)
            this.layers.push(layer)
            this.currentLayer = layer   
            return layer
        },
        getallbodies(){
            const bodies = []
            this.layers.forEach(layer=>layer.bodies.forEach(body=>bodies.push(body)))
            return bodies
        },
        deleteLayer(id){
            this.layers.forEach((layer, x)=>{
                if(layer.id === id)this.layers.splice(x, 1)
            })
        },
        renameLayer(id, value){
            this.layers.forEach((layer, x)=>{
                if(layer.id === id)this.layers.rename(value)
            })
        },
        load(){
            this.addLayer()
        },
        update(p){
            this.layers.forEach((layer, x)=>{
                layer.update(p)
                if(layer.Delete)this.layers.splice(x, 1)
            })
        },
    }
    res.load()
    return res
}

export function BodyLayer(name){
    const res = {
        name,
        hidden: false,
        color: getRandomHexColor(),
        bodies:[],
        id: genId(),
        rename(v){this.name = v},
        delete(){this.Delete = true},
        addBody(body){
            this.bodies.push(body)
        },
        load(){},
        update(p){
            this.bodies.forEach((body, i)=>{
                body.update(p)
                if(body.delete)this.bodies.splice(i, 1)
            })
        }
    }
    res.load()
    return res
}