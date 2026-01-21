import { motion } from "framer-motion";

export function State({state, object, key,setreload, children}){
    return (
        <motion.div 
        initial={{opacity: 0, translateY:`50px`}}
        animate = {{opacity: 1, translateY:`0`}}
        transition={{type: `spring`, delay:key * 0.2}}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 1.1}}
        onClick={()=>{object.currentState = (!object.currentState)? state: undefined;setreload(p=>!p);}}
        className="max-h-[14rem] max-w-[12rem] relative overflow-hidden cursor-pointer">
            <div className="w-[10rem] p-2 h-[10rem] relative rounded-2xl bg-[#b2973444] border border-amber-500 " key={`Collidefsmuistatekey${key}`}>
                <div className="transitionbefore"></div>
                <div className="content"></div>
                <div className="transitaionafter"></div>
                {state.isValid() && object.state === state && (
                <div className={`validsign w-5 h-5 rounded-[50%] ${(state?.isValid()?`bg-green-500/60`:`black`)} absolute top-2 outline-4 outline-black/70 right-2 `}></div>
                )}
            </div>
            <input 
            type="text"
            value={state.name}
            onChange={(e)=>{state.name = e.target.value;setreload(p=>!p)}}
            className="name border-white/20 border-2 rounded-2xl p-2 text-start text-[.7rem] capitalize mt-2 text-center w-full"/>

        </motion.div>
    )
}

