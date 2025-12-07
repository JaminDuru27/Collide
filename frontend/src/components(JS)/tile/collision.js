
export function CollisionBody(Collide){
    const res = {
        color: `#fff`,
        lineWidth: 2,
        hidden: false,
        alpha: .6,
        vertices: [],
        getexportdata(){
            return {container: this.container, type: `relative`, vertices: this.vertices}
        },
        addVertices(array){
            this.vertices = array
            return this
        },
        setContainerIndex({indx, indy, indw, indh}){
            this.container = {indx, indy, indw, indh}
            return this
        },
        calcpos(){
            const x = this.container.indx  * Collide.grid.cw + Collide.grid.x  
            const y = this.container.indy  * Collide.grid.ch + Collide.grid.y
            const w = this.container.indw * Collide.grid.cw
            const h = this.container.indh * Collide.grid.ch
            this.vertices.map(v=>{
                v.x = x + v.ratio.x * w
                v.y = y + v.ratio.y * h
            })
            
        },
        load(){},
        draw({ctx}){
            if(this.vertices.length <= 0)return
            ctx.save()
            // ctx.translate(Collide.grid.x, Collide.grid.y)
            ctx.globalAlpha = this.alpha
            ctx.lineWidth = this.lineWidth
            ctx.strokeStyle = this.color
            ctx.globalAlpha = (this.alpha -.2 <= 0)?0: this.alpha - .2 
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
            this.vertices.forEach((v, i)=>{
                if(i === 0 )return
                ctx.lineTo(v.x, v.y)
            })
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        },
        update(p){
            if(this.hidden)return
            this.draw(p)
        },
    }
    res.load()
    return res
}