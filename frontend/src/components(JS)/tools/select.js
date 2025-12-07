export function SelectTool(Collide){
    const res = {
        name: `Select`,
        load(){},
        enter(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            Collide.select.shouldupdate = true
        },
        leave(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            Collide.select.shouldupdate = false
        },
        update(){}
    }
    res.load()
    return res
}