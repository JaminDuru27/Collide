export async function createProject(data, cb = ()=>{}){
    try{
        const api = `http://localhost:5000`
        
        const res = await fetch(`${api}/api/users/createProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({projectdata:data}),
            credentials: 'include' // Send cookies with request
        })
        const d = await res.json()
        cb(d)
    }catch(err){
    }
}