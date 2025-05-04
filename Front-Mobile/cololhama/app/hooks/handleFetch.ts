export const handleFetch = async (url: string, method: string, body?: Object): Promise<Object | boolean> => {
    let r = await fetch(url, {method, body: (body ? JSON.stringify(body) : undefined), headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }})

    if(!r.ok){
        return false
    } else {
        return (await r.json())
    }

}