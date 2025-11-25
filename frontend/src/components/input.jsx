import { motion } from "framer-motion"
import { useState } from "react"


export function Input({title, setvalue,getvalue, type='input'}){
    const [focussed, setfocussed] = useState((getvalue === '')?false :true)

    useState(()=>{
        if(getvalue === ``)setfocussed(false)
        else setfocussed(true)
    }, [])
    return (
    <div
    onPointerEnter={()=>{setfocussed(true)}}
    onPointerLeave={()=>{if(getvalue === '')setfocussed(false)}}
    className="relative">
    <motion.div 
    initial = {{top: `20px`, translateY: `50%`, opacity:.6, fontSize:`1rem`, left:0,}}
    animate={(focussed )?{top: `-5px`, translateY: `50%`, opacity:1, fontSize:`.6rem`, left:0,}:{}}
    exit={{top: 0, translateY: `50%`, opacity:1, fontSize:`.5rem`, left:0,}}
    // animate = {{top: 0, translateY: `50%`, opacity:1, fontSize:`.5rem`, left:0,}}
    className="absolute rounded-2xl p-1 pr-2 text-[.9rem] opacity-[.4] left-2 top-1/2 translate-y-[-50%]"
    >
    {title}
    </motion.div>
    <input type={type} value={getvalue} onInput={(e)=>{setvalue(p=>e.target.value)}} className="w-full my-4 p-2  rounded-sm border-2 border-[#ffffff46]" />
    </div>                
    )
}