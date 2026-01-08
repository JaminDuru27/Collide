import { useState } from "react"

export function TileRot({tile, pos}){
    const [value, setValue] = useState(0)
    if(!tile?.sprite)return <></>
    else return (
        <>
        <div 
        style={{top:`${pos.y -60}px`, left:`${pos.x}px`}}
        className="p-1 absolute bg-[#060014] border border-white/30 rounded-sm w-fit h-fit">
            <div className="opacity-[.6] text-[.7rem] capitalize ">Rotate</div>
            <input type="range" max={0.09} min={0} step={0.00000000001} value={value} onInput={(e)=>{setValue(e.target.value); tile.sprite.angle = +(e.target.value)}} className="" />
        </div>
        </>
    )
}