import { BiSolidLayerPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { IoReloadOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import Draggable from "react-draggable";

export function SideBarLayers({collide}){
    const [rewind, setrewind] = useState(false)
    const [c, setC] = useState({...collide[`current`]})
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
                    key={i}
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
        </>
    )
}

function Layer(){
    return (
        <div className="layer"></div>
    )
}