import { BiRename, BiSolidLayerPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PiDiamondsFour } from "react-icons/pi";
import { FaCodeMerge } from "react-icons/fa6";

import { TbArrowMoveUp, TbArrowMoveDown } from "react-icons/tb";
export function SideBarLayers({collide, setfeedback, setcontextobject}){
    const [rewind, setrewind] = useState(false)
    const [c, setC] = useState({...collide[`current`]})
    
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }, 100)
        return ()=>clearTimeout(time)
    }, [])
    function handlelayermousedown(e, layer){
        if(e.button === 2){
            const b = e.target.getBoundingClientRect()
            setcontextobject({
                pos:{x: b.x + b.width + 50, y: b.y},
                [layer.name]:[
                    {   
                        element: MdDelete,
                        name: `delete`,
                        cb:()=>{
                            layer.delete = true
                            setC({...collide[`current`]})
                        }
                    },
                    {   
                        element: BiRename,
                        name: `rename`,
                        cb:()=>{
                            setfeedback({type:'text', message: `Rename`, cb:({value})=>{
                                layer.rename(value)
                            }})
                        }
                    },
                    {   
                        element: TbArrowMoveUp,
                        name: `moveup`,
                        cb:()=>{
                            layer.moveup()
                            setC({...collide[`current`]})
                        }
                    },
                    {   
                        element: TbArrowMoveDown,
                        name: `movedown`,
                        cb:()=>{
                            layer.movedown()
                            setC({...collide[`current`]})
                        }
                    },
                    {   
                        element: FaCodeMerge,
                        name: `consolidate`,
                        cb:()=>{
                            layer.consolidate()
                            setC({...collide[`current`]})
                        }
                    },
                ]
            })
        }
    }
    function handlePositionMouseDown(e, p){
        if(e.button === 2){
            const b = e.target.getBoundingClientRect()
            setcontextobject({
                pos:{x: b.x + b.width + 50, y: b.y},
                [`position`]:[
                    {   
                        element: MdDelete,
                        name: `delete`,
                        cb:()=>{
                            collide[`current`].positions.deleteId(p)
                            setC({...collide[`current`]})
                        }
                    },
                    {   
                        element: BiRename,
                        name: `rename`,
                        cb:()=>{
                            setfeedback(
                                {message:`rename position`, 
                                cb:({value})=>{
                                    collide[`current`].positions.renameId(p, value)
                                    setC({...collide[`current`]})
                                }
                            })
                        }
                    },
                    {   
                        element: MdDelete,
                        name: `delete color`,
                        cb:()=>{
                            collide[`current`].positions.deleteColor(p)
                            setC({...collide[`current`]})
                        }
                    },
                    {   
                        element: BiRename,
                        name: `rename color`,
                        cb:()=>{
                            setfeedback(
                                {message:`rename position`, 
                                cb:({value})=>{
                                    collide[`current`].positions.renameColor(p, value)
                                    setC({...collide[`current`]})
                                }
                            })
                            
                        }
                    }
                ]
            })
        }
    }
    
    if(!collide.current)return (<></>)
    else
    return (
        <>
            <h1 className="text-[1.2rem] opacity-[.7] mb-4 mt-2">Tiles</h1>
{/* ----------------------------Layer Nav-------------------------------------------------------- */}
                <div className="nav w-full p-1 py-2  flex justify-end items-center gap-x-2 border-b-2 border-[#ffffff3c] ">
                    <IoReloadOutline 
                    onClick={()=>{
                        // setrewind(p=>!p)
                        setC({...collide[`current`]})

                    }}
                    title="reload" className="cursor-pointer"/>
                    <BiSolidLayerPlus
                    onClick={()=>{
                        collide[`current`].imageLayers.add()
                        setC({...collide[`current`]})

                    }}
                    title="add layer" className="cursor-pointer"/>
                    <MdDelete onClick={()=>{
                        const cl = collide[`current`].imageLayers.currentLayer
                        if(cl){
                            cl.delete = true
                            const index = collide[`current`].imageLayers.layers.indexOf(cl)
                            collide[`current`].imageLayers.layers.splice(index, 1)
                            setC({...collide[`current`]})
                        }
                    }} title="delete layer" className="cursor-pointer"/>
                </div>


            <div className="tileslayers overflow-y-auto scrolly flex flex-col gap-4 p-2 bg-[#06011b] max-h-1/2 rounded-[.4rem] ">

                {
// ------------------------------ LAYER -------------------------------------------------
                c.imageLayers.layers.map((layer, i)=>(
                    <>
                    <div 
                    key={`layer`+ i}
                    onMouseDown={(e)=>{handlelayermousedown(e, layer)}}
                    onClick={()=>{
                        collide[`current`].imageLayers.currentLayer = layer
                        setC({...collide[`current`]})
                    }}
                    className={`layer py-2 ${(c.imageLayers.currentLayer !== layer)?`opacity-[0.5]`:`opacity-[1]`} flex items-center justify-between bg-[#ffffff2b] border-1 px-2 rounded-sm text-[.9rem] border-[#ffffffa4] text-[white]`}>
                        <div className="name  w-[70%] overflow-hidden text-[.7rem]">{layer.name}</div>
                        <motion.div 
                        whileHover={{transform: `rotate(360deg)`}}
                        className="eye  relative flex items-center cursor-pointer justify-center  w-[30%] h-full">
                            <MdOutlineWbSunny 
                            size={20} color={layer.color} 
                            className="absolute top-1/2 left-1/2 translate-[-50%]"
                            />
                            <div
                             onClick={()=>{
                                if(layer.hidden){layer.hidden = false;return}
                                if(!layer.hidden){layer.hidden = true; return}
                                //
                                setC({...collide[`current`]})
                            }}
                            style={{backgroundColor:(!layer.hidden)?layer.color:'transparent'}} 
                            className="absolute w-2 h-2 rounded-[50%] top-1/2 left-1/2 translate-[-50%]"
                            ></div>
                        </motion.div>
                    </div>
                    </>
                ))
                }
            
            </div>
        <h1 className="text-[1.2rem] opacity-[.7] my-5 mt-10">Indicated Positions</h1>

        {/* // ------------------------------ POSITION POINTS ------------------------------------------------- */}
        <div className="nav w-full p-1 mb-2 flex gap-2 items-center justify-end">
            <div 
            onClick={()=>{
                collide[`current`].positions.deleteAll()
                setC({...collide[`current`]})
            }}
            className={`text-[.6rem] bg-white/10 rounded-[.2rem] p-1`}>clear</div>
        
            
            <div 
            onClick={()=>{
                if(!collide[`current`].positions.hidden){
                    collide[`current`].positions.hide()
                }else 
                collide[`current`].positions.unhide()
                setC({...collide[`current`]})
            }}
            className={`text-[.6rem] bg-white/10 rounded-[.2rem] p-1`}>{`${(collide[`current`].positions.hidden)?`show`:`hide`}`}</div>
        
            <div 
            onClick={()=>{
                setC({...collide[`current`]})
            }}
            className={`text-[.6rem] bg-white/10 rounded-[.2rem] p-1`}>Reload</div>
        
        </div>
        <div className="w-full gap-2 overflow-x-auto scrollx overflow-y-hidden  flex justify-start items-center bg-[#06011b] p-2 h-10">
            {
            c.positions.array.map((p, i)=>(
                <motion.div 
                key={`ddm`+ i}
                onMouseDown={(e)=>{
                    handlePositionMouseDown(e, p)
                    setC({...collide[`current`]})
                }}
                onHoverStart={(e)=>{
                    collide[`current`].positions.showcolors(p.color)
                }}
                onHoverEnd={(e)=>{
                    collide[`current`].positions.reset()
                }}

                title={p.name}
                whileHover={{boxShadow:`inset 0px 0px 6px 1px ${p.color ?? `#ff000071`}`}} 
                // style={{boxShadow:`inset 0px 0px 6px 1px ${p.color ?? `#ff000071`}`}}
                className="flex relative p-[.1rem] shrink-0 items-start justify-center w-8 h-8 border-2 border-[#ffffff1f] cursor-pointer rounded-sm">
                    <PiDiamondsFour color={p.color ?? `red`} size={14}/>
                    <div 
                    style={{backgroundImage: `linear-gradient(45deg, black, transparent)`, backgroundColor: `${p.color ?? `red`}`}}
                    className={`slash w-[0.1rem] h-1/3 rounded-2xl bg-[] bottom-0 left-1/2 translate-x-[-50%] absolute`}></div>
                </motion.div>
            ))
            }
        </div>
        
        </>
    )
}

function Layer(){
    return (
        <div className="layer"></div>
    )
}