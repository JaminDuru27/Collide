import { useEffect, useRef, useState } from "react";
import { Canvas } from "../components/canvas";
import { Sidebar } from "../components/sidebar/sidebar";
import { SidebarGrid } from "../components/sidebar/sidebargrid";
import { motion } from "framer-motion";


import { SideBarLayers } from "../components/sidebar/sidebarlayers";
import { SideBarImage } from "../components/sidebar/sidebarimage";
import { Draggable } from "../components/draggable";
import { Feed } from "../components/feed";

export function Editor(){
    const editorref  = useRef(null)
    const [isModified, setisModified]= useState(false   )
    const [mode, setMode] = useState(`draw`) 
    const [play, setPlay] = useState(false)
    const [fullscreen,setFullscreen] = useState(false)
    const [hideside, sethidside]  = useState(true)
    const [head, sethead] =useState('')
    const [selectoptions, setselectoptions] = useState(false)
    const [tile, setTile] = useState(null)
    const [imagecanvas, setImageCanvas] =useState(null)
    const collide = useRef({})
    const feedvalueref = useRef(``)
    const [feedinfo, setFeedInfo] = useState({message:`Welcome Back!`, type:'message'})
    const [consolidateurl, setconsolidateurl] = useState(null)
    let handlefeed = ()=>{}

    
    useEffect(()=>{hideside===true?sethead(``):null},[hideside])
    return (
        <>
        <div 
        ref={editorref}
        className="w-full text-[#fff] h-screen bg-[#0f012d] "
        >
            <Canvas onClick={()=>{
                sethidside(true)
            }} collideref={collide} 
            gets={{
                feedvalueref, isModified, setisModified, imagecanvas,
                feedinfo, fullscreen, consolidateurl, selectoptions, mode, play,
                hideside, head, tile,
            }}
            sets={{
                setFeedInfo, setFullscreen, setconsolidateurl, setPlay,
                 setMode, setselectoptions, setTile,
            }} />
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
                {(head ===`grid`) && <SidebarGrid  collide={collide} fullscreen={fullscreen} />}
                {(head ===`layers`) && <SideBarLayers  collide={collide} fullscreen={fullscreen} />}
                {(head ===`addimage`) && <SideBarImage setfeedback={setFeedInfo}  collide={collide} fullscreen={fullscreen} />}
            </Sidebar>
            <Tools collide={collide} mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <SettingsController mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <ConsolidateUrl mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <SelectOperations consolidateurl={consolidateurl} setconsolidateurl={setconsolidateurl} setselectoptions={setselectoptions} selectoptions={selectoptions} collide={collide} mode={mode} setMode={setMode} fullscreen={fullscreen} />
            <Feed valueRef={feedvalueref} fullscreen={fullscreen} infoobj = {feedinfo} collide={collide} setinfoobj={setFeedInfo} />
            <TileOptions tile={tile} collide={collide} setTile={setTile} />
        </div>

        </>
    )
}

import { Title } from "../components/editor/title";
import { DevTools } from "../components/editor/devtools";
import { SideBarControllers } from "../components/editor/sidebarcontroller";
import { Tools } from "../components/editor/tools";
import { SettingsController } from "../components/editor/settingscontroller";
import { ConsolidateUrl } from "../components/editor/consolidateurl";
import { SelectOperations } from "../components/editor/selectoptions";
import { Tile } from "../components(JS)/tile/Tile";
import { TileOptions } from "../components/editor/tileoptions";

