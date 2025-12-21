import { motion, useMotionValue } from "framer-motion"
import { useRef } from "react"
import { useState } from "react"
import { BiRotateRight, BiText } from "react-icons/bi"
import { MdDelete } from "react-icons/md"

export function Elem({object,elem, setreload,mx, my, window, setOptions}){
    const [shouldDrag, setShouldDrag] = useState(true)
    const ref = useRef(null) 
    const options = {
        pos: {x: 0, y: 0},
        funcs: [
            {name: `add text`, element: BiText, cb:()=>{console.log(`~iji`)}},
            {name: `delete`, element: MdDelete, cb:()=>{console.log(`~del`)}},
        ]
    }
    return (
        <motion.div 
        ref={ref}
        drag =  {(shouldDrag)}
        dragElastic={0.2}
        dragMomentum={false}
        // dragConstraints={{
        // left: -window.innerWidth * 0.275,
        // right: window.innerWidth * 0.275,
        // top: -window.innerHeight * 0.275,
        // bottom: window.innerHeight * 0.275
        // }}
        
        onMouseDown={(e)=>{
            if(e.button === 2){
                console.log(mx, my)
                setOptions({...options, pos: {x: mx +2, y: my+ 2 }})
            }
        }}
        onMouseEnter={(e)=>{
            setShouldDrag(true)
        }}
        onDoubleClick={(e)=>{
            object.targetElement = elem
            setreload(p=>!p)
        }}
        style={{top: elem.position.y, left: elem.position.x, outline: (object.targetElement === elem)?`2px dashed purple`:``}}
        className="absolute outline-offset-2 relative w-fit h-fit">
            {
                (object.targetElement === elem) && (
                    <>
                    <div 
                    onMouseDown={()=>{
                        setShouldDrag(false)
                        elem.setTarget(`width`, ref)
                    }}
                    style={{borderStyle: `solid`}}
                    className="wbox absolute  cursor-e-resize top-1/2 rounded-[50%] opacity-[.7] right-0 translate-y-[-50%] translate-x-[150%] w-3 h-3  border-2 border-white  bg-[purple]"
                    ></div>
                    <div 
                    onMouseDown={()=>{
                        setShouldDrag(false)
                        elem.setTarget(`height`, ref)
                    }}
                    style={{borderStyle: `solid`}}
                    className="hbox absolute cursor-s-resize left-1/2 rounded-[50%] opacity-[.7] bottom-0 translate-x-[-50%] translate-y-[150%] w-3 h-3  border-2 border-white  bg-[purple]"
                    ></div>
                    <div 
                    style={{borderStyle: `solid`}}
                    className="rotbox absolute right-0 rounded-[50%] opacity-[.7] bottom-0 translate-[1.2rem]  w-5 h-5 cursor-grab border-2 border-white  bg-[purple]"
                    onMouseDown={()=>{
                        setShouldDrag(false)
                        elem.setTarget(`rotate`, ref)
                    }}
                    >
                        <BiRotateRight/>
                    </div>
                    </>
                )
            }
            
            {
                ([elem.ref] || []).map(e=>{
                    const Elem = e
                    return <Elem shouldDrag ={false} />
                })
            }
        </motion.div>
    )
}
