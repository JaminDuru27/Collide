export function Mouse(canvas){
    const res = {
        color: `#fff`,
        size: 10,
        x:0, y: 0,
        load(){
            window.addEventListener(`pointerdown`,(e)=>{
                const b =canvas.getBoundingClientRect()
                this.x = e.x - b.x
                this.y = e.y - b.y
            })
            window.addEventListener(`pointermove`,(e)=>{
                const b =canvas.getBoundingClientRect()
                this.x = e.x - b.x
                this.y = e.y - b.y
            })
            window.addEventListener(`pointerup`,()=>{
            })
        },
        draw(ctx){
            ctx.fillStyle = `red`
            ctx.save()
            ctx.strokeStyle = this.color
            ctx.setLineDash([2, 2])
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.stroke()
            ctx.restore()
        },  
        update({ctx}){
            this.draw(ctx)
        }
    }
    res.load()
    return res
}