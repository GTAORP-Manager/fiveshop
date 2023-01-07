import axios from "axios"

export interface CFXStatusData {
    "page": {
        "id": string,
        "name": string,
        "url": string,
        "time_zone": string,
        "updated_at": string
    },
    "status": {
        "indicator": string,
        "description": string
    }
}

export const getCFXStatus = async () => {

    const resp = await axios.get('https://status.cfx.re/api/v2/status.json')

    return resp.data as CFXStatusData 
}