import { Sprite } from "../tile/Sprite"
import { Tile } from "../tile/Tile"

export function SelectOperations(Collide, Scene, sets){
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
                'craft': this.craftworldcollisionfromtile.bind(this),
            }

            Collide.shortcuts.add(`delete`).cb(()=>{this.performOperation(`delete`)})
            Collide.shortcuts.add(`x`).cb(()=>{this.performOperation(`cut`)})
            Collide.shortcuts.add(`c`).cb(()=>{this.performOperation(`copy`)})
            Collide.shortcuts.add(`v`).cb(()=>{this.performOperation(`paste`)})
            Collide.shortcuts.add(`alt` , `s`).cb(()=>{this.performOperation(`consolidate`)})
            Collide.shortcuts.add(`alt` , `w`).cb(()=>{this.performOperation(`spread to`)})
            Collide.shortcuts.add(`shift` , `arrowleft`).cb(()=>{this.performOperation(`duplicate`, 'left')})
            Collide.shortcuts.add(`shift` , `arrowright`).cb(()=>{this.performOperation(`duplicate`, 'right')})
            Collide.shortcuts.add(`shift` , `arrowup`).cb(()=>{this.performOperation(`duplicate`, 'up')})
            Collide.shortcuts.add(`shift` , `arrowdown`).cb(()=>{this.performOperation(`duplicate`, 'down')})
        },
        performOperation(name, arg = undefined){
            const operation = this.operations[name]
            if(operation)operation(arg)
        },
        copytiles:[],
        craftworldcollisionfromtile(){

            const copytiles = this.copySelection(false)
            console.log(copytiles)
            Collide.collisionbodyfactory.addtiles(copytiles)
            sets.setbodyfactory(true)
            Collide.collisionbodyfactory.resizeOp(copytiles)

        },
        deleteSelection(){
            const select = Collide.select
            const tiles = Scene.imageLayers?.currentLayer?.tiles
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
            const tiles = Scene.imageLayers?.currentLayer?.tiles
            const images = Collide.images
            if(!images)return
            if(tiles && select.boxes.length >0){
                const tile = Tile(Scene, Collide)
                const fx = select.boxes[0].indx
                const fy = select.boxes[0].indy
                const imageobj = images.image
                if(!imageobj)return

                tile.indx = fx
                tile.indy = fy
                tile.indw = select.boxes[0].indw
                tile.indh = select.boxes[0].indh
                tile.sprite = Sprite(tile, Collide, Scene)
                tile.updateEliminateDuplicate()
            }
        },
        cutSelection(){
            this.copySelection()
            this.deleteSelection()
        },
        pasteSelection(array){           
            (array ?? this.copytiles).forEach(tile=>{
                const scene = Collide.scenes.currentLocker.currentScene
                const newtile = Tile(scene, Collide)
                if(Collide.select.boxes.length <=0)return
                newtile.indx = tile.rindx + Collide.select.boxes[0].indx
                newtile.indy = tile.rindy + Collide.select.boxes[0].indy
                newtile.indw = tile.indw
                newtile.indh = tile.indh
                
                newtile.sprite = Sprite(newtile,Collide, scene)
                newtile.sprite.imageobj = {...tile.sprite.imageobj, altered: true}
                newtile.sprite.sx = tile.sprite.sx
                newtile.sprite.sy = tile.sprite.sy
                newtile.sprite.sh = tile.sprite.sh
                newtile.sprite.sw = tile.sprite.sw

                newtile.sprite.loaded = true
                newtile.updateEliminateDuplicate()
                const tiles = scene.imageLayers?.currentLayer?.tiles
                tiles.push(newtile)
            })

        },
        copySelection(add = true){
            const resulttiles = []

            const select = Collide.select
            const tiles = Scene.imageLayers?.currentLayer?.tiles  
            if(tiles){
                select.forEachBox(box=>{
                    tiles.forEach(tile=>{
                        if(tile.indx === box.indx && tile.indy === box.indy){
                            resulttiles.push({...tile, rindx: box.rindx, rindy: box.rindy})
                        }
                    })
                }
            )
            if(add){
                if(resulttiles.length)
                this.copytiles = resulttiles
            }
            console.log(resulttiles, `resulttiles`)
            return resulttiles
        }
        },
        consolidateSelection(){
            const canvas = document.createElement(`canvas`)
            const ctx = canvas.getContext(`2d`)
            const select = Collide.select
            
            const indw = select.boxes[0].indw
            const indh = select.boxes[0].indh
            const w = indw * Scene.grid.cw
            const h = indh * Scene.grid.ch
            canvas.width = w
            canvas.height = h

            const tiles = []
            select.forEachBox(box=>{
                Scene.imageLayers?.currentLayer?.tiles.forEach(tile=>{
                    if(tile.indx >= box.indx && tile.indx < box.indx + box.indw &&
                          tile.indy >= box.indy && tile.indy < box.indy + box.indh){
                        tiles.push(tile)
                    }
                })
            })
            tiles.forEach(tile=>{
                const sprite = tile.sprite
                const imageobj = Collide.images?.image
                if(!imageobj)return 
                const sx = sprite.sx
                const sy = sprite.sy
                const sw = imageobj.$sw
                const sh = imageobj.$sh
                const dx = (tile.indx - select.boxes[0].indx) * Scene.grid.cw
                const dy = (tile.indy - select.boxes[0].indy) * Scene.grid.ch
                const dw = Scene.grid.cw
                const dh = Scene.grid.ch
                ctx.imageSmoothingEnabled = false
                ctx.drawImage(imageobj.image, sx, sy, sw, sh, dx, dy, dw, dh)
            })

            const dataurl = canvas.toDataURL()
            sets.seturl({url:dataurl + '', name: Scene.imageLayers?.currentLayer?.name})
        },
        duplicateSelection(direction = `right`){
            console.log(direction)
            const dir = direction 
            const select = Collide.select
            const tiles = Scene.imageLayers?.currentLayer?.tiles
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
                        // if(box.ref.indx > 0 && box.ref.indx + box.indw < Scene.grid.nx)
                        box.ref.x = box.ref.indx * Scene.grid.cw + Scene.grid.x
                    }
                    if(dir === `left`){
                        box.ref.indx = box.indx - 1
                        // if(box.ref.indx > 0 && box.ref.indx + box.indw < Scene.grid.nx)
                        box.ref.x = box.ref.indx * Scene.grid.cw + Scene.grid.x
                    }
                    if(dir === `up`){
                        box.ref.indy = box.indy - 1
                        // if(box.ref.indy > 0 && box.ref.indy + box.indh < Scene.grid.ny)
                        box.ref.y = box.ref.indy * Scene.grid.ch + Scene.grid.y
                    }
                    if(dir === `down`){
                        box.ref.indy = box.indy + 1
                        // if(box.ref.indy > 0 && box.ref.indy + box.indh < Scene.grid.ny)
                        box.ref.y = box.ref.indy * Scene.grid.ch + Scene.grid.y
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