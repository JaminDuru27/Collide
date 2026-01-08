import { DisposableCanvas } from "../../../utils/disposablecanvas"
import { genId } from "../../../utils/genid"
import { CollideKeyBinderUI } from "./collideKeyBinderUI"

export function CollideKeyBinder({Collide, Scene, Tile}){
    const res  = {
        name: `CollideKeyBinder`,
        toggle: true,
        requirements(){return true},
        requiredMessage: ``,
        save(){
            const data = {
                title: this.name,
                binds: [...this.binds.map(b=>({
                    name: b.name,
                    keys: [...b.keys],
                    varsdown: [...b.varsdown.map(v=>({variable: v.variable.save(), value: v.value}))],
                    varsup: [],
                }))]
            }
            return data
        },
        revert(data){
            console.log(data)
            this.inputs = []
            this.binds = []
            this.recording = false
            this.bind = undefined
            data.binds.forEach(binddata=>{
                const bind = this.addbind(binddata.name)
                bind.keys = binddata.keys
                bind.varsdown = [...binddata.varsdown.map(v=>({variable: Tile.varHandler.getvar(v.variable.id), value: v.value}))]
                bind.varsup = [...binddata.varsup.map(v=>({variable: Tile.varHandler.getvar(v.variable.id), value: v.value}))]
                bind.called = false
                bind.calcconds()
                console.log(bind, `ninf`)
            })
            if(this.setrefresh)this.setrefresh(p=>!p)
        },
        downloaddata(){
            const save = this.save()
            console.log(save)
        },
        dispid: genId(),//import
        remove(){
            Tile.plugins.splice(Tile.plugins.indexOf(this), 1)
            window.removeEventListener(`keydown`,  this.windowsdownevent.bind(this))
            window.removeEventListener(`keyup`, this.windowsupevent.bind(this))

        },
        open(canvasref){},
        close(){},
        maximize(){},
        minimize(){},
        load(){
            this.ui = <CollideKeyBinderUI object={this} Tile={Tile} Collide={Collide}/>
            window.addEventListener(`keydown`, this.windowsdownevent.bind(this))
            window.addEventListener(`keyup`, this.windowsupevent.bind(this))
        },
        render(p){},
        inputs: [],
        recording: false,
        binds: [],
        windowsdownevent(e){
            if(!this.toggle)return
            const key = e.key.toLocaleLowerCase()
            this.addinputkeys(key)
            this.binds.forEach(bind=>{
                if(bind.isvalid(this.inputs) && !bind.called){
                    bind.varsdown.forEach(v=>{v.variable.set(v.value)})
                    bind.called = true
                }
            })
            if(this.recording && this.bind){
                this.bind.addkey(key)
                this.recording = false
                if(this.setrefresh)this.setrefresh(p=>!p)
            }
        },        
        windowsupevent(e){
            if(!this.toggle)return
            this.binds.forEach(bind=>{
                if(bind.isnotvalid(this.inputs)){
                    bind.varsup.forEach(v=>{v.variable.set(v.value)})
                }
                console.log(bind.isnotvalid(), `bind is not valid`)
                bind.called = false
            })
            const key = e.key.toLocaleLowerCase()
            this.removeinputkeys(key)
        },
        addinputkeys(key){
            if(!this.inputs.includes(key)){
                this.inputs.push(key)
            }
        },
        removeinputkeys(key){
            if(this.inputs.includes(key)){
                this.inputs.splice(this.inputs.indexOf(key), 1)
            }
        },
        createBind(name = `bind`){
            const data  = {
                name,
                keys: [],
                varsdown: [],
                varsup: [],
                isvalid(){return false},
                isnotvalid(){return true},
                addvardown(){
                    const obj = {variable: undefined, value: undefined} 
                    obj.delete = ()=>{console.log(this.varsdown.indexOf(obj));this.varsdown  = this.varsdown.filter(v=>v!==obj)}
                    this.varsdown.push(obj)
                },
                addvarup(){
                    const obj = {variable: undefined, value: undefined} 
                    obj.delete = ()=>{this.varsup  = this.varsup.filter(v=>v !== obj)}
                    this.varsup.push(obj)
                },
                addkey(key){
                    this.keys.push(key.toLocaleLowerCase())
                    this.calcconds()
                },
                calcconds(){
                    this.isvalid = (allkeys = [])=>this.keys.every(k=>allkeys.includes(k))
                    this.isnotvalid = (allkeys = [])=>this.keys.every(k=>!allkeys.includes(k))
                }
            }
            return data
        },
        binds: [],
        addbind(name){
            const bind = this.createBind(name)
            bind.remove  = ()=>{
                this.binds = this.binds.filter(p=>p!==bind)
            }
            this.binds.push(bind)
            return bind
        },
    }
    res.load()
    return res
}

CollideKeyBinder.prototype.info =()=> ({
    name: `CollideKeyBinder`,
    thumbnailSource: `/plugins/collidekeybinderthumb.png`,
    descr: 'Finite State Machine For Creating Character and Game States',
    id: `9938888jjciippeqomx9-3=ma32ddjdi/Colllide-1122334455`,//id is id/enfineid for verification 
    type: `both`,
    genre: `All`,
})