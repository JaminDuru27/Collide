export function TileOperations(Collide, sets){
    const res = {
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
                const target = Collide.highlight.target
                const layer = Collide.imageLayers.currentLayer
                if(!layer && !target)return
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
            Collide.select.boxes = []
            const layer = Collide.imageLayers.currentLayer
            Collide.select.pushtarget()
            const tiletarget = layer.target
            layer.tiles.forEach(tile=>{
                if(
                    tile.sprite.sx === tiletarget.sprite.sx &&
                    tile.sprite.sy === tiletarget.sprite.sy &&
                    tile.sprite.indw === tiletarget.sprite.indw &&
                    tile.sprite.indh === tiletarget.sprite.indh
                ){
                    const grid = Collide.grid
                    const box  = {
                        indx: tile.indx,
                        indy: tile.indy,
                        x: grid.x + tile.indx * grid.cw,
                        y: grid.y + tile.indy * grid.ch,
                        w: tile.sprite.indw * grid.cw,
                        h: tile.sprite.indh * grid.ch,
                        indw: tile.sprite.indw, indh: tile.sprite.indh,
                    }
                    Collide.select.boxes.push(box)
                }
                sets.setselectoptions(true)
            })
            
        },

        copy(){
            Collide.select.pushtarget()
            Collide.selectoperations.performOperation(`copy`)
        },
        cut(){
            Collide.select.pushtarget()
            Collide.selectoperations.performOperation(`cut`)
        },
        paste(){
            Collide.select.pushtarget()
            Collide.selectoperations.performOperation(`paste`)
        },
        delete(){
            Collide.select.pushtarget()
            Collide.selectoperations.performOperation(`delete`)  
            sets.setTile(null)
        },
    }
    res.load()
    return res
}