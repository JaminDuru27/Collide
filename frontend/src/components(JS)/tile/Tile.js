import { Sprite } from "./Sprite"
import { TileVarHandler } from "./varhandler"
let tileno = 1
export function Tile(Scene,Collide){
    const res = {
        title: `Tile #${tileno}`,
        indx: Collide.highlight?.target?.indx, 
        indy: Collide.highlight?.target?.indy,
        indw: 1, indh: 1,
        angle: 0,
        indication: false,
        sprite: undefined,
        plugins: [], mods: [],
        collisionplugin:undefined, eliminateDuplicate:true,
        selected: true,
        showVariables(p){
            Collide.startVariableOptions(this.varHandler, p)
        },
        load(){
            
            Scene.imageLayers.currentLayer.tiles.push(this)
            this.varHandler  = TileVarHandler(this)
        },
        async addPlugin(entry, plugin){
            const factory = await entry
            const info = plugin.manifest.meta
            if(info.type === `environment`){return}

            let object = factory({Scene, Collide, Tile: this})
            if(!object.requirements)object.requirements = ()=> true
            if(object?.requirements() === true){
                object.info = info
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
            
        },
        updateEliminateDuplicate(){
            if(this.eliminateDuplicate){
                Scene.imageLayers.currentLayer.tiles.forEach(t=>{
                    if(t === this)return
                    if(t.indx === this.indx && t.indy === this.indy)
                    t.delete = true
                })
            }
        },
        getData(){
            const data = {
                data: {
                    indx: this.indx, indy: this.indy,
                    indw: this.indw, indh: this.indh
                },  
                sprite:this.sprite.getData(),
                collisionplugin:null,
            }
            return data
        },
        revertData(tiledata){
            this.indx = tiledata.indx ;this.indy = tiledata.indy 
            this.indw = tiledata.indw ;this.indh = tiledata.indh 
            this.sprite = Sprite(this, Collide, Scene)
            this.sprite.revertData(tiledata.sprite) 
        },
        select(){
            this.selected = true
            if(this.sprite)
            this.sprite.select()
        },
        unselect(){
            this.selected = false
            if(this.sprite)
            this.sprite.unselect()
        },
        onVeiw(){
            return (
                this.x + Collide.tx > window.InnerWidth ||
                this.y + Collide.ty> window.InnerHeight ||
                this.x + this.w + Collide.tx < 0 ||
                this.y + this.h + Collide.ty< 0 
            )
        },
        onHover(){
            const m = Collide.mouse
            return (
                m.x > this.x && 
                m.y > this.y &&
                m.x < this.x + this.w &&  
                m.y < this.y + this.h 
            )
        },
        retitle(v){this.title = `${v}`; console.log(`chages`, this.title)},
        show(){this.indication = true},
        hide(){this.indication = false},
        draw({ctx}){
            if(this.sprite)return
            if(Collide.devstate === `play` && this.collisionplugin)return
            if(`${Collide.mode}` === `dev` && this.collisionplugin)return
            if(!this.indication)return
            const size = 8
            
            ctx.save()
            ctx.strokeStyle = `blue`
            ctx.fillStyle = `blue`
            ctx.lineWidth = 1
            ctx.rect(this.x, this.y, this.w, this.h)
            ctx.globalAlpha =.8;ctx.stroke(); ctx.globalAlpha = 0.1; ctx.fill(); ctx.globalAlpha = 1

            ctx.strokeStyle = `white`
            ctx.fillStyle = `white`
            ctx.font = `${size}px geoform`
            ctx.fillText(`${this.title}`, this.x + 3,  this.y + size)
            ctx.restore()

        },
        delete: false,
        remove(){
            this.delete = true
            this.plugins.forEach(p=>p.remove())
            this.mods.forEach(p=>p.remove())
            this.plugins = []
            this.mods = []
        },
        update(p){  
            if(this.indx > Scene.grid.nx -1 || this.indy > Scene.grid.ny-1)return
            if(this?.sprite?.delete)this.sprite = undefined
            this?.collisionplugin?.update(p)
            this?.sprite?.update(p)

            this.plugins.forEach(plugin=>{
                if(plugin === this.sprite)return; if(plugin === this.collisionplugin) return
                if(plugin?.render)plugin.render(p)
            })
            this.calcDim()
            if(!this.onVeiw())
            this.draw(p)
        },
        resetdim(){
            this.x = Scene.grid.cw * this.indx + Scene.grid.x
            this.y = Scene.grid.ch * this.indy + Scene.grid.y
            this.w = Scene.grid.cw *this.indw
            this.h = Scene.grid.ch * this.indh
            this.initx = this.x; this.inity  = this.y; this.initw = this.w; this.inith = this.h

        },
        calcDim(){
            if(this.x || this.x === 0)return
            if(this.y || this.y === 0)return
            if(this.w || this.w === 0)return
            if(this.h || this.h === 0)return
            this.resetdim()
        },
    }
    res.load()
    tileno ++
    return res
}