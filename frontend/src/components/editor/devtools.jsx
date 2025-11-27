import { motion } from "framer-motion"
import { BsFullscreen } from "react-icons/bs";
import { BsFullscreenExit } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

export function DevTools({mode, play, setPlay, fullscreen, setFullscreen}){
    return (
        <motion.div 
            initial={(mode === `dev`)?{width: `fit-content`, padding: '2px', display:`flex`}:{}}
            animate={(mode === `draw`)?{width: 0, padding: 0, display:`none`}:{}}
            className="absolute overflow-hidden top-10 right-20 w-[fit] p-1 gap-2 rounded-md flex items-center justify-between border-2 border-[#ffffff63]"
            >   
                <div
                onClick={()=>{setPlay(p=>!p)}}
                
                className=" items-center justify-center cursor-pointer flex w-5 h-5 rounded-sm">
                    {(play)?<FaPlay title='Playing (Space to change)'/>:<FaPause title='Paused (Space to change)'/>}

                </div>
                {fullscreen? (
                    <BsFullscreenExit
                    onClick={()=>{setFullscreen(p=>!p)}}
                    title='Exit Fullscreen (F)' className="cursor-pointer"  color="white" />
                    
                ):(
                    <BsFullscreen
                    onClick={()=>{setFullscreen(p=>!p)}}
                    title='Fullscreen (F)' className="cursor-pointer"  color="white" />
                    
                ) }
                
            </motion.div>

    )
}