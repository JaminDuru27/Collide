import { useEffect, useRef } from "react"
import { Collide } from "../components(JS)/editor"

export function Canvas({onDoubleClick,collideref}){
    const canvas = useRef(null)
    useEffect(()=>{
        const timeout =setTimeout(()=>{
            const collide = Collide(canvas.current)
            // editor.parseData()
            collide.start()
            collideref.current = collide

        }, 100) 
        return ()=>{clearTimeout(timeout)}
    },[])
    return (
        <canvas onDoubleClick={onDoubleClick} ref={canvas} className="w-full h-screen absolute top-0 left-0 "></canvas>
    )
}