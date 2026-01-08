import { motion, useScroll } from "framer-motion"
import { useState } from "react"
import { BiPlay } from "react-icons/bi"
import { BsArrowDown } from "react-icons/bs"

export function CollideSpriteSideBottom({object, Tile, ref}){
    
    const props = [
        {name: `angle`, oninput: (value)=>{
            console.log(Tile)
            // Tile.angle = +(value)
        }, type:"range", min: 0, max: 0.1, step: 0.0001},
    ]
    const [open, setOpen] = useState(false)
    if(!object.propsavailable())return <></>
    else return (
        <motion.div
        animate={(open)?{translateY: `0`}:{translateY:`80%`}}
        className="w-1/4 bg-black/30 border text-white/70 p-2 overflow-x-hidden backdrop-blur-2xl right-0 bottom-0 rounded-sm border-white/10  absolute h-1/2 overflow-y-auto scrolly">
            <div 
            className="flex sticky top-0 left-0 backdrop-blur-2xl bg-black/70 rounded-2xl z-10 justify-between items-center p-2 py-1">
                <div 
                onClick={()=>{setOpen(p=>!p)}}
                className="name">{object?.image?.name || `Image`}</div>
                <div className="replay cursor-pointer p-1 rounded-[50%] bg-white/20 w-fit h-fit" onClick={()=>{object.replay}}><BiPlay /></div>
            </div>
            <img src={object?.image?.src} className="max-w-[150px] my-4 max-h-10" alt="" />
            <div className="props p-2 border border-white/30 my-4  relative rounded-2xl">
                <div className="name capitalize absolute left-1 top-0 p-2 bg-black/30 text-[.6rem] translate-y-[-60%]">props</div>
                <div className="content flex flex-col w-full p-2 gap-4 justify-start items-start">
                    {
                        props.map((p, key)=>{
                            return (
                                <div key={`colidtiitktitki-${key}`} className="flex justify-between items-center ">
                                    <div  className="nam text-[.6rem] capitalize">{p.name}</div>
                                    <input type={p.type} className="bg-white/30 w-1/2" min={(p.min || 0)} step={(p.step || 0)} max={(p.max || 0)} onInput={(e)=>{p.oninput(e.target.value)}} name="" id="" />
                                </div>
                            )
                        })
                    }
                </div>
                
            </div>
            <div className="props p-2 border border-white/30 my-4  relative rounded-2xl">
                <div className="name capitalize absolute left-1 top-0 p-2 bg-black/30 text-[.6rem] translate-y-[-60%]">frames</div>
                <div className="content flex flex-wrap w-full p-2 gap-2 justify-center items-center">
                    {
                        [...Array.from({length:object.nx * object.ny})].map((p,x)=>{
                            return (
                                <div 
                                onClick={()=>{
                                    object.replayfromframe(x)  
                                }}
                                style={{opacity: (object.currentclip && x < object?.currentclip?.from || x > object?.currentclip?.to)?`0.6`: `1`}}
                                key={`collidepsitekk${x}`} className="flex bg-white/20 rounded-md text-[.7rem] w-10 h-10 cursor-pointer justify-center items-center ">
                                    {x + 1}
                                </div>
                            )
                        })
                    }
                </div>
                
            </div>  
        </motion.div>
    )
}