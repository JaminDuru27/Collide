import {useState } from "react";
import {BiPlus } from "react-icons/bi";
import { StateVariableSetter } from "./statevarsetter";

export function VarLab({object,voptype, Tile, targetArray}){
    const temp = ()=>({variable: undefined, value: undefined, condition: undefined, })
    const [varGroups, setVarGroups] = useState([temp()])
    const [refresh, setrefresh] = useState(false)
    return (
        <>
            <div className="flex w-full rounded-lg border-white/20 border p-2 flex-col gap-2 justify-start items-start">
                {object?.currentState[targetArray].map((v, key)=>{
                    if(v.variable){
                        const name = v?.variable?.name()
                        const value = v?.value
                        return (
                            <div 
                            className="capitalize text-[.8rem] border border-white/20 rounded-sm flex items-center justify-between p-2 px-3 w-full"
                            >
                                <div className="name">set {name} to {`${value}`}</div>
                                <div 
                                onClick={()=>{
                                    v.isWorking = !v.isWorking
                                    setrefresh(p=>!p)
                                }}
                                className={`bib w-5 h-5 ${(v?.isWorking)?`bg-white/20 border-white/30`:`bg-black/20 border-black/30`} cursor-pointer rounded-[50%] border`}></div>
                            </div>
                        )
                    }else return null
                    
                })}
            </div>

            {(varGroups || []).map((obj)=>{
                return (
                    <>    
                    <StateVariableSetter voptype={voptype} Tile={Tile} obj={obj} />
                    <div 
                    onClick={()=>{
                        varGroups.forEach(vardata=>{
                            object.currentState[targetArray].push({...vardata, isWorking: true})
                        })
                        setVarGroups(p=>([temp()]))
                    }}
                    style={{background: `linear-gradient(22deg, transparent, rgb(80 78 154) 92%)`, boxShadow: `0px 0px 24px -8px #0000009e`}}    
                    className="save p-2 border border-white/20 rounded-lg w-full text-[.7rem]">Save Variable</div>
                    </>
                )
            })}
            <div 
            style={{background: `linear-gradient(22deg, transparent, rgb(80 78 154) 92%)`, boxShadow: `0px 0px 24px -8px #0000009e`}}    
            onClick={()=>{setVarGroups(p=>[temp()])}}
            className="add p-2 border border-white/20 bg-white/10 cursor-pointer rounded-[2rem] px-4 mt-4 cursor-pointer flex justify-center items-center gap-2"
            > <BiPlus/> Add Condition</div>
        </>
    )
}
