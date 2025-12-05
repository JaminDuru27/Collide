import { motion } from "framer-motion"
import { MdDeleteSweep } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { IoMdCut } from "react-icons/io";
import { FaPaste } from "react-icons/fa6";
import { GrSelect } from "react-icons/gr";
import { GiStoneBlock } from "react-icons/gi";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { useState , useEffect, useRef} from "react";


export function TileOptions({collide,tile, setTile}){
    const [c, setC] = useState({...collide[`current`]})
    const [pos, setpos] = useState({top: 0, left: 0})
    const element = useRef(null) 
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }
        , 100)
        return ()=>clearTimeout(time)
    }, [])

    useEffect(()=>{
        if(!tile)return
        const w = (c.grid.cw * tile.sprite.indw)
        const h = (c.grid.ch * tile.sprite.indh)
        const x= tile.indx * w + c.grid.x
        const y= tile.indy * h + c.grid.y
        const b = element[`current`].getBoundingClientRect()
        setpos({top:y-b.height - 5, left:x - b.width/2 + w/2 })
    }, [tile])
    const operationIndex = {
        'delete':{element: MdDeleteSweep, title: `Delete Selection (Del)`, name: `delete`},
        'copy':{element: FaCopy, title: `Copy Selection (C)`, name: `copy`},
        'cut':{element: IoMdCut, title: `Cut Selection (X)`, name: `cut`},
        'paste':{element: FaPaste, title: `Paste Selection (V)`, name: `paste`},
        'selectsprite':{element: GrSelect, title: `Select All Sprites `, name: `selectsprite`},
        'craft':{element: GiStoneBlock, title: `Use as templayer for collision `, name: `craft`},
        'rotate':{element: FaArrowRotateLeft, title: `Rotate Tile Sprite`, name: `rotate`},
    }
    if(!c)return null
    else
    return(
        <>
            {
            c?.tileoperations &&
            
            <motion.div 
            initial={{opacity:0}}
            animate={tile?{opacity:1}:{opacity:0, display:`none`}}
            transition={{}}
            ref={element}
            style={{top:pos.top, left:pos.left}}
            className="p-1 rounded-2xl gap-x-4  bg-[#060014] p-2 flex min-w-5 max-h20  absolute">
                {
                Object.keys(c?.tileoperations?.operations)?.map((name,x)=>(
                
                    operationIndex[name].element({
                    onClick:()=>{
                        collide[`current`].tileoperations.performOperation(name)
                    }
                    ,
                    key:x, className:`cursor-pointer`, 
                    size: 15, 
                    color:`white`,
                    title: operationIndex[name].title,  
                })
                ))}
            </motion.div>
            }

        </>
    )
}
