import { useEffect, useRef, useState } from "react"
import ReactDOM from 'react-dom'
export function Draggable({dragpointref ={}, dragelementref ={}, children}){
    const dragelement = useRef(dragelementref[`current`])
    const dragpoint = useRef(dragpointref[`current`])
    const drag = useRef(false)
    const d = useRef({x:0, y: 0})
    useEffect(()=>{
        console.log(dragpointref[`current`])
        const time = setTimeout(()=>{
            dragpoint[`current`].addEventListener(`mousedown`, (e)=>{
                const b = dragpoint[`current`].getBoundingClientRect()
                drag[`current`] = true
                d[`current`] = {
                    x: b.x - e.clientX, 
                    y: b.y - e.clientY
                }

            })
            window.addEventListener(`pointermove`, (e)=>{
                console.log(drag[`current`])
                if(!drag[`current`])return
                dragelement[`current`].style.top = e.clientY + d[`current`].y  + `px`
                dragelement[`current`].style.left = e.clientX + d[`current`].x + `px`
            })
            dragpoint[`current`].addEventListener(`pointerleave`, ()=>{
                drag[`current`] = false
                d[`current`] = {x: 0 , y:0}  
            })
            dragpoint[`current`].addEventListener(`pointerup`, ()=>{
                drag[`current`] = false
                d[`current`] = {x: 0 , y:0}  
            })
        }, 100)
        return ()=>clearTimeout(time)
    }, [])

    return (
        <>
        <div ref={(!dragelement[`current`]?dragelement:null)} className="absolute top-0 flex flex-col items-center justify-center left-0 w-20 p-1 h-20 rounded-sm bg-black">
            {(!dragpoint[`current`])?(
            <div ref={dragpoint} className="dragpoint w-5 h-5 shrink-0  relative top-0 left-0 bg-amber-200"></div>
            ):null}
            <div className="body">
                {children}
            </div>
        </div>
        </>

    )
}
