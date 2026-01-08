import { useState } from "react"

export function TileName({tile, pos}){
    const [value, setValue] = useState(tile?.name)
    if(!tile)return <></>
    else return (
        <>
        <div 
        style={{top:`${pos.y -60}px`, left:`${pos.x}px`}}
        className="p-1 absolute bg-[#060014] border border-white/30 rounded-sm w-fit h-fit">
            <div className="opacity-[.6] text-[.7rem] capitalize ">Rename</div>
            <input type="input" value={value} onInput={(e)=>{tile.retitle(e.target.value);console.log(tile);setValue(e.target.value)}} className="" />
        </div>
        </>
    )
}