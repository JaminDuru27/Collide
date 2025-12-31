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
            if(this.tile.sprite){
                const w = 50, h= 50
                const canvas  = p.ctx.canvas
                // console.log(canvas.width, canvas.height)
                this.tile.sprite.drawbib(p, canvas.width/2 - (w/2), canvas.height/2 - (h/2), w, h)
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