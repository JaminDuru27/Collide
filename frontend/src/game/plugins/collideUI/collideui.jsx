import { CollideUIUI } from "./collideuiui.jsx"
import { Element } from "./components/element.jsx"
import * as Banks from './exports.js'
export default function CollideUI(){
    const res = {
        banks: [],
        selectedBanks: [],
        targetElement:[],
        elements:[],
        updateBanks(){
            this.banks = []
            for(let x in Banks){
                const info = Banks[x]()
                info.onselect = ()=>{
                    const find = this.selectedBanks.find(b=>b.id === info.id)
                    if(!find){
                        this.selectedBanks.push(info)
                        // this.setrefresh(p=>!p)
                        this.targetBank = info
                    }
                }
                this.banks.push(info) 
            }
        },
        addElement(data){
            const bank = this.targetBank
            const element = bank.refs.find(e=>e.info.id === data.id)
            if(data.type === `element`){
                const e = Element()
                e.position = {x: data.x, y: data.y}
                e.data = data
                e.ref = element.element
                this.elements.push(e)
            }
        },

        load(){
            this.updateBanks()
            this.ui = CollideUIUI
            console.log(`cllideui`)
        }
    }
    res.load()
    return res
}
