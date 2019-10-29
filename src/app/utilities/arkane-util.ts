import { ArkaneConnect, Wallet, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { AuthenticationResult } from '@arkane-network/arkane-connect/dist/src/connect/connect';

export class ArkaneUtil {

    public static connect: ArkaneConnect;

    static async authenticate(): Promise<AuthenticationResult> {
        try {
            const authResult = await ArkaneUtil.connect.checkAuthenticated()
            return Promise.resolve(authResult)
        } catch {
            await Promise.reject()
        }
    }

    static async getAeWallet(): Promise<Wallet> {
        const authResult = await this.authenticate()

        return new Promise<Wallet>((resolve, reject) => {

            authResult
            .authenticated(async(auth) => {
                try {
                    const wallets = await ArkaneUtil.connect.api.getWallets()
                    const aewallet = wallets.filter((x) => {
                        x.secretType == SecretType.AETERNITY
                    })[0]

                    if(aewallet != undefined) {
                        resolve(aewallet)
                    } else {
                        ArkaneUtil.connect.manageWallets("AETERNITY")
                    }
                } catch {
                    reject("Cannot fetch wallets")
                }
            })
            .notAuthenticated(async(auth) => {
                const authResult = await ArkaneUtil.connect.flows.authenticate()
                const wallet = await this.getAeWallet()
                resolve(wallet)
            })
        })
    }

    static async signTx(txData: string) {
        const wallet = await ArkaneUtil.getAeWallet()
        const signer = ArkaneUtil.connect.createSigner(WindowMode.POPUP)
        const signedTx = await signer.signTransaction({
            walletId: wallet.id,
            type: SignatureRequestType.AETERNITY_RAW,
            data: txData
        })
        console.log("SIGNED TX:", signedTx)
    }


   
}