import {motion} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function NewProjectScreen({setshow}){
    const [title, settitle]= useState('')
    const [message, setMessage]= useState('')
    const nav = useNavigate()
    const templateId = useRef(0)
    async function createProject(){
        try{
            nav(`/editor?templateId=${templateId[`current`]}&projectName=${title}`)
        }catch(err){
            setMessage(err)
        }
    }
    return (
        <>
        <motion.img 
        src="/menu/forage.jpg" alt="" className="w-full h-full absolute top-0 left-0" />

        <motion.div 
        className="w-full h-screen text-[#fff] absolute top-0 left-0 bg-[rgba(0,0,0,.9)]"
        >
            
            <motion.div 
            initial={{y:50, opacity:0}}
            animate={{y:0, opacity: 1}}
            transition={{type:'spring', duration: .6, damping:10, }}
            className="top-1/2 p-4 left-1/2 flex flex-col sm:flex-row justify-between  backdrop-blur-2xl  overflow-hidden z-10 gap-5 relative items-start translate-[-50%] border-2 border-[#ffffff76] rounded-2xl w-[50vw] h-[50vh] absolute"
            >
            <motion.div 
            className="flex flex-col gap-4 justify-between w-[100%] items-start h-full">
                <h1 className='text-[1.5rem] opacity-[.4]'>New File</h1>
                <input 
                className='p-1 w-full rounded-2xl border-2 border-[#ffffff59]' 
                type="text"
                 value={title} onInput={(e)=>{settitle(e.target.value)}} />
                <div className="flex items-center justify-end gap-5 w-full">
                    <button
                    onClick={()=>{
                        setshow(false)
                    }}
                    className="text-white cursor-pointer p-2 rounded-2xl capitalize ">cancel</button>
                    <button
                    onClick={()=>{
                        createProject()
                    }}
                    className="text-black cursor-pointer bg-white rounded-2xl capitalize border-2 border-white p-2 ">create</button>
                </div>                
            </motion.div>
            
            </motion.div>
            <div className="w-full absolute top-0 right-0 mr-2 sm:w-[20vw] h-screen opacity-[.8]">
            <div className="flex w-full justify-between items-center">
            <div className="t border-b-2 w-fit mb-2 my-2">Templates</div>
            <div className="capitalize text-[.  8rem] opacity-[.7] cursor-pointer">veiw all</div>
            </div>
            <div className="content p-2 border-2 h-[90%] overflow-y-auto scrolly w-full rounded-sm"></div>
            </div> 
        </motion.div>
        </>
    )
}