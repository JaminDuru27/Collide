import { motion } from "framer-motion"

export function Title({isModified, fullscreen}){
    return (
        <motion.div
        initial={{top:`-100px`}} 
        animate={(!fullscreen)?{top:`1px`}:{top:`-100px`}}
        transition={{duration:1.5, type:`tween`}} 
        className="title w-[50vw] h-[fit] absolute top-0 z-10 left-1/2 translate-x-[-50%] text-[#ffffff83] capitalize text-center text-[.7rem] py-1 rounded-b-2xl  bg-[#060014]"
        >
        Project
        <div className={`${!isModified?`bg-transparent border-2 border-[#ffffffa2]`:`bg-green-500`} rounded-[50%] w-2 h-2 absolute top-1/2 right-2 translate-y-[-50%]`}></div>
        </motion.div>
    )
}
