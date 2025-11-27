import { motion } from "framer-motion"
import { IoMdSettings } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { FaDrawPolygon } from "react-icons/fa6";
import { TbDeviceGamepad3Filled } from "react-icons/tb";


export function SettingsController({mode, setMode, fullscreen}){
    return (
        <motion.div 
        initial={{right:`-100px`}} 
        animate={!fullscreen?{right:`1px`}:{right:`-100px`}}
        transition={{duration:1.5, type:`tween`}}

        className="controlpanel rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-10 right-0">
            <IoMdSettings title="settings" className="cursor-pointer"  color="white"/>
            <div className="cursor-pointer"  onClick={()=>{
                setMode(p=>(p === `draw`)?`dev`:`draw`)
            }}>
            {(mode === `dev`)?<TbDeviceGamepad3Filled title='Dev Mode (Alt D)' color="white"/>: <MdModeEdit title='Draw Mode (Alt P)' color="white"/>}
            </div>
        </motion.div>
    )
}
