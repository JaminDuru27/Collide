import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ContextMenu({contextobject, setcontextobject, }){
    useEffect(()=>{
        let mounted = true
        const yt = setTimeout(()=>{
            if (!mounted) return
            window.addEventListener(`dblclick`,()=>{
                setcontextobject(null)
            })
        }, 100)
        return ()=>{ 
            mounted = false
            clearTimeout(yt)
        }
    },[])

    if(!contextobject)return (<></>)
    else return (

        <div
        style={{top: contextobject.pos.y,zIndex:100, left: contextobject.pos.x}}
        className="absolute p-2 gap-y-5 rounded-sm w-[10rem] max-h-[25rem] bg-blue-950 border-2 border-[#ffffff39] flex flex-col items-start justify-start ">
            {
            Object.keys(contextobject).map((groupname, i)=>{
                if(groupname === `pos`)return null
                else return (
                    <div className="w-full" key={i}>
                        <div className="capitalize w-full" style={{overflow:`hidden`,textOverflow:`ellipsis` }}>{groupname}</div>
                        <div className="content w-full">
                            {contextobject[groupname].map((obj, u)=>(
                                <motion.div 
                                style={{overflow:`hidden`,textOverflow:`ellipsis` }}
                                initial={{translateX: `-20px`}}
                                animate={{translateX: `0`}}
                                transition={{delay: .2 * u, type:'spring'}}
                                onClick={()=>{if(obj.cb)obj.cb()}}
                                whileHover={{backgroundColor:`#ffffff21`}}
                                className="flex w-full p-1  rounded-sm justify-start items-center text-[.7rem] capitalize cursor-pointer my-2" key={`${i}${u}`}>
                                    {obj.element && (
                                        obj.element({color:`white`,className:`mr-2`, size: 15})
                                    )}
                                    <div className="">{obj.name}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}
