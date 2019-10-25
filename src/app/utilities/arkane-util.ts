import { ArkaneConnect, Wallet, SecretType, WindowMode, SignatureRequestType } from "@arkane-network/arkane-connect";
import { AuthenticationResult } from "@arkane-network/arkane-connect/dist/src/connect/connect";

export class ArkaneUtil {

    static async createInstance(): Promise<ArkaneConnect> {
        let arkaneConnect = new ArkaneConnect("Arketype", {
            environment: "staging"
        })
        try {
            const arkaneRes = await arkaneConnect.checkAuthenticated()
            try {
                await ArkaneUtil.afterAuth(arkaneRes, arkaneConnect)
                return Promise.resolve(arkaneConnect)
            } catch (reason) {
                return Promise.reject()
            }
        } catch (reason) {
            return Promise.reject()
        }

    }


    static async afterAuth(authResult: AuthenticationResult, connect: ArkaneConnect): Promise<void> {
        authResult
            .authenticated(async (auth) => {
                try {
                    const wallets = await connect.api.getWallets();
                    var aewallet: Wallet;

                    wallets.forEach(element => {
                        if (element.secretType == SecretType.AETERNITY) {
                            aewallet = element
                        }
                    });
                    if (aewallet != undefined) {
                        return Promise.resolve()
                    } else {
                        await connect.manageWallets("AETERNITY")
                        ArkaneUtil.afterAuth(authResult, connect)
                    }
                } catch (reason) {
                    return Promise.reject()
                }
            })
            .notAuthenticated(async (auth) => {
                const authRes = await connect.flows.authenticate()
                ArkaneUtil.afterAuth(authRes, connect)
            })
    }

    static async signTx(txData: string): Promise<void> {
        try {
            const connectInstance = await ArkaneUtil.createInstance()

            const wallets = await connectInstance.api.getWallets();
            var aewallet: Wallet;

            wallets.forEach(element => {
                if (element.secretType = SecretType.AETERNITY) {
                    aewallet = element
                }
            });
            const signingResult = await connectInstance.createSigner(WindowMode.POPUP)
                .sign(({
                    walletId: aewallet.id,
                    data: txData,
                    type: SignatureRequestType.AETERNITY_RAW
                }))
            Promise.resolve();
        } catch (reason) {
            Promise.reject()
        }

    }

}