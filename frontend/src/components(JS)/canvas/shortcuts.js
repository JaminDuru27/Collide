export function ShortCuts(){
    const res = {
        inputs: [],
        array: [],
        load(){
            window.addEventListener(`keydown`, (e)=>{
                if(!this.inputs.includes(e.key.toLocaleLowerCase()))
                this.inputs.push(e.key.toLocaleLowerCase())
                this.array.forEach(keys=>{
                    if(keys.cond(this.inputs)){
                        keys.call()
                    }
                })

            })
            window.addEventListener(`keyup`, (e)=>{
                if(this.inputs.includes(e.key.toLocaleLowerCase()))
                this.inputs.splice(this.inputs.indexOf(e.key.toLocaleLowerCase()), 1)
                this.array.forEach(keys=>{
                    if(keys.cond(this.inputs)){keys.callend()}
                    if(!keys.cond(this.inputs)){keys.reset()}
                    
                })
            })
        },
        add(...combo){
            const c= [...combo.map(c=>c)]
            const keys = Keys(combo) 
            this.array.push(keys)
            return keys
        },
    }
    res.load()
    return res
}

export function Keys(combo){
    const res = {
        combo,
        shouldcall: true,
        $end:()=>{},
        cb(cb){this.$cb = cb;return this},
        endcb(cb){this.$end = cb;return this},
        callend(){this.$end()},
        call(){
            if(this.shouldcall)
            this.$cb()
            this.shouldcall = false
        },
        cond(inputs){return combo.every(c=>inputs.includes(c))},
        reset(){this.shouldcall = true;return this},
        load(){

        }
    }
    res.load()
    return res
}