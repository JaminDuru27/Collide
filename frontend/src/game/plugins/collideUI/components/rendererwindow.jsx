import { motion } from "framer-motion"
import { useRef } from "react"
import { useState } from "react"
import { Elem } from "./elementui"
import { ElementOption } from "./options"

export function RendererWindow({object, window, setshowrender, showrender}){
    const [currentHeader, setCurrentHeader] = useState(`style`)
    const [reload, setreload] = useState(false)
    const [mx, setMx] = useState(false)
    const [my, setMy] = useState(false)
    const [options, setOptions] = useState(false)
    const ref = useRef(null)
    if(!showrender)return <></>
    else return (
        <>
        <div
        ref = {ref}
        onDrop={(e,info)=>{
            e.preventDefault()
            const data = {
                ... JSON.parse(e.dataTransfer.getData(`text`)),
                x: 40, y: 20
            }
            const b = ref[`current`].getBoundingClientRect() 
            data.x =e.clientX - b.x
            data.y =e.clientY - b.y
            object.addElement(data)
            setreload(p=>!p)
        }}
        onMouseMove={(e)=>{
            const b = ref[`current`].getBoundingClientRect() 

            setMx(e.clientX - b.x)
            setMy(e.clientY - b.y)
            if(!object.targetElement)return
            object.targetElement.mx  = e.clientX 
            object.targetElement.my  = e.clientY 
            if(object.targetElement.onupdate)object.targetElement.onupdate()
        }}
        onMouseUp={()=>{
            if(!object.targetElement)return
            object.targetElement?.clearTarget()
        }}
        onDoubleClick={()=>{
            setOptions(false)
        }}
        onDragOver={(e)=>{e.preventDefault()}}

        className="w-full h-full bg-black/100 absolute top-0 left-0">
        
        {
            (object?.elements || []).map(elem=>(
                <>
                <Elem object={object} elem={elem} mx={mx} my={my} setreload={setreload} options={options} setOptions={setOptions} />
                </>
            ))
        }
        </div>
        <Pane object={object}/>
        <ElementOption options={options} />
        </>
    )
}

function Pane(object){
    const [d, setd] = useState(`y`)
    return (
        <motion.div 
        drag =  {d}
        dragElastic={0.2}
        dragMomentum={true}

        className="pane  border-t-2 border-white/20 p-2 w-full absolute  bottom-0 left-0 h-1/2 backdrop-blur-2xl ">
            <div 
            className="w-10 h-4 absolute top-0 left-10 translate-y-[-100%] bg-black rounded-tl-sm rounded-tr-sm border-1 border-white/30"></div>
            <div className="headers flex  justify-evenly items-center gap-2">
                {
                    // currentHeader === `style` && 
                    <div 
                    onClick={()=>{

                    }}
                    className="style  cursor-pointer border-b-2 border-white/20 w-fit p-1 capitalize text-[.8rem]">Style</div>
                }
                    <div 
                    onClick={()=>{
                    }}
                    className="grid cursor-pointer border-b-2 border-white/20 w-fit p-1 capitalize text-[.9rem]">Grid</div>
            </div>
        </motion.div>
    )
}