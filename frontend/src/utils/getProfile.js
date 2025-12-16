export async function getProfile(cb){
    try{
        const api = `http://localhost:5000`
        
        const res = await fetch(`${api}/api/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Send cookies with request
        })
        
        const data = await res.json()
        if (data.success) {
            cb(data.data)
        } else {
            cb(null)
            console.error('Profile fetch failed:', data.message)
        }
    } catch(err) {
        console.error('getProfile error:', err)
    }
}