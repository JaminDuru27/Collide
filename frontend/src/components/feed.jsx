import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io";
export function Feed({collide, infoobj, setinfoobj, valueRef, fullscreen}){
    const [info, setinfo] =useState({...infoobj, value: ``})
    const [value, setValue] =useState(``)
    const inputRef = useRef(null)
    const cb = useRef(infoobj)
    useEffect(()=>{
        valueRef[`current`] = value
    }, [value])
    useEffect(()=>{
        cb[`current`] = infoobj?.cb
        if(inputRef[`current`])inputRef[`current`].focus()
    }, [infoobj])
    useEffect(()=>{
        let mounted = true
        const time = setTimeout(()=>{
            if (!mounted) return
            valueRef[`current`] = ``
            if(infoobj.type === `message`){
                infoobj.value = ''
            }
            function call (){
                if(valueRef !== `` && cb[`current`])
                cb[`current`]({value: valueRef[`current`]})
                setValue(``)
                setinfoobj(null)
            }
            window.addEventListener(`keydown`, (e)=>{
                if(e.key === `Enter`){
                    if(infoobj){
                        call()
                    }
                }
            })
            collide[`current`].canvas.addEventListener(`mousedown`, ()=>{
                call()
            })
        },100)
        return ()=>{
            mounted = false
            clearTimeout(time)
        }
    }, [])
    return(
        <motion.div
        initial={{width: `0`, height: `5vw`}} 
        animate={infoobj?{width: `40vw`, zIndex:100, height: `fit-content`,top:`50px`, borderRadius:`.4rem`}:(fullscreen)?{top: `-100px`}:{top:0, zIndex:1, width: `0`, height: `0`, borderRadius:`50%`}} 
        className="w-10 min-w-10 min-h-10 h-10 bg-[#070014] text-[.8rem] capitalize text-[#884bf8] p-2 rounded-[50%] absolute top-0  left-1/2 translate-x-[-50%]"
        >
            <div className="message">{infoobj?.message??``}</div>
            {infoobj && infoobj?.type !== `message` && (
                <input ref={inputRef} type={infoobj.type??`text`} value={value}  onInput={(e)=>{
                    setValue(infoobj.type === `number`?+(e.target.value):e.target.value)
                }} className="text-[#fff] w-full my-2 h-full bg-white/10 rounded-2xl p-1 text-[#070014]"/>
            )}
        </motion.div>
    )
}