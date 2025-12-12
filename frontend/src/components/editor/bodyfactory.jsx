
import { IoTriangle } from "react-icons/io5";
import { RiRectangleFill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoReload } from "react-icons/io5";
import { BiSort, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
export function BodyFactory({collide, setbodyfactory, bodyfactory}){
    const [c, setC] = useState(collide[`current`])
    const canvasref = useRef(null) 
    useEffect(()=>{
        const time =setTimeout(()=>{
            collide[`current`].collisionbodyfactory.setupcanvas(canvasref.current)
            setC({...collide[`current`]})
        }, 100)
        return ()=>clearTimeout(time)
    }, [])
    const tools  = [
        {element: IoReload, title: `Reload if not showing properly`, cb:()=>{collide[`current`].collisionbodyfactory.resizeOp()}},
        {element: MdDeleteForever   , title: `clear`, cb:()=>{collide[`current`].collisionbodyfactory.clear()}},
        {element: BiZoomIn, title: `zoomin`, cb:()=>{collide[`current`].collisionbodyfactory.zoomin()}},
        {element: BiZoomOut, title: `zoomout`, cb:()=>{collide[`current`].collisionbodyfactory.zoomout()}},
        {element: BiSort, title: `simpllify`, cb:()=>{console.log(collide[`current`]);collide[`current`].collisionbodyfactory.simplifyvertices()}},
    ]
    return (
        <div 
        style={{display:bodyfactory?`block`:`none`}}
        className="absolute z-10 w-full h-screen bg-[#000026] top-0 left-0 ">
            <motion.div
            onClick={()=>{setbodyfactory(null)}}
            whileHover={{scale:1.2}}
            className="flex items-center justify-center exit w-6 h-6 bg-white/10 absolute top-2 right-2 cursor-pointer rounded-[50%]"
            >
            <MdClear/>
            </motion.div>
            <div className="gui w-1/5 h-full backdrop-blur-[.4rem] absolute top-0 left-0 p-2 flex flex-col justify-start items-start">
            <div className="title my-4 mt-2 opacity-[.5] capitalize">shapes</div>
            <div 
            className="text-[.8rem] triangle flex items-center capitalize justify-start gap-2 my-2 cursor-pointer"
            >
            <IoTriangle color="skyblue"/>
            Triangle</div>
            <div 
            className="text-[.8rem] triangle flex items-center capitalize justify-start gap-2 my-2 cursor-pointer"
            >
            <FaCircle color="skyblue"/>
            Circle</div>
            <div 
            className="text-[.8rem] triangle flex items-center capitalize justify-start gap-2 my-2 cursor-pointer"
            >
            <RiRectangleFill color="skyblue"/>
            Rectangle</div>
        </div>

        <div className="tools gap-2 justify-start flex flex-col items-center absolute top-1/4 right-10">
            {tools.map((t,i)=>(
                t.element({
                key: i,
                size: 26,
                onClick: (e)=>{t.cb(e)},
                className:"cursor-pointer rounded-[50%] bg-white/10 flex items-center justify-center",
                title: t.title, })
            ))}
            
        </div>
        <motion.div 
        whileHover={{scale:1.2}}
        whileTap={{scale:.9}}
        onClick={()=>{collide[`current`].collisionbodyfactory.addtoworld()}}
        className="w-8 h-8 cursor-pointer rounded-sm absolute right-5 bottom-10  bg-white/10 flex items-center justify-center"
        title='Click To Add to Static Body to World'
        >
           <FaCheck color="#fff" />      
        </motion.div>
        <canvas ref={canvasref} className="w-full h-full"></canvas>
        </div>
    )
}