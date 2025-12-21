import { motion } from "framer-motion"

export function ElementOption({options}){
    return (
        <motion.div 
        animate={(options)?{opacity: 1, display: `flex`}:{opacity: 0, display: `none`}}
        style={{top: `${options?.pos?.y}px`, left: `${options?.pos?.x}px`}}
        className="options absolute p-2 w-[10rem] flex-col justify-start items-start max-h-[15rem] overflow-y-auto scrolly gap-2 bg-pink-500/20 rounded-sm backdrop-blur-2xl ">
        {
            options?.funcs?.map(e=>(
                <motion.div 
                whileHover={{background: `#ffffff22`}}
                onClick={()=>{e.cb()}}
                className="p-2 cursor-pointer w-full rounded-sm flex items-center justify-start gap-2">
                    {e.element && e.element({color: `white`, size: 14})}
                    <div className="text-[.5rem] capitalize">{e.name}</div>
                </motion.div>
            ))
        }
        </motion.div>
    )
}