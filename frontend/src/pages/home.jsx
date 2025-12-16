import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { BiPlug } from "react-icons/bi"
import { FaDropbox, FaJava, FaJs } from "react-icons/fa6"
import { MdJavascript } from "react-icons/md"
import { RiHtml5Fill, RiJavascriptFill } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { Intro } from "../components/intro"

export function Home(){
    const cards = [
        {
            src: `/editor/logo.png`,
            title: `Best Editor for PlatFormer and retro games`
        },
        {
            src: `/editor/logo.png`,
            title: `Reliable And Efficient`
        },
        {
            src: `/editor/logo.png`,
            title: `JS export and fast execution`
        },
        {
            src: `/editor/logo.png`,
            title: `JS export and fast execution`
        },
        {
            src: `/editor/logo.png`,
            title: `JS export and fast execution`
        },
        {
            src: `/editor/logo.png`,
            title: `No codingm Just seect plugins and maipulate settings`
        },
        {
            src: `/editor/logo.png`,
            title: `explore out plugins to give yout game funcyionality`
        },
    ]

    const steps =[
        {
            name: 'Signup',
            descr: `get this done in less than 2 mins`
        },
        {
            name: 'create Project',
            descr: `get this done in less than 2 mins`
        },
        {
            name: 'import Images',
            descr: `get this done in less than 2 mins`
        },
        {
            name: 'draw layouts',
            descr: `get this done in less than 2 mins`
        },
        {
            name: 'quick render',
            descr: `quick render`
        },
        {
            name: 'dev mode',
            descr: `quick render`
        },
    ]
    const [toggle, setToggle] = useState(true)
    const time =  useRef(setTimeout(()=>{setToggle(false)}, 4000))

    const nav = useNavigate()
    if(toggle)return <Intro toggle={toggle} setToggle={setToggle} /> 
    else return (
        <div className="w-full fit overflow-y-auto scrolly text-[.7rem] text-[white] bg-[black]  max-h-[100vh]">
        
        <div className="nav p-2 w-full h-fit backdrop-blur-2xl flex justify-between bg fixed"> 
            <div className=" rounded-[.5rem] flex justify-center px-2 py-1 items-center bg-white/10">Go To Editor</div>
            <div className="logo flex justify-between w-fit  items-center gap-2">
                <img src="/editor/logo.png" alt="" 
                style={{width: `calc(2vw + 1rem)`,}}
                className=" backdrop-blur-2xl rounded-[50%]" />
                <div className="text-[#fff] text-[1.2rem] overflow-hidden font-bold opacity-[.7]" >Collide</div>
            </div>
            <div className="wrap flex gap-2">
                <div 
                onClick={()=>{
                    nav(`/register`)
                }}
                className="register rounded-[.5rem] flex justify-center px-2 py-1 items-center bg-white/10">Register</div>
                <div className="login rounded-[.5rem] flex justify-center px-2 py-1 items-center bg-white/10">Login</div>
            </div>
        </div>
        <section
        style={{backgroundImage:`linear-gradient(27deg, black, #ffffff00), url(/editor/pixel-art-1.jpg)`, backgroundSize: `cover`}}
        className="w-full h-[100vh] p-6">
            <p className=" my-[5rem]">
                <span style={{fontSize:`calc(3vw + 1rem)`}} className=" w-1/2 my-2">Bring Imagination to Life with </span>
                <span className="flex justify-start gap-2 text-[1.3rem] border-b-2 w-fit border-amber-100 items-center"><img src="/editor/logo.png" className="w-[5rem] h-[5rem]" alt="" /> Collide</span>
            </p>
            <p className="w-[25vw]">
                Fine Tuned Editor that meets modern wats of creating games faster and a lot more easier if you ask me
            </p>
        </section>
        <section className="w-full h-fit shrink-0 p-2">
            <div className=" text-[2.5rem] text-center capitailze my-8">
                Signup and start creating for free
            </div>
            <div className="text-center my-4 text-[1rem] capitalize">
                create games with great ui and sounds all in one app
            </div>
            <div className="flex w-full  mt-[20vh] p-8 justify-between items-center">
                <div className="left w-1/2 text-[2rem]">
                    <p className="flex justify-between flex-col items-start capitalize">
                        <span className="mb-6 text-blue-400">easy navigation</span>
                        <span className="text-[1.2rem]">
                            easy to understand and get started right away.
                            user friendly layout. Simple and clean for maximum production.
                        </span>
                        <span className="text-[.8rem]  mt-5 ">
                            Export to fully functional 
                            <FaJs size={25} className="my-2"/>
                            <span className="text-[.7rem] opacity-[.7]">only one click away</span>
                        </span>
                    </p>
                </div>
                <div className="right w-1/2 h-[60vh] border-2 ">
                    
                </div>
            </div>
        </section>
        <div className=" text-[2.5rem] text-center capitailze my-8">
            In Just a Few <span className="p-4 rounded-[50%] border-2">Steps</span>        </div>
        <section className="flex w-full flex p-8  justify-center items-end ">
            <div className="steps w-1/2">
                {steps.map((step, x)=>(
                    <div key={`setep${x}`} className ="cursor-pointer capitalize steps shrink-0 flex gap-8  border-l-2 py-20 px-2">
                    <div className="logo w-20 h-full text-[4rem] text-[#ffffff96] shrink-0 p-2 bg-blue-400 rounded-[.1rem]">{`0${x + 1}`}</div>
                    <div className="wrap">
                        <div className="name mb-2 text-[2rem]">{step.name}</div>
                        <div className="descr text-[.9rem]">{step.descr}</div>
                        </div>
                    </div>
            ))}
            </div>
            <div className="img w-1/2 h-[60vh] border-2 rounded backdrop-blur-2xl sticky bottom-0 right-0">

            </div>
        </section>
        <div className=" text-[2.5rem] text-center capitailze my-8">
            Why Should I ChooSe Collide <span className="p-2 px-5 bg-blue-400 rounded-sm">?</span>
        </div>
        <div className="flex flex=col gap-4 justify-center items-center my-30 flex-wrap">
            {cards.map((card, i)=>(
                <div key={`kkcard${i}`} className="card w-[40vw] h-[fit-content] flex justify-start items-center p-2 gap-8 flex-col ">
                    <img src={card.src} alt="" className="w-[20vw] h-[20vw]" />
                    <div className="text-[1.2rem] text-center capitalize text-blue-400">{card.title}</div>
                </div>
            ))}
        </div>
        
        <div className="">
            
        </div>
        <div className=" text-[2.5rem] text-left px-6 capitailze my-8">
            <span className="p-2 flex gap-2 w-fit justify-between items-center px-5 bg-blue-400 rounded-sm">
                Plugins
                <BiPlug />
            </span>
            <p className="text-[1.6rem] text-center opacity-[.8] mt-10">
                Instead of tedious coding plugins are here to save you stress. Its simple and easy to use
                all you have to do is select a plugin to modify any tile and it works.
                Plugins have genre and classes suited for your niche.
            </p>
            
            <section
            style={{backgroundImage:`linear-gradient(to bottom, black, transparent, black), url(/editor/gamebg.jpg)`}}
            className="w-full h-[100vh] p-4 py-19 bg-cover"
            >
                <div className="w-1/2">
                    <h1 className="text-[2rem] mb-5 text-blue-400">KickStart your Gaming Journey</h1>
                    <p className="text-[1.4rem]">
                        <span className="py-1 pr-2 border-b-2 border-blue-400">
                            Start Without Coding
                        </span> 
                        
                        and get ahead of others by simply using this app.
                        Its time to skip all the manual hardwork, Collides got you. <br/>
                        <span className="py-2 border-b-2 border-blue-400">Focus on bringing your world to reality !</span> 
                    </p>
                    <q className="text-[1.2rem] opacity-[.8]">
                        Using Planck Js for advanced collision detection and precision
                        you can bring worlds to life 
                    </q>
                    <div className="p text-right text-[1.2rem]">~ JaminDev</div>
                    <div className="wrao flex gap-2 mt-5">
                        <RiJavascriptFill/> <RiHtml5Fill/>
                    </div> 
                </div>
            </section>
            
            <div className="text-blue-400 capitalize border-b-2 p-2 w-fit my-30">top plugins</div>
            <Plugins/>
        </div>
        <div className="plugins">
            
        </div>
        <div className=" text-[2.5rem] text-left px-6 capitailze my-8">
            <span className="p-2 px-5 bg-blue-400 rounded-sm">FAQs</span>
        </div>
        <Faqs/>
        </div>
        
    )
}
function Plugins(){
    return (
        <div className="w-full p-2 flex justify-start items-start gap-10 flex-wrap">
            <div className="w-[20vw] h-[50vh] relative border-2 rounded-sm">
                <div className="name absolute bottom-0 left-0 bg-white/10 text-[1rem] p-2 backdrop-blur-2xl w-full">w</div>
            </div>
        </div>
    )
}
function Faqs(){
    const [faqs, setFaqs] = useState([
        {
            question: `How Do I Get Started?`,
            answer: `How Do I Get Started?`,
        },
        {
            question: `How Do I Get Started?`,
            answer: `How Do I Get Started?`,
        },
        {
            question: `How Do I Get Started?`,
            answer: `How Do I Get Started?`,
        },
    ])
    return (
        <div className="faqs w-full gap-5 flex flex-wrap justify-between items-start p-2 text-[2rem]">
            {faqs.map((faq, i)=>(
                <div key={`faqs${i}`} className="faq shrink-0 p-5 border-2 w-full rounded-4xl">
                    <div className=" flex mb-8 capitalize w-full flex text-blue-400 justify-between items-center">
                        <p>{faq.question}</p>
                        <FaDropbox 
                        onClick={()=>{
                            const ftemp = {...faq, open: !faq.open}
                            const filter = faqs.filter(f=>f !== faq)
                            setFaqs([...filter, {...ftemp,}])
                        }}
                        className="cursor-pointer" color="white"/>
                    </div>
                    <div 
                    className="text-[1rem]  overflow-hidden">
                    {faq.answer}
                    </div>
                </div>
            ))}
        </div>
    )
}
