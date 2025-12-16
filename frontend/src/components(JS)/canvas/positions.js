import { Point } from "./point"
let alpha = 0
export function PositionPoints(Collide, Shortcuts, Grid, Tools, Mouse){
    const res ={
        mode: `relative`,
        size: 10,
        hidden: false,
        array: [],
        hide(){this.hidden = true},
        unhide(){this.hidden = false},
        getData(){
            const data =[...this.array.map(p=>({
                id: p.id,
                name: p.name, color: p.color, 
                mode: p.mode, hidden: p.hidden,
                x: p.x,y: p.y, ratio: p.ratio,
                gridw: p.gridw, gridh: p.gridh,
                gridnx: p.gridnx, gridny: p.gridny, 
            }))]
            return data
        },
        revertData(positionsData){
            this.array = []
            positionsData.forEach(pdata=>{
                const point  = this.addpoint(pdata.x, pdata.y)
                for(let x in pdata){
                    point[x] = pdata[x]
                }
            })
        },
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
            Grid.ontranslate(()=>{
                this.array.forEach(p=>p.setpos())
            })
            Grid.onpopulate(()=>{
                this.array.forEach(p=>p.setpos())
            })
            this.icon = new Image()
            this.icon.onload=()=>{
                this.loaded = true
                this.iconw = this.icon.w
                this.iconh = this.icon.h
            }
            this.icon.src = `/editor/mark.png`
            this.shortcuts()
        },
        shortcuts(){
            Shortcuts.add(`alt`, ()=>Tools?.tool?.name === `Mark`).cb(()=>{
                this.mode = `absolute`
                console.log(this.mode)
            }).endcb(()=>{
                this.mode = `relative`
            })
        },
        onHover(){
            const hoveredonpoints = []
            this.array.forEach(p=>{
                const dx = Mouse.x - p.dx
                const dy = Mouse.y - p.dy
                const dist = Math.sqrt(dx*dx + dy*dy)
                if(dist <= this.size){
                    hoveredonpoints.push(p)
                }
            })
            return {point: hoveredonpoints[0], all: hoveredonpoints}
        },
        mark(){ //auto 
            const x = Mouse.x
            const y = Mouse.y
            const point  = this.addpoint(x, y)
            return point
        },
        addpoint(x, y){ //auto
            if(this.array.find(e=>e.x === x && e.y === y)) return       
            const obj = Point(this, Grid)
            if(this.mode === `relative`)obj.relativemode()
            else if(this.mode === `absolute`)obj.absolutemode()
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