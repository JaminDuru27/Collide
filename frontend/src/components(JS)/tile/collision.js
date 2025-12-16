
export function CollisionBody(Collide){
    const res = {
        color: `#fff`,
        lineWidth: 2,
        hidden: false,
        alpha: .6,
        vertices: [],
        Scene(){return Collide.scenes.currentLocker.currentScene},
        getData(){
            const data = {
                data: {
                    color: this.color, lineWidth: this.lineWidth,
                    hidden: this.hidden, alpha: this.alpha,
                    container: this.container,
                },
                vertices: [...this.vertices.map(v=>({x: v.x, y: v.y, ratio: v.ratio}))],
            }
            return data
        },
        revertData({vertices, data}){
            console.log(vertices, data, `kook`)
            for(let x in data){
                this[x] = data[x]
            }
            this.vertices = vertices
        },
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
            const x = this.container.indx  * this.Scene().grid.cw + this.Scene().grid.x  
            const y = this.container.indy  * this.Scene().grid.ch + this.Scene().grid.y
            const w = this.container.indw * this.Scene().grid.cw
            const h = this.container.indh * this.Scene().grid.ch
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