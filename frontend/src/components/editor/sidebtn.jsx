import { motion } from "framer-motion"

export function Sidebtn({onpointerenter, delay=0, children}){
    return (
        <motion.div
            initial={{translateX:`-10px`}}
            animate={{translateX:`0px`}}
            transition={{delay:delay, duation: .5, type: `spring`}}
            onPointerEnter={()=>{
                onpointerenter()
            }} 
            style={{boxShadow:`0px 0px 10px 0px #01021c`, zIndex:1, position:`relative`, borderTop: `2px solid #7777de`}}
            className="ss rounded-2xl  flex justify-center cursor-pointer items-center w-8 h-8 bg-[#03012ead] border-2 border-[#ffffff48] "
            >{children}
        </motion.div>
    )
}
