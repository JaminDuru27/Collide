import { useEffect, useState } from "react";
// import { FeedBack } from "../components(JS)/feedback";
import { NewProjectScreen } from "./newProjectScreen";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BiFile, BiFolder, BiLoader } from "react-icons/bi";
import { BsSave } from "react-icons/bs";
import { getProfile } from "../utils/getProfile";
import { motion } from "framer-motion";
export function Menu(){
    const [userData, setUserData] = useState(null)
    const [news, setNews] = useState([])
    const [message, setMessage] = useState(``)
    const [shownewprojectform, setshownewprojectform] = useState(false)
    const nav = useNavigate()
    const [search] = useSearchParams()
    const mode = search.get(`mode`)
    useEffect(()=>{
        const time = setTimeout(async()=>{
            if(mode !== `visit`)
            getProfile((data)=>{
                if(!data)setMessage(`Something went wrong please login`)
                setUserData(data)
                setNews([
                    {text:`Welcome Jamin`},
                    {text:`Last Login At ${data.lastLogin}`},
                    {
                        text:`${data.username} Get Started With Collide. Create the best world you can dream of`,  
                        url:`/backend/logo.png`,
                        button: {text:`Start Tutorial`, url:`/`},
                    },
                ])
            })
            else setMessage(`On Visiting Mode, Register To Never Loose Progress`)

        }, 100)
        return ()=>clearTimeout(time)
    },[])
    return (
        <>
        <div className="menu w-full h-screen bg-[#000000]">
            <div className="nav flex justify-between items-center p-4 w-full text-white">
                <div className="logo flex items-center gap-2">
                    <img src="/editor/logo.png" className="w-[3rem]" alt="" />
                    <div className="">Collide</div>
                </div>
                <div className="btns flex text-[.4rem] sm:text-[.8rem] gap-2">
                    <div className="Home flex justify-center items-center bg-[#fff]/10 cursor-pointer rounded-sm px-2 py-1">Home</div>
                    <div className="Templates flex justify-center items-center bg-[#fff]/10 cursor-pointer rounded-sm px-2 py-1">Templates</div>
                    <div className="Home flex justify-center items-center bg-amber-300/10 cursor-pointer rounded-sm px-2 py-1">Watch Tutorials</div>
                    <div className="shrink-0 flex justify-center items-center rounded-sm bg-blue-400 p-2 px-4 uppercase">{userData?.username[0]}</div>
                </div>
            </div>
            <div className="text-white px-4 color text-[.7rem]">{message}</div>
            <div className="text flex w-full h-fit p-8 px-10">
                <div className="w-1/2">
                    <div 
                onClick={()=>{
                    nav(`/newproject?mode=${mode}`)
                }}
                style={{width: `clamp(100px , calc(30vw + 1rem), 300px)`, fontSize:`calc(1vw + .5rem)`, height: `calc(20vw + 1rem)`}}
                className="h-[5rem] flex flex-col gap-4 text-[.5rem] opacity-[.5] items-center justify-center rounded border-2 text-[#fff] my-2 cursor-pointer">
                <BiFile className="" size={20}/>
                New Project
                </div>
                <div
                style={{width: `clamp(100px , calc(30vw + 1rem), 300px)`, fontSize:`calc(1vw + .5rem)`, height: `calc(20vw + 1rem)`}}
                className="h-[5rem] flex flex-col gap-4 text-[.5rem] opacity-[.5] items-center justify-center rounded border-2 text-[#fff] my-2 cursor-pointer">
                <BiFolder size={20}/>
                Load Project
                </div>
                </div>
                <div className="border-2 overflow-y-auto  flex-col scrolly relative flex gap-2 justify-start items-start p-4 overflow-x-hidden border-white/50 w-1/2 rounded-sm">
                    {news.map((news, x)=>{
                        return !news.url?(
                            <div key={`news${x}`} className="shrink-0 text-white/50 bg-white/10 rounded-2xl p-4 capitalize px-2 w-full">{news.text}</div>

                        ):(
                            <div key={`news${x}`} className="text-white/50 shrink-0 bg-white/10 rounded-2xl p-4 capitalize px-2 w-full h-fit">
                                <img src={news.url} className="w-full h-[10rem] rounded-sm mb-4" alt="" />
                                <div  className="mb-4">{news.text}</div>
                                {news.button && (
                                    <motion.a 

                                    whileHover = {{background: `#f9f1f153`}}
                                    href={`${news.button?.link ?? `#`}`} className="p-2 text-[.7rem] border-2 rounded-sm">{news.button.text}</motion.a>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* <FeedBack placeholder='Title Project: ' /> */}
            </div>
        </div>
        </>
    )
}