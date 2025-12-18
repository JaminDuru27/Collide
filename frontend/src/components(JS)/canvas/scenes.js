import { BodyLayer } from "./bodies"
import { Scene } from "./scene"
import { SceneLocker } from "./scenelocker"

export function Scenes(Collide, sets,gets){
    const res = {
        lockers:[],
        add(){
            const sceneLocker  = SceneLocker(`Locker ${this.lockers.length + 1}` , Collide, this, sets,gets)
            this.lockers.push(sceneLocker)
            this.currentLocker = sceneLocker
            return sceneLocker
        },
        targetLocker(id){
            this.lockers.forEach(sceneLocker=>{
                if(sceneLocker.id === id){
                    this.currentLocker = sceneLocker
                }
            })
        },
        load(){
            const locker1= this.add()
            this.add()
            this.targetLocker(locker1.id)

            
        },
        getLockersDatas(){return {data:{currentLockerId: this.currentLocker.id},lockers:[...this.lockers.map(locker=>locker.getData())]}},
        revertData(LockersDatas){
            console.log(`this`, LockersDatas)

            this.lockers.map(locker =>locker.delete = true)
            this.currentLocker = undefined
            this.lockers = []

            LockersDatas.lockers.map(lockerdata=>{
                const sceneLocker  = SceneLocker(`Locker ${this.lockers.length + 1}` , Collide, this, sets,gets)
                sceneLocker.revertData(lockerdata)
                this.lockers.push(sceneLocker)
            })
            this.targetLocker(LockersDatas.data.currentLockerId)
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