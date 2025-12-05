import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react";
import { BiExit } from "react-icons/bi"
import { Merger } from "../../utils/merger";
import { ImExit } from "react-icons/im";

export function SpriteMerger({mergedatas, setmergedatas}){
    const [m, setM]= useState([])
    const canvas = useRef(null)
    const merger = useRef(null)
    const [mergerstate, setmergerstate] = useState(merger[`current`])
    const [mergeStage, setMergeStage]= useState(false)
    const  operations = [
        {name:'Horizontal', onclick : ()=>{merger[`current`].setOperation(`Horizontal`); setmergerstate({...merger[`current`]})}},
        {name:'Vertical', onclick : ()=>{merger[`current`].setOperation(`Vertical`); setmergerstate({...merger[`current`]})}},
        {name:'Compact', onclick : ()=>{merger[`current`].setOperation(`Compact`); setmergerstate({...merger[`current`]})}},
        {name:'X', onclick : ()=>{merger[`current`].setOperation(`X`); setmergerstate({...merger[`current`]})}},
        {name:'Y', onclick : ()=>{merger[`current`].setOperation(`Y`); setmergerstate({...merger[`current`]})}},
    ]
    useEffect(()=>{
        setM([...mergedatas])
    },[mergedatas])

    useEffect(()=>{

        if(mergeStage  && merger[`current`] && canvas[`current`]){
            if(merger[`current`])merger[`current`].parseImagesInfo()
            if(merger[`current`])merger[`current`].update()
        }
        if(!mergeStage)return()=>{}
        if(canvas[`current`] && !merger[`current`]){
            merger[`current`] = Merger(canvas[`current`], m)
        }
    
    },[mergeStage])

    if(!mergedatas?.length)return <></>
    else
    return (
        <motion.div 
        initial={{opacity:0,display:`none`}}
        animate={(m?.length)?{opacity:1, display:`flex`}:{opacity:0,display:`none`}}
        className="absolute w-full  h-screen backdrop-blur-2xl top-0 left-0 z-[100]">
            <div className="flex w-full h-full flex-wrap gap-2 p-10 items-center justify-center">
            {
                m?.map((data, x)=>(
                    <div 
                    key ={x}
                    className="w-[10rem] relative h-[10rem] overflow-hidden border-2 border-white/30   bg-white/10 rounded-sm "
                    >
                        <img 
                        onLoad={(e)=>{
                            const w = e.target.width
                            const h = e.target.height
                            const filter  = [...m.map(d=>(d ===data)?{...d,  imgw: w, imgh: h}:d)]
                            setM([...filter])       
                        }}
                        src={data.url} className='w-full h-full' alt="" />
                        <div className="descr absolute bottom-0 left-0 p-1 text-[.5rem] backdrop-blur-[2px]">
                            <div className="">{data.name}</div>
                            {data?.imgw && data?.imgh && (<div>Size: {data.imgw}px x {data.imgh}px </div>)}
                        </div>
                        <div onPointerEnter={()=>{
                            const data = m[x]
                            const filter  = [...m.map(d=>(d ===data)?{...d, showinfo:true}:d)]
                            setM([...filter])
                            // console.log(filter)
                        }} 
                        title='set info' className=" info absolute top-2 left-2 w-5 h-5 rounded-[50%] bg-black/40 cursor-pointer"
                        ></div>
                       
                        <motion.div
                        initial={{top:`100%`,display:`none`}}
                        animate={(data.showinfo)?{top:`0`,display:`flex`}:{}}
                        className="w-full h-full flex flex-col gap-y-2 justify-center items-center   bg-[black]/10 absolute backdrop-blur-[2px] top-[100%] left-0">
                            <div
                            className="div capitalize flex gap-2 w-full flex text-[.8rem] justify-center items-center">
                                nx<input
                                onInput={(e)=>{
                                    const filter  = [...m.map(d=>(d ===m[x])?{...d, nx: +(e.target.value)}:d)]
                                    setM([...filter])
                                }} 
                                type="number" value={data.nx} className="w-1/3 text-[.6rem] rounded-2xl border-2 px-2 border-white p-1"/>
                            </div>
                            <div
                            className="div capitalize flex gap-2 w-full flex text-[.8rem] justify-center items-center">
                                ny<input 
                                onInput={(e)=>{
                                    const filter  = [...m.map(d=>(d ===m[x])?{...d, ny: +(e.target.value)}:d)]
                                    setM([...filter])
                                }} 
                                type="number" value={data.ny} className="w-1/3 text-[.6rem] rounded-2xl border-2 px-2 border-white p-1"/>
                            </div>
                            <div 
                            onClick={()=>{
                                const filter  = [...m.map(d=>(d ===m[x])?{...d, showinfo:false, nx: data.nx, ny: data.ny}:d)]
                                setM([...filter])
                            }}
                            className="done border-2 border-white/20 rounded-lg px-2 py-1 capitalize bottom-1 right-1 absolute text-[.6rem] cursor-pointer ">done</div>
                        </motion.div>
                    </div>
               ))
            }
            </div>
            <BiExit color="white" size={19} className="absolute right-3 top-3" onClick={()=>{
                setmergedatas([])
                if(merger[`current`])merger[`current`].dispose()
            }}/>
            <motion.div
            onClick={()=>{
                setMergeStage(true)
            }}
            whileTap={{scale:.8}}
            whileHover={{background:`#ffffff30`}} 
            className="absolute border-2 cursor-pointer border-[#ffffff30] p-1 px-2 bottom-5 right-5 rounded-sm"
            >Next</motion.div>
            {
                (mergeStage) && 
                <div className="w-full h-full flex bg-[#11012dec] backdrop-blur-2xl top-0 left-0 absolute">
                    <div className="left w-[20%] mr-2 h-screen rounded border-[1px] border-white/20 bg-white/10"></div>
                    <div className="h-screen w-[70%] flex  gap-2 flex-col items-start justify-start relative">
                        <div className="top flex overflow-y-hidden justify-start scrollx overflow-x-auto px-2 gap-1 items-center h-[8%]  w-full rounded border-[1px] border-white/20">
                            <div className="flex justify-center  items-center bg-black/50 rounded-2xl p-1 gap-2 px-2 text-[.7rem]">
                                Title <input 
                                value={mergerstate?.title}
                                onInput={(e)=>{
                                    merger[`current`].title = e.target.value
                                    setmergerstate({...merger[`current`]})
                                }}
                                className="w-[5rem] text-[.7rem] p-1  rounded-2xl border-[1px] border-[#fff]" />
                                .png
                            </div>
                            <div className="flex justify-center items-center bg-black/50 rounded-2xl p-1 gap-2 px-2 text-[.7rem]">
                                W <input 
                                value={mergerstate?.cellw}
                                onInput={(e)=>{
                                    merger[`current`].setcellW(e.target.value)
                                    setmergerstate({...merger[`current`]})
                                }}
                                type="number" className="w-10 text-[.7rem] p-1  rounded-2xl border-[1px] border-[#fff]" />
                            </div>
                            <div className="flex justify-center items-center bg-black/50 rounded-2xl p-1 gap-2 px-2 text-[.7rem]">
                                H <input 
                                value={mergerstate?.cellw}
                                onInput={(e)=>{
                                    merger[`current`].setcellH(e.target.value)
                                    setmergerstate({...merger[`current`]})
                                }}
                                type="number" className="w-10 text-[.7rem] p-1  rounded-2xl border-[1px] border-[#fff]" />
                            </div>
                           
                            <div className="shrink-0 flex p-2 px-4 justify-center items-center bg-black/50 rounded-2xl  gap-2  text-[.7rem]">
                                Show Grid <input 
                                value={mergerstate?.showgrid}
                                onChange={(e)=>{
                                    merger[`current`].showGrid= +(e.target.value)
                                    setmergerstate({...merger[`current`]})
                                }}
                                type="checkbox" className="w-10 text-[.7rem] p-1  rounded-2xl border-[1px] border-[#fff]" />
                            </div>
                            <div
                            onClick={()=>{merger[`current`].save()}}
                            className="flex cursor-pointer p-2 px-4 justify-center items-center bg-black/50 rounded-2xl  gap-2  text-[.7rem]">
                            Save
                            </div>
                            <div
                            onClick={()=>{merger[`current`].save()}}
                            className="shrink-0 flex cursor-pointer p-2 px-4 justify-center items-center bg-black/50 rounded-2xl  gap-2  text-[.7rem]">
                            Download (Size: {canvas[`current`]?.width} x {canvas[`current`]?.height})px
                            </div>
                        </div>
                        <div className="top flex overflow-y-hidden justify-start scrollx overflow-x-auto px-2 gap-1 items-center h-[8%]  w-full rounded border-[1px] border-white/20">
                            {
                                operations.map(mode=>(
                                    <motion.div 
                                    initial={{backgroundColor:`#090015`}}
                                    animate={(mergerstate?.currentoperation === mode.name)?{backgroundColor:`#000d35`}:{backgroundColor:`#090015`}}
                                    onClick={()=>{mode.onclick()}}
                                    className="flex cursor-pointer p-2 px-4 justify-center items-center bg-black/50 rounded-2xl  gap-2  text-[.7rem]">
                                    {mode.name}
                                    </motion.div>
                                ))
                            }
                             <motion.div 
                            initial={{opacity: 0, display: `none` }}
                            animate={(mergerstate?.currentoperation === `Compact`)?{opacity:1, display:`flex`}:{opacity:0, display: `none` }}
                            className="flex  justify-center p-2 px-4 items-center bg-black/50 rounded-2xl  gap-2  text-[.7rem]">
                                Wrap <input 
                                value={mergerstate?.wrap}
                                onInput={(e)=>{
                                    merger[`current`].setWrap(+(e.target.value))
                                    setmergerstate({...merger[`current`]})
                                }}
                                type="number" className="w-20  text-[.7rem] p-1  rounded-2xl border-[1px] border-[#fff]" />
                            </motion.div>

                        </div>
                        <div className="w-full h-[80%] relative rounded border-[1px] border-white/20 overflow-auto">
                            <canvas ref={canvas}className="w-full absolute top-0 left-0 h-full"></canvas>

                        </div>
                    </div>
                    <ImExit onClick={()=>{
                        setMergeStage(false);
                        if(merger)merger[`current`].dispose()    
                    }} className="absolute top-2 left-2" color="white"/>


                </div>
            }
        </motion.div>
    )
}