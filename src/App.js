import { useEffect, useState } from 'react'
import { SecretType, VenlyConnect } from '@venly/connect';
import './App.css';

let venlyConnect;
let venlyAccountID;

export default function App() {
  const [isVenlyConnected, setIsVenlyConnected] = useState(false);
  venlyConnect = new VenlyConnect("Testaccount", {environment: "staging"});

  useEffect(() => {
    if (venlyConnect !== undefined && venlyConnect.checkAuthenticated().isAuthenticated) {
      setIsVenlyConnected(true);
    }
  }, []);

  async function InitialiseVenlyConnect(){
    if(!venlyConnect.checkAuthenticated().isAuthenticated)
    venlyConnect.flows.authenticate({ windowMode: 'POPUP' })
    .then((result) => {
      result.authenticated((auth) => {
        venlyAccountID = auth.subject;
        setIsVenlyConnected(true);
      })
      .notAuthenticated((auth) => {
        alert('not logged in' + auth);
      });
    });
  }

  async function GetUserProfile(){
    venlyConnect.api.getProfile()
    .then((profile)=>{
      alert (JSON.stringify(profile));
    })
    .catch((error)=>{
      alert (`Error while getting user profile : ${JSON.stringify(error)}`)
    })
  }

  async function GetUserWallets(){
    // InitialiseVenlyConnect();
    venlyConnect.api.getWallets()
    .then((wallets)=>{
      alert (JSON.stringify(wallets));
    })
    .catch((error)=>{
      alert (`Error while getting user wallets : ${JSON.stringify(error)}`)
    })
  }

  async function LinkWallet(){
    venlyConnect.flows.linkWallets();
  }

  async function UnlinkWallet(){
    const walletIDToUnlink = "";
    venlyConnect.api.unlink(walletIDToUnlink);
  }

  async function ManageWallets(){
    venlyConnect.manageWallets(SecretType.MATIC);
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

  if(isVenlyConnected)
  return (
    <div className="App">
      <header className="App-header">
        <p> You are connected to  Venly wallet : {venlyAccountID} </p>
        <p> Operations </p>
        <button onClick={GetUserProfile}> Get user profile</button> <br/>
        <button onClick={GetUserWallets}> Get user wallets </button> <br/>
        <button onClick={LinkWallet}> Create a wallet </button> <br/>
        <button onClick={UnlinkWallet}> Delete a wallet </button>  <br/>
        <button onClick={ManageWallets}> Manage wallets </button> <br/>
        <button onClick={Logout}> Logout </button>
      </header>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={InitialiseVenlyConnect}> Connect to Venly Wallet </button>
      </header>
    </div>
  );
}
