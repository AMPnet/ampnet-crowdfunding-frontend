
export module API {
    const APIURL = "http://demo.ampnet.io:8123"

    export function generateRoute(endpoint: string) {
        return APIURL + endpoint;
    }

    export function tokenHeaders() {
        return {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('access_token');
            }
        }
    }

}