export function TileOperations(Collide, sets){
    const res = {
        performOperation(name){
            this.operations[name]()
        },
        load(){
            this.operations = {
                'selectsprite': this.selectspite,
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
            window.addEventListener(`mousedown`, (e)=>{
                if(e.button !== 2)return
                const target = Collide.highlight.target
                const layer = Collide.imageLayers.currentLayer
                if(!layer && !target)return
                const findTile = layer.tiles.find(tile=>tile.indx === target.indx && tile.indy === target.indy)
                if(!findTile)return
                sets.setTile(p=>({...findTile}))
                layer.target = findTile

            })
        },
        selectspite(){},
        craft(){},
        rotate(){},
        copy(){
            Collide.select.pushtarget()
            // Collide.selectoperations.performOperation(`copy`)
        },
        cut(){},
        paste(){},
        delete(){},
    }
    res.load()
    return res
}