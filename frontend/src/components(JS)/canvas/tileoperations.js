export function TileOperations(Collide, Select, sets){
    const res = {
        Scene(){return Collide.scenes?.currentLocker?.currentScene},
        performOperation(name){
            this.operations[name]()
        },
        load(){
            this.operations = {
                'selectsprite': this.selectsprite,
                'craft': this.craft,
                'rotate': this.rotate,
                'copy': this.copy,
                'cut': this.cut,
                'paste': this.paste,
                'delete': this.delete,
            }
            this.events()
        },
        events(){
            Collide.canvas.addEventListener(`mousedown`, (e)=>{
                if(e.button !== 2)return
                const target = this.Scene().highlight?.target
                const layer = this.Scene().imageLayers?.currentLayer

                if(!layer)return
                if(!target)return

                const findTile = layer.tiles.find(tile=>tile.indx === target.indx && tile.indy === target.indy)
                if(!findTile)return
                sets.setTile(p=>({...findTile}))
                layer.target = findTile

            })
            Collide.canvas.addEventListener(`dblclick`, (e)=>{
                sets.setTile(null)

            })
        },
        craft(){},
        rotate(){},
        selectsprite(){
            Select.boxes = []
            const layer = this.Scene().imageLayers.currentLayer
            Select.pushtarget()
            const tiletarget = layer.target
            layer.tiles.forEach(tile=>{
                if(
                    tile.sprite.sx === tiletarget.sprite.sx &&
                    tile.sprite.sy === tiletarget.sprite.sy &&
                    tile.sprite.indw === tiletarget.sprite.indw &&
                    tile.sprite.indh === tiletarget.sprite.indh
                ){
                    const grid = this.Scene().Grid
                    const box  = {
                        indx: tile.indx,
                        indy: tile.indy,
                        x: grid.x + tile.indx * grid.cw,
                        y: grid.y + tile.indy * grid.ch,
                        w: tile.sprite.indw * grid.cw,
                        h: tile.sprite.indh * grid.ch,
                        indw: tile.sprite.indw, indh: tile.sprite.indh,
                    }
                    Select.boxes.push(box)
                }
                sets.setselectoptions(true)
            })
            
        },

        copy(){
            Select.pushtarget()
            this.Scene().selectoperations.performOperation(`copy`)
        },
        cut(){
            Select.pushtarget()
            this.Scene().selectoperations.performOperation(`cut`)
        },
        paste(){
            Select.pushtarget()
            this.Scene().selectoperations.performOperation(`paste`)
        },
        delete(){
            Select.pushtarget()
            this.Scene().selectoperations.performOperation(`delete`)  
            sets.setTile(null)
        },
    }
    res.load()
    return res
}