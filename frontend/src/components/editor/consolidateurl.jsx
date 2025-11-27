import { motion } from "framer-motion"
import { useRef } from "react"
export function ConsolidateUrl({mode, consolidateurl, setconsolidateurl,setMode}){
    const a  = useRef(null)
    function downloadUrl(){
        if(consolidateurl){
            const link = document.createElement('a')
            link.href = consolidateurl
            link.download = 'selection.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setconsolidateurl(null)
        }
    }
    return (
        <motion.div 
        initial={{right:`-200px`, display:`none`}} 
        animate={consolidateurl?{right:`1px`, display:`flex`}:{right:`-200px`, display:`none`}}
        transition={{duration:1.5, type:`tween`}}


        className="controlpanel text-[.7rem] text-[#3636e6] rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-[90vh] right-0">
            <div className="">
                Image is ready !  &nbsp; &nbsp;    
                <motion.span
                onClick={()=>{downloadUrl}} 
                whileTap={{transform: `scale(.6)`, color: `#3636e6`}}
                className="capitalize text-white text-center cursor-pointer border-b-2 border-offset-2 border-[#fff]"> click Here</motion.span>    
            </div>
        </motion.div>
    )
}
