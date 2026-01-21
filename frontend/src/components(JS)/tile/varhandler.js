import { genId } from "../../utils/genid"

export function TileVarHandler(Tile){
    const res = {
        nodes: [],
        allvars:{},
        getvar(id){
            return this.allvars[id]
        },
        load(){},
        node({name, src, id}){
            const folder = ({name}, par)=>{
                const obj  = gg.bind(this)(par)  
                const data = {name}
                for(let x in obj){data[x] = obj[x]}
                return data
            }
            const getType = (get)=>{
                const type = typeof get()
                return type
            }
            const getOperationList=(get)=>{
                const type = getType(get)
                return (type === `boolean` || type === `string`)?[`===`, `!==`]:(type === `number`)?[`===`, `<=`, `>=`, `!==`]:[]
            }
            const getinputType = (get)=>{
                const type = typeof get()  
                const yy = (type === `function`)?`button`:(type === `object`)?`reference`:(type===`boolean`)?`checkbox`:(type===`string`)?`text`:(`${type[0]}` === `#`)?`color`:type
                return  yy
            }
            const parseinput= (v,get)=>{
                const inputtype = getinputType(get)
                return (inputtype === `number`)?(+v):(inputtype === `checkbox`)?Boolean(v):v
            }
            
            const gg= (par)=>({
                vars:[],
                folders:[],
                createFolder(p){
                    const fold = folder(p, par)
                    fold.destroy = ()=> {this.folders.filter(f=>f !== f)}
                    this.folders.push(fold)
                    return fold
                },
                destroyFolder(folder){
                    this.folders = this.folders.filter(f=>f !== folder)
                },
                addvar({set, get, name, id}){
                    const obj  = {set,get,name}
                    obj.id = name + id
                    obj.inputtype = getinputType(get)
                    obj.type = getType(get)
                    obj.parseinput = (v)=>parseinput(v, get)
                    obj.getOperationList = ()=>getOperationList(get)
                    obj.save  = ()=>({id:obj.id, name:name()})
                    obj.destroy=()=>{
                        delete res.allvars[obj.id]
                    }
                    res.allvars[obj.id] = obj
                    par.ids[obj.id] = obj.id
                    this.vars.push(obj)
                    
                    return obj
                },
                
            })
            
            const data = {
                name, src, id: !id ?`${name}${src}`: id, 
                ids: {},
                destroy:()=>{
                    for(let x in data.ids){
                        delete res.allvars[x]
                    }  
                    
                    this.nodes.forEach((node, x)=>{
                        if(node.id === data.id)this.nodes.splice(x, 1)
                    })
                },
            }
            let obj =gg(data)
            for( let x in obj){data[x] =obj[x]}
            return data
        },
        getNode(name, src){
            const node = this.node(name, src)
            this.nodes.push(node)
            return node
        },
        
    }
    res.load()
    return res
}