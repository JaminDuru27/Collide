import { useState } from "react"
import {  BiPlus } from "react-icons/bi";
import { StateVariableSetter } from "./statevarsetter";

export function VarHandler({state, Tile, object, voptype,targetArray, setrefresh, groupobject, setgroupobject}){
    const [varsetter, setvarsetter] = useState(false)
    const [lastvarsdata, setlastvarsdata] = useState(null)
    const temp = ()=>({variable: undefined,condition:undefined, value:undefined, operator:undefined})
    const [varsdata, setVarsData] = useState([temp()])
    return (
        <>            
            <div className="w-full p-2 border-2 border-white/20 rounded-2xl border-dashed ">
                <div className="w-full flex flex-col justify-start items-start">
                    {(varsdata || []).map(obj=>{
                        return <StateVariableSetter voptype={voptype} state={state} Tile={Tile} obj={obj} />
                    })}
                </div>
                <AndOr 
                varsdata={varsdata}
                setlastvarsdata={setlastvarsdata} 
                setVarsData={setVarsData}
                temp = {temp}
                ondeploy={()=>{
                    groupobject.group = varsdata
                    if(targetArray === `onenterconds`)
                    state.insertOnEnterConds(groupobject)
                    else state.insertOnLeaveConds(groupobject)

                    setVarsData(([temp()]))
                    setrefresh(p=>!p)
                    
                }}/>
            </div>
            
         </>
    )
}
export function AndOr({setlastvarsdata, varsdata, setVarsData, temp, ondeploy=()=>{}}){
    return (
        <>
        <div 
            className="andor flex justify-start border border-white/20 p-2 rounded-2xl text-[.7rem] items-center gap-2 my-2">
                <div 
                style={{
                background: `linear-gradient(-23deg, transparent, rgb(34, 32, 104) 92%)`,   
                boxShadow: `0px 0px 24px -8px #0000009e`}}
                onClick={()=>{
                    setlastvarsdata(varsdata)
                    const obj = temp()
                    obj.operator = `AND`
                    setVarsData(p=>([...p, obj]))
                }}
                className="and cursor-pointer rounded-lg border border-white/10 flex items-center gap-2 p-2 px-2">
                <BiPlus />
                And</div>
                <div 
                style={{
                background: `linear-gradient(-23deg, transparent, rgb(34, 32, 104) 92%)`,   
                boxShadow: `0px 0px 24px -8px #0000009e`}}
                onClick={()=>{
                    setlastvarsdata(varsdata)
                    const obj = temp()
                    obj.operator = `OR`
                    setVarsData(p=>([...p, obj]))
                }}
                className="or cursor-pointer rounded-lg border border-white/10 flex items-center gap-2 p-2 px-2">
                <BiPlus />
                Or</div>
                
            </div>
            <div 
            onClick={()=>{
                ondeploy()
            }}
            style={{
                background: `linear-gradient(-23deg, transparent, rgb(34, 32, 104) 92%)`,   
                boxShadow: `0px 0px 24px -8px #0000009e`}}
            className="Do border border-white/10 p-2 cursor-pointer w-full px-4 my-2  rounded-2xl text-[.7rem] ">Deploy</div>

        </>
    )
}