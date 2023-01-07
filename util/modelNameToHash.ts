import fetch from 'node-fetch'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default async(modelName: string) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {

        const result = await fetch("https://dalr.ae/GTA5Hasher/", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": "https://dalr.ae/GTA5Hasher/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `HashKey=${modelName}&submit=Create+Hash`,
            "method": "POST",
            // @ts-ignore
            "mode": "cors",
            "credentials": "omit"
        });
        
        const html = await result.text()
        
        const splited = html.split('\n')
        const lastRow = splited[splited.length-1]
        
        const modelHash = lastRow.split('readonly value="')[1].replace('">', '')
        
        return Number(modelHash)
    } catch(err) {
        return false
    }
}