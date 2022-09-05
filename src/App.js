import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, isconnected } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';


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
    setFeedback(`Have some patience dude...`);
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
        setFeedback("Sorry dude, something went wrong.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Dudeee you got it!!!`
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
     document.getElementById("mintbox").style.display = "none";
  };

  // Scroll Check
  const changeScroll = () => {
    
    const scrollValue = document.documentElement.scrollTop;
    if(scrollValue>1100){
      document.getElementById("oceanbox").style.opacity = "1";
      document.getElementById("oceanbox").style.visibility = "inherit";
      document.getElementById("oceanbox").style.transform = "translate(0px, 0px)";
      document.getElementById("oceanbox").style.transition = "all 1.2s ease-in-out";
    };
    if(scrollValue>2000){
      document.getElementById("mintbox").style.opacity = "1";
      document.getElementById("mintbox").style.visibility = "inherit";
      document.getElementById("mintbox").style.transform = "translate(0px, 0px)";
      document.getElementById("mintbox").style.transition = "all 1.2s ease-in-out";
    }

  }

  window.addEventListener('scroll', changeScroll);

  return (
      <div className="home" id="home">
      {/*Background*/}
      <LazyLoadImage src="/config/images/canerelpacino.jpg" style={{maxWidth: '100%', maxHeight: '100%', position: 'relative'}}></LazyLoadImage>

      {/*Socials*/}
      <a href="https://www.google.com/" target="_blank">
      <LazyLoadImage src="/config/images/tw.png" style={{width: '80px', position: 'fixed', top: '20px', right: '255px', zIndex: '10'}} className="tw"></LazyLoadImage>
      </a>
      <a href="https://www.google.com/" target="_blank">
      <LazyLoadImage src="/config/images/os.png" style={{width: '80px', position: 'fixed', top: '20px', right: '338px', zIndex: '10'}} className="os"></LazyLoadImage>
      </a>
      <a href="https://www.google.com/" target="_blank">
      <LazyLoadImage src="/config/images/etherscan.png" style={{width: '80px', position: 'fixed', top: '20px', right: '423px', zIndex: '10'}} className="etherscan"></LazyLoadImage>
      </a>
      <LazyLoadImage style={{width: '250px', position: 'fixed', top: '15px', right: '15px', zIndex: '10'}} id="connectbtn" className="connect-button" src="/config/images/connect-btn.png"
           onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
            }}           
            >
        </LazyLoadImage>
        <div id="connected-btn" style={{display: 'none', position: 'fixed', top: '45px', right: '50px', color: '#C88D27'}} className="connected-button"    
            >
            CONNECTED
        </div>

      {/*Logo*/}
       <div className="header">
          <LazyLoadImage src="/config/images/logger.png" style={{width: '55%'}}></LazyLoadImage>
       </div>

      {/*Text 1*/}
       <div className="ocean-box" id="oceanbox" style={{opacity: '0', visibility: 'hidden', transform: 'translate(0px, 50px)', transition: 'all 1.2s ease-in-out'}}>
          <h2 style={{color: 'white', fontFamily: "Caribbean", textAlign: 'center', fontSize: '2.7vw', textShadow: '3px 3px black'}}>AN NFT COLLECTION HELPING SEA TURTLES TO SURVIVE.</h2>
          <p style={{color: 'white', fontFamily: "Caribbean", fontSize: '1.8vw', padding: '24px', textShadow: '3px 3px black'}}>Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic which come from longer plastics that have degraded over time.
          Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic.</p>
       </div>

      {/*Text 2*/}
       <div id="mintbox" className="mint-text" style={{opacity: '0', visibility: 'hidden', transform: 'translate(0px, 50px)', transition: 'all 1.2s ease-in-out'}}>
        <h2 style={{color: 'white', fontFamily: "Caribbean", textAlign: 'center', fontSize: '2.7vw', textShadow: '3px 3px black'}}>THE BIGGEST KILLER IN OCEAN.</h2>
        <p style={{color: 'white', fontFamily: "Caribbean", fontSize: '1.8vw', padding: '24px', textShadow: '3px 3px black'}}>Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic which come from longer plastics that have degraded over time.
        Microplastics are a major part of the issue. Microplastics are tiny pieces of plastic.</p>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 0}}>
        <LazyLoadImage id="connectbtn2" style={{width: '260px'}} src="/config/images/connect-btn.png" className="connect-button"
           onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
            getData();
            }}        
            >
        </LazyLoadImage>
        </div>
       </div>
      
      {/*Mint Section*/}
      <div className="mint-section">
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
                              fontFamily: 'Caribbean',
                              textAlign: "center",
                              color: "white",
                              marginTop: '14.5vw'
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
                        <p id="text-box" style={{color: 'white', visibility: 'inherit', maxWidth: '29ch', display: 'inline-block', marginBottom: '1em', margin: 0, 
                        fontFamily: "Caribbean", fontSize: '30px', lineHeight: '2rem', 
                        marginBlockStart: '0em', marginInlineStart: '50px', marginInlineEnd: '50px'}}>
                                    {feedback}
                        </p>
                      </div>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <btn id="roundbtn" className="round-button"
                          style={{fontFamily: 'Caribbean', color: 'white'}}
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
                          style={{fontFamily: 'Caribbean', color: 'white'}}
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
                        <LazyLoadImage src="/config/images/mint.png" className="mint-button"
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                        </LazyLoadImage>
                      </s.Container>
                    </>
                  )}
                </>
              )}
          </div>
      </div>
  ); 
}

export default App;
