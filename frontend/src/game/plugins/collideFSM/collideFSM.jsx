import { DisposableCanvas } from "../../../utils/disposablecanvas"
import { genId } from "../../../utils/genid"
import { CollideFSMUI } from "./collideFSMUI"

export default function CollideFSM({Collide, Scene, Tile}){
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
                
                prev(){return undefined},
                next(){return undefined},
                shouldEnter(){return true},
                shouldLeave(){return false},
                isValid(){return this.shouldEnter() && this.transitions.every(t=>t.isValid() === false)},
                isInValid(){return this.shouldLeave()},
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
                        data.isValid = ()=>{return validcb() &&  this.mintimeinstatetimer >= this.mintimeinstate}
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
                        :()=>true 
                        if(!conditionobject.shouldRun)current = ()=>true
                        const condition = conditionobject.condition
                        if(index === 0)return current
                        if(conditionobject.operator === `AND`)
                        return ()=>result() && current()
                        if(conditionobject.operator === `OR`)
                        return ()=>result() || current()
                        return result
                    }, ()=>true)
                },
                getCond(array = []){
                    return array.reduce((result, cond, index) =>{
                        const current = cond.isValid
                        if(index === 0)return current
                        if(cond?.operator === `AND`)return ()=>result() && current() 
                        if(cond?.operator === `OR`)return ()=>result() && current() 
                        return result
                    }, ()=>true)
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
                reset(){
                    this.delaybeforstarttimer = 0
                    this.mintimeinstatetimer = 0
                    this.hasEntered = false
                },
                delaybeforstart: 1,
                mintimeinstate: 1,
                delaybeforstarttimer: 0,
                mintimeinstatetimer: 0,
                hasEntered: false,
                update:()=>{
                    if(data.delaybeforstarttimer >= data.delaybeforstart){
                        if(!data.hasEntered){
                            data.start()
                            data.mintimeinstatetimer = 0
                            data.hasEntered = true
                        }
                        
                        
                        //if min time in state reached
                        if(data.mintimeinstatetimer >= data.mintimeinstate){
                            data.onupdatevars.forEach(v=>{
                                v.variable.set(v.value)
                            })
                            const valids = [...data.transitions.filter(t=>t.isValid()).map(t=>t.getref()?.get())]
                            // const sorted = valids.sort((a, b)=>a.priority - b.priority)
                            if(valids?.length){
                                const state = valids[0]
                                // console.log(`switching to ${state.name}, ${state.isValid()}`)
                                if(state.isValid()){
                                    console.log(state.isValid(), state.name)
                                    if(this.state){this.state.end(); this.state.reset()}
                                    this.state = state
                                    this.state.reset()
                                    if(this.setreload)this.setreload(p=>!p)
                                }
                            }
                        }else {
                            if(data.mintimeinstatetimer < data.mintimeinstate + 1)
                            data.mintimeinstatetimer ++ 
                        }
                    }else {
                        if(data.delaybeforstarttimer < data.delaybeforstart + 1)
                        data.delaybeforstarttimer ++
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
            if(!this.state && this.states.length === 1){
                this.state = this.states[0]
                this.state.isValid = ()=>true
                this.state.reset()
            }
            if(this.state)
            this?.state?.update()
        },
    }
    res.load()
    return res
}
