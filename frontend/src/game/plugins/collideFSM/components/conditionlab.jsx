import { useState } from "react"
import { motion } from "framer-motion";
import { BiPause, BiPlay, BiPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { VarHandler } from "./varHandler";

export function ConditionLab({object, voptype, Tile, targetArray}){
    const temp = ()=>({group: [], operator: undefined})
    const [varGroups, setVarGroups] = useState([])
    const [refresh, setrefresh] = useState(false)

    return (
        <>
        <div className="w-full border border-white/20 rounded-lg p-2">
            {object?.currentState &&  (
                <>
                {(object?.currentState[targetArray] || []).map((condobject, key)=>{
                    return (
                        <>
                        {condobject.operator ? (
                            <div className="text-white/60 text-[.8rem] py-2 opacity-[.7rem] ml-2 border-l px-2 border-white/20">{condobject.operator}</div>
                        ):(
                            <div className="text-white opacity-[.7rem] my-2">If</div>
                        )}
                        <div 
                        
                        className="p-2 border-2 rounded-lg border-white/20 border-dashed p-2" 
                        key={`kkcondcoditionlabkey-${key}`}>
                            {condobject.group.map((group, i)=>{
                                return (
                                    <>
                                    {group.operator && (
                                        <div className="text-white/50 text-[.7rem] ml-2 border-l-2 border-white/20 px-2 py-2  opacity-[.7rem] ">{group.operator}</div>
                                    )}
                                    <div 
                                    className=" p-2 flex items-center justify-between rounded-lg bg-white/10 border-2 rounded-lg border-white/20 " 
                                    key={`ie3j9jx9-33$-${i}`}>
                                        <div className="txt">{group?.variable?.name()} is {`${group.value}`}</div>
                                        <div className="flex items-center gap-2 justify-between ">
                                            <motion.div
                                            onClick={()=>{
                                                group.shouldRun = !group.shouldRun 
                                                setrefresh(p=>!p)
                                            }} 
                                            animate={group.shouldRun?{background: `#2fff002f`}:{background: `#ff00002f`}}
                                            className="pause relative  h-8 flex justify-start items-center  rounded-2xl border-white/10 border w-20">
                                            <motion.div 
                                            className='flex justify-center items-center p-2 rounded-[50%] border bg-white/30 border-white/20'
                                            animate={group.shouldRun?{translateX: `0`}:{translateX: `140%`}}
                                            >{group.shouldRun?<BiPlay className=""/>:<BiPause/>}</motion.div>
                                            </motion.div>
                                            <div 
                                            onClick={()=>{group.remove(); setrefresh(p=>!p)}}
                                            className="delete bg-red-500/20 p-2 rounded-lg border-white/10 border"><MdDelete/></div>
                                        </div>
                                    </div>
                                    </>
                                )
                            })}
                        </div>
                        </>
                        )
                })}
                </>
            )}
        </div>
        {
            (varGroups || []).map((group, k)=>{
                return (
                    <VarHandler state={object.currentState} voptype={voptype} targetArray={targetArray} setrefresh={setrefresh} object={object} Tile={Tile} groupobject={group} key={k} setgroupobject={setVarGroups}/>
                )
            })
        }
        {!(object?.currentState[targetArray]?.length)?(
            <div 
            style={{background: `linear-gradient(22deg, transparent, rgb(80 78 154) 92%)`, boxShadow: `0px 0px 24px -8px #0000009e`}}    
            onClick={()=>{setVarGroups(p=>[temp()])}}
            className="add p-2 border border-white/20 bg-white/10 cursor-pointer rounded-[2rem] px-4 mt-4 cursor-pointer flex justify-center items-center gap-2"
            > <BiPlus/> Add Condition</div>
        ):
        (
            <div 
            className="flex text-[.7rem] justify-between gap-2 items-center">
                <div 
                style={{background: `linear-gradient(22deg, transparent, rgb(80 78 154) 92%)`, boxShadow: `0px 0px 24px -8px #0000009e`}}    
                onClick={()=>{setVarGroups(p=>[{...temp(), operator: `AND`}])}}
                className="and p-2 rounded-sm border-white/20 border cursor-pointer">AND</div>
                <div 
                style={{background: `linear-gradient(22deg, transparent, rgb(80 78 154) 92%)`, boxShadow: `0px 0px 24px -8px #0000009e`}}    
                onClick={()=>{setVarGroups(p=>[{...temp(), operator: `OR`}])}}
                className="or p-2 rounded-sm border-white/20 border cursor-pointer">OR</div>
            </div>
        )
        }
        </>
        
    )
}