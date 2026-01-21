import { useState } from "react";

export function CollideSpriteInput({object,ps, type, name}){
    const [value, setValue] = useState(object[ps[0]])
    return (
        <div className="flex w-full gap-2 p-2 justify-between items-center">
            <div className="name capitalize text-[.8rem] opacity-[.7]">{name}</div>
            {
                (type === `number`)?
                <input type={type} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl"  value = {value} onInput={(e)=>{ setValue(+e.target.value); ps.forEach(vv=>{object[vv] = +e.target.value})}}/>
                :
                (type !== `checkbox`)?
                <input type={type} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl"  value = {value} onInput={(e)=>{ setValue(e.target.value); ps.forEach(vv=>{object[vv] = e.target.value})}}/>
                : 
                <input type={type} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl" value={value}  checked={value} onChange={(e)=>{ setValue(e.target.checked); ps.forEach(vv=>{object[vv] = e.target.checked})}}/>

            }
        </div>
    )
}