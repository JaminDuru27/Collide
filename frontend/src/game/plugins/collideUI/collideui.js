export function CollideUI(){
    const res = {
        load(){
            console.log(`cllideui`)
        }
    }
    res.load()
    return res
}
CollideUI.prototype.info =()=> ({
    name: `CollideUI`,
    thumbnailSource: `/plugins/ui2thumb.jpg`,
    descr: 'create visually appealing UIs wih this plugin',
    type: `environment`,
    genre: `All`,
})