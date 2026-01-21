import { genId } from "../../utils/genid"
import { Scene } from "./scene"

export function SceneLocker(name, Collide, Scenes, sets,gets){
    const res= {
        name,
        id: `scene`+ genId(),
        scenes : [],
        plugins : [],
        mods : [],
        showplacement: false,
        add(scene = Scene(`Scene ${this.scenes.length + 1}`, Collide, sets,gets), tagnew = true){
            this.scenes.push(scene)
            if(!tagnew)return scene
            this.currentScene = scene
            return scene
        },
        addplugin(){
            sets.setpluginmodcb(p=>({cb:(info)=>{
                const func = Collide.pluginsmodshandler.getPlugin(info, `environment`)
                if(!func)return
                const object = func(Collide,this)
                if(!object.requirements)object.requirements = ()=> true
                if(object?.requirements() === true){
                    object.info = func.prototype.info()
                    this.plugins.push(object)
                    const l = this.plugins.filter(p=>p.info.id === object.info.id)?.length
                    if(l > 1){object.name = `${object.name} #${l -1}`; object.info.name = `${object.info.name} #${l -1}` }
                    Collide.pluginsmodshandler.openPlugin(object)
                    return object
            
                }else {
                    Collide.setMessage({type:`message`, flag:`warning`, message: object.requiredMessage})
                    this.plugins.forEach(p=>{if(p === object)this.plugins = this.plugins.filter(e=>e !== p)})
                    object = null
                }
            }, type:`environment`}))
        },
        addmod(){
            sets.setpluginmodcb(p=>({cb:(info)=>{
                const func = Collide.pluginsmodshandler.getPlugin(info, `environment`)
                if(!func)return
                const object = func(Collide,this)
                if(!object.requirements)object.requirements = ()=> true
                if(object?.requirements() === true){
                    object.info = func.prototype.info()
                    this.mods.push(object)
                    const l = this.mods.filter(p=>p.info.id === object.info.id)?.length
                    if(l > 1){object.name = `${object.name} #${l -1}`; object.info.name = `${object.info.name} #${l -1}` }
                    Collide.pluginsmodshandler.openPlugin(object)
                    return object
            
                }else {
                    Collide.setMessage({type:`message`, flag:`warning`, message: object.requiredMessage})
                    this.mods.forEach(p=>{if(p === object)this.mods = this.mods.filter(e=>e !== p)})
                    object = null
                }
            }, type:`environment`}))
        },      
        unlockallscenes(){this.scenes.map(scene=>scene.locked = false)},
        targetScene(id){
            console.log(id)
            this.scenes.forEach(scene=>{
                if(scene.id === id){
                    if(!scene.locked)
                    this.currentScene = scene
                    const x = scene.grid.x
                    const y = scene.grid.y
                    const dx = x- this.scenes[0].grid.x
                    const dy = y- this.scenes[0].grid.y

                    this.scenes[0].grid.center()
                    this.scenes[0].grid.x -= dx 
                    this.scenes[0].grid.y -= dy
                }
            })
        },

        checkHoverOnScenes(scene){
            return (
                Collide.mouse.x > scene.grid.x &&
                Collide.mouse.y > scene.grid.y &&
                Collide.mouse.x < scene.grid.x + scene.grid.w &&
                Collide.mouse.y < scene.grid.y + scene.grid.h
            )
        },
        highlightplacement({ctx}){
            if(!this.showplacement)return
            if(!this.currentScene)return
            const grid = this.currentScene.grid
            let dir , taken



            if(Collide.mouse.x > grid.x + grid.w)dir =`right`
            else if(Collide.mouse.x < grid.x )dir =`left`
            else if(Collide.mouse.y > grid.y + grid.h)dir =`bottom`
            else if(Collide.mouse.y < grid.y )dir =`top`
            else dir = null

            if(!dir)return
            if(this.currentScene[`join${dir}`])taken = true;else false
            ctx.fillStyle = taken?`#b307078f`:`green`
            if(dir === `top`){ctx.fillRect(grid.x, grid.y -10, grid.w, 6)}
            if(dir === `bottom`){ctx.fillRect(grid.x, grid.y + grid.h +10, grid.w, 6)}
            if(dir === `left`){ctx.fillRect(grid.x -10, grid.y,  6,grid.h)}
            if(dir === `right`){ctx.fillRect(grid.x +10 + grid.w, grid.y,  6,grid.h)}
            this.dir = dir
        },
        lockScene(id){
            this.unlockallscenes()
            if(id)this.scenes.forEach(scene=>{if(scene.id === id)scene.locked = true; else scene.locked = false })
            else this.scenes.forEach(scene=>{if(scene.id === this.currentScene.id)scene.locked = true; else scene.locked = false})
        },
        load(){
            const scene1 = this.add()
            const scene2 = this.add()
            scene2.join(scene1.id, `right`)
        },
        highlightcurrentscene({ctx}){
            if(!this.currentScene)return
            const g = this?.currentScene?.grid
            if(!g)return
            ctx.save()
            ctx.lineWidth = 4
            ctx.setLineDash([8,4])
            ctx.strokeStyle = `#454588`
            const p = 6
            const x = g.x - p, y= g.y -p, w=g.w + (p*2) ,h=g.h + (p*2)
            ctx.strokeRect(x, y, w, h)
            ctx.restore()

            ctx.save()
            ctx.font = `12px Arial`
            ctx.fillStyle = `rgba(225, 225, 225, 0.5)`
            ctx.fillText(`${this.name} - ${this.currentScene.name} ${(this.currentScene.locked)?` - Locked`:``}` , g.x + 5, g.y + 14)
            ctx.restore()
        },
        getData(){return {data:{type: `Locker`, id: this.id, name: this.name,}, scenes: [...this.scenes.map(scene=>scene.getData())]}},
        revertData(lockerData){
            this.scenes = []
            this.currentScene = undefined

            this.name = lockerData.data.name
            this.type = lockerData.data.type
            this.id = lockerData.data.id


            lockerData.scenes.forEach(data=>{
                const scene = Scene(`Scene ${this.scenes.length + 1}`, Collide, sets, gets)
                scene.revertData(data)
                this.scenes.push(scene)
                this.currentScene = scene
            })
            lockerData.scenes.forEach((data, x)=>{
                this.scenes[x].join(data.data.refsceneid, data.data.dir)
            })
            
        },
        update(p){
            this.highlightcurrentscene(p)
            this.scenes.forEach((scene, c)=>{
                scene.update(p)
                if(scene.delete)this.scenes.splice(c, 1)
            })
            this.scenes.forEach(scene=>{
                if(this.checkHoverOnScenes(scene)){
                    if(this.scenes.every(scene=>scene.locked === false))
                    this.currentScene = scene
                }
            })
            this.highlightplacement(p)

        },
    }
    res.load()
    return res
}