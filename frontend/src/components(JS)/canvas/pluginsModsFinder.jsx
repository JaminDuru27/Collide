export function pluginsModsFinder(sets){
    const res = {
        genres:[`all`],
        currentGenre: undefined,
        currentPlugin: undefined,
        plugins: [],
        mods: [],
        plugingenre:[],
        loadplugins(){
            this.plugins = []
            const manifests = this.getManifestsDatasForPlugins()
            this.plugins = manifests
        },
        loadmods(){
            this.mods = []
            const manifests = this.getManifestsDatasForMods()
            this.mods = manifests
        },
        getManifestsDatasForPlugins(){
            let pluginsManifestModules  = import.meta.glob("../../game/plugins/**/manifest.json", {eager: true})
            const manifests = Object.entries(pluginsManifestModules).map(([path, module])=>({
                path,
                manifest: module.default
            }))
            return manifests
        },
        getManifestsDatasForMods(){
            let pluginsManifestModules  = import.meta.glob("../../game/mods/**/manifest.json", {eager: true})
            const manifests = Object.entries(pluginsManifestModules).map(([path, module])=>({
                path,
                manifest: module.default
            }))
            return manifests
        },
        search(v){
            const data = {
                plugins:[
                    ...this.plugins.filter(({manifest})=>{
                        const word = manifest.meta.name.toLocaleLowerCase()
                        return word.includes(v.toLocaleLowerCase())
                    }),
                ],
                mods: [
                    ...this.mods.filter(({manifest})=>{
                        const word = manifest.meta.name.toLocaleLowerCase()
                        return word.includes(v.toLocaleLowerCase())
                    }),
                ],
            }
            return data
        },
        filterByType(type){
            return {
                plugins: this.plugins.filter(({manifest})=>manifest?.meta?.type === type),
                mods: this.mods.filter(({manifest})=>manifest?.meta?.type === type),
            }            
        },
        getResultsFromGenre(genre){
            //get plugin mods that have the genre
            const array = []
            return array
        },
        
        load(){
            this.loadplugins()
            this.loadmods()
            return this
        },
        getPlugin(plugin, type = `environment`){
            const info = plugin.manifest.meta
            const foundplugin = this.plugins.find(p=>p.manifest.meta.id === info.id)
            if(!foundplugin) {sets.setFeedInfo({message:`This Plugin Is Not Found`, type:`message`});return}
            if(info.type !== `both`)
            if(info.type !== type){
                sets.setFeedInfo({message:`This Plugin Is Not For ${type}`, type:`message`})
                return null
            }
            const entry = this.getPluginEntry(foundplugin)
            return {entry, plugin: foundplugin}
        },
        getMod(mod, type = `environment`){
            const info = mod.manifest.meta
            const foundplugin = this.mods.find(p=>p.manifest.meta.id === info.id)
            if(!foundplugin) {sets.setFeedInfo({message:`This Mod Is Not Found`, type:`message`});return}
            if(info.type !== `both`)
            if(info.type !== type){
                sets.setFeedInfo({message:`This Mod Is Not For ${type}`, type:`message`})
                return null
            }
            const entry = this.getModEntry(foundplugin)
            return {entry, plugin: foundplugin}
        },
        async getPluginEntry(plugin){
            const manifestPath = plugin.path
            const baseDir = manifestPath.replace("/manifest.json", "")
            const entryPath = `${baseDir}/${plugin.manifest.entry.main.replace("./", "")}`
            const jsxImports = import.meta.glob("../../game/plugins/**/**/*.jsx")
            const factoryimport = jsxImports[entryPath]
            
            const module = await factoryimport()
            const def = module.default;
            const factory = module[plugin.manifest.meta.name]
            return (def || factory)
        },
        async getModEntry(mod){
            const manifestPath = mod.path
            const baseDir = manifestPath.replace("/manifest.json", "")
            const entryPath = `${baseDir}/${mod.manifest.entry.main.replace("./", "")}`
            const jsxImports = import.meta.glob("../../game/mod/**/**/*.jsx")
            const factoryimport = jsxImports[entryPath]
            
            const module = await factoryimport()
            const def = module.default;
            const factory = module[mod.manifest.meta.name]
            return (def || factory)
        },
        openPlugin(pluginobject){
            this.current = pluginobject;sets.setupdateAll(p=>!p)
        },
        openMod(pluginobject){
            this.current = pluginobject;sets.setupdateAll(p=>!p)
        },
        closePlugin(){
            this.current.close();this.current = undefined;sets.setupdateAll(p=>!p)
        },
        closeMod(){
            this.current.close();this.current = undefined;sets.setupdateAll(p=>!p)
        },
        
    }
    return res
}