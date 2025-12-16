import { IoSettings } from "react-icons/io5";
import { GiMaterialsScience } from "react-icons/gi";
import { BiBattery } from "react-icons/bi";
import { SiRender } from "react-icons/si";
import { FaDownLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { BsFiletypeJs, BsFiletypeJson } from "react-icons/bs";
import { useState } from "react";
import { DownloadWorldData } from "../../utils/downloadworlddata";
import { SelectJSONFile } from "../../utils/selectjsonfile";
export function Settings({showsettings,collide, setshowsettings}){
    const [showjsjsonbtn, setshowjsjson] = useState(false)
    return (
        <motion.div 
        initial = {{opacity: 0, display: `none`}}
        animate  = {(showsettings)?{opacity: 1, display: `block`}:{opacity: 0, display: `none`}}
        style={{background: `#14000024`,
        boxShadow: `-2px 0px 20px -7px #000`,
        backdropFilter: `blur(4px)`,
        border: `2px inset #ffffff40,`}}
        className="absolute w-[15rem] top-19 right-20 bg-[#070014] rounded-sm p-2">
            <div className="logo flex gap-2 text-[1.1rem] items-center justify-start">
                <IoSettings color="#fff" />
                <div className="">Settings</div>
            </div>
            <div className="flex gap-2 items-center my-2 justify-start text-[.55rem] capitalize opacity-[.5]">
                <div className="">Using PlanckJS</div>
                <GiMaterialsScience color="#fff" /> Library
            </div>
            <div className="content text-[.7rem] flex flex-col justify-start items-start gap-2 capitalize w-full mt-4 mb-3 rounded-lg overflow-y-auto scrolly bg-white/20 p-2">
            
            <div 
            className=""
            onClick={()=>{collide.current.state.download()}}
            >download state</div>
            <div 
            className=""
            onClick={()=>{
                SelectJSONFile((data)=>{
                    collide.current.state.clear()
                    collide.current.state.revert(data)
                    collide.current.state.save()
                })
            }}
            >load state</div>
            </div>
            <motion.div 
            initial={{opacity: 0, bottom:`0`, display: `none`}}
            animate={showjsjsonbtn?{opacity: 1, bottom:`2.5rem`, display: `flex`}:{display: `none`,opacity: 0, bottom:`0`}}
            className="w-dir p-2 absolute right-2  bottom-10 flex bg-[#14000073] backdrop-blur-[6px] rounded-sm gap-2">
                <BsFiletypeJs onClick={()=>{DownloadWorldData(collide[`current`]).compile().downloadJS()}} color="#fff" size={20} />
                <BsFiletypeJson onClick={()=>{DownloadWorldData(collide[`current`]).compile().downloadJSON()}} color="#fff" size={20} />
            </motion.div>
            <div className="flex justify-around  items-center my-2">
                <BiBattery title={`current battery life is`} className="cursor-pointer"/>
                <SiRender title={`quick render`} className="cursor-pointer"/>
                <FaDownLong onClick={()=>{setshowjsjson(p=>!p)}} title={`download world data`} className="cursor-pointer"/>
            </div>
        </motion.div>
    )
}