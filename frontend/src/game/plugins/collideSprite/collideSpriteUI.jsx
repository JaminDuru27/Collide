import { useEffect, useRef, useState } from "react"
import { BiExit, BiSave } from "react-icons/bi"
import { CgAdd } from "react-icons/cg"
import { MdLoop } from "react-icons/md"
import { PiPlus } from "react-icons/pi"

export function CollideSpriteUI({object}){
    const canvasRef = useRef(null)
    const [refresh, setrefresh] = useState  (false)

    useEffect(()=>{
        const time = setTimeout(()=>{
            canvasRef[`current`]?.addEventListener(`mousemove`, (e)=>{
                const b =e.target.getBoundingClientRect()
                const x=e.clientX - b.x
                const y=e.clientY - b.y
                object?.updatemouse(x, y)
            })
            canvasRef[`current`]?.addEventListener(`mousedown`, (e)=>{
                object?.mousedown(e)
            })
            canvasRef[`current`]?.addEventListener(`mouseup`, (e)=>{
                object?.mouseup(e)
            })
            object?.open(canvasRef, setrefresh)
        }, 100)
        return ()=>{clearTimeout(time); }
    },[])
    const [showspritemacro, setshowspritemacro] = useState  (false)
    return <>
    <div className="w-full h-full bg-black/30 backdrop-blur-2xl">
        <div className="w-full h-full">
            <div className="flex justify-center gap-2 p-2 items-center w-full h-full">
                <div className="left w-[30%] h-full border border-white/30 relative rounded-sm">
                    <div className="content w-full h-full relative overflow-y-auto scrolly overflow-x-hidden">
                        {object?.clips.map(clip=>(
                            <div 
                            onClick={()=>{
                                object.setcurrentclip(clip)
                                object.playclip(clip)
                                setshowspritemacro(true)
                            }}
                            className={`clip cursor-pointer relative p-2 m-2 border  ${ (object.currentclip?.id === clip.id)?`border-amber-400`:`border-white/30`} rounded-sm flex justify-between items-center`}>
                                {clip.loop && <MdLoop className="absolute top-1 left-1  bg-black" title="looping" size={10} color="orange"/>}
                                <div className="name text-[.8rem]">{clip.name}</div>
                                <div className="frames text-[.7rem] opacity-50">{clip.from} - {clip.to}</div>
                            </div>
                        ))}
                        {showspritemacro && (
                            <>
                            <BiSave color="#fff" onClick={()=>{
                                object.currentclip.updateFromMain()
                                setshowspritemacro(false)
                                setrefresh(p=>!p)
                            }} className="absolute top-2 left-2 z-10 cursor-pointer" size={20}/>
                            <div className="absolute top-0 left-0 bg-black p-2 py-10 w-full h-full flex flex-col justify-start items-start gap-4">
                                {[
                                    ['from', `number`,[ `minframe`, `frame`]], 
                                    ['to', 'number', [`maxframe`]], 
                                    ['delaytime', 'number', [`delaytime`]], 
                                    ['loop','checkbox', [`loop`]]
                                    ].map((e,x)=>{
                                    return (
                                        <Input key={x} object={object} v={e} clip={object.currentclip} />
                                    )
                                })}
                            </div>
                            </>
                        )}
                    </div>
                    <div
                    onClick={()=>{
                        object.createclip()
                        setshowspritemacro(true)
                    }}
                    className="add w-full p-2 py-4 absolute bottom-0 left-0 flex backdrop-blur-2xl cursor-pointer justify-center items-center">
                        {<PiPlus/>}
                    </div>
                </div>
                <canvas ref = {canvasRef} className="right w-[70%] h-full border border-white/30 rounded-sm"></canvas>
            </div>
        </div>
    </div>
    </>
}

export function Input({object, v, clip}){
    const [value, setValue] = useState(object[v[2][0]])
    return (
        <div className="flex w-full gap-2 p-2 justify-between items-center">
            <div className="name capitalize text-[.8rem] opacity-[.7]">{v[0]}</div>
            {
                (v[1] !== `checkbox`)?
                <input type={v[1]} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl"  value = {value} onInput={(e)=>{ setValue(+e.target.value); v[2].forEach(vv=>{object[vv] = value})}}/>
                : 
                <input type={v[1]} className="w-1/2 p-1 px-2 text-[.7rem] border border-white/30 rounded-2xl" checked={value} onChange={(e)=>{ setValue(e.target.checked); v[2].forEach(vv=>{object[vv] = !value})}}/>

            }
        </div>
    )
}