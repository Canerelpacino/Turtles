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
  const [feedback, setFeedback] = useState(`THE MINT IS FREE! ANY EXTRA MINTS DO COST 0.0025 ETH.`);
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

    if (mintAmount > 1) {
      cost = 2500000000000000;
    }

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Have some patience...`);
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
          `You got it!!!`
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
    if (newMintAmount > 20) {
      newMintAmount = 20;
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
    document.getElementById("mintbox").style.display = "none";
  };

  // Animations
  const changeScroll = () => {

    const scrollValue = document.documentElement.scrollTop;
    if (scrollValue > 1000) {
      document.getElementById("oceanbox").style.opacity = "1";
      document.getElementById("oceanbox").style.visibility = "inherit";
      document.getElementById("oceanbox").style.transform = "translate(0px, 0px)";
      document.getElementById("oceanbox").style.transition = "all 1.2s ease-in-out";
    };
    if (scrollValue > 2000) {
      document.getElementById("mintbox").style.opacity = "1";
      document.getElementById("mintbox").style.visibility = "inherit";
      document.getElementById("mintbox").style.transform = "translate(0px, 0px)";
      document.getElementById("mintbox").style.transition = "all 1.2s ease-in-out";
    };
  }

  window.addEventListener('scroll', changeScroll);

  return (
    <div style={{ overflowY: 'auto' }}>
      <div className="home" id="home">
        {/*Background*/}
        <img src="/config/images/background.jpg" style={{ maxWidth: '100%', maxHeight: '100%' }}></img>

        {/*Socials*/}
        <a href="https://twitter.com/LoggerHeadsNFT" target="_blank">
          <img src="/config/images/tw.png" style={{ width: '75px', position: 'fixed', top: '20px', right: '245px', zIndex: '10' }} className="tw"></img>
        </a>
        <a href="https://www.google.com/" target="_blank">
          <img src="/config/images/os.png" style={{ width: '75px', position: 'fixed', top: '20px', right: '328px', zIndex: '10' }} className="os"></img>
        </a>
        <a href="https://www.google.com/" target="_blank">
          <img src="/config/images/etherscan.png" style={{ width: '75px', position: 'fixed', top: '20px', right: '412px', zIndex: '10' }} className="etherscan"></img>
        </a>
        <img style={{ width: '231px', position: 'fixed', top: '15px', right: '15px', zIndex: '10' }} id="connectbtn" className="connect-button" src="/config/images/connect-btn.png"
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
          }}
        >
        </img>
        <div id="connected-btn" style={{ display: 'none', position: 'fixed', top: '45px', right: '50px', color: '#C88D27' }} className="connected-button"
        >
          CONNECTED
        </div>

        {/*Logo*/}
        <div className="header">
          <img src="/config/images/logger.png" style={{ width: '55%' }}></img>
          <p style={{ position: 'absolute', top: '31.5vw', color: 'white', fontFamily: "Caribbean", textShadow: '3px 3px black', fontSize: '1.4vw' }}>Sea Turtle Conservancy Donor Wallet:</p>
          <p style={{ position: 'absolute', top: '33.3vw', color: '#C88D27', fontFamily: "Caribbean", textShadow: '3px 3px black', fontSize: '1.4vw' }}>0x1353988a560482462c2e2427B1</p>
        </div>

        {/*Text 1*/}
        <div className="ocean-box" id="oceanbox" style={{ opacity: '0', visibility: 'hidden', transform: 'translate(0px, 100px)', transition: 'all 1.2s ease-in-out' }}>
          <h2 style={{ color: '#C88D27', fontFamily: "Caribbean", textAlign: 'center', fontSize: '2.7vw', textShadow: '3px 3px black' }}>AN NFT COLLECTION HELPING SEA TURTLES TO SURVIVE.</h2>
          <p style={{ color: 'white', fontFamily: "Caribbean", fontSize: '1.8vw', padding: '24px', textShadow: '3px 3px black' }}>Did you know that 52% of the world's sea turtles have eaten plastic waste? And that nearly all species of them are classified as endangered? They are struggling to survive - but they play a crucial role for the health of our oceans and land. Our misson
            is to use the power of community and web3 to help sea turtles to survive.</p>
        </div>

        {/*Text 2*/}
        <div id="mintbox" className="mint-text" style={{ opacity: '0', visibility: 'hidden', transform: 'translate(0px, 100px)', transition: 'all 1.2s ease-in-out' }}>
          <h2 style={{ color: '#C88D27', fontFamily: "Caribbean", fontSize: '2.7vw', textShadow: '3px 3px black' }}>WE ARE DONATING 100% OF OUR SECONDARY FUNDS</h2>
          <div style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
            <p style={{ color: 'white', fontFamily: "Caribbean", fontSize: '1.8vw', textShadow: '3px 3px black' }}>We wanna help. We will help. We decided to donate 100% of our secondary market
              funds to the oldest sea turtle conservancy in the world in Gainesville, FL. The Donation will take place every sunday. Follow our twitter for more information.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '9px', justifyContent: 'center' }}>
            <img id="connectbtn2" style={{ width: '15vw' }} src="/config/images/connect-btn.png" className="connect-button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}
            >
            </img>
          </div>
        </div>

        {/*Mint Section*/}
        <div className="mint-section">
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
              <s.TextTitle
                style={{ textAlign: "center", color: "#C88D27", fontFamily: 'Caribbean', fontSize: "5vw", marginTop: "4vw", textShadow: '3px 3px black' }}
              >
                SOLD OUT!
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
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <div onLoad={connected()}></div>
                  <div style={{ overflow: 'hidden', boxSizing: 'border-box', display: 'block' }}>
                    <p id="text-box" style={{
                      color: 'white', visibility: 'inherit', maxWidth: '29ch', display: 'inline-block', marginBottom: '1em', margin: 0,
                      fontFamily: "Caribbean", fontSize: '30px', lineHeight: '2rem',
                      marginBlockStart: '0em', marginInlineStart: '50px', marginInlineEnd: '50px'
                    }}>
                      {feedback}
                    </p>
                  </div>
                  <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <btn id="roundbtn" className="round-button"
                      style={{ fontFamily: 'Caribbean', color: 'white' }}
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
                        color: 'white', fontFamily: 'Caribbean',
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <btn className="round-button"
                      style={{ fontFamily: 'Caribbean', color: 'white' }}
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
                    <img src="/config/images/mint.png" className="mint-button"
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                    </img>
                  </s.Container>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <FirstPage>

      </FirstPage>

    </div>
  );
}

export const FirstPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 230vh;
minWidth: 100%;
background-image: url("/config/images/background.jpg");
background-position: center center; 
background-repeat: no-repeat;
background-size: 220%; 
text-align: center; 
@media (orientation: landscape) {
  display: none;
}
`;

export default App;
