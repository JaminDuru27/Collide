import { genId } from "../../utils/genid"

export function PluginsModsPreset(){
    const res= {
        list: {},
        load(){},
        getPresetList(id){
            return this.list[id]
        },
        add(id, data){
            if(!this.list[id])this.list[id] = []
            const d= data
            console.log(data, d)
            if(!d.name)d.name = `plugin preset - ${Date.now()}` 
            if(!d.id)d.id = `${id}${genId()}`
            this.list[id].push(data)
            d.creationDate = Date.now()
            return {name: d.name, id: d.id}
        },
        remove(objectid, dataid){
            this?.list[objectid]?.forEach((data, i)=>{
                if(data.id === dataid)this?.list[objectid]?.splice(i, 1)
            })
        }
    }
    res.load()
    return res
}