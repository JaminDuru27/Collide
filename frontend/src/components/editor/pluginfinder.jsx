import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { BiExit, BiSearch } from "react-icons/bi"
export function PluginFinder({collide, pluginmodcb, setpluginmodcb}){
    const [c, setC] = useState({...collide[`current`]})
    const [currentinfo, setcurrentinfo] = useState(null)
    const pl = ()=>collide[`current`].pluginsmodshandler    
    const [infolist, setinfolist] = useState(
        [...pl()?.filterByType(pluginmodcb?.type || ``)?.plugins, ...pl()?.filterByType(`both`)?.plugins] 
    )
    
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
    else return (
        <motion.div
        initial={{translateX: `-100%`}} 
        animate ={(pluginmodcb)?{transform: `translateX(0)`}:{transform: `translateX(-100%)`}}
        className="w-1/5 bg-black/40 border z-20 absolute top-0 left-0 border-white/20 p-2 backdrop-blur-2xl h-full flex flex-col justify-start items-center">
            <motion.div
            animate = {(pluginmodcb)?{opacity: `1`, display: `flex`}:{opacity: `0`, display: `none`}}
            className="w-fit h-fit">
                <BiExit 
                onMouseDown={()=>{setpluginmodcb(null);}}
                className="absolute top-5 cursor-pointer right-0 translate-x-[149%] z-10" color={'#fff'} size={20} onClick={()=>{
                }} />
            </motion.div>
            <div className="search z-10 bg-[black]/20 backdrop-blur-[5px] p-2 px-2  absolute top-0 left-0 w-full">
                <div className="w-full h-fit flex gap-2 justify-between items-center ">
                    <input type="text" 
                    onInput = {(e)=>{
                        const searchlist  = collide[`current`].pluginsmodshandler.search(e.target.value)
                        setinfolist(searchlist.plugins)
                    }}
                    className="p-[.2rem] text-[.7rem] border-2 border-[#ffffff53] w-1/1 rounded-sm"/>
                    <BiSearch color="white" className="cursor-pointer"/>
                </div>
                <div className="types overflow-x-auto scrollx w-full my-2 flex justify-start items-center uppercase gap-2 text-[.6rem] ">
                    <div 
                    onClick={()=>{
                        setinfolist([...pl()?.filterByType(pluginmodcb.type)?.plugins, ...pl()?.filterByType(`both`)?.plugins])
                    }}
                    className="plugin p-2  cursor-pointer rounded-sm border-2 border-white/20 text-white/60">plugins</div>
                    <div 
                    onClick={()=>{
                        setinfolist([...pl()?.filterByType(pluginmodcb.type)?.mods, ...pl()?.filterByType(`both`)?.mods])
                    }}
                    className="mods  p-2 cursor-pointer rounded-sm border-2 border-white/20 text-white/60">mods</div>
                </div>
            </div>
            <div className="content w-full flex gap-4 pt-20 flex-col justify-start items-start h-full overflow-y-auto scrolly">
                {(infolist || []).map((data,c)=>{
                    const info = data.manifest.meta
                    return (
                    <>
                        <div 
                        key={`keycollideinfonplug${c}`}
                        onClick={()=>{
                            if(pluginmodcb){
                                pluginmodcb.cb(data)
                                setpluginmodcb(null)
                            }
                            
                        }}
                        onMouseEnter={()=>setcurrentinfo({...info})}
                        className="w-full shrink-0 h-[10rem] rounded-sm border-2 overflow-hidden cursor-pointer relative border-white/30 "
                        >
                        <img src={info.thumbnailSource} alt="" className="w-full h-full" />
                        <div className="descr text-amber-400 absolute bottom-0 left-0 text-[.7rem] p-2 w-full bg-black/30  capitalize backdrop-blur-[5px]">{info.name}</div>
                        </div>
                    </>
                    )
                }
                )}
                
            </div>
            <div className="descr w-full p-2 capitalize  absolute bottom-0 backdrop-blur-[5px] bg-[black]/60 text-[.6rem] "
            >
            <div className="content w-full h-1/2 my-1"
            >
                {(currentinfo)?currentinfo.descr:''}
            </div>
            <div className="genres w-full py-1 flex justify-start items-center  overflow-x-auto scrollx gap-2">
                {(currentinfo?.genres || []).map((genre, x)=>{
                    return <div className="border-2 border-white/20 rounded-sm p-1" key={`collidejetgenresii${x}`}>#{genre}</div>
                })}
            </div>
            {currentinfo?.type && (
                <div className="w-full flex gap-1 justify-start py-2 items-center overflow-hidden">
                    <div className="name text-amber-400  bg-black/30  capitalize ">
                        {(currentinfo)?currentinfo?.name:''}
                    </div>
                    <div className="dot w-1 h-1 bg-white/30 shrink-0 rounded-[50%]"></div>
                    <div className="type capitalize text-nowrap text-ellipsis"> {currentinfo?.type === `both`?`Any`: `${currentinfo?.type} Plugin`}</div>
                </div>
            )}
            </div>
        </motion.div>
    )
}