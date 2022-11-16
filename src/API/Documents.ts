
const URL_JOKE = 'https://webknox-jokes.p.rapidapi.com/jokes/random?minRating=8&maxLength=100'
const URL_SHORT_STORY ="https://shortstories-api.onrender.com"


export async function getShortStory (signal:AbortSignal){
    const options = {
        method: "GET",
        headers: {
            'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
            'X-RapidAPI-Host': 'webknox-jokes.p.rapidapi.com'
        },
        signal:signal

    }
    
    const response = await fetch(URL_SHORT_STORY,options)
    const data = await response.json()
    return data
}