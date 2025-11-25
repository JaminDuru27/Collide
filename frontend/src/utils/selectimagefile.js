export function SelectImageFile(cb){
    const a = document.createElement(`input`)
    a.type = `file`
    a.accept  = `images/*`
    a.multiple = true
    a.onchange = async (e)=>{
        const filesDatas = [] 
        const promiselist = [] 
        for(let x in e.target.files){
            const file = e.target.files[x]
            const data = {name: file.name, size: file.size, type: file.type}
            
            if(file?.type?.startsWith(`image/`)){
                // const promise = new Promise((res, rej)=>{
                    const reader = new FileReader()
                    reader.onload = ()=>{
                        data.url = reader.result
                        filesDatas.push(data)

                        cb(data)
                    }
                    reader.readAsDataURL(file)
                // })
                // promiselist.push(promise)
            }

        }
    }
    a.click()

}