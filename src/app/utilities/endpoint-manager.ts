
export module API {
    const APIURL = "https://api.ampnet.io"

    export function generateRoute(endpoint: string) {
        return APIURL + endpoint;
    }

    export function generateComplexRoute(endpoint: string, path: string[]) {
        return APIURL + endpoint + "/" + path.reduce((a, b) => {
            return a + "/" + b
        });
    }

    export function tokenHeaders() {
        return {
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('access_token')
            }
        }
    }

}