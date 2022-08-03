import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Accordion from 'react-bootstrap/Accordion';


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;


export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
margin: auto;
width: 50%;
  @media (max-width: 600px) {
    width: 90%;
    margin-top: 0;
    margin: auto;
  }
`;

export const StyledLogo2 = styled.img`
width: 35%;
margin: auto;
margin-top: 10vh;
  @media (orientation: portrait) {
    width: 80%;
    margin: auto;
  }
`;


export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const Start = styled.div`
//cursor: url(config/images/ca.png), auto;
`;

function App() {
  
  const changeDisplay1 = () => {
    if(document.getElementById("faqBody1").style.display === "block"){
       document.getElementById("faqBody1").style.display = "none";
       document.getElementById("faqPage1").classList.remove('active');
       
    } else {
      document.getElementById("faqBody1").style.display = "block";
      document.getElementById("faqPage1").classList.add('active');
    }
  }
  const changeDisplay2 = () => {
    if(document.getElementById("faqBody2").style.display === "block"){
       document.getElementById("faqBody2").style.display = "none";
       document.getElementById("faqPage2").classList.remove('active');
    } else {
      document.getElementById("faqBody2").style.display = "block";
      document.getElementById("faqPage2").classList.add('active');
    }
  }
  const changeDisplay3 = () => {
    if(document.getElementById("faqBody3").style.display === "block"){
       document.getElementById("faqBody3").style.display = "none";
       document.getElementById("faqPage3").classList.remove('active');
    } else {
      document.getElementById("faqBody3").style.display = "block";
      document.getElementById("faqPage3").classList.add('active');
    }
  }
  const changeDisplay4 = () => {
    if(document.getElementById("faqBody4").style.display === "block"){
       document.getElementById("faqBody4").style.display = "none";
       document.getElementById("faqPage4").classList.remove('active');
    } else {
      document.getElementById("faqBody4").style.display = "block";
      document.getElementById("faqPage4").classList.add('active');
    }
  }
  const changeDisplay5 = () => {
    if(document.getElementById("faqBody5").style.display === "block"){
       document.getElementById("faqBody5").style.display = "none";
       document.getElementById("faqPage5").classList.remove('active');
    } else {
      document.getElementById("faqBody5").style.display = "block";
      document.getElementById("faqPage5").classList.add('active');
    }
  }

  const [state, setstate] = useState(false);
  const changeScroll = () => {
    
    const scrollValue = document.documentElement.scrollTop;
    if(scrollValue>100){
      setstate(true);
    } else {
      setstate(false);
    }

  }

  window.addEventListener('scroll', changeScroll);


  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click MINT to mint your NFT.`);
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
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
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
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
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


  return (
    <Start>
      <FirstPage>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
          <a href="https://www.google.de/?hl=de">
          <img className="icon" style={{width: '50px', marginRight: '20px', marginTop: '15px'}} src="/config/images/tw.png"></img>
          </a>
          <a href="https://www.google.de/?hl=de">
          <img className="icon" style={{width: '50px', marginRight: '10px', marginTop: '15px'}} src="/config/images/os.png"></img>
          </a>
        </div>
      </FirstPage>


      <SecondPage>
        <HideImage className={state? "left-image-move":"left-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/hero.webp"></img>
          </span>
        </HideImage>
        <HideImage className={state? "right-image-move":"right-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/hero-right.webp"></img>
          </span>
        </HideImage>

        <div className="middle-container" style={{marginTop: '2%'}}>
            <StyledLogo2 src="/config/images/logo.png"></StyledLogo2>
            <div style={{overflow: 'hidden', boxSizing: 'border-box', display: 'block'}}>
              <p style={{visibility: 'inherit', maxWidth: '40ch', display: 'inline-block', marginBottom: '1em', margin: 0, 
              fontFamily: '"Freckle Face", cursive', fontSize: '1.5rem', lineHeight: '1.5rem', 
              marginBlockStart: '1em', marginInlineStart: '50px', marginInlineEnd: '50px'}}>
                          A 2,500 collection of Moon Vamps. You’ll need to have $BLOOD in 
                          your wallet to mint. Each Moon Vamp costs 60 $BLOOD to mint. 
                          If you don’t have enough you will be able to 
                          make up the difference with ETH.
              </p>
            </div>
          <div>
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--primary-text)" }}
                  >
                    SOLD OUT
                  </s.TextTitle>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.SpacerXSmall />
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.SpacerSmall />
                      <div className="connect-button"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT WALLET
                      </div>
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
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--primary-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <div className="connect-button"
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
        </div>
      </SecondPage>
      <div class="slider">
            <div class="slide-track">
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
            </div>
      </div>

      <ThirdPage>
        <div className="faq-content">
          <h1 className="faq-heading">FAQ'S</h1>
          <section className="faq-container">
            <div className="faq-one">
              <h2 className="faq-page" id="faqPage1" onClick={changeDisplay1}>When will the mint be live?</h2>
              <div className="faq-body" id="faqBody1" style={{display: 'none'}}>
                <p>
                  rgv54z56b4z56z34pjzüp34jv5zjhühj43vhj345zhü435vz45
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-two">
            <h2 className="faq-page" id="faqPage2" onClick={changeDisplay2}>What is the mint price?</h2>
              <div className="faq-body" id="faqBody2" style={{display: 'none'}}>
                <p>
                  rgv54z56b4z56z34pjzüp34jv5zjhühj43vhj345zhü435vz45
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" id="faqPage3" onClick={changeDisplay3}>When will travelling be available?</h2>
              <div className="faq-body" id="faqBody3" style={{display: 'none'}}>
                <p>
                  rgv54z56b4z56z34pjzüp34jv5zjhühj43vhj345zhü435vz45
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" id="faqPage4" onClick={changeDisplay4}>How much does it cost to travel?</h2>
              <div className="faq-body" id="faqBody4" style={{display: 'none'}}>
                <p>
                  rgv54z56b4z56z34pjzüp34jv5zjhühj43vhj345zhü435vz45
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" id="faqPage5" onClick={changeDisplay5}>How can I get a station/landmark?</h2>
              <div className="faq-body" id="faqBody5" style={{display: 'none'}}>
                <p>
                  rgv54z56b4z56z34pjzüp34jv5zjhühj43vhj345zhü435vz45
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
          </section>
        </div>
      </ThirdPage>


      <footer>
        <div className="test" style={{width: '100%', height: '70px', backgroundColor: 'var(--secondary)'}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/tw.png" style={{width: '40px', marginTop: '12px', marginRight: '10%'}}></img>
            </a>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/os.png" style={{width: '40px', marginTop: '12px', marginLeft: '10%'}}></img>
            </a>
          </div>
        </div>
      </footer>
      </Start>
  ); 
}

export const FirstPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: linear-gradient(180deg,transparent 95%,#EDE9E6),linear-gradient(0deg,transparent 100%,#000), url("/config/images/supper.jpg");
background-position: 50%; 
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


export const ThirdPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: url("/config/images/back.webp");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (min-width: 1900px) {
  height: 80vh;
}
`;

export const SecondPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 90vh; 
minWidth: 100%;
background-image: linear-gradient(0deg,transparent 95%,#EDE9E6), url("/config/images/back.webp");
background-position: 50%; 
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
@media (orientation: portrait) {
  height: 65vh;
}
`;

export const Slider = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 60vh; 
minWidth: 100%;
background-image: url("/config/images/back.webp");
background-position: 50%; 
background-repeat: no-repeat; 
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  height: 150vh;
}
@media (min-width: 1850px) {
  height: 45vh;
}
`;

export const HideImage = styled.div`
@media (max-width: 900px) {
  visibility: hidden;
  clear: both;
  float: left;
  margin: 10px auto 5px 20px;
  width: 28%;
  display: none;
}
`;

export default App;
