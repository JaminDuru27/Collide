import { Point } from "./point"
let alpha = 0
export function PositionPoints(Collide){
    const res ={
        size: 10,
        hidden: false,
        array: [],
        hide(){this.hidden = true},
        unhide(){this.hidden = false},
        deleteColor(pp){
            this.array.map(p=>{
                if(p.color === pp.color){p.delete = true}
            })
        },
        deleteId(pp){
            this.array.map(p=>{
                if(p.id === pp.id){p.delete = true}
            })
        },
        deleteOnHover(){
            const {point, all} = this.onHover()
            all?.map(e=>{e.delete = true})
        },
        deleteAll(pp){
            this.array = []
        },
        renameColor(pp, name){
            this.array.map(p=>{
                if(p.color === pp.color){p.rename(name)}
            })
        },
        renameId(p, name){
            this.array.map(pp=>{
                if(p.id === pp.id){p.rename(name)}
            })
        },
        showcolors(color){
            this.array.map(pp=>{
                if(pp.color === color){pp.hidden = false; return}
                pp.hidden =true
            })
        },
        reset(){
            this.array.forEach(arr=>arr.hidden = false)
        },
        load(){
            Collide.grid.ontranslate(()=>{
                this.array.forEach(p=>p.setpos())
            })
            Collide.grid.onpopulate(()=>{
                this.array.forEach(p=>p.setpos())
            })
            this.icon = new Image()
            this.icon.onload=()=>{
                this.loaded = true
                this.iconw = this.icon.w
                this.iconh = this.icon.h
            }
            this.icon.src = `/editor/mark.png`
        },
        onHover(){
            const hoveredonpoints = []
            this.array.forEach(p=>{
                const dx = Collide.mouse.x - p.dx
                const dy = Collide.mouse.y - p.dy
                const dist = Math.sqrt(dx*dx + dy*dy)
                if(dist <= this.size){
                    hoveredonpoints.push(p)
                }
            })
            return {point: hoveredonpoints[0], all: hoveredonpoints}
        },
        mark(){ //auto 
            const x = Collide.mouse.x
            const y = Collide.mouse.y
            const point  = this.addpoint(x, y)
            return point
        },
        addpoint(x, y){ //auto
            if(this.array.find(e=>e.x === x && e.y === y)) return       
            const obj = Point(this, Collide)
            obj.set(x, y)
            this.array.push(obj)
            return obj
        },
        
        update(p){
            alpha += 0.05
            this.array.forEach((point, i)=>{
                point.update({...p, alpha})
                if(point.delete)this.array.splice(i, 1)
            })
        },
    }
    res.load()
    return res
}