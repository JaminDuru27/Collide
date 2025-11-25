import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io";
export function Feed({collide, infoobj, setinfoobj, valueRef}){
    const [info, setinfo] =useState({...infoobj, value: ``})
    const [value, setValue] =useState(``)
    const cb = useRef(infoobj)
    useEffect(()=>{
        valueRef[`current`] = value
    }, [value])
    useEffect(()=>{
        cb[`current`] = infoobj?.cb
    }, [infoobj])
    useEffect(()=>{
        const time = setTimeout(()=>{
            valueRef[`current`] = ``
            if(infoobj.type === `message`){
                infoobj.value = ''
            }
            collide[`current`].canvas.addEventListener(`mousedown`, ()=>{
                if(valueRef !== `` && cb[`current`])
                cb[`current`]({value: valueRef[`current`]})
                setValue(``)
                setinfoobj(null)
            })
        },100)
        return ()=>{clearTimeout(time)}
    }, [])
    return(
        <motion.div
        initial={{width: `5vw`, height: `5vw`}} 
        animate={infoobj?{width: `40vw`, height: `fit-content`,top:`50px`, borderRadius:`.4rem`}:{top:0, width: `5vw`, height: `5vw`, borderRadius:`50%`}} 
        className="w-10 h-10 bg-[#070014] text-[.8rem] capitalize text-[#884bf8] p-2 rounded-[50%] absolute top-0  left-1/2 translate-x-[-50%]"
        >
            <div className="message">{infoobj?.message??``}</div>
            {infoobj && infoobj?.type !== `message` && (
                <input type={infoobj.type??`text`} value={value}  onInput={(e)=>{
                    setValue(infoobj.type === `number`?+(e.target.value):e.target.value)
                }} className="text-[#fff] w-full my-2 h-full bg-white/10 rounded-2xl p-1 text-[#070014]"/>
            )}
        </motion.div>
    )
}