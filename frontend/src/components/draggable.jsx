import { useEffect, useRef, useState } from "react"
import { PiDotsNineLight } from "react-icons/pi";
import ReactDOM from 'react-dom'
import { motion } from "framer-motion";
export function Draggable({dragelement}){
    const contentref = useRef(null)
    const element = useRef(null)
    const dragpoint = useRef(null)
    const drag = useRef(false)
    const p = useRef({x: 0,y: 0})
    const d = useRef({x: 0,y: 0})
    useEffect(()=>{
        const time = setTimeout(()=>{
            dragpoint[`current`].addEventListener(`mousedown`, (e)=>{
                if(!dragelement[`current`])return
                const b = dragpoint[`current`].getBoundingClientRect()
                drag[`current`] = true
                d[`current`] = {
                    x: e.clientX - b.x, 
                    y: e.clientY - b.y
                }
            })
            window.addEventListener(`mousemove`, (e)=>{
                if(!dragelement[`current`])return
                if(!drag[`current`])return
                element[`current`].style.top = e.clientY - d[`current`].y  + `px`
                element[`current`].style.left = e.clientX - d[`current`].x + `px`
            })
            window.addEventListener(`mouseup`, ()=>{
                if(!dragelement[`current`])return
                drag[`current`] = false
                p[`current`] = {x: 0 , y:0}  
                d[`current`] = {x: 0 , y:0}  
            })
        }, 100)
        return ()=>clearTimeout(time)
    }, [])

    if(contentref[`current`] && dragelement[`current`]){
        contentref[`current`].append(dragelement[`current`])
    }
    return (
        <>
        <motion.div 
        inital={{opacity: 0, display: `none`}}
        animate={(dragelement[`current`])?{opacity: 1, display: `flex`}:{opacity: 0, display: `none`}}
        ref={element} 
        className="absolute z-10 top-0  left-0 gap-2 flex flex-col items-start justify-between">
            <div 
            ref={dragpoint} 
            className=" dragpoint flex justify-center items-center w-full h-6 rounded-t-[100%]  shrink-0 bg-[#4b1a9f]">
                <PiDotsNineLight size={22} color="#dec6ff"/>
            </div>
            <div ref={contentref}   className="  w-fit top-0  h-fit p-2  bg-[#070014]/30 backdrop-blur-[4px] border-2 border-[#4b1a9f] left-0 w-20 p-1 h-20 rounded-sm">
            </div>
        </motion.div>
        </>

    )
}
