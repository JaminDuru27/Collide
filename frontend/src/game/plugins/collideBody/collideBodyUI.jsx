import { motion } from "framer-motion"
import { useRef } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { BiCircle, BiExit, BiPlus, BiPolygon, BiShapePolygon, BiSquare } from "react-icons/bi"
import { BsTriangle } from "react-icons/bs"
export function CollideBodyUI({object}){
    const info = useRef({type: `dynamic`, geometry:`polygon`})
    const [createStage, setCreateStage] = useState(null)
    const [refresh, setrefresh] = useState(false)
    const canvasRef = useRef(null)
    useEffect(()=>{
        const time = setTimeout(()=>{
            canvasRef[`current`]?.addEventListener(`mousemove`, (e)=>{
                const b =e.target.getBoundingClientRect()
                const x=e.clientX - b.x
                const y=e.clientY - b.y
                object?.updatemouse(x, y)
            })
            canvasRef[`current`]?.addEventListener(`mousedown`, (e)=>{
                object?.mouseDown(e)
            })
            object?.open(canvasRef)
        }, 100)
        return ()=>clearTimeout(time)
    },[])
    const [showMacros, setShowMacros] = useState(false)
    const [feed, setfeed] = useState(null)
    return (
        <div 
        onDoubleClick={()=>{setfeed(null)}}
        className="text-white cursor-pointer flex w-full h-full justify-between items-center gap-2">
            {feed && (
                <div 
                style = {{top: `${feed.y}px`, left: `${feed.x   }px`}}
                className="fee absolute w-50 z-20 bg-black p-2 flex flex-col justify-start items-start gap-2">
                    {object.options.map((op, l)=>{
                        return (
                        <div key={`dop39-${l}`} className="p-2 w-full text-white text-[.7rem]">
                            <div onClick={()=>{op.cb(feed.id, setrefresh, setShowMacros);}} className="">{op.name}</div>
                        </div>)
                    })}
                </div>
            )}
            <div className="side w-1/5 h-full border border-white/40 rounded">
                <div className="title capitalize flex justify-start items-center gap-2 opacity-[.8] p-1 px-2 mb-2">shapes {<BiShapePolygon/>}</div>
                <div className="content flex flex-col cursor-default gap-2 justify-start overflow-y-auto items-center scrolly  rounded p-2 w-full h-[80%] ">
                    {
                        object?.shapes?.map((shape, key)=>(
                            <div 
                            onMouseDown={(e)=>{if(e.button === 2)setfeed({id: shape.id, x: e.clientX, y: e.clientY})}}
                            onClick={()=>{object.editShape(shape)}}
                            key={`diooa` + key}
                            className="w-full cursor-pointer relative mb-6"
                            >
                                <div className="type absolute text-[.6rem] capitalize opacity-[.7] bg-blue-900/20 p-2">{shape.type}</div>
                                <canvas className="w-full h-30 rounded overflow-hidden mb-4 border border-white/40 "></canvas>
                                <div className="text-[.7rem] capitalize opacity-[.7] w-full  text-center">{shape.name}</div>
                            </div>
                        ))
                    }
                </div>
                <div 
                onClick={()=>{setCreateStage(`type`)}}
                className="w-full p-2 cursor-pointer rounded flex justify-center items-center bottom-0 ">{<BiPlus/>}</div>
            </div>

            <div className="w-[80%] h-full border border-white/40 rounded relative">

                <canvas 
                ref = {canvasRef}
                className="w-full h-full"></canvas>
                {
                    object.targetShape && (<div onClick={()=>{object.saveshape()}} className="save text-[.7rem] absolute bottom-2 border border-white/30 rounded p-2 capitalize right-2">save</div>)
                }
                {
                createStage === `type` && (
                    <TypeStage setCreateStage={setCreateStage} info={info} onclick = {(e)=>{setCreateStage(`geometry`)}}/>
                )}
                {
                createStage === `geometry` && (
                    <GeometryStage setCreateStage={setCreateStage}  info={info} onclick = {(e)=>{ object.addBody(info[`current`]); setCreateStage(null);}}/>
                )}
                {
                showMacros && (
                    <Macros setShowMacros={setShowMacros} object={object} />
                )}

            </div>
                
        </div>
    )
}

export function Macros({object, setShowMacros}){
    return (
        <div className="w-full backdrop-blur-2xl scrolly overflow-y-auto flex-col h-full absolute gap-4 top-0 left-0 flex justify-start items-start p-4 bg-black/50">
            <div className="text-2xl mb-2">Macros - {object.name || body}</div>
            <div className="content p-2 border border-white/40 rounded-md w-full h-fit flex flex-col jystify-start  items-start gap-2 capitalize text-[.7rem] text-white/70">
            {[...object.targetShape.macros].map(({name, value, title}, k)=>{
                return (
                    <div key={`,acros-${k}`} title={title?title:""} className="w-full shrink-0 rounded-sm p-2 bg-white/10 flex justify-between items-center">
                        <div className="name">{name}</div>
                        <Input set={(v)=>{object.targetShape.macros[name] = v}} get={()=>value}/>
                    </div>
                )
            })}    
            </div>
            <div 
            onClick={()=>{setShowMacros(false); object.targetShape.updateFromMacros()}}
            className="next  bg-black/40 backdrop-blur-2xl rounded flex justify-center items-center bottom-2 w-10 h-10 cursor-pointer right-2 fixed">
                <FaCheck color={`white`}/>
            </div>           
        </div>
    )
}

export function Input({get, set}){
    const [value, setvalue] = useState(get()) 
    const type = typeof get()
    let inputtype = (type === `boolean`)?`checkbox`:(type === `function`)? `button`: type
    if(`${get()[0]}` === `#`)inputtype === `color`
    if(inputtype)
    return (
        <input style={(type === `button`)?{width: `70%`, height: `100%`}:{}} type={inputtype} max={100} min={-100} step={0.1} value={value} onInput={(e)=>{setvalue(e.target.value); set(+(e.target.value))}} className="w-20 h-full cursor-pointer bg-white/10 rounded p-2 text-[.6rem]" />
    )
}

import { CgArrowRight } from "react-icons/cg";
import { FaCheck } from "react-icons/fa"
import { PiPolygon } from "react-icons/pi"

export function TypeStage({info, setCreateStage,  onclick}){
    const def = `dynamic`
    const [s, sets] = useState(null)
    const btns = [
        {name: `static`, info:`Create Static platforms like ground`},
        {name: `dynamic`, info:`Create Dynamic Bodies For Movements `},
        {name: `kinematic`, info:`No Collision Detection. Just Physics`}
    ]
    return (
        <div className="w-full backdrop-blur-2xl h-full absolute gap-4 top-0 left-0 flex justify-center items-center bg-black/50">
            <div onClick={()=>{setCreateStage(null)}} className="exit w-10 h-10 absolute top-2 right-0 cursor-pointer"><BiExit/></div>
            {btns.map((e, key)=>(
                <motion.div 
                key={`03odod` + key}
                whileHover={{translateY: `-5%`}}
                animate={(s === e.name)?{background: `#ffffff1b`, border: `1px solid #ffffff1b`}:{}}
                onClick={()=>{
                    info[`current`].type = e.name
                    sets(e.name)
                }}
                className="w-1/6 opacity-[.8] cursor-pointer p-2">
                    <div className="type text-[.7rem] rounded w-full h-20 border border-[white]/40 rounded capitalize flex flex-col justify-center items-center">{e.name}</div>
                    <div className="text-center opacity-[.5] text-[.7em] capitalize my-3">{e.info} {(def === e.name)?`(default)`:``}</div>
                </motion.div>
            ))}
            <div 
            onClick={()=>{onclick(s)}}
            className="next absolute bottom-2 w-10 h-10 cursor-pointer right-2">
                <CgArrowRight color={`white`} />
            </div>
        </div>
    )
}

export function GeometryStage({info, setCreateStage, onclick}){
    const def = `polygon`
    const [s, sets] = useState(null)
    const btns = [
        {name: `circle`, elem: BiCircle, info:`Circle Template`},
        {name: `triangle`, elem: BsTriangle, info:`Triangle Template `},
        {name: `square`, elem: BiSquare, info:`Box Template`},
        {name: `polygon`, elem:PiPolygon, info:`Free polygon Drawing`}
    ]
    return (
        <div className="w-full h-full absolute backdrop-blur-2xl gap-4 top-0 left-0 flex justify-center items-center bg-black/50">
            <div onClick={()=>{setCreateStage(null)}} className="exit w-10 h-10 absolute top-2 right-0 cursor-pointer"><BiExit/></div>
            
            {btns.map((e, key)=>(
                <motion.div 
                key={`kkodod` + key}
                whileHover={{translateY: `-5%`}}
                animate={(s === e.name)?{background: `#ffffff1b`, border: `1px solid #ffffff1b`}:{}}
                onClick={()=>{
                    info[`current`].geometry = e.name
                    sets(e.name)
                }}
                className="w-1/6 opacity-[.8] cursor-pointer p-2">
                    <div className="type text-[.7rem] rounded w-full h-20 border border-[white]/40 rounded capitalize flex flex-col justify-center items-center">
                    <div className=" w-5 h-5 mb-1 flex justify-center items-center">{e.elem({size: 20})}</div>
                    {e.name}
                    </div>
                    <div className="text-center opacity-[.5] text-[.7em] capitalize my-3">{e.info} {(def === e.name)?`(default)`:``}</div>
                </motion.div>
            ))}
            <div 
            onClick={()=>{onclick(s)}}
            className="next absolute bottom-2 w-10 h-10 cursor-pointer right-2">
                <CgArrowRight color={`white`} />
            </div>
        </div>
    )
}