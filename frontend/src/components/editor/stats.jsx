export function Stats({feedback}){
    return(<></>)
    return (
        <div className="text-[.6rem] text-[#fff] capitalize absolute h-fit p-2 w-fit rounded-t-lg  bg-[#4800c059] backdrop-blur-[5px] border-2 border-[#683aaf57] bottom-0 left-1/2 translate-x-[-50%]">
            <div className="wrap flex items-center justify-between gap-[.9rem] w-fit">
                <div className="x shrink-0 w-fit">
                <span className="shrink-0 p-1 px-2 mr-1 bg-[#000]/30 rounded-2xl">Mouse</span> 
                ( X : {statsdata.mx}  Y : {statsdata.my} )</div>

                <div className="x shrink-0"> 
                <span className="p-1 px-2 mr-1 bg-[#000]/30 rounded-2xl">Box</span> 
                ( row : {statsdata.row}  col : {statsdata.col} )</div>
                    
            </div>
            <div className="wrap flex items-center mt-2 justify-between gap-[.9rem] w-fit">
                <div className="x shrink-0 w-fit">
                <span className="shrink-0 p-1 px-2 mr-1 bg-[#000]/30 rounded-2xl">Layer</span> 
                {statsdata.layer}</div>
                <div className="max-w-[140px] p-1 rounded-[.5rem] bg-[#4800c059] backdrop-blur-[5px] border-2 border-[#683aaf57] ">{statsdata.text}</div>
                    
            </div>
        </div>
    )
}