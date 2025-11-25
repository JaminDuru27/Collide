import { color, m, number } from "framer-motion"
import { useState } from "react"
import { GUI } from "./gui"

export function SidebarGrid({collide}){
    const gui  =  [
        {type: `Header`, name:`Grid Properties`},
        {step: 10,type: Number,name:'x',
        get:()=>collide[`current`].grid.x,
        set:(e)=>collide[`current`].grid.x  = e},
        {step: 10,type: Number,name:'y',
        get:()=>collide[`current`].grid.y,
        set:(e)=>collide[`current`].grid.y  = e},
        {type: Number,name:'nx',
        onchange:()=>{collide[`current`].grid.populate()},
        get:()=>collide[`current`].grid.nx, step: 10,
        set:(e)=>collide[`current`].grid.nx  = e},
        {type: Number,name:'ny',
        onchange:()=>{collide[`current`].grid.populate()},
        get:()=>collide[`current`].grid.ny,step: 10,
        set:(e)=>collide[`current`].grid.ny  = e},
        {step: 10,type: Number,name:'cw',
        onchange:()=>{collide[`current`].grid.populate()},
        get:()=>collide[`current`].grid.cw,
        set:(e)=>collide[`current`].grid.cw  = e},
        {step: 10,type: Number,name:'ch',
        onchange:()=>{collide[`current`].grid.populate()},
        get:()=>collide[`current`].grid.ch,
        set:(e)=>collide[`current`].grid.ch  = e},

        {type: `Color`,name:'color',
        get:()=>collide[`current`].grid.color,
        set:(e)=>collide[`current`].grid.color = e},
        
        {type: Number,name:'alpha', min:0, max:1,
        get:()=>collide[`current`].grid.alpha,
        set:(e)=>collide[`current`].grid.alpha = e},


        {type: Function,name:'center',
        get:()=>undefined,
        set:(e)=>collide[`current`].grid.center()},
    
        {type: `Header`, name:`Highlight Properties`},
        
        {type: Number,name:'alpha', min:0, max:1,
        get:()=>collide[`current`].highlight.alpha,
        set:(e)=>collide[`current`].highlight.alpha = e},
        {type: `Color`,name:'color',
        get:()=>collide[`current`].highlight.color,
        set:(e)=>collide[`current`].highlight.color = e},

        {type: `Header`, name:`Mouse Properties`},

        {type: Number,name:'size', min:0, max:10,
        get:()=>collide[`current`].mouse.size,
        set:(e)=>collide[`current`].mouse.size = e},
        {type: `Color`,name:'color',
        get:()=>collide[`current`].mouse.color,
        set:(e)=>collide[`current`].mouse.color = e},

    ]
    if(!collide)return (<></>)
    else
    return (
        <>
        {gui.map((obj, x)=><GUI key={x} obj={obj} />)}
        </>
    )
}
