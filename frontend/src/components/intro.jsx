import { motion } from "framer-motion"
import { IoIosCheckmarkCircle } from "react-icons/io";
export function Intro({toggle, setToggle, progreslist = []}){

    return (
        <>
        <motion.div
        style={{zIndex:`200`,backgroundImage: `linear-gradient(#00000059, #0000002b), url(/editor/homebg.jpg)`, backgroundSize:`cover`}} 
        initial={{opacity: 0, display:`none`}}
        animate={(toggle)?{opacity: 1,display:`flex 
            `}:{}}
        className="w-full flex flex-col relative  h-screen z-10 justify-center items-center gap-5 bg-[blue]">
        {/* <motion.div 
        initial={{backdropFilter: `blur(25px)`}}
        animate={{backdropFilter: `blur(10px)`}}
        transition={{type:`spring`, duration: 10}}
        className="filter w-full h-full absolute">
            
        </motion.div> */}
        <div className="logo flex justify-between w-fit items-center gap-2">
            <img src="/editor/logo.png" alt="" 
            style={{width: `calc(20vw + 1rem)`,}}
            className="p-2 bg-white/10 backdrop-blur-2xl rounded-[50%]" />
            <div className="text-[#fff] overflow-hidden font-bold opacity-[.7]" style={{fontSize: `calc(5vw + 1rem)`}}>Collide</div>
        </div>
        
        <div className="text-[#fff] text-2xl font-bold opacity-[.7]">Build Great Pixel Games </div>
        
        <motion.div 
        initial = {{height: 0 , margin: `0`}}
        initial = {{height: `fit-content` , margin: `20px 0`}}
        className="border-2 h-1/4 w-1/2 ">
            {progreslist.map((prog, x)=>(
                <div key={`[prg]-${x}`} className="w-full p-4 text-center flex justify-start items-center gap-2">
                    {!prog.complete?(<Loader />):(<IoIosCheckmarkCircle color="green" size={20}/>)}
                    <div className="capitalize">{prog.title}</div>
                </div>

            ))}
        </motion.div>
        
        </motion.div>

        </>
    )
}
export function Loader({size = 20}){
    return (
        <motion.div 
        animate = {{rotate: [0,360]}}
        transition={{repeat:Infinity, duration: 1, ease: `linear`}}
        style={{width: `${size}px`, height: `${size}px`}}
        className={`bg-transparent border-2 border-white/30 border-b-black/20 rounded-[50%]`}></motion.div>
    )
}