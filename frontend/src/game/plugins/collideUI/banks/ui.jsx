import { motion } from "framer-motion"

export function BankUI({info, object}){
    return (
        <div className="w-full p-2 items-center justify-start gap-5 flex  scrollx rounded-sm overflow-x-auto">
        <motion.div
        whileHover= {{boxShadow: `0px 0px 12px 0px #000`, scale: 1.02}}
        transition={{type:`spring`, }}
        style={{boxShadow: `0px 0px 12px -2px #000`}}
        className="shrink-0 pack w-[12rem] p-2 rounded-sm ">
            <img src={info.thumbnailSource} className="w-full h-[10rem] rounded-sm" alt="" />
            <div className="">
                <div className="bame text-[.9rem] mt-2 capitalize font-bold">{info.name}</div>
                <div className="bame text-[.6rem] mt-2 capitalize font-bold">{info.descr}</div>
                
                <div className="author text-amber-400 text-[.6rem] capitalize my-1">{info.name} By - {info.author}</div>
                <div 
                onClick={()=>{
                    if(info.onselect)info.onselect(info)
                }}
                className="text-[.7rem] capitalize bg-black/50 cursor-pointer w-fit py-1 px-3 my-3 rounded-sm">select</div>
            </div>
        </motion.div>
        </div>
    )
}