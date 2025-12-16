export function CollideBody(){
    const res = {
        name:`CollideBody`,
        load(){
            console.log(`cllideui`)
        }
    }
    res.load()
    return res
}
CollideBody.prototype.info = ()=> ({
    name: `CollideBody`,
    thumbnailSource: `/plugins/collide1thumb.png`,
    descr: 'Bring Characters into the world with this exciting plugin',
    type: `tile`,
})