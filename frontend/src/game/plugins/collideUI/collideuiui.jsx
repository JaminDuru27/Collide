import { motion } from "framer-motion"
import { useState } from "react"
import { BankUI } from "./banks/ui"
import { useEffect } from "react"
import { BsSave } from "react-icons/bs"
import { BiRefresh } from "react-icons/bi"
import { SideBank } from "./components/sidebank"
import { RendererWindow } from "./components/rendererwindow"


export function CollideUIUI({object}){
    const [toggle, settoggle] = useState(true)
    const [refresh, setrefresh] = useState(false)
    const [showsidebank, setshowsidebank] = useState(false)
    const [showrender, setshowrender] = useState(false)
    useEffect(()=>{
        object.setrefresh = setrefresh
    },[])
    return (
        <div key={`kikoidjo`} className="w-full h-full bg-black/50 ">
            <BiRefresh size={25} className="refresh opacity-[.7] cursor-pointer absolute right-2 top-2" onClick={()=>{object.updateBanks(); setrefresh(p=>!p)}}/>
            <motion.div 
            animate={toggle?{transform: `translateX(-100%)`}:{transform:`translateX(0)`}}
            className="sidebar p-2 scrolly   z-10 backdrop-blur-2xl border-2 border-white/20 absolute top-0 left-0 w-1/4 h-full bg-black/90">

            <div 
            onClick={()=>{settoggle(p=>!p)}}
            className="toggler fixed top-8 right-[-2rem] w-6 h-6 opacity-[.5] bg-black border-2 rounded-[50%]"> </div>
            <div className="openrenderer cursor-pointer">
                <div 
                onClick={()=>{
                    setshowrender(p=>!p)
                }}
                className=" w-full h-[9rem] capitalize border-2 opacity-[.3] bg-white/20 rounded-sm justify-center items-center flex  my-3">renderer</div>
            </div>
            <div className="title p-2 capitalize opacity-[.5] border-b-2">Packs</div>
            <div className="packscontent w-full h-[50%]  overflow-y-auto scrolly p-2 mt-3">
                {(object.selectedBanks || []).map((info, x)=>
                    <div 
                    onClick={()=>{object.targetBank = info;  setshowsidebank(p=>true)}}
                    className="w-full mb-2 relative h-[10rem] cursor-pointer border-2 border-white/20 bg-black rounded-sm ">
                        <img src={info.thumbnailSource}  alt="" className="w-full h-full" />
                        <div className="name absolute bottom-0 left-0 p-2 w-full bg-black/20 text-[.7rem] backdrop-blur-2xl">{info.name}</div>
                    </div> 
                )}
                
            </div>
            </motion.div>
            <SideBank object={object.targetBank} showsidebank={showsidebank} setshowsidebank={setshowsidebank} showrender={setrefresh}/>
            <RendererWindow object={object} setshowrender={setshowrender} showrender={showrender}/>
            <div className="title">
                <div className="px-2 py-1 text-[1.5rem] opacity-[.5]">Collide UI</div>
            </div>

            <div className="content p-2 min-h-[15rem] bg-amber-300/20">
                <div className="titke my-2 flex items-center justify-between  gap-2">Saved <BsSave/></div>
                {(object.banks || []).map((bank, x)=>
                    {
                        return <BankUI info={bank} object={object} />
                    }
                )}
            </div>
        </div>
        
    )
}