import { useEffect, useState } from "react";
// import { FeedBack } from "../components(JS)/feedback";
import { NewProjectScreen } from "./newProjectScreen";
import { useParams } from "react-router-dom";

export function Menu(){
    const [shownewprojectform, setshownewprojectform] = useState(false)
    

    return (
        <>
        <div className="menu w-full h-screen bg-[#000000]">
            <div className="text w-full p-8 px-10">
                <div 
                onClick={()=>{
                    setshownewprojectform(true)
                }}
                className="text-[#fff] my-2 cursor-pointer">New File</div>
                <div className="text-[#fff] my-2 cursor-pointer">Load</div>
                {/* <FeedBack placeholder='Title Project: ' /> */}
                {shownewprojectform && (<NewProjectScreen setshow = {setshownewprojectform} />)}
            </div>
        </div>
        </>
    )
}