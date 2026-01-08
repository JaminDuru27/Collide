import { motion } from "framer-motion"
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react"
import { BiSolidLeftArrow } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export function SideTilePluginMods({collide, setcontextobject}){
    const [toggle, setToggle] = useState(false)
    const canvasref = useRef(null)
    useEffect(()=>{
        const t = setTimeout(()=>{
            const tf = collide[`current`].tileReference
            tf.setup(canvasref)
            canvasref[`current`].addEventListener(`mousedown`, (e, info)=>{
                const b = e.target.getBoundingClientRect()   
                const tile =collide[`current`]?.tileReference?.tile
                if(!tile)return
                const x = e.clientX
                const y = e.clientY
                if(e.button === 2){
                    setcontextobject({
                        pos:{x: b.x + b.width + 50, y: b.y},
                        [tile.name || `tile`]: tf.options.filter((option)=>(
                            {   
                                element: undefined,
                                name: option.name,
                                cb:()=>{
                                    option.cb()
                                    setC({...collide[`current`]})
                                }
                            }
                        ))
                    })
                }
            })
        }, 100)
        return ()=>{
            const tf = collide[`current`].tileReference
            if(tf.disposableCanvas)
            tf.disposableCanvas.dispose()
            clearTimeout(t)
        }
    }, [])
    return (
        <motion.div
        initial={{translateX: `-100%`}}
        animate = {(toggle)?{translateX: `0`}:{translateX: `-100%`}} 
        className="absolute top-0 left-0 border-2  border-white/10 bg-black/10 z-10 backdrop-blur-2xl w-1/4 sm:w-1/5 md:w-1/7 lg:w-1/7  h-screen block flex-col justify-start items-start p-2">
            <div 
            onClick={()=>{setToggle(p=>!p)}}
            className="btn absolute top-1/2 cursor-pointer flex justify-center items-center right-0 translate-y-[-50%] rounded-r-lg translate-x-[100%] bg-black/50  w-5 h-20 border border-white/30 ">
            <BiSolidLeftArrow  className="text-[#fff]/30" size={12} />
            </div>
            
            <motion.div 
            animate={(!toggle)?{
                position: `relative`,
                top: `50%`, right: `0`, display: (!toggle && collide[`current`]?.tileReference?.tile)?`flex`:`none`,
                transform: `translate(125%, -50%)`
            }:{transform: `translate(0, 0)`, top: `0`, right: `0`}}
            className="relative ">
                <canvas 
                ref={canvasref}
                className="canvas backdrop-blur-2xl rounded w-full h-[10rem] border border-white/20 mb-5"></canvas>
            </motion.div>
            {(collide[`current`]?.tileReference?.tile)?
            (
                <>
                <Section name={`plugins`} onclick={(plugin)=>{
                    collide[`current`].pluginsmodshandler.openPlugin(plugin)
                }} array={collide[`current`]?.tileReference?.tile?.plugins}/>
                <Section name={`mods`} onclick={()=>{}} array={collide[`current`]?.tileReference?.tile?.mods}/>
                </>
            ):<div className='text-center  w-full opacity-[.5]'>Select a Tile</div>}
            
        </motion.div>
    )
}
function Section({name, array, onclick}){
    return (
        <>
        <h1 className="plugins text-[.7rem] mb-2 capitalize">{name}</h1>
        <div className="content overflow-y-auto p-2 scrolly gap-4 flex flex-col justify-start align-start w-full h-[30%] ">
            {array.map((plugin,x)=>{
                const info = plugin?.info
                return (
                    <div 
                    title = {info.name}
                    onClick={()=>{onclick(plugin, array,name)}}
                    key={`plmods-${x}`}
                    style={{backgroundImage: `url(${info.thumbnailSource})`, textOverflow: `ellipsis`}}
                    className="black shrink-0 text-ellipsis cursor-pointer  relative overflow-hidden w-full gap-2 border bg-repeat[no-repeat] flex justify-start items-center border-white/20 rounded px-2 py-2">
                        <img src={info.thumbnailSource} className="rounded w-5 h-5" alt="" />
                        <div className="text-[.7rem] w-full text-ellipsis">{info.name}</div>
                    </div>
                )
            })}
        </div>
        </>
    )
}