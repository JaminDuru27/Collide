import { useRef, useState } from "react"
import { StateVariableSetter } from "./statevarsetter"
import { AndOr } from "./varHandler"
import { BiPlus } from "react-icons/bi"

export function TransitionLab({object, Tile, voptype, transition}){
    const temp = ()=>({variable: undefined,condition:undefined, value:undefined, operator:undefined})

    const [reload, setreload] = useState(false)
    const getref = ()=>Tile?.varHandler?.getvar(transition[`current`]?.ref?.id)
    const [transitionname, settransitionname] = useState(getref()?.get()?.name || `select state`)
    const [varsdata, setvarsdata] = useState([temp()])
    const [lastvardata, setlastvardata] = useState(undefined)
    const lastop = useRef(undefined)
    return(
        <>
            <div className="w-full p-2  border border-white/20 rounded-lg">
                {(
                    <div 
                    onClick={()=>{
                        Tile.showVariables({types: [`references`, `functions`], cb:(ref)=>{
                            if(ref.type !== `object`)return
                            transition[`current`].ref = ref.save()
                            settransitionname(ref?.get()?.name)
                            // object.currentState.selectedTransition.ref = ref.id
                        }})
                    }}
                    className="w-40 flex justify-center items-center h-40 border border-white/20 rounded-2xl bg-white/2">
                        {transitionname}
                    </div>
                )} 
            </div>      
            <div className="">Conditions</div>
            <div className="vars w-full flex justify-start items-start gap-2 flex-col">
                {(transition[`current`]?.conditions || [])?.map((cond, k)=>{
                    return (
                        <>
                        {cond?.operator && (
                            <div className="uppercase ml-2 text-[1.2rem] opacity-[.7] py-1 border-l-2 px-4 border-white/20">{cond.operator}</div>
                        )}
                        <div className="w-full p-2 border-2 border-white/20 border-dashed rounded-2xl w-full flex justify-start items-start flex-col">
                            {cond.group.map((v,kk)=>{
                                return (
                                    <>
                                    {v.operator && (
                                        <div className="uppercase ml-2 text-[.7rem] opacity-[.7] py-1 border-l-2 px-4 border-white/20">{v.operator}</div>
                                    )}
                                    <div className="w-full bg-white/10 rounded-2xl p-2 w-full text-[.8rem]">if {v.variable?.name()} {v.condition} {`${v?.value}`}</div>
                                    
                                    </>
                                )
                            })}
                        </div>
                        
                        </>
                    )
                })}
            </div>
            <div className="w-full p-2 border-2 border-white/20 rounded-2xl border-dashed ">
                <div className="w-full flex flex-col justify-start items-start">
                    {(varsdata || []).map(obj=>{
                        return <>
                        <StateVariableSetter voptype={voptype}  Tile={Tile} obj={obj} />
                        
                        </>
                    })}
                </div>
                {varsdata.length ? (
                    <AndOr 
                    varsdata={varsdata}
                    setlastvarsdata={setlastvardata} 
                    setVarsData={setvarsdata}
                    temp = {temp}
                    ondeploy={()=>{
                        transition[`current`].addcondsgroup({grouparray:varsdata, operator : lastop[`current`]})
                        setreload(p=>!p)
                        setvarsdata([])                    
                        lastop[`current`] = undefined
                    }}/>
                ):null}
            </div>
            {}
           {!transition[`current`]?.conditions?.length ? <div 
            onClick={()=>{
                setvarsdata(p=>([temp()]))
            }}
            className="add p-2 conditions flex items-center border-2 rounded-sm border-white/20 gap-2">{<BiPlus/>}Add</div>
            : (
                <div className="flex gap-2">

                    <div onClick = {()=>{setvarsdata(p=>([{...temp(), operator: `AND`}]));lastop[`current`] = `AND`}} className="and p-2 border-white/20 cursor-pointer border-2 rounded-2xl ">AND</div>
                    <div onClick = {()=>{setvarsdata(p=>([{...temp(), operator: `OR`}]));lastop[`current`] = `OR`}} className="and p-2 border-white/20 cursor-pointer border-2 rounded-2xl ">OR</div>
                </div>
            )
            }
        </>
    )
}