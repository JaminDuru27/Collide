import { color, m, number } from "framer-motion"
import { useState } from "react"
import { GUI } from "../gui"

export function SidebarGrid({collide}){
    const scene = ()=>{return collide[`current`].scenes?.currentLocker?.currentScene}
    const gui  =  [
        {type: `Header`, name:`Grid Properties`},
        {step: 10,type: Number,name:'x',
        get:()=>scene().grid.x,
        set:(e)=>scene().grid.x  = e},
        {step: 10,type: Number,name:'y',
        get:()=>scene().grid.y,
        set:(e)=>scene().grid.y  = e},
        {type: Number,name:'nx',
        onchange:()=>{scene().grid.populate()},
        get:()=>scene().grid.nx, step: 10,
        set:(e)=>scene().grid.nx  = e},
        {type: Number,name:'ny',
        onchange:()=>{scene().grid.populate()},
        get:()=>scene().grid.ny,step: 10,
        set:(e)=>scene().grid.ny  = e},
        {step: 10,type: Number,name:'cw',
        onchange:()=>{scene().grid.populate()},
        get:()=>scene().grid.cw,
        set:(e)=>scene().grid.cw  = e},
        {step: 10,type: Number,name:'ch',
        onchange:()=>{scene().grid.populate()},
        get:()=>scene().grid.ch,
        set:(e)=>scene().grid.ch  = e},

        {type: `Color`,name:'color',
        get:()=>scene().grid.color,
        set:(e)=>scene().grid.color = e},
        
        {type: Number,name:'alpha', min:0, max:1,
        get:()=>scene().grid.alpha,
        set:(e)=>scene().grid.alpha = e},


        // {type: Function,name:'center',
        // get:()=>undefined,
        // set:(e)=>scene().grid.center()},
    
        {type: `Header`, name:`Highlight Properties`},
        
        {type: Number,name:'alpha', min:0, max:1,
        get:()=>scene().highlight.alpha,
        set:(e)=>scene().highlight.alpha = e},
        {type: `Color`,name:'color',
        get:()=>scene().highlight.color,
        set:(e)=>scene().highlight.color = e},

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
        <div className="my-2 text-2xl">{scene().name}</div>
        {gui.map((obj, x)=><GUI key={x} obj={obj} />)}
        </>
    )
}
