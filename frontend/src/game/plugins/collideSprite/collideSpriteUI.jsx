import { useEffect, useRef, useState } from "react"
import { BiExit, BiSave } from "react-icons/bi"
import { CgAdd } from "react-icons/cg"
import { MdDelete, MdLoop } from "react-icons/md"
import { PiPlus } from "react-icons/pi"
import { CollideSpriteInput } from "./components/input"
import { CollideSpriteSideBottom } from "./components/sidebottom"

export function CollideSpriteUI({object, Tile}){
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
    const contentref = useRef(null)
    const [showspritemacro, setshowspritemacro] = useState  (false)
    return <>
    <div className="overflow-hidden w-full h-full bg-black/30 backdrop-blur-2xl">
        <div className="w-full h-full">
            <div className="flex justify-center gap-2 p-2 items-center w-full h-full">
                <div className="left w-[30%] h-full border border-white/30 relative rounded-sm">
                    <div 
                    ref = {contentref}
                    className="content w-full h-full relative overflow-y-auto scrolly overflow-x-hidden">
                        {object?.clips.map(clip=>(
                            <div 
                            onClick={()=>{
                                object.setcurrentclip(clip)
                                object.playclip(clip)
                                    
                            }}
                            className={`clip cursor-pointer relative p-2 m-2 border  ${ (object.currentclip?.id === clip.id)?`border-amber-400`:`border-white/30`} rounded-sm flex justify-between items-center`}>
                                {clip.loop && <MdLoop className="absolute top-1 left-1  bg-black" title="looping" size={10} color="orange"/>}
                                <div 
                                onClick={()=>{
                                    setshowspritemacro(true)
                                }}
                                className="name cursor-pointer text-[.8rem]">{clip.name}</div>
                                <div className="frames text-[.7rem] opacity-50">{clip.from} - {clip.to}</div>
                                <div onClick={()=>{clip.remove(); setrefresh(p=>!p)}} className="flex w-fit h-fit justify-center cursor-pointer items-center"><MdDelete/></div>
                            </div>
                        ))}
                        
                    </div>
                    <div
                    onClick={()=>{
                        object.createclip()
                        setshowspritemacro(true)
                    }}
                    className="add w-full p-2 py-4 absolute bottom-0 left-0 flex backdrop-blur-2xl cursor-pointer justify-center items-center">
                        {<PiPlus/>}
                    </div>
                    {showspritemacro && (
                    <>
                    <BiSave color="#fff" onClick={()=>{
                        object.currentclip.updateFromMain()
                        setshowspritemacro(false)
                        setrefresh(p=>!p)
                    }} className="absolute top-2 left-2 z-10 cursor-pointer" size={20}/>
                    <div className="absolute top-0 left-0 bg-black p-2 py-10 w-full h-full flex flex-col justify-start items-start gap-4">
                         {[['name', `text`,[`name`]]].map((e,x)=>{
                            return <CollideSpriteInput key={x} object={object.currentclip} ps = {e[2]} type={e[1]} name={e[0]} />
                        })}
                        {[ 
                            ['from', `number`,[ `minframe`, `frame`],], 
                            ['to', 'number', [`maxframe`]], 
                            ['delaytime', 'number', [`delaytime`]], 
                            ['loop','checkbox', [`loop`]]
                            ].map((e,x)=>{
                            return (
                                <CollideSpriteInput key={x} object={object} ps = {e[2]} type={e[1]} name={e[0]} />
                            )
                        })}
                    </div>
                    </>
                )}
                </div>
                <canvas ref = {canvasRef} className="right w-[70%] h-full border border-white/30 rounded-sm"></canvas>
                <CollideSpriteSideBottom Tile={Tile} object={object} ref={contentref}/>

            </div>
        </div>
        
    </div>
    </>
}

