export interface ManageableResource {
    name: string
}

export default interface AppConfig {
    show_server_data: boolean
    show_server_resources: boolean
    resources?: ManageableResource[]
}