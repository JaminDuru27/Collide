import * as Plugins from "../../game/plugins/export.js"
export function pluginsModsFinder(sets){
    const res = {
        genres:[`all`],
        currentGenre: undefined,
        currentPlugin: undefined,
        genresInfos: [],
        loadplugins(genre = `All`){
            this.currentGenre = genre
            this.genresInfos = []
            for(let key in Plugins){
                const info = Plugins[key].prototype.info()
                if(info.genre === genre)
                this.genresInfos.push(info)
            }
            return this
        },
        // downloadPlugin(info){
             
        // },
        getPlugin(info, type = `environment`){
            if(info.type !== type){
                sets.setFeedInfo({message:`This Plugin Is Not For ${type}`, type:`message`})
                return null
            }
            let plugin= ()=>{return null} 
            for(let key in Plugins){
                const pinfo = Plugins[key].prototype.info()
                if(pinfo.id ===  info.id)
                plugin = Plugins[key]
            }
            return plugin
        },
        openPlugin(plugin){
            this.currentPlugin = plugin
            sets.setupdateAll(p=>!p)
        },
        closePlugin(){
            this.currentPlugin.close()
            this.currentPlugin = undefined
            sets.setupdateAll(p=>!p)
        },
        
    }
    return res
}