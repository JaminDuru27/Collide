import {motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function NewProjectScreen({setshow}){
    const [title, settitle]= useState('')
    const [message, setMessage]= useState('')
    const nav = useNavigate()
    const [search] = useSearchParams()
    const username = search.get(`username`)
    const id = search.get(`id`)
    useEffect(()=>{
        const y = setTimeout(()=>{
            console.log(id)
        }, 100)
        return ()=>clearTimeout(y)
    }, [])
    async function createProject(){
        try{
            // const api = `http://localhost:5000`
            // const res =fetch(`${api}/api/users/createproject`,
            //     {
            //         method: `POST`,
            //         headers: {'Content-Type': 'application/json'},
            //         body:JSON.stringify({userid:id, projectname: title})
            //     }
            // )
            // const data  = await res.json()
            nav('/editor')
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
            className="top-1/2 p-4 left-1/2 flex justify-between  backdrop-blur-2xl  overflow-hidden z-10 gap-5 relative items-start translate-[-50%] border-2 border-[#ffffff76] rounded-2xl w-[50vw] h-[40vh] absolute"
            >
            <motion.div 
            className="flex flex-col justify-between w-[100%] items-start h-full">
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
        </motion.div>
        </>
    )
}