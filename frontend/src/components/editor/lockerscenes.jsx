import { useState, useEffect } from "react"
import { Scene } from "../../components(JS)/canvas/scene"
import { motion } from "framer-motion"
import { MdDelete } from "react-icons/md"

export function LockerScenes({collide, renderlockerscenes}){
    const [c, setC] = useState(collide[`current`])
    const [show, setShow] = useState(false)
    if(!collide[`current`])return<></>
    useEffect(()=>{
        let mounted = true
        const t = setTimeout(()=>{
            if (!mounted) return
            setC({...collide[`current`]})
            console.log(c, collide[`current`])
        }, 100)
        return ()=>{
            mounted = false
            clearTimeout(t)
        }
    },[])
    if(!c)return <></>
    else return (
        <>
        <div onClick={()=>{setShow(p=>!p)}} className="w-5 h-5 cursor-pointer m-2 rounded-2xl bg-[#070014] border-2 border-[#fff]/30 absolute bottom-0 left-0"></div>
        <motion.div 
        initial={{bottom: `-100%`}}
        animate={(show)?{bottom: `0`}:{bottom:`-100%`}}
        className="flex absolute left-1/2 overflow-x-auto scrollx translate-x-[-50%] bottom-0 gap-2 w-fit bg-[#070014] p-2 rounded-sm">
            {collide[`current`]?.scenes?.currentLocker?.scenes?.map((scene, key)=>(
                <div 
                onClick={()=>{
                    const locker = collide[`current`].scenes.currentLocker
                    locker.targetScene(scene.id)
                }}
                key={`ss`+key} style={{borderColor:`${scene.color ?? `#070014`}`}} className={` shrink-0  border-2  relative rounded-sm`}>
                    <div 
                    onClick={()=>{scene.delete = true; setTimeout(()=>{setC({...collide[`current`]})}, 100)}} 
                    className="absolute top-1 right-1 cursor-pointer border-2 border-[#fff]/30 p-1 justify-center items-center flex p-1 rounded-2xl"
                    >
                        <MdDelete color="#fff" size={10} opacity={0.6}/>
                    </div>
                    <img src="" className="w-[8rem]  h-[6rem] rounded-sm" alt="" />
                    <div className="text-[.7rem] absolute top-2 left-3 opacity">{Scene.name}</div>
                </div>
            ))}
        </motion.div>
        </>
    )
}