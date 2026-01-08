import { useState } from "react"
import { BiArrowToLeft, BiFolder } from "react-icons/bi"
import { HiVariable } from "react-icons/hi"

export function VarHandler({varHandler, setVarHandler}){
    let pos = varHandler.pos || {x: 0, y: 0}
    const [options, setOptions]= useState([])
    const [pages, setPages] = useState(4)
    const [node, setnode] = useState(undefined)
    return (
        <div
        style={{top:`${pos.y}px`, left:`${pos.x}px` }} 
        className="w-[10rem] p-2 rounded-sm backdrop-blur-2xl  bg-blue-600/20 absolute z-10">
            {!options?.length? (varHandler.varhandler.nodes || []).map(node=>{
                return <Option src={node.src} name={node.name()} cb={()=>{
                    setOptions([...node.folders, ...node.vars])
                    setnode(node)
                }}/>
            }):null}
            {options?.length? (
                <div 
                style={(node)?{backgroundImage: `url(${node})`}:{}}
                className="bg-blue-600/20 px-2 py-7  backdrop-blur-[4px] top-0 left-0 w-full h-fit max-h-[10rem] overflow-y-auto scrolly">
                    <div 
                    onClick={()=>{setOptions([])}}
                    className="absolute w-fit h-full top-2  left-2 cursor-pointer">{<BiArrowToLeft/>}</div>
                    <div className="content flex flex-col gap-2 items-start justify-start w-full h-full">
                        {(options || []).map(option=>{
                            let type= (option?.type)?option.type : 'folder'
                            const name = (option.name)?option.name():'option unknown'
                            if(type === `folder`)
                            return <Option2 name={name} src={`${node.src}`} type={`folder`} cb={()=>{
                                setOptions([...option.folders, ...option.vars])
                            }}/>
                            else if(type === `boolean`)
                            return <Option2 name={name} src={`${node.src}`} type={`conditions`} cb={()=>{varHandler.cb(option, node); setVarHandler(null)}}/>
                            else if(type === `functions`)
                            return <Option2 name={name} src={`${node.src}`} type={`functions`} cb={()=>{varHandler.cb(option, node); setVarHandler(null)}}/>
                            else
                            return <Option2 name={name} src={`${node.src}`} type={`variables`} cb={()=>{varHandler.cb(option, node); setVarHandler(null);}}/>
                            
                            })}
                    </div>
                    <div className="pages w-full p-2 flex mt-2 gap-2 justify-center items-start overflow-x-auto scrollx">
                        {[...Array.from({length:pages}).map((e, k)=>{
                            return (
                                <div c
                                className="text-white text-[.8rem] shrink-0 bg-white/20 border border-white/20 rounded-sm w-6 h-6 flex justify-center items-center "
                                >{k + 1}</div>
                            )
                        })]}
                    </div>
                </div>
            ):null}
        </div>
    )
}
export function Option({name, src, cb=()=>{}}){
    return (
        <div 
        onClick={()=>{cb()}}
        className="w-full p-2 flex justify-start cursor-pointer capitalize gap-2 items-center text-[.7rem]">
            {src && (
                <img src={src} className="w-5 h-5 rounded-sm" alt="" />
            )}
            <div className="name">{name}</div>
        </div>
    )
}
export function Option2({name,type, src, cb=()=>{}}){
    return (
        <div 
        onClick={()=>{cb()}}
        title={(type === `folder`)?`open ${name} folder`:`type is ${type}`}
        style={(src)?{backgroundImage:`url(${src})`}:{}}
        className="w-full p-2 border border-white/30 rounded-2xl flex justify-between cursor-pointer capitalize gap-2 items-center text-[.7rem]">
            <div className="name">{name}</div>
            {type === `folder` && (<BiFolder className="opacity-[.5]" size={17}/>)}
            {type === `conditions` && (
                <div className="opacity-[.5] text-[.6rem]">i/o</div>
            )}
            {type === `variables` && (<HiVariable className="opacity-[.5]" size={17}/>)}
            
        </div>
    )
}