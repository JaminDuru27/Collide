import { motion } from "framer-motion"

export function SideBank({showsidebank, setshowsidebank,showrender, object}){
    if(!object)return <></>
    else return (
        <motion.div 
        animate= {(showsidebank)?{opacity:1, display:`flex`}:{opacity:1, display:`none`}}
        className="w-1/4 flex-col justify-start p-2 items-start gap-4 h-full z-10 border-2 border-white/20 backdrop-blur-2xl bg-black/30 absolute top-0 right-0">
        <div 
            onClick={()=>{setshowsidebank(p=>!p)}}
            className="toggler fixed top-8 left-[-2rem] w-6 h-6 opacity-[.5] bg-black border-2 rounded-[50%]"> 
        </div>
        
        <div className="flex justify-between items-center  capitalize w-full h-fit gao-2">
            <img src={object?.thumbnailSource} alt="" className="w-6 h-6" />
            <div className="text-[.7rem] opacity-[.7]">{object?.name}</div>
            
        </div>
        {(object?.refs || []).map(e=>{
            const Elem = e.element
            return (
                <div 
                style={{
                    boxShadow: `0px 0px 7px 2px #0000001f inset`,
                    border: `2px groove #00000033`,
                }}  
                className="p-2 rounded-[.5rem] w-full flex flex-col gap-2 justify-center items-center bg-black/10 rounded-sm">
                    <Elem />
                    <div className="content"></div>
                    <div className="text-[.7rem] capitalize ">{e.info.name}</div>
                </div>
            )
        })}
        </motion.div>
    )
}