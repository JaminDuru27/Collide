import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import ReactDom from 'react-dom'
export function Sidebar({dir = `left`,hide, setHide, children, ref}){
    const timeout = useRef(null)
    return (
        <motion.div 
        initial={dir===`left`?{translateX:`-100%`}:{translateX:`100%`}}
        animate={dir===`left`?{translateX: !hide?`0`:`-100%`}:{translateX: !hide?`0`:`100%`}}
        onPointerEnter={()=>{
            clearTimeout(timeout.current)
        }}
        onPointerLeave={()=>{
            timeout.current = setTimeout(()=>{
                setHide(true)
            }, 10000)
        }}
        style={{zIndex:10}}
        className={` w-[30%] overflow-y-auto overflow-x-hidden scrolly p-2 z-10 border-2 bg-[#0f012d] border-amber-50/20 rounded-r-2xl h-screen absolute top-0 ${(dir === `left`?` left-0`:`right-0`)}`}
        >{children}</motion.div>
    )
}