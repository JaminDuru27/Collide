export function Element(){
    const res = {
        load(){},
        setTarget(type, ref){
            this.target = ref[`current`]
            this.type = this[`${type}change`]
            this.onupdate = ()=>{
                if(this.type)
                this.type()
            }
        },
        clearTarget(){
            this.target = null; this.type = null
            this.onupdate= ()=>{}
        },
        onupdate(){},
        widthchange(){
            if(!this.target)return ;
            const x = this.target.getBoundingClientRect().x
            const dx = this.mx - x
            this.target.style.width = dx + `px`  
        },
        heightchange(){
            if(!this.target)return ;
            const y = this.target.getBoundingClientRect().y
            const dy = this.my - y
            this.target.style.height = dy + `px`  
        }
    }
    res.load()
    return res 
}