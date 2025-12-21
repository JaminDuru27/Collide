const id = `dkokkodsko2jddpk/Collide-1122334455`
const dragdata = {
    id,
    type: `element`
}

export function Buttons2({shouldDrag = true}){
    return (
        <button 
        draggable={shouldDrag ?'true':`false`}
        onDragStart={(e)=>{e.dataTransfer.setData('text', JSON.stringify(dragdata))}}
        className="bg-[purple] p-6 rounded-sm border-2 w-full h-full border-white"
        ></button>
    )
}
Buttons2.prototype.info = ()=>({
    name: `button2`,
    id
})