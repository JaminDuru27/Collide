export function State({state, object, key,setreload, children}){
    return (
        <div 
        onClick={()=>{object.currentState = (!object.currentState)? state: undefined;setreload(p=>!p);}}
        className="max-h-[12rem] max-w-[10rem] relative overflow-hidden cursor-pointer">
            <div className="w-[10rem] p-2 h-[10rem] relative rounded-2xl bg-[#b2973444] border border-amber-500 " key={`Collidefsmuistatekey${key}`}>
                <div className="transitionbefore"></div>
                <div className="content"></div>
                <div className="transitaionafter"></div>
                {state.isValid() && (
                <div className={`validsign w-5 h-5 rounded-[50%] ${(state?.isValid()?`bg-green-500/60`:`black`)} absolute top-2 outline-4 outline-black/70 right-2 `}></div>
                )}
            </div>
            <div className="name text-[.7rem] capitalize mt-2 text-center w-full">{state.name}</div>

        </div>
    )
}
