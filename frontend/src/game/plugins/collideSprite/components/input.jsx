import { useState } from "react";

export function CollideSpriteInput({object, v, clip}){
    const [value, setValue] = useState(object[v[2][0]])
    return (
        <div className="flex w-full gap-2 p-2 justify-between items-center">
            <div className="name capitalize text-[.8rem] opacity-[.7]">{v[0]}</div>
            {
                (v[1] !== `checkbox`)?
                <input type={v[1]} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl"  value = {value} onInput={(e)=>{ setValue(+e.target.value); v[2].forEach(vv=>{object[vv] = +e.target.value})}}/>
                : 
                <input type={v[1]} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl" checked={value} onChange={(e)=>{ setValue(e.target.checked); v[2].forEach(vv=>{object[vv] = e.target.checked})}}/>

            }
        </div>
    )
}