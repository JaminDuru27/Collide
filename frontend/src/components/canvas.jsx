import { useEffect, useRef } from "react"
import { Collide } from "../components(JS)/editor"

export function Canvas({onClick =()=>{},info, onDoubleClick=()=>{}, onmousedown= ()=>{},collideref, gets, sets }){
    const canvas = useRef(null)
    useEffect(()=>{
        let mounted = true
        const timeout = setTimeout(()=>{
            if (!mounted) return
            const collide = Collide(canvas,gets,info, sets)
            // editor.parseData()
            collide.start()
            collideref.current = collide
             window.addEventListener(`keydown`, (e)=>{
                if(e.key === `ContextMenu`){
                    onmousedown({clientX: collide.mouse.x, clientY:collide.mouse.y },undefined)
                }
             })
        }, 100) 
        return ()=>{
            mounted = false
            clearTimeout(timeout)
        }
    },[])
    return (
        <canvas onDoubleClick={onDoubleClick} onClick={onClick} ref={canvas} className="w-full h-screen absolute top-0 left-0 "></canvas>
    )
}