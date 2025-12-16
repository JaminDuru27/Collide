export async function createProject(data, cb = ()=>{}){
    const api = `http://localhost:5000`
        
    await fetch(`${api}/api/users/createProject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({projectdata:data}),
        credentials: 'include' // Send cookies with request
    }).then(()=>{cb()})
}