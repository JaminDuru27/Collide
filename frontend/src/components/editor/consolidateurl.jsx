import { motion } from "framer-motion"
import { useRef } from "react"
export function ConsolidateUrl({mode, url, seturl,setMode}){
    const a  = useRef(null)
    function downloadUrl(){
        if(url){
            const link = document.createElement('a')
            link.href = url.url
            link.download = (url.name.trim(' ')??'consolidate') + '.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            seturl(null)
        }
    }
    return (
        <motion.div 
        initial={{right:`-200px`, display:`none`}} 
        animate={url?{right:`1px`, display:`flex`}:{right:`-200px`, display:`none`}}
        transition={{duration:1.5, type:`tween`}}

        style={{zIndex:20}}
        className="controlpanel text-[.7rem] text-[#3636e6] rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-[92vh] right-0">
            <div className="">
                Image is ready !  &nbsp; &nbsp;    
                <motion.span
                onClick={()=>{downloadUrl()}} 
                whileTap={{transform: `scale(.6)`, color: `#3636e6`}}
                className="capitalize text-white text-center cursor-pointer border-b-2 border-offset-2 border-[#fff]"> click Here</motion.span>    
            </div>
        </motion.div>
    )
}
