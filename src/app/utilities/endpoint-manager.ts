
export module API {
    const APIURL = "http://demo.ampnet.io:8123"

    export function generateRoute(endpoint: string) {
        return APIURL + endpoint;
    }

}