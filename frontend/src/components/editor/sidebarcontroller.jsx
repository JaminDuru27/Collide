import { BsFillGridFill } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri"; 
import { PiPlugsFill } from "react-icons/pi";
import { HiViewGridAdd } from "react-icons/hi";
import { SiDatabricks } from "react-icons/si";
import { Sidebtn } from "./sidebtn";
export function SideBarControllers({mode, sethidside, sethead}){
    return (
        <div className="absolute top-4 left-4 flex flex-col gap-3 z-[1]">
        {mode===`draw` && (
            <>
            <Sidebtn delay={0} onpointerenter={()=>{sethidside(false); sethead(`grid`)}} >
                <BsFillGridFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.1} onpointerenter={()=>{sethidside(false); sethead(`addimage`)}} >
                <RiImageAddFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.2} onpointerenter={()=>{sethidside(false); sethead(`layers`)}} >
                <SiDatabricks color="white" />   
            </Sidebtn>
            </>
        )}
        {mode===`dev` && (
            <>
            <Sidebtn delay={0} onpointerenter={()=>{sethidside(false); sethead(`grid`)}} >
                <BsFillGridFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.1} onpointerenter={()=>{sethidside(false); sethead(`plugins`)}} >
                <PiPlugsFill color="white" />   
            </Sidebtn>
            <Sidebtn delay={.2} onpointerenter={()=>{sethidside(false); sethead(`mods`)}} >
                <HiViewGridAdd color="white" />   
            </Sidebtn>
            <Sidebtn delay={.3} onpointerenter={()=>{sethidside(false); sethead(`layers`)}} >
                <SiDatabricks color="white" />   
            </Sidebtn>
            </>
        )}
    </div>
    )
}