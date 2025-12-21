import * as Genres from "../../game/plugins/export.js"
export function pluginsModsFinder(sets){
    const res = {
        genres:[`all`],
        currentGenre: undefined,
        currentPlugin: undefined,
        genresInfos: [],
        loadplugins(genre = `All`){
            this.currentGenre = genre
            this.genresInfos = []
            for(let key in Genres){
                const info = Genres[key].prototype.info()
                if(info.genre === genre)
                this.genresInfos.push(info)
            }
            return this
        },
        // downloadPlugin(info){
             
        // },
        getPlugin(info){
            let plugin= ()=>{return null} 
            for(let key in Genres){
                const pinfo = Genres[key].prototype.info()
                if(pinfo.id ===  info.id)
                plugin = Genres[key]
            }
            return plugin
        },
        openPlugin(plugin){
            this.currentPlugin = plugin
            console.log(this.currentPlugin,` cp`)
            sets.setupdateAll(p=>!p)
        
        },
        
    }
    return res
}