export function SelectTool(Collide){
    const res = {
        name: `Select`,
        load(){},
        enter(){
            Collide.select.shouldupdate = true
            console.log(Collide.select.shouldupdate, Collide.select)
        },
        leave(){
            Collide.select.shouldupdate = false
        },
        update(){}
    }
    res.load()
    return res
}