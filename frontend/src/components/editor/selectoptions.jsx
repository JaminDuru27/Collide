import { MdDeleteSweep } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { IoMdCut } from "react-icons/io";
import { FaPaste } from "react-icons/fa6";
import { ImEnlarge } from "react-icons/im";
import { FaCodeMerge } from "react-icons/fa6";
import { motion } from "framer-motion";
import { HiDuplicate } from "react-icons/hi";
import { GiStoneBlock } from "react-icons/gi";

import { useState, useEffect } from "react";
import { CgAdd } from "react-icons/cg";
export function SelectOperations({collide,selectoptions, mode, setMode, fullscreen}){
    const [c, setC] = useState({...collide})
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }
        , 100)
        return ()=>clearTimeout(time)
    }, [])
    const Scene = ()=>c.scenes?.currentLocker?.currentScene
    const operationIndex = {
        'add tile':{element: CgAdd, title: `Add Tile (Shift + T)`, name: `add tile`},
        'copy':{element: FaCopy, title: `Copy Selection (C)`, name: `copy`},
        'cut':{element: IoMdCut, title: `Cut Selection (X)`, name: `cut`},
        'paste':{element: FaPaste, title: `Paste Selection (V)`, name: `paste`},
        'consolidate':{element: FaCodeMerge, title: `Consolidate Selection (Alt S)`, name: `consolidate`},
        'spread to':{element: ImEnlarge, title: `Spread Selection (Alt W)`, name: `spread`},
        'craft':{element: GiStoneBlock, title: `Craft World Collision`, name: `craft`},
        'duplicate':{element: HiDuplicate, title: `Duplicate Selection. Alt + (> for lft, < right / up 'down )`, name: `duplicate`},
        'delete':{element: MdDeleteSweep, title: `Delete Selection (Del)`, name: `delete`},

    }
    if(Object.keys(collide[`current`]).length <=0)return null
    else
    return (
        <motion.div 
        initial={{right:`-100px`}} 
        animate={(selectoptions)?{right:`1px`}:{right:`-100px`, display:`none`}}
        transition={{duration:.7, type:`tween`}}

        className="controlpanel rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-96  right-0">
            {
                Object?.keys(collide.selectoperations?.operations??{})?.map((name, x)=>{
                    return operationIndex[name].element({
                        onClick:()=>{   
                            collide.selectoperations?.performOperation(name)
                        },
                        key:x, className:`cursor-pointer`, 
                        size: 15, 
                        color:`white`,
                        title: operationIndex[name].title,  
                    })
            } 
            )}
        </motion.div>
    )
}