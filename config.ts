import AppConfig from "./config/app.config.type";
import manifest from './config/manifest'

const appConfig: AppConfig = {

    /**
     * Server View
     */
    show_server_data: true,

    /**
     * Resource View
     */
    show_server_resources: true,
    resources: [
        {
            name: 'LegacyFuel'
        }
    ]
}

export {
    appConfig,
    manifest
}