export function SelectJSONFile(cb){
    const a = document.createElement(`input`)
    a.type = `file`
    a.accept  = `.json`
    a.onchange = (e)=>{
        const filesDatas = [] 
        const file = e.target.files[0]
        if(!file)return
        const reader = new FileReader()
        reader.onload = (e)=>{
            try{
                const jsonData = JSON.parse(e.target.result)
                cb(jsonData)
            }catch(err){console.log(err)}
        }
        reader.readAsText(file)

    }
    a.click()

}