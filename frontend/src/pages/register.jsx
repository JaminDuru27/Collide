import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "../components/input"
import { IoMdRocket } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export function Register(){
    const [message, setmessage] = useState(null)
    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const nav = useNavigate()
    async function HandleReg(){

        try{
            const url ='http://localhost:5000'

            const res = await fetch(`${url}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            })
            const d= await res.json()
            console.log(d.message)

            if(d.success){
                setTimeout(()=>{
                    nav(`/login`)
                }, 1000)
            }
            
            setmessage({text: d.message, success: d.success})
        }catch(err){
            
        }
    }


    return (
        <div className="w-full overflow-hidden text-[#fff]  h-screen flex justify-center items-center bg-black ">
            <img src="/auth/design1.png" className="absolute top-[40%] left-[20%] w-[15rem] h-[15rem]" alt="" />
            <img src="/auth/design2.png" className="absolute top-[20%] left-[60%] w-[15rem] h-[15rem]" alt="" />
            <img src="/auth/design3.png" className="absolute top-[10%] left-[10%] w-[15rem] h-[15rem]" alt="" />
            <img src="/auth/design5.png" className="absolute top-[40%] left-[60%] w-[15rem] h-[15rem]" alt="" />
            <div className="w-[75%]  sm:w-[40%] p-4  lg:w-[25%] h-[70%] rounded backdrop-blur-2xl  rounded-2xl">
            <div className="w-fill my-2 text-center capitalize text-[2rem]">Register</div>

                <div 
                style={{background: `${message?.success?`green`:`#eb54548d`}`}}
                className="w-full capitalize p-2 px-4 text-black rounded-2xl mb-4">{message?.text}</div>

                <div className="form" >
                    <Input title='name' setvalue={setusername} getvalue={username}/>
                    <Input title='email' setvalue={setemail} getvalue={email} type='email'/>
                    <Input title='password' setvalue={setpassword} getvalue={password} type='password'/>
                </div>
                <div className="btns mt-4 flex justify-start gap-4 items-center">
                    <div 
                    onClick={()=>{nav('/')}}
                    className="cancel p-1 px-4 rounded-2xl border-2 cursor-ponter border-[#fff] text-[#fff] rounded-2xl">cancel</div>
                    <div 
                    onClick={async()=>{HandleReg()}}
                    className="ok flex items-center justify-between cursor-pointer items-center gap-2 p-1 px-4 rounded-2xl bg-[#fff] cursor-ponter text-[#000] rounded-2xl">
                        Register
                        <IoMdRocket size={20}/>
                        </div>
                </div>
            </div>

        </div>
    )
}