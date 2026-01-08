import { motion, useDragControls, useMotionValue } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { BiDownload, BiExit, BiFullscreen } from "react-icons/bi"
import { BsBox2, BsDash } from "react-icons/bs"
import { GiCancel } from "react-icons/gi"
import { MdOutlineCancel, MdSave, MdToggleOn, MdUpload } from "react-icons/md"
import { GrSign } from "react-icons/gr"

export function PluginModWindow({collide, editorref}){
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
    const [showpresetlist, setshowpresetlist] = useState(false)
    const [showWindowOptions,setShowWindowOptions] = useState(false)
    const dragControls = useDragControls()
    if(!c)return <></>
    return (
        <>
        {c.pluginsmodshandler?.currentPlugin && (
            <motion.div 
            ref={editorref}
            drag
            dragElastic={0.03}
            dragMomentum={true}
            dragControls={dragControls}
            dragConstraints={editorref}
            animate={(!full)?{height: `fit-content`, width: `fit-content`}:{}}
            // style={{x, y}}
            className="w-[75vw] absolute top-20 left-40 h-[75vh] bg-black/10 overflow-hidden backdrop-blur-2xl flex justify-between items-end flex-col border-2 border-white/40  z-10 rounded-sm cursor-grab active:cursor-grabbing"
            >
            <div 
            onPointerDown={(e)=>{dragControls.start(e)}}
            onPointerUp={(e)=>{dragControls.stop()}}
            className="nav gap-2 w-full p-2 bg-black/20 h-fit p-2 flex justify-between items-center">
                {(c.pluginsmodshandler?.currentPlugin?.info?.thumbnailSource) && (
                    <div className="flex justify-center mr-10 items-center gap-4">
                        <img 
                        onClick={()=>{setShowWindowOptions(p=>!p)}}
                        className="w-5 h-5 outline-2 rounded outline-white/30 outline-offset-2 cursor-pointer"
                        src={c.pluginsmodshandler?.currentPlugin?.info?.thumbnailSource}/>
                        <div className="text-[.7rem]">{c.pluginsmodshandler?.currentPlugin?.info?.name}</div>
                    </div>
                )}
                <div className="wrap flex gap-2  ">
                    <div 
                        onClick={()=>{
                            const p =c.pluginsmodshandler?.currentPlugin
                            if(full)
                            if(p?.minimize)p.minimize()      
                            if(!full)
                            if(p?.maximize)p.maximize()      
                            
                            setFull(p=>!p)
                        }}
                        className="">
                        {(full) ? <BsDash className="cursor-pointer" color="white"/>
                        :<BiFullscreen className="cursor-pointer" color="white"/>
                        }
                    </div>

                    <MdOutlineCancel
                    onClick={()=>{
                        collide[`current`].pluginsmodshandler.closePlugin()
                    }}  
                    className="cursor-pointer" color="white"/>
                </div>
            
            </div>
            <motion.div 
            animate={(!full)?{height: `0px`, display:`none`}:{height:`93%`, display:`block`}}
            className="content relative w-full h-[93%]">
            {[c.pluginsmodshandler?.currentPlugin].map((e)=>{
                const UI = e.ui
                return UI
            })}
            
            {showWindowOptions && (
                <WindowOptions 
                setshowpresetlist = {setshowpresetlist}
                setShowWindowOptions={setShowWindowOptions}
                collide={collide}
                />
            )}
            {!c.pluginsmodshandler?.currentPlugin?.toggle && (
                <div className="w-full h-full bg-black/80 backdrop-blur-2xl flex justify-center items-center absolute top-0 left-0">
                    <div className="flex justify-between items-center gap-4 flex-col">
                        <div className="text-6xl absolute top-10 left-1/2 translate-x-[-50%] capitalize opacity-[.1]">Turned Off</div>
                        <div
                        onClick={()=>{
                            const p = c.pluginsmodshandler?.currentPlugin
                            if(p) p.toggle = !p.toggle
                            setreload(p=>!p)
                        }}
                        className="p-2 border border-white/30 cursor-pointer opacity-[.8] bg-white/5  w-30 h-30 flex justify-center items-center capitalize rounded-md cursor-pointer"
                        >
                            <MdToggleOn size={50} color="white"/>
                        </div>
                        <div 
                        className="text-[.7rem] capitalize text-center"
                        >click to turn on</div>
                    </div>
                
                </div>
            )}
            {showpresetlist && <PresetList collide={collide} setshowpresetlist = {setshowpresetlist} />}
            </motion.div>    
            
            </motion.div>
        )}
        
        </>
    )
}
export function PresetList({collide, setshowpresetlist}){
    const currentp = ()=>{
        return collide[`current`].pluginsmodshandler?.currentPlugin
    }
    return (
        <div className="w-full h-full p-4 bg-black z-20 absolute top-0 left-0">
            <BiExit className="cursor-pointer" onClick={()=>{setshowpresetlist(false)}}/>
            <div className="title my-2  w-full text-2xl opacity-[.5] px-2 py-2">Presets - {currentp?.info?.name || `plugin`}</div>
            <div 
            className="content scrolly overflow-y-auto w-full rounded-sm border border-white/30 h-[80%] p-2 flex flex-col justify-start items-start gap-4"
            >
                {
                    (collide[`current`].pluginsmodspreset || [])?.getPresetList(currentp()?.info?.id)?.map((d, x)=>{
                        return (
                            <div    
                            onClick={()=>{
                                currentp().revert(d)
                                setshowpresetlist(false)
                            }}
                            key={`preset${x}`} className="w-full cursor-pointer p-2 bg-white/10 rounded-sm">
                                <div className="name capitalize mb-1">{d.name}</div>
                                <div className="date text-[.6rem]">{d.creationDate}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export function WindowOptions({setshowpresetlist,setShowWindowOptions, collide}){
    const [toggle, setToggle] = useState(false)
    const currentp = ()=>{
        return collide[`current`].pluginsmodshandler?.currentPlugin
    }
    const options =[
        
        {name:`save preset`, element: <MdSave size={30} color="white"/>, cb:()=>{
            const p = currentp()
            const id = p.info.id
            const  save = p.save()
            collide[`current`].pluginsmodspreset.add(id, save)
            console.log(collide[`current`].pluginsmodspreset.list)
        }},
        {name:`download preset`, element: <BiDownload size={30} color="white"/>, cb:()=>{
            const p = currentp()
            p.download()
            console.log(`savepresef`, p)
        }},
        {name:`load preset`, element: <MdUpload size={30} color="white"/>, cb:()=>{
            setshowpresetlist(true)
        }},
        {name:`toggle`, element: <MdToggleOn size={30} color="white"/>, cb:()=>{
            const p = currentp()
            p.toggle = !p.toggle
            setShowWindowOptions(false)
        }},
    ]
    return (
        <motion.div 
        animate={{opacity: 1}}
        initial={{opacity: 0}}
        exit={{opacity: 0}}
        className="w-full gap-10 h-full bg-black/80 backdrop-blur-2xl absolute top-0 left-0 flex justify-center items-center z-20">
            {options.map((opt,x)=>(
                <div
                key={`k92jd : ${x}`}
                animate={{opacity: 1}}
                initial={{opacity: 0}}
                exit={{opacity: 0}}
                transition = {{delay: x * 100}}
                className="flex justify-between items-center gap-4 flex-col">
                    <motion.div
                    whileHover={{background: `rgba(255, 255, 255, 0.1)`}} 
                    onClick={()=>{opt.cb()}}
                    className="p-2 border border-white/30 cursor-pointer opacity-[.8] bg-white/5  w-30 h-30 flex justify-center items-center capitalize rounded-md cursor-pointer ">
                    {opt.element ? opt.element : null }
                    </motion.div>
                    <div className="text-[.7rem] capitalize">
                        {opt.name}
                    </div>
                </div>
            ))}
        </motion.div>
    )
}
