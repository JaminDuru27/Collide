import { BodyLayer } from "./bodies"
import { Scene } from "./scene"
import { SceneLocker } from "./scenelocker"

export function Scenes(Collide, sets,gets){
    const res = {
        lockers:[],
        add(){
            const sceneLocker  = SceneLocker(`Scene ${this.lockers.length + 1}` , Collide, this, sets,gets)
            this.lockers.push(sceneLocker)
            this.currentLocker = sceneLocker
            return sceneLocker
        },
        targetLocker(id){
            this.scene.forEach(sceneLocker=>{
                if(sceneLocker.id === id){
                    this.currentLocker = sceneLocker
                }
            })
        },
        load(){
            this.add()
        },
        update(p){
            if(this.currentLocker){
                this.currentLocker.update(p)
                const c = this.lockers.find(e=>e.id === this.currentLocker.id)
                if(this.currentLocker.delete)this.lockers.splice(c, 1)
        
            }        
        }
    }
    res.load()
    return res
}