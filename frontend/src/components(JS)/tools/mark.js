export function Mark(Collide){
    const res = {
        name: `Mark`,
        color: undefined,
        load(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            window.addEventListener(`mousedown`, (e)=>{
                if(e.button === 2){
            
                    const {point}= Scene().positions.onHover()
                    if(point)this.color = point.color
                }
            })
        },

        on(){
            const  Scene = ()=>Collide.scenes?.currentLocker?.currentScene
            
            const point = Scene().positions.mark()
            if(point && this.color){
                point.color = this.color
                this.color = undefined
            }
        },

        off(){},
        enter(){},
        leave(){},
        update(){}
    }
    res.load()
    return res
}