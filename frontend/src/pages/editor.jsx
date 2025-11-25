import { useEffect, useRef, useState } from "react";
import { Canvas } from "../components/canvas";
import { Sidebar } from "../components/sidebar";
import { BsFillGridFill } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri"; 
import { IoMdSettings } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { FaDrawPolygon } from "react-icons/fa6";
import { PiPlugsFill } from "react-icons/pi";
import { HiViewGridAdd } from "react-icons/hi";
import { SiDatabricks } from "react-icons/si";
import { TbDeviceGamepad3Filled } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { SidebarGrid } from "../components/sidebargrid";
import { BsFullscreen } from "react-icons/bs";
import { motion } from "framer-motion";
import { BsFullscreenExit } from "react-icons/bs";
export function Editor(){
    const editorref  = useRef(null)
    const [isModified, setisModified]= useState(false   )
    const [mode, setMode] = useState(`draw`) 
    const [play, setPlay] = useState(false)
    const [fullscreen,setFullscreen] = useState(false)
    const [hideside, sethidside]  = useState(true)
    const [head, sethead] =useState('')
    
    const [imagecanvas, setImageCanvas] =useState(null)
    const collide = useRef({})
    const feedvalueref = useRef(``)
    const [feedinfo, setFeedInfo] = useState({message:`Welcome Back!`, type:'message'})
    let handlefeed = ()=>{}

    
    useEffect(()=>{hideside===true?sethead(``):null},[hideside])
    return (
        <>
        <div 
        ref={editorref}
        className="w-full text-[#fff] h-screen bg-[#0f012d] "
        >
            <Canvas onDoubleClick={()=>{
                sethidside(true)
            }} collideref={collide} />
            <Title fullscreen={fullscreen} isModified={isModified}/>
            <DevTools 
            mode={mode} 
            play={play} 
            setPlay={setPlay} 
            fullscreen={fullscreen} 
            setFullscreen={setFullscreen} 
            />
            
            <SideBarControllers fullscreen={fullscreen} mode={mode} sethead={sethead} sethidside={sethidside} />

            <Sidebar dir="left" hide={hideside} fullscreen={fullscreen} setHide={sethidside} ref={editorref}>
                {console.log(head)}
                {(head ===`grid`) && <SidebarGrid  collide={collide} fullscreen={fullscreen} />}
                {(head ===`layers`) && <SideBarLayers  collide={collide} fullscreen={fullscreen} />}
                {(head ===`addimage`) && <SideBarImage setfeedback={setFeedInfo}  collide={collide} fullscreen={fullscreen} />}
            </Sidebar>
            <Tools collide={collide} mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <SettingsController mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <Feed valueRef={feedvalueref} infoobj = {feedinfo} collide={collide} setinfoobj={setFeedInfo} />

        </div>

        </>
    )
}
function SideBarControllers({mode, sethidside, sethead}){
    return (
        <div className="absolute top-4 left-4 flex flex-col gap-3 z-[1]">
        {mode===`draw` && (
            <>
            <Sidebtn delay={0} onpointerenter={()=>{sethidside(false); sethead(`grid`)}} >
                <BsFillGridFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.1} onpointerenter={()=>{sethidside(false); sethead(`addimage`)}} >
                <RiImageAddFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.2} onpointerenter={()=>{sethidside(false); sethead(`layers`)}} >
                <SiDatabricks color="white" />   
            </Sidebtn>
            </>
        )}
        {mode===`dev` && (
            <>
            <Sidebtn delay={0} onpointerenter={()=>{sethidside(false); sethead(`grid`)}} >
                <BsFillGridFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.1} onpointerenter={()=>{sethidside(false); sethead(`plugins`)}} >
                <PiPlugsFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.2} onpointerenter={()=>{sethidside(false); sethead(`mods`)}} >
                <HiViewGridAdd color="white" />   
            </Sidebtn>
            <Sidebtn delay={.3} onpointerenter={()=>{sethidside(false); sethead(`layers`)}} >
                <SiDatabricks color="white" />   
            </Sidebtn>
            </>
        )}
    </div>
    )
}
function SettingsController({mode, setMode}){
    return (
        <motion.div 
        initial={{right:`-100px`}} 
        animate={{right:`1px`}}
        transition={{duration:1.5, type:`tween`}}

        className="controlpanel rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-10 right-0">
            <IoMdSettings title="settings" className="cursor-pointer"  color="white"/>
            <div className="cursor-pointer"  onClick={()=>{
                setMode(p=>(p === `draw`)?`dev`:`draw`)
            }}>
            {(mode === `dev`)?<TbDeviceGamepad3Filled title='Dev Mode (Alt D)' color="white"/>: <MdModeEdit title='Draw Mode (Alt P)' color="white"/>}
            </div>
        </motion.div>
    )
}
import { FaPencilAlt } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import { FaFillDrip } from "react-icons/fa";
import { FaEyeDropper } from "react-icons/fa6";
import { PiSelectionDuotone } from "react-icons/pi";
import { SideBarLayers } from "../components/sidebarlayers";
import { SideBarImage } from "../components/sidebarimage";
import { Draggable } from "../components/draggable";
import { Feed } from "../components/feed";
function Tools({mode, collide, setMode}){
    const [c, setC] = useState({...collide})
    const [currenttool, setcurrenttool] = useState(`Pencil`)
    const tools = {
        Pencil:{element: FaPencilAlt, title: `Pencil (B)`, name: `Pencil`},
        Eraser:{element: FaEraser, title: `Eraser (E)`, name: `Eraser`},
        Fill:{element: FaFillDrip, title: `Fill (G)`, name: `Fill`},
        Inspect:{element: FaEyeDropper, title: `Inspect (Alt or I)`, name: `Inspect`},
        Select:{element: PiSelectionDuotone, title: `Select (M)`, name: `Select`},
    }
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }, 100)
        return ()=>clearTimeout(time)
    }, [])
    return (
        <motion.div 
        initial={{right:`-100px`}} 
        animate={{right:`1px`}}
        transition={{duration:1.5, type:`tween`}}

        className="controlpanel rounded-l-2xl gap-y-4 bg-[#060014] p-2 flex flex-col min-w-5 max-h20  absolute top-40 right-0"
        >
            {/* <PiSelectionDuotone title="Select (M)" className="p-[.3rem] border-b-2 border-[#ffffff7f] cursor-pointer"  size={15} color="white"/> */}
            {c?.tools?.array?.map((obj, x)=>{
            return tools[obj.name].element({
                onClick:()=>{
                    setcurrenttool(obj.name)
                    collide[`current`].tools.setTool(obj.name)
                    setC({...collide[`current`]})
                },
                key:x, className:`${c.tools.tool.name === obj.name?`pb-[.3rem] border-b-2 border-[#ffffff7f] border-b-2 border-[#ffffff7f] rounded-[.2rem]`:``} cursor-pointer`, 
                size: c.tools.tool.name === obj.name?18:15, 
                color:`white`
            })
            })}

        </motion.div>
    )
}
function Sidebtn({onpointerenter, delay=0, children}){
    return (
        <motion.div
            initial={{translateX:`-10px`}}
            animate={{translateX:`0px`}}
            transition={{delay:delay, duation: .5, type: `spring`}}
            onPointerEnter={()=>{
                onpointerenter()
            }} 
            style={{boxShadow:`0px 0px 10px 0px #01021c`, zIndex:1, position:`relative`, borderTop: `2px solid #7777de`}}
            className="ss rounded-2xl  flex justify-center cursor-pointer items-center w-8 h-8 bg-[#03012ead] border-2 border-[#ffffff48] "
            >{children}
        </motion.div>
    )
}

function Title({isModified, fullscreen}){
    return (
        <motion.div
        initial={{top:`-100px`}} 
        animate={(!fullscreen)?{top:`1px`}:{top:`-100px`}}
        transition={{duration:1.5, type:`tween`}} 
        className="title w-[50vw] h-[fit] absolute top-0 z-10 left-1/2 translate-x-[-50%] text-[#ffffff83] capitalize text-center text-[.7rem] py-1 rounded-b-2xl  bg-[#060014]"
        >
        Project
        <div className={`${!isModified?`bg-transparent border-2 border-[#ffffffa2]`:`bg-green-500`} rounded-[50%] w-2 h-2 absolute top-1/2 right-2 translate-y-[-50%]`}></div>
        </motion.div>
    )
}

function DevTools({mode, play, setPlay, fullscreen, setFullscreen}){
    return (
        <motion.div 
            initial={(mode === `dev`)?{width: `fit-content`, padding: '2px', display:`flex`}:{}}
            animate={(mode === `draw`)?{width: 0, padding: 0, display:`none`}:{}}
            className="absolute overflow-hidden top-10 right-20 w-[fit] p-1 gap-2 rounded-md flex items-center justify-between border-2 border-[#ffffff63]"
            >   
                <div
                onClick={()=>{setPlay(p=>!p)}}
                
                className=" items-center justify-center cursor-pointer flex w-5 h-5 rounded-sm">
                    {(play)?<FaPlay title='Playing (Space to change)'/>:<FaPause title='Paused (Space to change)'/>}

                </div>
                {fullscreen? (
                    <BsFullscreenExit
                    onClick={()=>{setFullscreen(p=>!p)}}
                    title='Exit Fullscreen (F)' className="cursor-pointer"  color="white" />
                    
                ):(
                    <BsFullscreen
                    onClick={()=>{setFullscreen(p=>!p)}}
                    title='Fullscreen (F)' className="cursor-pointer"  color="white" />
                    
                ) }
                
            </motion.div>

    )
}