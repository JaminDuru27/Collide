import { updateProject } from "../../utils/updatproject"

export function State(Collide, sets){
    const res = {
        load(){
            Collide.shortcuts.add(`1`).cb(()=>{
                const save =this.save()
                updateProject(save, ()=>{})
                console.log(`saved`)
            })
            Collide.shortcuts.add(`control`, `z`).cb(()=>{
                this.undo()
            })
            Collide.shortcuts.add(`control`, `y`).cb(()=>{
                this.do()
            })
        },
        maxlength: 10,
        index: 0,
        stages: [],
        indexlength: 0,
        undo(){
            this.index -= 1 
            if(this.index <= 0) this.index = 0
            if(this.stages[this.index])
            this.revert(this.stages[this.index])
        },
        do(){
            this.index += 1
            if(this.index >= this.stages.length -1) this.index = this.stages.length-1
            if(this.stages[this.index])
            this.revert(this.stages[this.index])
        },
        getprojectname(){return Collide.projectName},
        getprojectgenre(){return Collide.pluginsmodshandler?.currentGenre ?? `All`},
        getprojecttool(){return Collide.tools?.tool.name ?? `Pencil`},
        getLockersDatas(){return Collide.scenes.getLockersDatas()},
        getimagesdatas(){return [...Collide.images.array.map(image=>image.getData())]},
        getprojectmeta(){return {
            EngineId: Collide.engineid,
            Id: Collide.id,
            ProjectName: this.getprojectname(),//project name
            Index: this.stages.length,
            
        }},
        save(stage = true){
            const dataheads = {
                meta: this.getprojectmeta(),
                Genre:this.getprojectgenre(),//game genre
                CurrentTool:this.getprojecttool(),//game tool
                Lockers:this.getLockersDatas(),//bodylayers and image layers
                ImagesDatas:this.getimagesdatas(),//imported images data
            }
            if(stage){
                this.stages.push(dataheads)
                if(this.stages.length > this.maxlength-1)this.stages.shift() 
                this.index = this.stages.length
            }
            return dataheads
        },
        download(){
            const save = this.save(false)
            const string = JSON.stringify(save, null, 2)
            const blob = new Blob([string], {type: `application/json`})
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob); // Create a URL for the Blob
            link.download = save.meta.ProjectName.replace(/\s+/g, ''); // Set the desired file name
            link.click()
        },
        checkMeta(meta){
            if(!meta)return false
            return meta?.EngineId === Collide.engineid
        },
        revert({meta, Genre, CurrentTool, Lockers, ImagesDatas}){
            const metacheck = this.checkMeta(meta)
            if(!metacheck)return
            Collide.projectName = meta.ProjectName
            Collide.tools.setTool(CurrentTool)
            Collide.pluginsmodshandler.loadplugins(Genre)
            Collide.scenes.revertData(Lockers)
            Collide.images.revertData(ImagesDatas)
            sets.setupdateAll(p=>!p)
        },
        clear(){this.stages = []; this.index = 0}
    }
    res.load()
    return res
}