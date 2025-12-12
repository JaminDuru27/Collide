export function Highlight(mouse, collide, scene){
    const res = {
        scene(){return (scene)?scene:collide?.scenes?.currentLocker?.currentScene},
        target:undefined,
        color: `#0378c6`, alpha:0.2,
        load(){},
        draw(ctx){
            if(!this.target)return
            ctx.save()
            ctx.translate(this.scene().grid.x, this.scene().grid.y)
            ctx.setLineDash([2,2])
            
            ctx.globalAlpha = (this.alpha !== (0 || `0`))?1:0
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.target.cw * this.target.indx, this.target.ch * this.target.indy, this.target.cw, this.target.ch )
            
            ctx.globalAlpha  = this.alpha
            ctx.fillStyle = this.color
            ctx.fillRect(this.target.cw * this.target.indx, this.target.ch * this.target.indy, this.target.cw, this.target.ch )
            ctx.restore()
        },
        checkboxcollide(mx,my, box){
            return (
                mx> box.x &&
                my > box.y &&
                mx < box.x + box.w && 
                my < box.y + box.h 
            )
        },
        detTarget(){
            const mx = mouse.x
            const my = mouse.y
            this.scene().grid.boxes.forEach(box=>{
                const bx = this.scene().grid.x + box.indx * box.cw
                const by = this.scene().grid.y + box.indy * box.ch
                if(this.checkboxcollide(mx, my, {x: bx, y: by, w: box.cw, h: box.ch})){
                    this.target = box
                }
            })
        },
        update({ctx}){
            this.detTarget()
            this.draw(ctx)
        }
    }
    res.load()
    return res
}