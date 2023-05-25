import { useEffect, useState } from 'react'
import { SecretType, VenlyConnect, WalletType } from '@venly/connect';
import { ImportWalletWithKeystore, GetUserProfileFromAPI } from './Venly.ts'
import './App.css';

let venlyConnect;
let venlyAccountID;
let bearerToken;

export default function App() {
  const [isVenlyConnected, setIsVenlyConnected] = useState(false);

  useEffect(() => {
    if (venlyConnect !== undefined && venlyConnect.checkAuthenticated().isAuthenticated) {
      setIsVenlyConnected(true);
    }
  }, []);

  async function GetUserProfile(){
    // venlyConnect.api.getProfile()
    // .then((profile)=>{
    //     alert (JSON.stringify(profile));
    // })
    // .catch((error)=>{
    //     alert (`Error while getting user profile : ${JSON.stringify(error)}`)
    // })
    const res = await GetUserProfileFromAPI(bearerToken);
    console.log(JSON.stringify(res))
  }

  async function InitialiseVenlyConnect(){
    venlyConnect = new VenlyConnect("Testaccount", {environment: "staging"});
    if(!venlyConnect.checkAuthenticated().isAuthenticated)
    venlyConnect.flows.authenticate({ windowMode: 'POPUP' })
    .then((result) => {
      result.authenticated((auth) => {
        venlyAccountID = auth.subject;
        bearerToken = auth.token;
        setIsVenlyConnected(true);
      })
    .notAuthenticated((auth) => {
      alert('not logged in' + auth);
      });
    });
  }

  async function GetUserWallets(){
    // const clientId = (await venlyConnect.flows.getAccount()).auth.clientId;  // Testaccount
    // const userId = (await venlyConnect.api.getProfile()).userId;  // 678306b9-982a-4145-a229-29c255bd8fba
    venlyConnect.api.getWallets()
    .then((wallets)=>{
      alert (JSON.stringify(wallets));
      console.log(JSON.stringify(wallets));
    })
    .catch((error)=>{
      alert (`Error while getting user wallets : ${JSON.stringify(error)}`)
    })
  }

  async function PerformKYC(){
    venlyConnect.flows.performKYC();
  }

  async function UnlinkWallet(){
    const walletIDToUnlink = "2a27ed3e-4eac-4da0-8271-e5d783fb4b53";
    venlyConnect.api.unlink(walletIDToUnlink)
    .then((result)=>{
      console.log(`Wallet ${walletIDToUnlink} successfully unlinked, ${JSON.stringify(result)}`);
    }).catch((error)=>{
      console.log(`Error while unlinking wallet : ${JSON.stringify(error)}`);
    });
  }

  async function ManageWallets(){
    venlyConnect.manageWallets(SecretType.ETHEREUM);
  }

  async function Logout(){
    venlyConnect.logout()
    .then(()=>{
      setIsVenlyConnected(false);
      alert("User is logged out");
    }).catch((error)=>{
      alert(`Error while logging out : ${JSON.stringify(error)}`);
    });
  }

  async function SignMessage(){
    const signer = venlyConnect.createSigner();
    signer.signMessage({
      walletId: '2a27ed3e-4eac-4da0-8271-e5d783fb4b53',
      secretType: SecretType.MATIC,
      data : "To verify that you are the ligitime owner of this wallet : wallet id, please sign this message with your pincode "
    }).then((signerResult)=>{
      if (signerResult.success) {
        console.log(`Wallet has successfully been imported into ${signerResult.result.chain} and has id ${signerResult.result.id}`);
    } else {
        console.warn(`Something went wrong while importing the wallet : ${JSON.stringify(signerResult)}`);
    }
    }).catch((error)=>{
      console.log(`Error while signing message : ${JSON.stringify(error)}`)
    });
  }

  async function ImportWallet(){
    // const signer = venlyConnect.createSigner();
    const keystore = JSON.stringify({"address":"13515419a1dc674a1201e6f39fb9defdb6d232a3","id":"5a36759e-ccf7-4ed1-9636-27187fd6afed","version":3,"crypto":{"cipher":"aes-128-ctr","ciphertext":"e9b122c5a063c06b1c2ec27e2cb8c5e6ddbde4854967b208b4fcb5a734a557c5","cipherparams":{"iv":"6a5138377adb0cbfd27ffb3b4b4eae17"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"7683d66a546903213ede6576df08da5bae4ccd7f0a01f4a748294cadcf0ac106"},"mac":"1b74aae92fe1e085ba2bbc55d703b255e6ecc29edc463da589dc783f0abeea71"}})
    if (!bearerToken) throw new Error("Bearer token is undefined");
    const pinCodeToEncryptNewWallet = "123456";
    const passwordOfKeystore = "123456";
    const res = await ImportWalletWithKeystore(bearerToken, pinCodeToEncryptNewWallet,"ETHEREUM_KEYSTORE", WalletType.WHITE_LABEL, keystore, passwordOfKeystore);
    console.log(JSON.stringify(res));
}

  if(isVenlyConnected)
  return (
    <div className="App">
      <header className="App-header">
        <p> You are connected to Venly wallet : {venlyAccountID} </p>
        <button onClick={SignMessage}> Sign message with pincode </button> <br/>
        <button onClick={GetUserProfile}> Get user profile</button> <br/>
        <button onClick={GetUserWallets}> Get user wallets </button> <br/>
        <button onClick={ImportWallet}> Import a wallet </button> <br/>
        <button onClick={PerformKYC}> Perform KYC </button> <br/>
        <button onClick={UnlinkWallet}> Delete a wallet </button>  <br/>
        <button onClick={ManageWallets}> Manage wallets </button> <br/>
        <button onClick={Logout}> Logout </button>
      </header>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={InitialiseVenlyConnect}> Connect to Venly Wallet </button> <br/>
        <button onClick={InitialiseVenlyConnect}> Connect to Metamask Wallet </button> <br/>
      </header>
    </div>
  );
}
