export function Mark(Collide){
    const res = {
        name: `Mark`,
        color: undefined,
        load(){
            window.addEventListener(`mousedown`, (e)=>{
                if(e.button === 2){
                    const {point}= Collide.positions.onHover()
                    if(point)this.color = point.color
                }
            })
        },

        on(){
            const point = Collide.positions.mark()
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