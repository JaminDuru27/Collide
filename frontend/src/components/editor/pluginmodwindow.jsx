import { motion, useMotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { BiFullscreen } from "react-icons/bi"
import { BsBox2, BsDash } from "react-icons/bs"
import { GiCancel } from "react-icons/gi"
import { MdOutlineCancel } from "react-icons/md"
import * as UIS from '../../game/plugins/exportuis.js'
import { GrSign } from "react-icons/gr"

export function PluginModWindow({collide}){
    const [c, setC] = useState({...collide[`current`]})
    const [full, setFull] = useState(true)
    const [reload, setreload] = useState(false)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const ref = useRef(null)
    // guard async updates so we don't call setState after unmount
    useEffect(()=>{
        let mounted = true
        const time = setTimeout(()=>{
            if (mounted) setC({...collide[`current`]})
        }, 100)
        return ()=>{
            mounted = false
            clearTimeout(time)
        }
    }, [])
    if(!c)return <></>
    return (
        <>
        {c.pluginsmodshandler?.currentPlugin && (
            <motion.div 
            ref={ref}
            // drag
            // dragElastic={0.2}
            // dragMomentum={true}
            // dragConstraints={{
            //   left: -window.innerWidth * 0.275,
            //   right: window.innerWidth * 0.275,
            //   top: -window.innerHeight * 0.275,
            //   bottom: window.innerHeight * 0.275
            // }}
            animate={(!full)?{height: `fit-content`, width: `fit-content`}:{}}
            // style={{x, y}}
            className="w-[75vw] absolute top-20 left-40 h-[75vh] bg-black/10 overflow-hidden backdrop-blur-2xl flex justify-between items-end flex-col border-2 border-white/40  z-10 rounded-sm cursor-grab active:cursor-grabbing"
            >
            <div className="nav gap-2 w-full p-2 bg-black/20 h-fit p-2 flex justify-end items-end">
                <div 
                    onClick={()=>{
                        const p =c.pluginsmodshandler?.currentPlugin
                        if(p?.minimize)p.minimize()      
                        setFull(p=>!p)
                    }}
                    className="">
                    {(full) ? <BsDash className="cursor-pointer" color="white"/>
                    :<BiFullscreen className="cursor-pointer" color="white"/>
                    }
                </div>

                <MdOutlineCancel
                onClick={()=>{
                    collide[`current`].pluginsmodshandler.currentPlugin = undefined
                    setC(p=>({...collide[`current`]}))
                }}  
                className="cursor-pointer" color="white"/>
            
            </div>
            <motion.div 
            animate={(!full)?{height: `0px`, display:`none`}:{height:`93%`, display:`block`}}
            className="content relative w-full h-[93%]">
            {[c.pluginsmodshandler?.currentPlugin].map((e)=>{
                const UI = e.ui
                return <UI object= {{...e}} window={{x, y, ref}}/>
            })}
            </motion.div>    
            </motion.div>
        )}
        </>
    )
}