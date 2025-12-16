import { Sprite } from "./Sprite"

export function Tile(Scene,Collide){
    const res = {
        indx: Collide.highlight?.target?.indx, 
        indy: Collide.highlight?.target?.indy,
        indw: 1, indh: 1,
        sprite: undefined,
        bodies:[], eliminateDuplicate:true,
        load(){
            console.log(Scene)
            Scene.imageLayers.currentLayer.tiles.push(this)
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
                bodies:null,
            }
            return data
        },
        revertData(tiledata){
            this.indx = tiledata.indx ;this.indy = tiledata.indy 
            this.indw = tiledata.indw ;this.indh = tiledata.indh 
            this.sprite = Sprite(this, Collide, Scene)
            this.sprite.revertData(tiledata.sprite) 
        },
        update(p){
            if(this.indx > Scene.grid.nx -1 || this.indy > Scene.grid.ny-1){
                return
            }
            // if(this.count >2){
                if(this?.sprite?.delete)this.sprite = undefined
                this?.sprite?.update(p)
            // }
            if(this.count <3)
            this.count ++

        }
    }
    res.load()
    return res
}