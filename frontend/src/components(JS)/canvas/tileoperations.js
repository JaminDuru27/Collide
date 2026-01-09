export function TileOperations(Collide, Select, sets){
    const res = {
        Scene(){return Collide?.select?.targetScene ?? Collide.scenes?.currentLocker?.currentScene},
        performOperation(name){
            this.operations[name]()
        },
        load(){
            this.operations = {
                'selectsprite': this.selectsprite.bind(this),
                'craft': this.craft.bind(this),
                'copy': this.copy.bind(this),
                'cut': this.cut.bind(this),
                'paste': this.paste.bind(this),
                'delete': this.delete.bind(this),
            }
            this.events()
        },
        events(){
            Collide.canvas.addEventListener(`mousedown`, (e)=>{
                const layer = this.Scene().imageLayers?.currentLayer
                if(!layer)return
                const findTile = layer.tiles.filter(tile=>tile.onHover())[0]
                if(!findTile)return
                Collide.currentSelectedTile = findTile
                Collide.currentSelectedTile.lock = true
                Collide.ontileswitchcb(findTile)
                sets.setupdateAll(p=>!p)
                layer.target = findTile
                sets.setRefreshTilePluginsMods(p =>!p)
                if(e.button === 2)
                sets.setTile(p=>({...findTile}))

            })
            
            Collide.canvas.addEventListener(`dblclick`, (e)=>{
                sets.setTile(null)
                
                if(!Collide.currentSelectedTile)return
                Collide.currentSelectedTile.lock = false
                Collide.currentSelectedTile = undefined
                const layer = this.Scene().imageLayers?.currentLayer
                if(!layer) layer.target = undefined
                
            })
        },
        craft(){},
        selectsprite(){
            Select.boxes = []
            const layer = this.Scene().imageLayers.currentLayer
            if(!Collide.currentSelectedTile)return
            this.pt()    
            const tiletarget = layer.target
            layer.tiles.forEach(tile=>{
                if(
                    tile.sprite.sx === tiletarget.sprite.sx &&
                    tile.sprite.sy === tiletarget.sprite.sy &&
                    tile.sprite.indw === tiletarget.sprite.indw &&
                    tile.sprite.indh === tiletarget.sprite.indh
                ){
                    const grid = this.Scene().grid
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
            Select.boxes = []
            Collide.currentSelectedTile.lock = false
            
        },

        copy(){
            if(!Collide.currentSelectedTile)return
            this.pt()    
            Collide.selectoperations.performOperation(`copy`)
            Select.boxes = []
            Collide.currentSelectedTile.lock = false

        },
        cut(){
            if(!Collide.currentSelectedTile)return
            this.pt()    
            Collide.selectoperations.performOperation(`cut`)
            Select.boxes = []
            Collide.currentSelectedTile.lock = false

        },
        paste(){
            if(!Collide.currentSelectedTile)return
            this.pt()    
            Collide.selectoperations.performOperation(`paste`)
            Select.boxes = []
            Collide.currentSelectedTile.lock = false

        },
        pt(){
            Select.boxes = []
            Select.pushtarget({
                indx: Collide.currentSelectedTile.indx,
                indy: Collide.currentSelectedTile.indy,
                indw: Collide.currentSelectedTile.indw,
                indh: Collide.currentSelectedTile.indh,
            })
        },
        delete(){
            const layer = this.Scene().imageLayers.currentLayer
            if(layer.target)
            layer.target.remove()
        },
    }
    res.load()
    return res
}