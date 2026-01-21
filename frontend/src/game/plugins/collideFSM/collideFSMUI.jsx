import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiExit, BiPause, BiPlay, BiPlus } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import Select from 'react-select'
import { selectStyles } from "./components/selectdata";
import { State } from "./components/state";
import { VarLab } from "./components/varlab";
import { ConditionLab } from "./components/conditionlab";
import { TransitionLab } from "./components/transitionsLab";
export function CollideFSMUI({object, Tile}){
    const [reload, setreload] = useState(false)
    const [varlab, setvarlab] = useState(null)
    const selectedTransition = useRef(null)
    object.setreload  = setreload
    const condsbtns =[
        {name: `on enter`, v:`on enter conditions`, voptype: [`conditions`, `variables`]},
        {name: `on leave`, v: `on leave conditions`, voptype: [`conditions`, `variables`]}
    ]
    const varssbtns =[
        {name: `on enter`, v:`on variable enter`, voptype: [`conditions`, `variables`, `functions`]},
        {name: `on leave`, v: `on variable leave`, voptype: [`conditions`, `variables`, `functions`]},
        {name: `on update`, v: `on variable update`, voptype: [`conditions`, `variables`, `functions`]}
    ]
    return(
        <div className="text-white w-full h-full relative">
            <motion.div 
            animate={(object.currentState)?{translateX:`0`}:{translateX:`-100%`}}
            style = {{background: `linear-gradient(128deg, #090b1b 12%, #222068 91%)`}}
            className="sidebar w-1/4 h-fill overflow-y-auto scrolly z-10 backdrop-blur-2xl flex flex-col justify-start gap-8 items-start p-2 bg-black/30 backdrop-blur-2xl absolute top-0 left-0 border border-white/30 rounded  h-full">
                 <div className="title w-full border-b px-2 uppercase opacity-[.7] border-white/40 py-2 text-bold text-[.8rem]">Conditions</div>
                {condsbtns.map(({v, name}, key)=>{
                    return (
                        <Navbtn name={name} cb={()=>setvarlab(v)} key={key} />
                    )
                })}
                <div className="title w-full border-b px-2 uppercase opacity-[.7] border-white/40 py-2 text-bold text-[.8rem]">Variables</div>
                {varssbtns.map(({v, name}, key)=>{
                    return (
                        <Navbtn name={name} cb={()=>{setvarlab(v)}} key={key} />
                    )
                })} 
                <div className="title w-full border-b px-2 uppercase opacity-[.7] border-white/40 py-2 text-bold text-[.8rem]">Transitions</div>
                <div className="transitions p-2 border w-full flex justify-star items-start gap-2 flex-col border-white/20 rounded-2xl">
                    {(object?.currentState?.transitions || []).map((t, k)=>{
                        const getref = ()=>Tile?.varHandler?.getvar(t?.ref?.id)
                        const name = getref()?.get()?.name
                        return (
                            <Navbtn name={name?`${name} transition`:`Enter Transition`} delcb={()=>{t.remove(); setreload(p=>!p)}} cb={()=>{selectedTransition[`current`] = t;setvarlab(`transition`)}} key={`dkidk8339002${k}`} />
                        )
                    })}
                </div>
                <Navbtn name={`add transition`} cb={()=>{
                    object.currentState.addNewTransition()
                    setreload(p=>!p)
                }} key={`k99j92`} />
                <div className="title w-full border-b px-2 uppercase opacity-[.7] border-white/40 py-2 text-bold text-[.8rem]">Values</div>
                {object.currentState && (
                    <>
                    <MInput name={`min time in state`} state={object.currentState} v={'mintimeinstate'}/>
                    <MInput name={`min time before start`} state={object.currentState} v={'delaybeforstart'}/>
                    <MInput name={`priority`} state={object.currentState} v={'priority'}/>
                    </>
                )}
            </motion.div>
            <div className="main w-full h-full">
                <div className="content flex flex-wrap gap-4 justify-center w-full h-full items-center gap-5">{
                (object.states || []).map((state, k)=>{
                    return (
                        <State state={state} setreload={setreload} object= {object} key={k}></State>
                    )
                })
                }</div>
                <div 
                onClick={()=>{object.addState(setreload)}}
                className="add absolute px-5 py-2 border-2 border-white/20 rounded-sm cursor-pointer bottom-2 right-2"><BiPlus/></div>
            </div>
            {varlab && object.currentState && 
            <div 
            style={{
                background: `#1a1b55`,
                boxShadow: `inset 0px 0px 317px 2px black`,
            }}
            className="varlab absolute top-0 right-0 w-[75%] h-full p-2 bg-black/80 backdrop-blur-2xl">
            <div 
            onClick={()=>{setvarlab(undefined)}}
            className="exit absolute top-2 right-2 cursor-pointer"><BiExit/></div>
            <div className="name capitalize m-2 text-bold">{varlab}</div>
            <div className="content gap-5 w-full h-[70%] mt-5 p-4 border-2 border-white/10 bg-[#ffffff04] rounded-md overflow-y-auto scrolly flex justify-start items-center flex-col ">
                    {varlab === `on enter conditions` && <ConditionLab object={object} Tile={Tile} voptype= {[`conditions`, `variables`]} targetArray = {`onenterconds`}/>}
                    {varlab === `on leave conditions` && <ConditionLab object={object} Tile={Tile} voptype= {[`conditions`, `variables`]} targetArray = {`onleaveconds`}/>}
                    {varlab === `on variable enter` && <VarLab object={object} Tile={Tile} voptype= {[`conditions`, `variables`, `functions`]} targetArray = {`onentervars`}/>}
                    {varlab === `on variable leave` && <VarLab object={object} Tile={Tile} voptype= {[`conditions`, `variables`, `functions`]} targetArray = {`onleavevars`}/>}
                    {varlab === `on variable update` && <VarLab object={object} Tile={Tile} voptype= {[`conditions`, `variables`, `functions`]} targetArray = {`onupdatevars`}/>}
                    {varlab === `transition` &&  selectedTransition.current && <TransitionLab object={object} transition={selectedTransition} Tile={Tile} voptype= {[`conditions`, `variables`]} targetArray = {``}/>}
            </div>
            </div>}
        </div>
    )
}
export function MInput({name, state, v}){
    const [value, setValue] = useState(state[v])
    return (
        <div className="flex flex-col gap-2 justify-start items-center border-rounded p-2 text-[.7rem] capitalize ">
            <div className="">{name}</div>
            <input type="number" value={value} onChange= {(e)=>{setValue(+(e.target.value));state[v]= +(e.target.value)}} className="rounded-md p-2 text-[.7rem] w-full border border-white/30 " />
        </div>
    )
}

export function Navbtn({cb,name, delcb, key}){
    return (
        <div 
            key ={`jdji8830-d--d:${name}:${key}`}
            onClick={()=>{cb()}}
            style={{boxShadow: `0px 0px 24px -4px #0000009e`}}
            className="onenter flex justify-between items-center text-[.9rem] text-white/70 bg-white/5 capitalize rounded-md  w-full p-2 border border-white/10 flex justify-between items-center">
                <div className="name">{name}</div>
                {delcb && <MdDelete onClick={()=>{delcb()}} className={`cursor-pointer`} color="red"/>}
        </div>
    )
}
export function FSMInput({cs, setreload}){
    const [value, setValue] = useState(cs.name||'')
    return(
        <div className="name mb-4 flex w-full justify-between items-center">
            <div className="name capitalize text-[.7rem]">name</div>
            <input type="text" value={value} onChange={()=>{setreload(p=>!p)}} onInput={(e)=>{cs.name = e.target.value; setValue(e.target.value)}} className="w-1/2 text-[.7rem] p-1 border border-white/20 rounded-2xl" />
        </div>
    )
}
