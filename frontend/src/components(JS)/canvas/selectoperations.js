import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function SelectOperations(Collide, sets){
    const res = {
        load(){
            this.operations = {
                'delete': this.deleteSelection.bind(this),
                'cut': this.cutSelection.bind(this) ,
                'copy': this.copySelection.bind(this),
                'paste': this.pasteSelection.bind(this),
                'consolidate': this.consolidateSelection,
                'spread to': this.SpreadImageToSelection,
                'duplicate': this.duplicateSelection.bind(this),
            }
        },
        performOperation(name){
            const operation = this.operations[name]
            if(operation)operation()
        },
        copytiles:[],
        deleteSelection(){
            const select = Collide.select
            const tiles = Collide.imageLayers?.currentLayer?.tiles
            if(tiles){
                select.forEachBox(box=>{
                    tiles.forEach(tile=>{
                        if(tile.indx === box.indx && tile.indy === box.indy){
                            tile.delete = true
                        }
                    })
                })
            } 

        },
        SpreadImageToSelection(){
            const select = Collide.select
            const tiles = Collide.imageLayers?.currentLayer?.tiles
            const images = Collide.images
            if(tiles && select.boxes.length >0){
                const tile = Tile(Collide)
                const fx = select.boxes[0].indx
                const fy = select.boxes[0].indy
                const imageobj = images.image
                if(!imageobj)return

                tile.indx = fx
                tile.indy = fy
                tile.sprite = Sprite(tile, Collide)
                tile.sprite.indw = select.boxes[0].indw
                tile.sprite.indh = select.boxes[0].indh
                tile.updateEliminateDuplicate()
            }
        },
        cutSelection(){
            this.copySelection()
            this.deleteSelection()
        },
        pasteSelection(array){
            (array ?? this.copytiles).forEach(tile=>{
                const newtile = Tile(Collide)
                if(Collide.select.boxes.length <=0)return
                console.log(tile)
                newtile.indx = tile.rindx + Collide.select.boxes[0].indx
                newtile.indy = tile.rindy + Collide.select.boxes[0].indy
                newtile.sprite = Sprite(newtile, Collide)
                newtile.sprite.imageobj = tile.sprite.imageobj
                newtile.sprite.sx = tile.sprite.sx
                newtile.sprite.sy = tile.sprite.sy
                newtile.sprite.sh = tile.sprite.sh
                newtile.sprite.sw = tile.sprite.sw

                newtile.sprite.indw = tile.sprite.indw
                newtile.sprite.indh = tile.sprite.indh
                newtile.sprite.loaded = true
                newtile.updateEliminateDuplicate()
                const tiles = Collide.imageLayers?.currentLayer?.tiles
                tiles.push(newtile)
            })

        },
        copySelection(add = true){
            if(add)
            this.copytiles = []
            const select = Collide.select
            const tiles = Collide.imageLayers?.currentLayer?.tiles  
            if(tiles){
                select.forEachBox(box=>{
                    tiles.forEach(tile=>{
                        if(tile.indx === box.indx && tile.indy === box.indy){
                            if(add)
                            this.copytiles.push({...tile, rindx: box.rindx, rindy: box.rindy})
                        }
                    })
                }
            )
            }
        },
        consolidateSelection(){
            const canvas = document.createElement(`canvas`)
            const ctx = canvas.getContext(`2d`)
            const select = Collide.select
            
            const indw = select.boxes[0].indw
            const indh = select.boxes[0].indh
            const w = indw * Collide.grid.cw
            const h = indh * Collide.grid.ch
            canvas.width = w
            canvas.height = h

            const tiles = []
            select.forEachBox(box=>{
                Collide.imageLayers?.currentLayer?.tiles.forEach(tile=>{
                    if(tile.indx >= box.indx && tile.indx < box.indx + box.indw &&
                          tile.indy >= box.indy && tile.indy < box.indy + box.indh){
                        tiles.push(tile)
                    }
                })
            })
            tiles.forEach(tile=>{
                const sprite = tile.sprite
                const imageobj = Collide.images.image
                if(!imageobj)return
                const sx = sprite.sx
                const sy = sprite.sy
                const sw = imageobj.$sw
                const sh = imageobj.$sh
                const dx = (tile.indx - select.boxes[0].indx) * Collide.grid.cw
                const dy = (tile.indy - select.boxes[0].indy) * Collide.grid.ch
                const dw = Collide.grid.cw
                const dh = Collide.grid.ch
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(imageobj.image, sx, sy, sw, sh, dx, dy, dw, dh)
            })

            const dataurl = canvas.toDataURL()
            sets.setconsolidateurl(dataurl)
            console.log(dataurl)
            // document.body.appendChild(canvas)
            // canvas.setAttribute(`style`,`position:absolute;top:0;left:0;z-index:10000;border:2px solid red;`)

        },
        duplicateSelection(direction = `r   ight`){
            const dir = direction 
            const select = Collide.select
            const tiles = Collide.imageLayers?.currentLayer?.tiles
            const selectedTiles = []
            if(tiles){
                select.forEachBox(box=>{
                    tiles.forEach(tile=>{
                        if(tile.indx >= box.indx && tile.indx < box.indx + box.indw &&
                            tile.indy >= box.indy && tile.indy < box.indy + box.indh){
                            selectedTiles.push({...tile, rindx:box.rindx, rindy:box.rindy})
                        }
                    })
                    if(dir === `right`){
                        box.ref.indx = box.indx + 1
                        // if(box.ref.indx > 0 && box.ref.indx + box.indw < Collide.grid.nx)
                        box.ref.x = box.ref.indx * Collide.grid.cw + Collide.grid.x
                    }
                    if(dir === `left`){
                        box.ref.indx = box.indx - 1
                        // if(box.ref.indx > 0 && box.ref.indx + box.indw < Collide.grid.nx)
                        box.ref.x = box.ref.indx * Collide.grid.cw + Collide.grid.x
                    }
                    if(dir === `up`){
                        box.ref.indy = box.indy - 1
                        // if(box.ref.indy > 0 && box.ref.indy + box.indh < Collide.grid.ny)
                        box.ref.y = box.ref.indy * Collide.grid.ch + Collide.grid.y
                    }
                    if(dir === `down`){
                        box.ref.indy = box.indy + 1
                        // if(box.ref.indy > 0 && box.ref.indy + box.indh < Collide.grid.ny)
                        box.ref.y = box.ref.indy * Collide.grid.ch + Collide.grid.y
                    }
                
                })

            }

            //create new tiles
            this.copySelection(false)
            this.pasteSelection(selectedTiles)
        },
        update(){}
    }  
    res.load()
    return res
}