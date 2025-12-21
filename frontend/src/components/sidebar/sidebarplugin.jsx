import { useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"

export function SidebarPlugin({collide}){
    const [c, setC] = useState({...collide[`current`]})
    const [currentinfo, setcurrentinfo] = useState(null)
    useEffect(()=>{
        let mounted = true
        const time = setTimeout(()=>{
            if (mounted) setC({...collide[`current`]})
        }, 100)
        return ()=>{
            mounted = false
            clearTimeout(time)
        }
    }, [])
    if(!c)return <></>
    else return (
        <div className="w-full h-full flex relative flex-col justify-start items-center">
            <div className="search z-10 bg-[black]/20 backdrop-blur-[5px] p-2 px-2  flex gap-2 justify-between items-center absolute top-0 left-0 w-full">
                <input type="text" className="p-[.2rem] text-[.7rem] border-2 border-[#ffffff53] w-1/1 rounded-sm"/>
                <BiSearch color="white" className="cursor-pointer"/>
            </div>
            <div className="content w-full flex gap-4 flex-col justify-start items-start h-full overflow-y-auto scrolly">
                {c?.pluginsmodshandler?.genresInfos.map((info)=>
                <>
                    <div 
                    onClick={()=>{
                        if(info.type === `environment`){
                            collide[`current`].addPlugin(info)
                            setC({...collide[`current`]})
                        }
                    }}
                    onMouseEnter={()=>setcurrentinfo({...info})}
                    className="w-full shrink-0 h-[10rem] rounded-sm border-2 overflow-hidden cursor-pointer relative border-white/30 "
                    >
                    <img src={info.thumbnailSource} alt="" className="w-full h-full" />
                    <div className="descr text-amber-400 absolute bottom-0 left-0 text-[.7rem] p-2 w-full bg-black/30  capitalize backdrop-blur-[5px]">{info.name}</div>
                    </div>
                </>
                )}
                
            </div>
            <div className="descr w-full p-2 capitalize  absolute bottom-0 backdrop-blur-[5px] bg-[black]/20 text-[.6rem] opacity-[.5]"
            >
            <div className="content w-full h-1/2 my-1"
            >
                {(currentinfo)?currentinfo.descr:''}
            </div>
            <div className="name text-amber-400 w-full bg-black/30 h-[2px] p-2 capitalize ">
                {(currentinfo)?currentinfo.name:''}
            </div>
            </div>
        </div>
    )
}