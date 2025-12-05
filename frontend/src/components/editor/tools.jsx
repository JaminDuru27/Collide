import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaFillDrip } from "react-icons/fa";
import { FaEyeDropper } from "react-icons/fa6";
import { PiSelectionDuotone } from "react-icons/pi";
import { FaMapMarkerAlt  } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState , useEffect} from "react";
export function Tools({mode, collide, setMode, updatetools, fullscreen}){
    const [c, setC] = useState({...collide})
    const [currenttool, setcurrenttool] = useState(`Pencil`)
    const [render, setRender]= useState(false)
    const tools = {
        Pencil:{element: FaPencilAlt, title: `Pencil (B)`, name: `Pencil`},
        Eraser:{element: FaEraser, title: `Eraser (E)`, name: `Eraser`},
        Fill:{element: FaFillDrip, title: `Fill (G)`, name: `Fill`},
        Inspect:{element: FaEyeDropper, title: `Inspect (Alt or I)`, name: `Inspect`},
        Select:{element: PiSelectionDuotone, title: `Select (M)`, name: `Select`},
        Mark:{element: FaMapMarkerAlt , title: ``, name: `Mark`},
    }
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }, 100)
        return ()=>clearTimeout(time)
    }, [])
    return (
        <motion.div 
        initial={{right:`-100px`}} 
        animate={!fullscreen?{right:`1px`}:{right:`-100px`}}
        transition={{duration:1.5, type:`tween`}}

        className="controlpanel rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-40 right-0"
        >
            {/* <PiSelectionDuotone title="Select (M)" className="p-[.3rem] border-b-2 border-[#ffffff7f] cursor-pointer"  size={15} color="white"/> */}
            {c?.tools?.array?.map((obj, x)=>{
            return tools[obj.name].element({
                onClick:()=>{
                    setcurrenttool(obj.name)
                    collide[`current`].tools.setTool(obj.name)
                    setC({...collide[`current`]})
                },
                key:x, className:`${c.tools.tool.name === obj.name?`pb-[.3rem] border-b-2 border-[#ffffff7f] border-b-2 border-[#ffffff7f] rounded-[.2rem]`:``} cursor-pointer`, 
                title: tools[obj.name].title,
                size: c.tools.tool.name === obj.name?18:15, 
                color:`white`
            })
            })}

        </motion.div>
    )
}