import { ArkaneConnect, SecretType, SignatureRequestType, SignerResult, Wallet, WindowMode } from '@arkane-network/arkane-connect';
import { AuthenticationResult } from '@arkane-network/arkane-connect/dist/src/connect/connect';

export class ArkaneUtil {
    public static connect: ArkaneConnect;

    static async getAeWallet(authResult: AuthenticationResult): Promise<Wallet> {
        return new Promise<Wallet>((resolve, reject) => {
            authResult
                .authenticated(async (auth) => {
                    try {
                        const wallets = await ArkaneUtil.connect.api.getWallets();
                        const aewallet = wallets.filter((x, i, arr) => {
                            return x.secretType === SecretType.AETERNITY;
                        })[0];

                        if (aewallet !== undefined) {
                            resolve(aewallet);
                        } else {
                            ArkaneUtil.connect.manageWallets('AETERNITY');
                        }
                    } catch {
                        reject('Cannot fetch wallets');
                    }
                })
                .notAuthenticated(async (auth) => {
                    const newAuthResult = await ArkaneUtil.connect.flows.authenticate();
                    const wallet = await this.getAeWallet(newAuthResult);
                    resolve(wallet);
                });
        });
    }

    static async signTx(txData: string): Promise<string> {
        try {
            const arkaneAuthResult = await ArkaneUtil.connect.checkAuthenticated();

            const wallet = await ArkaneUtil.getAeWallet(arkaneAuthResult);
            const signer = ArkaneUtil.connect.createSigner(WindowMode.POPUP);
            const signedTx: SignerResult = await signer.sign({
                walletId: wallet.id,
                type: SignatureRequestType.AETERNITY_RAW,
                data: txData
            });
            return Promise.resolve(signedTx.result.signedTransaction);
        } catch (reason) {
            return Promise.reject('Did not sign transaction');
        }
    }
}
