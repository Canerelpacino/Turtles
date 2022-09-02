import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, isconnected } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {
 
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`1 FREE PER WALLET. 0.0052 ETH FOR EXTRA MINTS.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;

    if(mintAmount > 1){
      cost = 5000000000000000;
    }

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Mint successfull!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };
  

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });  
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const connected = () => {
     document.getElementById("connectbtn").style.display = "none";
     document.getElementById("connected-btn").style.display = "flex";
     document.getElementById("mint-text").style.display = "none";
  };

  return (
    <div  style={{scrollBehavior: 'smooth'}}>

      <div className="shake" style={{position: 'fixed', top: '25px', left: '40px'}}>
        <img src="/config/images/twitter_wabbits.png" style={{width: '55px'}}></img>
      </div>
      <div className="shake" style={{position: 'fixed', top: '17px', left: '100px'}}>
        <img src="/config/images/os_wabbits.png" style={{width: '60px'}}></img>
      </div>

      <FirstPage>
       <div className="header">
         <p className="lagune">Welcome to the lagune.</p>
         <a style={{scrollBehavior: 'smooth'}}>
          <button className="mint-ref"  style={{scrollBehavior: 'smooth'}}>DIVE</button>
         </a>
       </div>

       <div className="ocean-box">
          <h2 style={{color: 'black', fontFamily: "Caribbean", textAlign: 'center', fontSize: '48px'}}>THE BIGGEST KILLER IN OCEAN.</h2>
          <p style={{color: 'black', fontFamily: "Caribbean", fontSize: '30px', padding: '24px'}}>Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic which come from longer plastics that have degraded over time.
          Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic.</p>
       </div>

       <div id="mint-text" className="mint-text">
        <h2 style={{color: 'black', fontFamily: "Caribbean", textAlign: 'center', fontSize: '48px'}}>THE BIGGEST KILLER IN OCEAN.</h2>
        <p style={{color: 'black', fontFamily: "Caribbean", fontSize: '30px', padding: '24px'}}>Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic which come from longer plastics that have degraded over time.
        Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic.</p>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
        <div id="connectbtn2" style={{display: 'flex', justifyContent: 'center'}} className="connect-button"
           onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
            }}
                        
            >
            CONNECT
        </div>
        </div>
       </div>


      <div id="connectbtn" style={{display: 'flex', position: 'fixed', top: '22px', right: '30px', justifyContent: 'center'}} className="connect-button"
           onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
            }}
                        
            >
            CONNECT
        </div>

        <div id="connected-btn" style={{display: 'none', position: 'fixed', top: '35px', right: '50px'}} className="connected-button"    
            >
            CONNECTED
        </div>
      
      <div className="mint2">
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--primary-text)", fontFamily: 'Caribbean' }}
                  >
                    SOLD OUT
                  </s.TextTitle>
                  <s.SpacerSmall />
                </>
              ) : (
                <>
                  <s.SpacerXSmall />
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.SpacerSmall />
                      
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--primary-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                    <div onLoad={connected()}></div>
                      <div style={{overflow: 'hidden', boxSizing: 'border-box', display: 'block'}}>
                        <p id="text-box" style={{color: '#000', visibility: 'inherit', maxWidth: '29ch', display: 'inline-block', marginBottom: '1em', margin: 0, 
                        fontFamily: "Caribbean", fontSize: '30px', lineHeight: '2rem', 
                        marginBlockStart: '0em', marginInlineStart: '50px', marginInlineEnd: '50px'}}>
                                    {feedback}
                        </p>
                      </div>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <btn id="roundbtn" className="round-button"
                          style={{fontFamily: 'Caribbean'}}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </btn>
                        <s.SpacerMedium />
                        <s.TextDescription id="mint-amount"
                          style={{
                            fontSize: '60px',
                            textAlign: "center",
                            color: "var(--primary-text)", fontFamily: 'Caribbean',
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <btn className="round-button"
                          style={{fontFamily: 'Caribbean'}}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </btn>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <div className="mint-button"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                          {claimingNft ? "MINTING..." : "MINT"}
                        </div>
                      </s.Container>
                    </>
                  )}
                </>
              )}
          </div>
      </FirstPage>
    </div>
  ); 
}

export const FirstPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 490vh; 
minWidth: 100%;
background-image: url("/config/images/canerelpacino.jpg");
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
}
`;

export default App;
