export function Tile(Collide){
    const res = {
        indx: Collide.highlight?.target?.indx, 
        indy: Collide.highlight?.target?.indy,
        sprite: undefined,
        bodies:[], eliminateDuplicate:true,
        load(){
            Collide.imageLayers.currentLayer.tiles.push(this)
        },
        updateEliminateDuplicate(){
            if(this.eliminateDuplicate){
                Collide.imageLayers.currentLayer.tiles.forEach(t=>{
                    if(t === this)return
                    if(t.indx === this.indx && t.indy === this.indy)
                    t.delete = true
                })
            }
        },
        count: 0,
        update(p){
            if(this.indx > Collide.grid.nx -1 || this.indy > Collide.grid.ny-1){
                return
            }
            if(this.count >2){
                if(this?.sprite?.delete)this.sprite = undefined
                this?.sprite?.update(p)
            }
            if(this.count <3)
            this.count ++

        }
    }
    res.load()
    return res
}