const production = true

let urlLocal = `http://localhost:5000`
let urlRemote = `https://comfenalcoapi.conextec.com.co`

let URLServer = production ? urlRemote : urlLocal

export default URLServer