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
    const [contextobject, setcontextobject] = useState(null)
    const [imagecanvas, setImageCanvas] =useState(null)
    const dragelement = useRef(null)
    const [updatedrag, setupdatedrag] = useState(false)
    const collide = useRef({})
    const feedvalueref = useRef(``)
    const [feedinfo, setFeedInfo] = useState({message:`Welcome Back!`, type:'message'})
    const [url, seturl] = useState(null)
    const [bodyfactory,setbodyfactory] = useState(null)
    const [updatetools, setupdatetools] = useState(false) 
    const [updatestats, setupdatestats] = useState(false) 
    const [mergedatas, setmergedatas] = useState([]) 
    const [showsettings, setshowsettings] = useState(false) 
    const [renderlockerscenes, setrenderlockerscenes] = useState(false)
    let handlefeed = ()=>{}
    const canvasoptions = (e, info)=>{
        setcontextobject({
            pos:{x: e?.clientX + 2?? 0, y: e?.clientY + 2??0},
            [`scene`]:[
                {   
                    element: BsLock,
                    name: `lock current scene`,
                    cb:()=>{
                        collide[`current`].scenes.currentLocker.lockScene()
                    }
                },
                {   
                    element: BsUnlock,
                    name: `unlock all scenes`,
                    cb:()=>{
                        collide[`current`].scenes.currentLocker.unlockallscenes()
                    }
                },
            ]
    })}
    
    
    useEffect(()=>{hideside===true?sethead(``):null},[hideside])
    return (
        <>
        <div 
        ref={editorref}
        className="w-full text-[#fff] h-screen bg-[#0f012d] "
        >
            <Canvas
            onmousedown = {(e, info)=>{canvasoptions(e, info)}}
            onClick={()=>{
                sethidside(true)
            }} collideref={collide} 
            gets={{
                feedvalueref, isModified, setisModified, imagecanvas,
                feedinfo, fullscreen, url, selectoptions, mode, play,
                hideside, head, tile, bodyfactory, updatetools
            }}
            sets={{
                setFeedInfo, setFullscreen, seturl, setPlay, setupdatetools,setupdatestats,
                 setMode, setselectoptions, setTile, setbodyfactory,
            }} />
            <Title fullscreen={fullscreen} isModified={isModified}/>
            <DevTools
            showsettings={showsettings} 
            setshowsettings={setshowsettings} 
            mode={mode} 
            play={play} 
            setPlay={setPlay} 
            fullscreen={fullscreen} 
            setFullscreen={setFullscreen} 
            />
            <Draggable dragelement={dragelement} updatedrag={updatedrag}/>
            <SideBarControllers fullscreen={fullscreen} mode={mode} sethead={sethead} sethidside={sethidside} />

            <Sidebar dir="left" hide={hideside} fullscreen={fullscreen} setHide={sethidside} ref={editorref}>
                {(head ===`grid`) && <SidebarGrid  collide={collide} fullscreen={fullscreen} />}
                {(head ===`layers`) && <SideBarLayers  setcontextobject={setcontextobject} setfeedback={setFeedInfo} collide={collide} fullscreen={fullscreen} />}
                {(head ===`addimage`) && <SideBarImage setmergedatas={setmergedatas} dragelement={dragelement} setupdatedrag={setupdatedrag} setcontext={setcontextobject} setfeedback={setFeedInfo}  collide={collide} fullscreen={fullscreen} />}
                {(head ===`scenes`) && <SideBarScenes renderlockerscenes = {renderlockerscenes} setrenderlockerscenes={setrenderlockerscenes}  setmergedatas={setmergedatas} dragelement={dragelement} setupdatedrag={setupdatedrag} setcontext={setcontextobject} setfeedback={setFeedInfo}  collide={collide} fullscreen={fullscreen} />}
            </Sidebar>
            <Tools collide={collide} mode={mode} updatetools={updatetools} setMode={setMode} fullscreen={fullscreen}/>
            <SettingsController setshowsettings={setshowsettings} mode={mode} setMode={setMode} fullscreen={fullscreen}/>
            <ConsolidateUrl mode={mode} seturl={seturl} url={url} setMode={setMode} fullscreen={fullscreen}/>
            <SelectOperations setselectoptions={setselectoptions} selectoptions={selectoptions} collide={collide} mode={mode} setMode={setMode} fullscreen={fullscreen} />
            <Feed valueRef={feedvalueref} fullscreen={fullscreen} infoobj = {feedinfo} collide={collide} setinfoobj={setFeedInfo} />
            <TileOptions tile={tile} collide={collide} setTile={setTile} />
            <ContextMenu contextobject={contextobject} setcontextobject={setcontextobject} />
            <Stats fullscreen={fullscreen} updatestats={updatestats} />
            <BodyFactory collide={collide} setbodyfactory={setbodyfactory} bodyfactory={bodyfactory} />
            <SpriteMerger mergedatas={mergedatas} collide={collide} setmergedatas={setmergedatas} />
            <Settings collide={collide} fullscreen={fullscreen} showsettings={showsettings} setshowsettings={setshowsettings}/>
            <LockerScenes collide={collide} fullscreen={fullscreen} renderlockerscenes={renderlockerscenes}/>
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
import { MdOnlinePrediction } from "react-icons/md";
import { ContextMenu } from "../components/contextmenu";
import { BodyFactory } from "../components/editor/bodyfactory";
import { Stats } from "../components/editor/stats";
import { SpriteMerger } from "../components/editor/merger";
import { Settings } from "../components/editor/settings";
import { SideBarScenes } from "../components/sidebar/sidebarscene";
import { LockerScenes } from "../components/editor/lockerscenes";
import { BsLock, BsUnlock } from "react-icons/bs";

