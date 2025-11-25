import { useState } from "react"
let key = 0
export function GUI({obj}) {
    key ++ 
    const [value, setValue] = useState((obj.get)?obj.get():null)
    return (
        <>
    <div 
    key={key} 
    className="mb-2 text-[.7rem]"
    >   
        {(obj.type === `Header` && (
            <div 
            className="my-4 text-[.8rem] opacity-[0.7] capitalize ">{obj.name}</div>
        ))}
        {(obj.type === Number || obj.type === String || obj.type === Boolean || obj.type === `Color`) && (
            <div 
            className="mb-1">{obj.name}</div>
        )}        
        {obj.type === Number && (
            <input 
            className="w-full  p-1 rounded-2xl bg-[#ffffff0d]"
            type="number" 
            step={obj.step??0.1}
            min={obj.min??0}
            max={obj.max??1000}
            onInput={(e)=>{
                setValue(+(e.target.value))
                obj.set(+(e.target.value))
                if(obj.onchange)
                obj.onchange(+(e.target.value))

            }}  value={value} 
            />
        )}
        {obj.type === `Color` && (
            <input
            type="color" 
            value={value}
            onChange={(e)=>{obj.set(e.target.value); if(obj.onchange)obj.onchange(); setValue(e.target.value)}}
            className="w-full cursor-pointer justify-center items-center flex p-1 rounded-2xl bg-[#ffffff0d]"
            />
        )}
        {obj.type === Function && (
            <div 
            onClick={()=>{obj.set(); if(obj.onchange)obj.onchange()}}
            className="w-full cursor-pointer justify-center items-center flex p-1 rounded-2xl bg-[#ffffff0d]"
            >{obj.name}</div>
        )}
    </div>
    </>
    )
}