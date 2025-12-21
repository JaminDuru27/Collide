import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RiImageAddFill } from "react-icons/ri"; 
import { RiGalleryView } from "react-icons/ri"; //merging
import { SelectImageFile } from "../../utils/selectimagefile";
import { FaFileImage } from "react-icons/fa";
import { BiSolidLeftArrow } from "react-icons/bi";
import { Draggable } from "../draggable";
import { MdDelete } from "react-icons/md";

const time = 3000

export function SideBarImage({setmergedatas, dragelement, setupdatedrag,collide, setfeedback, setcontext}){
    const [ch, setch]= useState(5)
    const [cw, setcw]= useState(5)
    const [nx, setnx]= useState(10)
    const [ny, setny]= useState(10)
    const [imageObjectInfo,setImageObjectInfo]= useState(null)
    const [message, setMessage]= useState(null)
    const [timeout, settimeout]= useState(()=>{})
    const canvasref = useRef(null)
    const [c, setC] = useState(collide[`current`])
    useEffect(()=>{
        const time = setTimeout(()=>{
            const images = collide[`current`].images
            .setup(canvasref)
            .start()
            collide[`current`].images.image?.reassign()
            updatedim()
            setC({...collide[`current`]})
        }, 100)
        if(collide[`current`].images.image)
        collide[`current`].images.image.reassign()
        return ()=>clearTimeout(time)
    }, [])
    function updatedim(){
        setnx(c.images.grid.nx)
        setny(c.images.grid.ny)
    }
    function setCellSize(){
        const imgobj = collide[`current`].images.image
        if(imgobj){
            console.log(`kk`)
        }
    }
    function addImage(){
        SelectImageFile((data)=>{
            const imgobj= collide[`current`].images.add(data)
            .setinfo(data)
            setC({...collide[`current`]})
        }, collide[`current`])
    }
    return (
        <div className="flex gap-y-4 flex-col h-full overflow-y-auto justify-between items-center overflow-x-visible">
            
            <h1 className="text-[1.2rem] opacity-[.7] mb-4 mt-2">Image</h1>

            <div className="nav w-full rounded-sm bg-[#060014] flex justify-start gap-x-2 overflow-x-auto overflow-y-hidden scrollx items-center p-2">
                {c?.images?.image && (
                    <SideBarNavIncBtn name='zoom' 
                    onclick={()=>{
                    setfeedback(p=>({message: `set zoom value`, type:'number', 
                    cb:({value})=>{
                        collide[`current`].images.image.zoomin(value)
                        setMessage(`nx:${nx} ny:${ny}`);
                        clearTimeout(timeout); 
                        settimeout(setTimeout(()=>setMessage(null), time))
                        setC({...collide[`current`]})
                    }}))}}
                    set={(p, inc)=>{
                        if(inc>0) collide[`current`].images.image.zoomin(10)
                        else collide[`current`].images.image.zoomout(10);
                        setC({...collide[`current`]})
                    }}
                    get={()=>collide[`current`].images.image.$zoom}
                    onchange={()=>{setMessage(`zoom`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))}}
                    />
                )}
                <SideBarNavIncBtn name='set ch'
                onclick={()=>{
                    setfeedback({message:`enter cell height`, type:`number`,
                        cb:({value})=>{
                            setch(value)
                            collide[`current`]?.images?.image?.calcch(value)
                            setC({...collide[`current`]})
                        }
                    })
                    setMessage(`cw:${cw} ch:${ch}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))
                }}
                set={(p, inc)=>{
                    setch(x=> x + inc)
                    collide[`current`].images?.image?.calcch(x + inc)
                    setC({...collide[`current`]})
                }}
                get={()=>ch}
                onchange={()=>{setMessage(`cw:${cw} ch:${ch}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))}}
                />
                <SideBarNavIncBtn name='set cw' 
                onclick={()=>{
                    setfeedback({message:`enter cell width`, type:`number`,
                        cb:({value})=>{
                            setcw(value)
                            collide[`current`].images?.image?.calccw(value)
                            setC({...collide[`current`]})
                        }
                    })
                    setMessage(`cw:${cw} ch:${ch}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))
                    }}
                set={(p, inc)=>{
                    setcw(x=> x + inc)
                    collide[`current`]?.images?.image?.calccw(x + inc)
                    setC({...collide[`current`]})
                }}
                get={()=>cw}
                onchange={()=>{setMessage(`cw:${cw} ch:${ch}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))}}
                />
                <SideBarNavIncBtn name='set nx' 
                onclick={()=>{
                    setfeedback({message:`enter cell number on x-axis`, type:`number`,
                        cb:({value})=>{
                            setnx(value)
                            collide[`current`].images?.image?.setnx(value)
                            setC({...collide[`current`]})
                        }
                    })
                    setMessage(`nx:${nx} ny:${ny}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))
                }}
                
                set={(p, inc)=>{collide[`current`].images?.image?.setnx(p+inc);  setC({...collide[`current`]});updatedim();}}
                get={()=>collide[`current`].images.grid[`nx`]}
                onchange={()=>{setMessage(`nx:${nx} ny:${ny}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))}}
                />
                <SideBarNavIncBtn name='set ny' 
                onclick={()=>{
                    setfeedback({message:`enter cell number on y-axis`, type:`number`,
                        cb:({value})=>{
                            setny(value)
                            collide[`current`].images?.image?.setny(value)
                            setC({...collide[`current`]})
                        }
                    })
                    setMessage(`nx:${nx} ny:${ny}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))
                }}
                set={(p, inc)=>{collide[`current`].images?.image?.setny(p+inc);  setC({...collide[`current`]});updatedim();}}
                get={()=>collide[`current`].images.grid[`ny`]}
                onchange={()=>{setMessage(`nx:${nx} ny:${ny}`);clearTimeout(timeout); settimeout(setTimeout(()=>setMessage(null), time))}}
                />
            </div>
            <div className="w-[10rem] relative  h-[10rem] flex flex-col gap-2 items-center justify-center  rounded-sm border-2  border-white/20">
                <motion.div 
                initial={{opacity:0, display:`none`}}
                animate={(message)?{opacity:1, display:`block`}:{opacity:0, display:`none`}}
                className="font-bold absolute top-0 right-0 text-[.7rem] text-[black] bg-white/10 rounded-sm backdrop-blur-2xl py-1 px-2 "
                >{message}</motion.div>
                <motion.div
                title='make draggable'
                initial={{opacity:0}}
                whileHover={{opacity:1}}
                onClick={()=>{
                    dragelement[`current`] = canvasref[`current`]
                    setupdatedrag(p=>!p)
                }} 
                className="bib absolute rounded-tl-2xl rounded-bl-4xl cursor-pointer bg-white/20 top-0 right-0  w-4 h-4">

                </motion.div>
                <canvas ref={canvasref} className="w-full h-full">
                </canvas>

            </div>

            <div className="w-[10rem] max-h-[10rem] p-2 max-h-[50px] overflow-y-auto scrolly flex-col gap-2   rounded-sm bg-white/20">
            {
                c.images.array.map((imgobj, key)=>{
                    if(!imgobj.loaded && imgobj?.info)return (<></>)
                    else return (
                        <>
                        <motion.div 
                        key={key}
                        whileHover={{color: `#11012d`}}
                        onHoverStart={(e)=>{
                            setImageObjectInfo({...imgobj, b: e.target.getBoundingClientRect()})
                        }}
                        onHoverEnd={()=>{
                            setImageObjectInfo(null)
                        }}
                        onMouseDown={(e)=>{
                            if(e.button === 0){
                                collide[`current`].images.switch(imgobj.id)
                                setC({...collide[`current`]})
                            }
                            if(e.button === 2){
                                const b = e.target.getBoundingClientRect()
                                setcontext(p=>({
                                    pos:{x: b.x + b.width + 50, y: b.y},
                                    [imgobj.info.name]:[
                                        {   
                                            element: MdDelete,
                                            name: `delete`,
                                            cb:()=>{
                                                collide[`current`].images.deleteImage(imgobj)
                                                setC({...collide[`current`]})
                                            }
                                        }
                                    ]
                                }))
                            }
                        }}
                        title={`${imgobj?.info?.name} MB: ${imgobj?.info?.size} Size: ${imgobj?.imgw}px x  ${imgobj?.imgh}px `}
                        className="cursor-pointer text-[.6rem] justify-start  w-full overflow-hidden flex mb-2 items-center">
                            <FaFileImage />
                            <div className="ml-1">{imgobj?.info?.name}</div>
                        </motion.div>
                    </>
                    )
                })
            }
            </div>
            {
                imageObjectInfo && (
                    <motion.div
                    initial={{opacity:0, translateY:`10px`,}}
                    animate={{opacity:1, translateY:`0px`,}}
                    transition={{duration:.6}}
                    exit={{opacity:0}}
                    style={{
                        top: `calc(${Math.floor(imageObjectInfo?.b?.top)}px - 10rem/2 + ${imageObjectInfo.b.height/2}px)`,
                        left: `calc(100% + 20px)`,
                    }}
                    className={`absolute w-[10rem] h-[10rem]  text-[.7rem] t rounded-sm backdrop-blur-[3px] bg-white/20 border-2 border-amber-50/10`}>
                        <img src={imageObjectInfo?.image?.src} alt="" className="w-full h-full rounded-sm" />
                        <div className="arr w-5 h-5 absolute top-1/2 translate-y-[-50%] left-[-40px] ">
                        <BiSolidLeftArrow color="#fff" size={25}  />
                        </div>
                    </motion.div>
                ) 
            }
            

            <motion.div
            whileTap={{scale:0.8}} 
            onClick={()=>{addImage()}}
            className="w-[10rem] h-[10rem] flex flex-col gap-2 items-center justify-center  rounded-sm bg-white/20">
                <RiImageAddFill color="#11012d" size={30}  />   
                <div className="text-[#11012d] text-[.8rem]">Drop Image Here</div>
            </motion.div>
            <motion.div
            whileTap={{scale:0.8}} 
            onClick={()=>{
                SelectImageFile((data)=>{
                    setmergedatas(p=>([...p, {...data, nx: 1, ny: 1,}]))
                })
            }} 
            className="w-[10rem] h-[10rem] flex flex-col gap-2 items-center justify-center  rounded-sm bg-white/20">
                <RiGalleryView color="#11012d" size={30}  />   
                <div className="text-[#11012d] text-[.8rem]">Merge Images Here</div>
            </motion.div>
        </div>
    )
}

let i = 0
export function SideBarNavIncBtn({name, onclick=()=>{}, onchange=()=>{}, set, get}){
    return (
        <div  style={{flexShrink:0}} className="text-[.5rem] relative p-1 px-3 bg-white/10 rounded-[.2rem]">
        <div
        onClick={()=>{
            set(get(), -1)
            onchange()
        }} 
        title={`decrease value of ${name}`}  className="cursor-pointer left w-[20%] bg-white/10 h-full absolute top-0 left-0 border-r-2 rounded-r-2xl border-[#060014]"></div>
        <div 
        onClick={()=>{onclick()}}
        title={`set value of ${name}`}  className="cursor-pointer z-10 title relative">{name}</div>
        <div 
        onClick={()=>{
            set(get(), 1)
            onchange()
        }}
        title={`increase value of ${name}`} className="cursor-pointer right w-[20%] bg-white/10 h-full absolute top-0 right-0 border-l-2 rounded-l-2xl border-[#060014]"></div>
        </div>
    )
}