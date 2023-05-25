import { WalletType } from "@venly/connect";

export async function ImportWalletWithPrivateKey(bearerToken: string, pincode: string, importWalletType: string, walletType: WalletType, privateKey:string){
    const body = JSON.stringify({
        importWalletType: importWalletType,
        walletType: walletType,
        pincode: pincode,
        privateKey: privateKey,
    });

    const request = new Request(`${process.env.WALLET_API_EP}/api/wallets/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
        },
        body: body
    });

    const data = await (await fetch(request)).json();
    return data;
}

export async function ImportWalletWithKeystore(bearerToken: string, pincode: string, importWalletType: string, walletType: WalletType, keyStore:string, password: string){
    const body = JSON.stringify({
        importWalletType: importWalletType,
        walletType: walletType,
        pincode: pincode,
        keyStore: keyStore,
        password: password,
    });

    const request = new Request(`https://api-wallet-staging.venly.io/api/wallets/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
        },
        body: body
    });

    const data = await (await fetch(request)).json();
    return data;
}

export async function UserAuthenticate(client_id: string, client_secret: string){
    const body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        body.set('client_id', client_id);
        body.set('client_secret', client_secret);
        // TO DO : replace staging url with real login.venly url
        const request = new Request(`https://login-staging.arkane.network/auth/realms/Arkane/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });
        const result = await (await fetch(request)).json();
        return result.bearerToken;
}

export async function GetUserProfileFromAPI(bearerToken: string){
    const request = new Request(`https://api-wallet-staging.venly.io/api/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        }
    });

    const data = await (await fetch(request)).json();
    return data.result;
}

export async function GetWalletsByUserId(bearerToken: string, userId: string) {
    const request = new Request(`https://api-wallet-staging.venly.io/api/wallets?identifier=user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
        },
    });

    const data = await (await fetch(request)).json();
    return data.result;
} 