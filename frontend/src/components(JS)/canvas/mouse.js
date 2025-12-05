export function Mouse(canvas){
    const res = {
        color: `#fff`,
        size: 10,
        x:0, y: 0,
        updatex: true, updatey: true,
        load(){
            canvas.addEventListener(`pointerdown`,(e)=>{
                const b =canvas.getBoundingClientRect()
                if(this.updatey)this.x = e.x - b.x
                if(this.updatey)this.y = e.y - b.y
            })
            canvas.addEventListener(`pointermove`,(e)=>{
                const b =canvas.getBoundingClientRect()
                if(this.updatex)this.x = e.x - b.x
                if(this.updatey)this.y = e.y - b.y
            })
            canvas.addEventListener(`pointerup`,()=>{
            })
        },
        restrict(){this.updatex = false;this.updatey = false;},
        unrestrict(){this.updatex = true;this.updatey = true;},
        restrictx(){this.updatex = false},unrestrictx(){this.updatex = true},
        restricty(){this.updatey = false},unrestricty(){this.updatey = true},
        
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