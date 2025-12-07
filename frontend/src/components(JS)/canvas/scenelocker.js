import { genId } from "../../utils/genid"
import { Scene } from "./scene"

export function SceneLocker(name, Collide, Scenes, sets,gets){
    const res= {
        name,
        id: `scene`+ genId(),
        scenes : [],
        add(){
            const scene = Scene(`Scene ${this.scenes.length + 1}`, Collide, sets,gets)
            this.scenes.push(scene)
            this.currentScene = scene
            return scene
        },
        targetScene(id){
            this.scene.forEach(scene=>{
                if(scene.id === id){
                    this.currentScene = scene
                }
            })
        },
        checkHoverOnScenes(scene){
            return (
                Collide.mouse.x > scene.grid.x &&
                Collide.mouse.y > scene.grid.y &&
                Collide.mouse.x < scene.grid.w + scene.grid.w &&
                Collide.mouse.y < scene.grid.h + scene.grid.h
            )
        },
        load(){
            this.add()
            this.add()
        },
        highlightcurrentscene({ctx}){
            if(!this.currentScene)return
            const g = this?.currentScene?.grid
            if(!g)return
            ctx.strokeStyle = `red`
            ctx.strokeRect(g.x, g.y, g.w, g.h)

            ctx.save()
            ctx.font = `12px Arial`
            ctx.fillStyle = `rgba(225, 225, 225, 0.5)`
            ctx.fillText(this.currentScene.name, g.x + 5, g.y + 14)
            ctx.restore()
        },
        update(p){
            this.scenes.forEach((scene, c)=>{
                scene.update(p)
                if(scene.delete)this.scenes.splice(c, 1)
            })
            this.scenes.forEach(scene=>{
                if(this.checkHoverOnScenes(scene)){
                    this.currentScene = scene
                }
            })
            this.highlightcurrentscene(p)
        },
    }
    res.load()
    return res
}