import { motion, useMotionValue } from "framer-motion"
import { useEffect, useState } from "react"
import { genId } from "../../utils/genid"
import { BsFillGridFill } from "react-icons/bs"

export function SideBarScenes({collide}){
    const [dragging, setDragging] = useState(false)
    const [c, setC] = useState(collide[`current`])
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const Lockers = ()=>c.scenes.lockers
    useEffect(()=>{
        const time = setTimeout(()=>{
            setC({...collide[`current`]})
        }, 100)
        return ()=>clearTimeout(time)
    }, [])
    function startDrag(e, info){
        collide[`current`].scenes.currentLocker.showplacement = true
    }
    function moveDrag(e, info){
        const locker  = collide[`current`].scenes.currentLocker
        if(!locker.currentScene)return
        collide[`current`].mouse.x = info.point.x
        collide[`current`].mouse.y = info.point.y
    }
    function endDrag(e, info){
        const canvas = collide[`current`].canvas
        if(!canvas)return

        const rect = canvas.getBoundingClientRect()
        const point = info.point
        if(
            point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom
        ) {
            const Locker  = collide[`current`].scenes.currentLocker
            const newScene = Locker.add(undefined, false)
            Locker.currentScene.join(newScene, Locker.dir)
        }
        x.set(0)
        y.set(0)
        collide[`current`].scenes.currentLocker.showplacement = false

    }
    return (
        <div className={`lockers max-h-[100%]  scrolly h-full`}>
        <motion.div 
        drag
        dragElastic={0.2}
        dragMomentum={false}
        onDrag={(e, info)=>{moveDrag(e, info)}}
        onDragStart={()=>{startDrag();setDragging(true)}}
        onDragEnd={(e, info)=>{endDrag(e, info);setDragging(false)}}
        whileDrag={{scale: 1.05, opacity:0.8, zIndex:10}}
        style={{x,y}}
        key={`lockercreate`} className={`Locker flex justify-center items-center mb-4  h-[7rem] border-2 border-[#dddddd5e] bg-[#070014] rounded-sm p-2`}>
            <div className="title my-1   mb-2 opacity-[.7] capitalize text-[.8rem]">{}</div>
            <div className={`scenes flex scrollx justify-start items-center`}>
            <BsFillGridFill className="opacity-[.2]" color="white" size={35}/>
            </div>
        </motion.div> 

        {Lockers()?.map((locker, i)=>(
        <div key={`locker`+i} 
        onDoubleClick={()=>{
            collide[`current`].scenes.targetLocker(locker.id)
            setC({...collide[`current`]})
        }}
        style={{borderColor: (c.scenes.currentLocker === locker)?`white`:`transparent`}} 
        className={`Locker border-2 mb-4 border-[#dddddd5e] bg-[${locker.color??'#070014'}] rounded-sm p-2`}>
            <div className="title my-1 mb-2 opacity-[.7] capitalize text-[.8rem]">{locker.name}</div>
            <div className={`scenes flex gap-2 overflow-x-visible overflow-y-hidden scrollx justify-start items-center`}>
                {locker.scenes.map((scene, x)=> <Scene c={c} setC={setC} collide={collide} key={`scene` + x} scene={scene} locker={locker} />)}
            </div>
        </div> 

        ))}
        {/* <div className="Locker bg-[#070014] rounded-sm p-2">
            <div className="title my-1 mb-2 opacity-[.7] capitalize text-[.8rem]">Locker1</div>
            <div className="scenes flex gap-2 overflow-x-auto overflow-y-hidden scrollx justify-start items-center">
                <div className="scene cursor-pointer w-full shrink-0">
                    <canvas className="w-full rounded-sm h-[6rem] border-2 border-[#dddddd3e]"></canvas>
                    <div className="title capitalize opacity-[.7] text-[.7rem] my-1">scene 1</div>
                </div>
            </div>
        </div> */}
        </div>        
    )
}

function Scene({locker, scene,collide,c,setC, key}){
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const [dragging, setDragging] = useState(false)
    function startDrag(e, info){
        collide[`current`].scenes.currentLocker.showplacement = true
    }
    function moveDrag(e, info){
        const locker  = collide[`current`].scenes.currentLocker
        if(!locker.currentScene)return
        collide[`current`].mouse.x = info.point.x
        collide[`current`].mouse.y = info.point.y
    }
    function endDrag(e, info){
        const canvas = collide[`current`].canvas
        if(!canvas)return

        const rect = canvas.getBoundingClientRect()
        const point = info.point
        if(
            point.x >= rect.left &&
            point.x <= rect.right &&
            point.y >= rect.top &&
            point.y <= rect.bottom
        ) {
            const Locker  = collide[`current`].scenes.currentLocker
            if(Locker !== locker){
                const newScene = Locker.add(undefined, false)
                Locker.currentScene.join(newScene, Locker.dir)
            }
            else{console.log(`cannot add to the sname locker`)}
            // scene.delete = true
        }
        x.set(0)
        y.set(0)
        collide[`current`].scenes.currentLocker.showplacement = false

    }
    return (
        <motion.div 
        drag
        dragElastic={0.2}
        dragMomentum={false}
        onDrag={(e, info)=>{moveDrag(e, info)}}
        onDragStart={()=>{startDrag();setDragging(true)}}
        onDragEnd={(e, info)=>{endDrag(e, info);setDragging(false)}}
        whileDrag={{scale: 1.05, opacity:0.8, zIndex:10}}
        key={key} 
        style={{x, y, backgroundImage: ` linear-gradient(to top, transparent, #0d0123)`}}
        className={`scene p-2 pb-0 mb-2 ${(dragging)?`fixed`:`relative`} cursor-pointer w-[10.2rem] shrink-0`}>
            <img className={`w-full rounded-sm h-[6rem] border-2 border-[#dddddd3e]`} />
            <div className="title capitalize opacity-[.7] text-[.7rem] my-1">{scene.name}</div>
        </motion.div>
    )
}