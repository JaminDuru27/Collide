import { genId } from "../../utils/genid"
import { getRandomHexColor } from "../../utils/randomcolor"
import { CollisionBody } from "../tile/collision"

export function BodyLayers(Collide){
    const res = {
        layers:[],
        addLayer(){
            const layer = BodyLayer(`Body Layer ${this.layers.length + 1}`, Collide)
            this.layers.push(layer)
            this.currentLayer = layer   
            return layer
        },
        getData(){return[...this.layers.map(layer=>layer.getData())]},
        revertData(data){
            this.layers= []
            this.currentLayer= undefined
            data.forEach(d=>{
                const lys = this.addLayer()
                lys.revertData(d)
            })
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

export function BodyLayer(name, Collide){
    const res = {
        name,
        hidden: false,
        color: getRandomHexColor(),
        bodies:[],
        id: genId(),
        rename(v){this.name = v},
        delete(){this.Delete = true},
        addBody(body){
            const b = {...body, color: this.color}
            this.bodies.push(b)
            console.log(b, `bodies`)

        },
        getData(){
            const data = {
                data: {
                    id: this.id, name: this.name, hidden:this.hidden,
                    color: this.color,
                },
                bodies: [...this.bodies.map(body=>body.getData())],
            }
            return data
        },
        revertData({data, bodies }){
            for(let x in data){
                this[x] = data[x]
            }
            this.bodies = []
            bodies.map(({data, vertices})=>{
                const body = CollisionBody(Collide)
                body.revertData({data, vertices})
            })
        },
        load(){},
        update(p){
            if(this.hidden)return
            this.bodies.forEach((body, i)=>{
                body.update(p)
                if(body.delete)this.bodies.splice(i, 1)
            })
        }
    }
    res.load()
    return res
}