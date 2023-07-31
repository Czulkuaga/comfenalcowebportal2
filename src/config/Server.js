const production = true

let urlLocal = `http://localhost:5000`
// let urlRemote = `https://comfenalcoapi.conextec.com.co`
// let urlRemote = 'http://172.30.1.31:9080'

let urlRemote = 'https://app-serviciosqa.comfenalcoantioquia.com'

let URLServer = production ? urlRemote : urlLocal

export default URLServer