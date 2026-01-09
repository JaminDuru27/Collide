import { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import { selectStyles } from "./selectdata";

export function StateVariableSetter({obj,voptype, Tile}){
    const [vardata, setvardata] = useState(null)
    const [conds, setconds] = useState(null)
    const [inputType, setinputType] = useState(null)
    const [selectedOp, setSelectedOp] = useState({value: undefined, label: undefined})
    const [value, setvalue] = useState(undefined)
    const [type, settype] = useState(`Type`)
    useEffect(()=>{
        obj.variable = vardata?.variable
        obj.condition = (selectedOp?.value || selectedOp)
        obj.value = vardata?.variable?.parseinput(value)
    },[value, vardata, selectedOp])
    return (
        <>
        <div className={`opacity-[.4] px-2 ${obj.operator?`border-l-2 border-white/20  ml-2 py-2`:``}`}>{(obj.operator)?obj.operator:`If`}</div>
        <div 
        style={{boxShadow: `0px 0px 24px -4px #0000009e`}}
        className="w-full relative flex flex-col items-start bg-[#ffffff05] border-white/20 border rounded-2xl p-2 justify-between">
            
            <div className="w-full mb-4 flex items-center justify-between">
                <div 
                onClick={(e)=>{
                    Tile.showVariables({types: voptype, cb:(variable)=>{
                        settype(variable.type)
                        setvardata({variable})
                        setvalue(variable.parseinput(variable.get()))
                        const list = variable.getOperationList()
                        setconds(list)
                        setinputType(variable.inputtype)
                        setSelectedOp({value: list[0], label:list[0]})
                    }})
                }}
                style={{
                background: `linear-gradient(-23deg, transparent, rgb(34, 32, 104) 92%)`,   
                    boxShadow: `0px 0px 24px -8px #0000009e`}}
                className="condition w-[30%] text-[.8rem] capitalize p-2   bg-white/20 rounded-lg flex justify-center items-center"
                >
                    {(vardata)?`${vardata?.variable?.name()}`:`select variable`}</div>
                <div 
                style={conds?{width:`fit-content`}:{}}
                className="operator border border-white/20 bg-[#1d1f55] w-[20%] h-10 rounded-sm bg-white/20">
                {conds && (
                    <Select
                    styles = {selectStyles}
                    options = {[...conds.map(c=>({value: c, label: c}))]}
                    value = {selectedOp}
                    onChange ={opt=>{
                        setSelectedOp(opt)
                    }}
                    />
                )}
                </div>
                {
                    vardata && inputType !== `button` && (
                        <div 
                        style={{
                        background: `linear-gradient(-23deg, transparent, rgb(34, 32, 104) 92%)`,   
                            boxShadow: `0px 0px 24px -8px #0000009e`}}
                        className="condition w-[30%] text-[.8rem] capitalize p-2   bg-white/20 rounded-lg flex justify-center items-center">
                        {
                        selectedOp  &&
                        <input type={inputType} className="w-full h-full text-[.7rem] p-2 rounded-2xl" 
                        checked={value}
                        value={value} 
                        onChange={(e)=>{(inputType === `checkbox`)?setvalue(p=>!p):null}} 
                        onInput={(e)=>{(inputType !== `checkbox`)?setvalue(e.target.value):null}} name="" id="" />
                        }
                        </div>
                    )
                }
            </div>
            <div className="info w-full flex justify-between items-center">
                <div 
                style={{
                    boxShadow: `0px 0px 24px -8px #0000009e`}}
                className="flex justify-start capitalize text-[.6rem] border w-fit gap-2 border-white/10 rounded-2xl p-1 items-center">
                    <div className="type flex  justify-start items-center gap-1">
                        <div className="circle w-2 h-2 bg-green-400/30 rounded-[50%]"></div>
                        <div className="">{type}</div>
                    </div>
                    <div className="type flex justify-start items-center gap-1">
                        <div className="circle w-1 h-1 bg-gray-700 rounded-[50%]"></div>
                        <div className="">Physics</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
