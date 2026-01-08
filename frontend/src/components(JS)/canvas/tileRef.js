import { DisposableCanvas } from "../../utils/disposablecanvas"

export function TileRef(Collide, sets){
    const res = {
        tile: undefined,
        scene(){return Collide.scenes.currentLocker.currentScene},
        load(){
            if(!this.scene())return
            Collide.ontileswitch((t)=>{
                if(!t){}
                else {
                    this.tile = t
                    sets.setRefreshTilePluginsMods(p=>!p)
                }
            })

            this.options = [
                {name: `add plugin`, cb: this.addPlugin.bind(this)},
                {name: `add mod`, cb: this.addMod.bind(this)},
            ]
            
        },
       
        addPlugin(){
            sets.setpluginmodcb(p=>({cb:(info)=>{
                const func = Collide.pluginsmodshandler.getPlugin(info, `tile`)
                if(!func)return
                this.tile.addPlugin(func)
            }}))
        },
        addMod(){},
        draw(p){
            if(!this.tile)return;
            const w = 50, h= 50
            const canvas  = p.ctx.canvas
            if(this.tile.sprite){
                this.tile.sprite.drawbib(p, canvas.width/2 - (w/2), canvas.height/2 - (h/2), w, h)
            }else{
                const ctx = p.ctx
                ctx.save()
                ctx.strokeStyle = this?.tile?.color || `blue`
                ctx.fillStyle = this?.tile?.color || `blue`
                ctx.globalAlpha = 0.5
                ctx.fillRect(canvas.width/2 - (w/2), canvas.height/2 - (h/2), w, h)
                ctx.globalAlpha = 1
                ctx.strokeRect(canvas.width/2 - (w/2), canvas.height/2 - (h/2), w, h)
                ctx.restore()
                ctx.fillStyle = `white`
                ctx.globalAlpha = 0.5
                ctx.font = `12px geoform`
                ctx.fillText((this.tile.title||`Unknown Tile`), 10, 20)
            }
        },
        setup(cref){
            this.disposableCanvas = DisposableCanvas(this, cref)
            .onupdate((p)=>{
                this.draw(p)
            }).update(1000/60)
        },
        update(p){
            
        },
    }
    res.load()
    return res
}