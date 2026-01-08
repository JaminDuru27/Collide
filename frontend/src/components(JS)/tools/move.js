import { Tile } from "../tile/Tile"

export function Move (Collide){
    const res = {
        name: `Move`,
        color: undefined,
        load(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            window.addEventListener(`mousedown`, (e)=>{
                if(!this.selected)return
                if(e.button === 0){
                    this.down = true
                    this.t = Scene().imageLayers.currentLayer.target
                    if(!this.t)return
                    this.d = {x: Collide.mouse.x - this.t.x, y: Collide.mouse.y  - this.t.y}
                }
            })
            window.addEventListener(`mouseup`, ()=>{this.down = false; this.t = undefined; this.d = {x:0, y: 0}})
        },

        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            if(this.down && this.t){
                this.t.x = Collide.mouse.x - (this.d.x || 0)
                this.t.y = Collide.mouse.y - (this.d.y || 0)
                this.t.initx  = Collide.mouse.x - (this.d.x || 0)
                this.t.inity = Collide.mouse.y - (this.d.y || 0)
            }
        },

        off(){},
        enter(){this.selected= true},
        leave(){this.selected = false},
        update(){}
    }
    res.load()
    return res
}