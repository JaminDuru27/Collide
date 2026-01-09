import { DisposableCanvas } from "../../../utils/disposablecanvas"
import { genId } from "../../../utils/genid"
import { CollideFSMUI } from "./collideFSMUI"

export function CollideFSM({Collide, Scene, Tile}){
    const res  = {
        name: `CollideFSM`,
        toggle: true,
        requirements(){return true},
        requiredMessage: `CollideSprite plugin requires CollideBody plugin to be added to the tile first.`,
        save(){},
        revert(){},
        downloaddata(){},
        dispid: genId(),//import
        states:[],
        remove(){
            Tile.plugins.splice(Tile.plugins.indexOf(this), 1)
        },
        createState(setreload){
            const data = {
                id: genId(),
                priority: 0,
                name: `States${this.states.length}`,
                delaybeforentervalue: 100,
                mintimeinstate: 10,
                prev(){return undefined},
                next(){return undefined},
                shouldEnter(){return false},
                shouldLeave(){return false},
                isValid(){return this.shouldEnter() && this.transitions.every(t=>t.isValid() === false)},
                isInValid(){return this.shouldLeave()},
                transitionDuration: 0,
                shouldeResetOnLeave:false,
                shouldeResetOnEnter:false,
                onentervars:[],
                onleavevars:[],
                onupdatevars:[],
                onleaveconds:[],
                onenterconds:[],
                transitions:[],
                createTransition(){
                    const data = {
                        conditions:[],
                        isValid(){return false},
                        ref: undefined,
                        getref(){return Tile.varHandler?.getvar(this.ref?.id)},
                    }
                    data.addcondsgroup = ({grouparray, operator})=>{
                        const newgarray = [...grouparray.map(c=>({...c, shouldRun: true}))]
                        const gcondcb = this.getGroupCondCb(newgarray)
                        const obj ={...grouparray, group: newgarray, operator}
                        obj.isValid=()=>{return (gcondcb())} 
                        data.conditions.push(obj)

                        const validcb = this.getCond(data.conditions)
                        data.isValid = validcb
                    }
                    return data
                },
                addNewTransition(){
                    const transition = this.createTransition()
                    transition.remove =()=>{
                        this.transitions.splice(this.transitions.indexOf(this), 1)
                    }
                    this.transitions.push(transition)
                    return this.insertTransition
                },
                insertOnEnterConds(groupdata){
                    const newgrouparray = [
                        ...groupdata.group.map((d,x)=>({...d, shouldRun: true, 
                        remove: ()=>{groupdata.group.splice(x, 1);this.insertOnEnterConds(groupdata)}
                    }))]
                    const gcondcb = this.getGroupCondCb(newgrouparray)
                    const obj ={...groupdata, group: newgrouparray}
                    obj.isValid=()=>{return (gcondcb())} 
                    this.onenterconds.push(obj)
                    const condcb = this.getCond(this.onenterconds)
                    this.shouldEnter = condcb 
                },
                insertOnLeaveConds(groupdata){
                    const newgrouparray = [
                        ...groupdata.group.map((d,x)=>({...d, shouldRun: true, 
                        remove: ()=>{groupdata.group.splice(x, 1);this.insertOnEnterConds(groupdata)}
                    }))]
                    const gcondcb = this.getGroupCondCb(newgrouparray)
                    const obj ={...groupdata, group: newgrouparray} 
                    this.onleaveconds.push({...groupdata, isValid: gcondcb})
                    const condcb = this.getCond(this.onenterconds)
                    this.shouldEnter = condcb 
                },
                getGroupCondCb(garray){
                    return garray.reduce((result, conditionobject, index)=>{
                        let current = ()=>
                        (conditionobject.condition === `===`)?conditionobject?.variable?.get() === conditionobject.value
                        :(conditionobject.condition === `!==`)? conditionobject?.variable?.get() !== conditionobject.value
                        :(conditionobject.condition === `>=`)? conditionobject?.variable?.get() >= conditionobject.value
                        :(conditionobject.condition === `<=`)? conditionobject?.variable?.get() <= conditionobject.value
                        :()=>false 
                        if(!conditionobject.shouldRun)current = ()=>false
                        const condition = conditionobject.condition
                        if(index === 0)return current
                        if(conditionobject.operator === `AND`)
                        return ()=>result() && current()
                        if(conditionobject.operator === `OR`)
                        return ()=>result() || current()
                        return result
                    }, ()=>false)
                },
                getCond(array = []){
                    return array.reduce((result, cond, index) =>{
                        const current = cond.isValid
                        if(index === 0)return current
                        if(cond?.operator === `AND`)return ()=>result() && current() 
                        if(cond?.operator === `OR`)return ()=>result() && current() 
                        return result
                    }, ()=>false)
                },        
                // addconditions(){},
                load(){},
                start(){
                    this.onentervars.forEach(v=>{
                        v.variable.set(v.value)
                    })
                    setreload(p=>!p)
                },
                end(){
                    this.onentervars.forEach(v=>{
                        v.variable.set(v.value)
                    })
                    setreload(p=>!p)
                    this.reset()
                },
                delaybeforentertimer: 0,
                reset(){
                    this.delaybeforentertimer = 0
                },
                update(){
                    if(this.delaybeforentertimer >= this.delaybeforentervalue){
                        this.onupdatevars.forEach(v=>{
                            v.variable.set(v.value)
                        })
                        const valids = [...this.transitions.filter(t=>t.isValid()).map(t=>t.getref()?.get())]
                        const sorted = valids.sort((a, b)=>a.priority - b.priority)
                        if(sorted){
                            const highestpriority = sorted[sorted.length -1]
                            if(highestpriority)
                            highestpriority.isValid = ()=>true
                        }
                    }else {
                        if(this.delaybeforentertimer < this.delaybeforentervalue + 1)
                        this.delaybeforentertimer ++
                    }
                    
                },
            }
            data.load()
            data.folder = this.statesfolder.createFolder({name: ()=>`${data.name}`})
            data.folder.addvar({name: ()=>`execute`,set: ()=>{data.start()}, get:()=>()=>{}, id: `${data.name}, execute`})
            data.folder.addvar({name: ()=>`end`,set: ()=>{data.end()}, get:()=>()=>{}, id: `${data.name}, end`})
            data.folder.addvar({name: ()=>`reference`,set: ()=>{}, get:()=>data, id: `${data.name}, ref`})
            return data
        },
        
        addState(setreload){
            const state = this.createState(setreload)
            this.states.push(state)
            setreload(p=>!p)
        },
        open(canvasref){
            this.disposableCanvas = DisposableCanvas(this, canvasRef, this.dispid).onupdate((p)=>{
                if(!this.toggle)return
            }).update()
        },
        close(){},
        maximize(){},
        minimize(){},
        load(){
            this.ui = <CollideFSMUI object={this} Tile={Tile}/>
            this.varnode = Tile.varHandler.getNode({name:()=>this.name, src: `/plugins/collidefsmthumb.png`})
            this.statesfolder = this.varnode.createFolder({name: ()=>`states`})
            this.varnode.addvar({id: `${this.name} toggle`,name:()=>`toggle`,set: (v)=>{if(v)this.toggle = v}, get:()=>this.toggle})
        },
        mintimeinstate : 10,
        render(){
            if(!this.toggle)return
            this.states.forEach(state=>{
                if(state.isValid() && !state.running){
                    if(!this.currentValidState || this.currentValidState?.priority <= state.priority){
                        state.running = true
                        state.start()
                        this.currentValidState = state
                        this.mintimeinstatetimer = 0
                        this.mintimeinstate = state.mintimeinstate
                        console.log(`switch states prev ${this.currentValidState?.priority} current ${state.priority}`)
                    }
                } else if((!state.isValid() || state.isInValid()) && state.running){
                    if(this.mintimeinstatetimer >= this.mintimeinstate){
                        state.end()
                        state.running = false
                        this.currentValidState = undefined
                        console.log(`end`)
                    }
                    else {
                        this.mintimeinstatetimer ++
                        console.log(`countdown to end `)
                    }
                }
                if(this.currentValidState){
                    this.currentValidState.update()
                }
            })
        },
    }
    res.load()
    return res
}

CollideFSM.prototype.info =()=> ({
    name: `CollideFSM`,
    thumbnailSource: `/plugins/collidefsmthumb.png`,
    descr: 'Finite State Machine For Creating Character and Game States',
    id: `2038i3038hc-=ma'di32ddjdi/Colllide-1122334455`,//id is id/enfineid for verification 
    type: `both`,
    genre: `All`,
})