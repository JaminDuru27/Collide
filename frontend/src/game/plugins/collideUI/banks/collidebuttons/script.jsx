import { genId } from '../../../../../utils/genid.js'
import * as Buttons from './exports.js'

export function ButtonsPackScript(){
    const res = {
        refs: [],
        name: `Buttons Retro Pack`,
        author: `Jamin`,
        descr: `Build Cool Retri Ganes with this starter pack. Fast UI Loading. Modern Look`,
        thumbnailSource: `/plugins/ui2thumb.jpg`,
        id: `kokf893j2hfh28h2f82h/Collide-1122334455`,//id is id/enfineid for verification 
        updaterefs(){
            for(let x in Buttons){
                const element = Buttons[x]
                console.log(element,`element`)
                this.refs.push({info:Buttons[x].prototype.info(), element})
            }
        },

        load(){
            this.updaterefs()
        },
    }
    res.load()
    return res
}
