import { motion } from "framer-motion";
import { useEffect, useState } from "react"
import { BiMicrochip, BiPlus, BiTrash } from "react-icons/bi";
import { BsKeyboard, BsKeyboardFill } from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa6";
import { GiCancel, GiGamepad } from "react-icons/gi";
import { HiMicrophone } from "react-icons/hi2";
import { ImExit } from "react-icons/im";
import { IoExitOutline } from "react-icons/io5";
import { RiDeleteBin2Fill } from "react-icons/ri";
export function CollideKeyBinderUI({object, Tile}){
    const [refresh, setrefresh] = useState(null)
    useEffect(()=>{object.setrefresh = setrefresh},[])
    return (
        <>
        <motion.div 
        initial={{opacity: 0}}
        animate = {{opacity: 1}}
        transition={{delay: 1, type: `tween`}}
        className="type w-full h-full flex justify-center gap-4 items-center">
            <div style={{background: `linear-gradient(45deg, #000000ba, transparent)`}} 
            className="absolute top-0 left-0 w-full  overflow-y-auto scrolly overflow-x-hidden p-2 flex flex-wrap gap-2 justify-center items-center h-full " >
            {(object.binds || []).map(((bind, x)=>{
                return (
                    <motion.div 
                    key = {`collidsion keybindet ${x}`}
                    initial={{opacity: 0, translateY:`50px`}}
                    animate = {{opacity: 1, translateY:`0`}}
                    transition={{type: `spring`, delay:x * 0.2}}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 1.1}}
                    className="typechoosejeyboard gap-4 shrink-0 relative justify-center p-2 bg-white/10 items-center w-1/4 h-1/2 border-white/20  border-2 rounded-2xl flex"
                    >
                        {<BsKeyboardFill
                        onClick={()=>{object.bind = bind;setrefresh(p=>!p)}}
                        className="opacity-[.3]  cursor-pointer" size={70} />}
                        <div className="w-8 h-8 cursor-pointer rounded-[50%] bg-white/30 absolute flex justify-center items-center top-2 left-2"></div>
                        <input
                        type="text"
                        value={bind.name}
                        onChange={(e)=>{
                            bind.name = e.target.value
                            setrefresh(p=>!p)
                        }}
                        className="w-[70%] h-8 cursor-pointer rounded-lg bg-white/10 px-2 capitalize border-white/10 border text-[.6rem] absolute flex justify-start overflow-hidden items-center bottom-2 left-2"
                        />
                        <div 
                        onClick={()=>{
                            bind.remove()
                            setrefresh(p=>!p)
                        }}
                        className="w-8 h-8 cursor-pointer rounded-[50%] bg-red-500/30 absolute flex justify-center items-center bottom-2 right-2">{<BiTrash color={`rgba(225, 225, 266, 0.6)`}/>}</div>
                    </motion.div>
                )
            }))}
            </div>
            <div 
            onClick={()=>{object.addbind();setrefresh(p=>!p)}}
            className="p-2 px-4 rounded-2xl border-white border cursor-pointer absolute bottom-2 right-2"><BiPlus/></div>
            {object.bind && (<Keyboard object={object} setrefresh={setrefresh}  Tile = {Tile}/>)}

        </motion.div>
        </>
    )
}

export function Keyboard({object, setrefresh, Tile}){
    return (
        <>
        
        <div className="keyboardmain w-[100%] overflow-y-auto scrolly p-2 px-4 h-[100%] bg-black/90 backdrop-blur-2xl absolute translate-[-50%] top-1/2 left-1/2">
        
        <div className="my-4 capitalize  ">keys</div>

        <div className="keys p-2 rounded-2xl flex overflow-x-auto scrollx border my-2 border-white/10">
            {(object?.bind?.keys || []).map((key, x)=>{
                return (
                    <>
                    <div key={`ddkeyvoiadkey-:${x}`} 
                    className="bg-white/70 relative rounded-sm px-2 h-8 flex justify-center items-center text-[1rem] text-bold text-black/90 uppercase"
                    >   
                    <div
                    onClick={()=>{
                        object?.bind?.keys.splice(object?.bind?.keys.indexOf(key), 1)
                        object?.bind?.calcconds()
                        setrefresh(p=>!p)
                    }}
                    className="delete absolute top-0 right-0 translate-y-[-50%] translate-x-[50%] flex justify-center items-center w-4 h-4 rounded-[50%] bg-red border-black bg-black cursor-pointer border-2 text-white/50 bg-red">{<GiCancel/>}</div>
                        {key}
                    </div>
                    {x < object.bind.keys.length -1 && (
                        <div className="pus p-2">{<BiPlus className="text-[#fff]/40"/>}</div>
                    )}
                    </>

                )
            })}
        </div>
        <Record 
        object={object}
        setrefresh={setrefresh}
        />
        
        <div className="w-full">
            <div className="my-4 capitalize ">on key held</div>
            <div className="varibles my-4 overflow-y-auto scrolly w-full gap-2 max-h-50 border-2 flex flex-col justify-start items-start border-dash border-white/20 p-2 rounded-2xl">
                {(object?.bind?.varshold || []).map((v)=>{
                    return (
                        <KeyboardVar object={object} Tile={Tile} setrefresh={setrefresh} v={v}/>
                    )
                })}
            </div>
            <AddVarBtn cb={()=>{
                if(!object.bind)return
                object.bind.addvarhold()
                setrefresh(p=>!p)
            }}/>
        </div>
        
        <div className="w-full">
            <div className="my-4 capitalize ">on key down</div>
            <div className="varibles my-4 overflow-y-auto scrolly w-full gap-2 max-h-50 border-2 flex flex-col justify-start items-start border-dash border-white/20 p-2 rounded-2xl">
                {(object?.bind?.varsdown || []).map((v)=>{
                    return (
                        <KeyboardVar object={object} Tile={Tile} setrefresh={setrefresh} v={v}/>
                    )
                })}
            </div>
            <AddVarBtn cb={()=>{
                if(!object.bind)return
                object.bind.addvardown()
                setrefresh(p=>!p)
            }}/>
        </div>
        
        <div className="w-full">
            <div className="my-4 capitalize  ">on key up</div>
            <div className="varibles my-4 overflow-y-auto scrolly w-full gap-2 max-h-50 border-2 flex flex-col justify-start items-start border-dash border-white/20 p-2 rounded-2xl">
                {(object?.bind?.varsup || []).map((v)=>{
                    return (
                        <KeyboardVar object={object} Tile={Tile} setrefresh={setrefresh} v={v}/>
                    )
                })}
            </div>
            <AddVarBtn cb={()=>{
                if(!object.bind)return
                object.bind.addvarup()
                setrefresh(p=>!p)
            }}/>
        </div>
        
        </div>
        <div 
        onClick={()=>{object.bind = undefined; setrefresh(p=>!p)}} className="absolute   cursor-pointer top-2 right-2"
        ><ImExit /></div>
        </>
    )
}
export function AddVarBtn({cb = ()=>{}}){
    return (
        <div 
        onClick={()=>{cb()}}
        style={{
            background: `linear-gradient(#0b0f1a, #0b0f1a) padding-box, linear-gradient(133deg, #4facfe, #00f2fe) border-box`,
            border: `1px solid transparent`,
            color: `#4facfe`,
            boxShadow: `0 0 1px rgba(79, 172, 254, 0.6), 0 0 14px rgba(79 172, 254, 0.4)`
        }}
        className="addvar flex cursor-pointer justify-between items-center w-fit rounded-lg relative my-4 text-[1rem] capitalize bg-blue-900 gap-3 p-4">
            <BiPlus />
             add variable
        </div>
    )
}
export function KeyboardVar({object, setrefresh, Tile, v}){
    const [variable, setVariable] = useState(v?.variable)
    const [value, setvalue] = useState(v?.value)
    return (
        <div className="var w-full flex justify-start gap-4 items-center text-[.7rem]">
            
            <div 
            onClick={()=>{
                Tile?.showVariables({types: [`conditions`, `events`, `variables`], cb:(variable)=>{
                    setVariable(variable)
                    v.variable= variable
                    v.value = variable.parseinput(variable.get())
                    setvalue(v.value)
                }})
            }}
            className="name  border border-white/20 rounded-lg p-2 capitalize">{(!variable)?`Select Variable`:`${variable.name()}`}</div>
            <div className="">to</div>
            <div className="value  border border-white/20 rounded-lg p-2">
                <input
                value={value} 
                checked={value}
                onChange={(e)=>{
                    if(variable.inputtype === `checkbox`){
                        v.value = variable.parseinput(e.target.checked)
                        setvalue(v.value)
                        console.log(v)
                    }
                }}
                onInput={(e)=>{
                    if(variable.inputtype !== `checkbox`){
                        v.value = variable.parseinput(e.target.value)
                        setvalue(v.value)
                    }
                    
                    
                }}
                type={(variable)?variable.inputtype:"text"}  
                className=" p-2 w-full h-full" />
            </div>
                <div 
                onClick={()=>{
                    v.delete()
                    setrefresh(p=>!p)
                }}
                className="delete cursor-pointer text-red-600">{<RiDeleteBin2Fill size={18}/>}</div>
        </div>
    )
}
export function Record({setrefresh, object}){

    return (
        <div 
        onClick={()=>{
            object.recording = !object.recording
            setrefresh(p=>!p)
        }}
        style={{boxShadow: `0px 0px 12px -3px black`, opacity: object.recording? `.5`: `1`}}
        className="record flex cursor-pointer justify-between border-2 border-white/10 p-4 rounded-lg  items-center">
            <div className="r flex justify-center items-center gap-2">
                <div 
                style={{boxShadow: `inset 0px 0px 39px -1px black`}}
                className="mic w-15 p-2 h-15 border-2 border-white/10 flex justify-center items-center  rounded-[50%]">
                    <FaMicrophone 
                    color = {`rgba(225, 77, 0.4)`}
                    className="w-[70%] h-[70%] "/>
                </div>
                <div className="descr flex justify-between flex-col  items-start ">
                    <div className="gead">Record Key</div>
                    <div className="gead opacity-[.7] text-[.7rem]">Click to record keys</div>
                </div>
            </div>
            <div 
            style={{
                boxShadow: `0 0 8px rgba(225, 77, 77, 0.6), 0 0 20px rgba(225, 77, 0.4)`,
                background: `radial-gradient(circle at top left, #ff6b6b, #c92a2a)`
            }}
            className="rec w-6 h-6  outline  outline-red-400 rounded-[50%] bg-red-500 outline-offset-10  flex"></div>
        </div>
    )
}