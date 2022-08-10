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
margin-top: 7vh;
  @media (orientation: portrait) {
    width: 80%;
    margin: auto;
  }
  @media (min-width: 1900px) {
    margin-top: 9vh;
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
cursor: url(config/images/cursor.png), auto;
`;

function App() {
  
  const mintClick = () => {
    document.getElementById("text-box").style.display = "none";
  }

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
    if(scrollValue>500){
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
  const [feedback, setFeedback] = useState(`Mint 1 of us for free per wallet. If you wanna mint more you greedy mf, you gotta pay 0.005 per NFT.`);
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


  return (
    <Start>
      <FirstPage>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
          <a href="https://www.google.de/?hl=de">
          <img className="icon" style={{width: '60px', marginRight: '10px', marginTop: '15px', cursor: 'url(config/images/cursor.png), pointer'}} src="/config/images/os_wabbits.png"></img>
          </a>
          <a href="https://www.google.de/?hl=de">
          <img className="icon" style={{width: '53px', marginRight: '5px', marginTop: '22px', cursor: 'url(config/images/cursor.png), pointer'}} src="/config/images/twitter_wabbits.png"></img>
          </a>
        </div>
      </FirstPage>


      <SecondPage>
        <HideImage className={state? "left-image-move":"left-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/left.png"></img>
          </span>
        </HideImage>
        <HideImage className={state? "right-image-move":"right-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/right_zombie.png"></img>
          </span>
        </HideImage>

        <div className="middle-container">
            <StyledLogo2 src="/config/images/Logo-Wabbits.png"></StyledLogo2>
            <div style={{overflow: 'hidden', boxSizing: 'border-box', display: 'block'}}>
              <p id="text-box" style={{color: '#000', visibility: 'inherit', maxWidth: '29ch', display: 'inline-block', margin: 0, marginTop: '35px',
              fontFamily: '"DynaPuff", cursive', fontSize: '1.5rem', lineHeight: '2rem', 
              marginBlockStart: '0em', marginInlineStart: '50px', marginInlineEnd: '50px'}}>
                          A collection of 10,000 wabbits which will give you your carrot pass into the Wabbit-verse. What beautiful benefits will your Wabbit provide? Air-droppings? Mutations?

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
                      <div style={{cursor: 'url(config/images/cursor.png), pointer'}} className="connect-button"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                          mintClick();
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
                      <div style={{overflow: 'hidden', boxSizing: 'border-box', display: 'block'}}>
                        <p id="text-box" style={{color: '#000', visibility: 'inherit', maxWidth: '29ch', display: 'inline-block', marginBottom: '1em', margin: 0, 
                        fontFamily: '"DynaPuff", cursive', fontSize: '1.5rem', lineHeight: '2rem', 
                        marginBlockStart: '0em', marginInlineStart: '50px', marginInlineEnd: '50px'}}>
                                    {feedback}
                        </p>
                      </div>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <btn className="round-button"
                          style={{ lineHeight: 0.4, cursor: 'url(config/images/cursor.png), pointer'}}
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
                            fontSize: '30px',
                            textAlign: "center",
                            color: "var(--primary-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <btn className="round-button"
                          style={{cursor: 'url(config/images/cursor.png), pointer'}}
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
      <div class="slider" style={{backgroundImage: 'url("config/images/paw_background.png")'}}>
            <div class="slide-track">
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/1.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/2.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/3.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/4.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/5.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/6.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/7.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/8.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/9.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/10.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/11.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/12.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/13.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img style={{borderRadius: '35px'}} src="/config/slider/14.png" height="300" width="300" alt="" />
                  </div>
            </div>
      </div>
      <div style={{backgroundImage: 'url("/config/images/paw_background.png")'}}>
        <div className="faq-content">
          <h1 className="faq-heading" style={{fontFamily: '"DynaPuff", cursive'}}>FAQ'S</h1>
          <section className="faq-container">
            <div className="faq-one">
              <h2 className="faq-page" style={{fontFamily: '"DynaPuff", cursive', cursor: 'url(config/images/cursor.png), pointer'}} id="faqPage1" onClick={changeDisplay1}>When will the mint be live?</h2>
              <div className="faq-body" id="faqBody1" style={{display: 'none'}}>
                <p style={{fontFamily: '"DynaPuff", cursive'}}>
                Probably right now dumbass.
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-two">
            <h2 className="faq-page" style={{fontFamily: '"DynaPuff", cursive', cursor: 'url(config/images/cursor.png), pointer'}} id="faqPage2" onClick={changeDisplay2}>What is the mint price?</h2>
              <div className="faq-body" id="faqBody2" style={{display: 'none'}}>
                <p style={{fontFamily: '"DynaPuff", cursive'}}>
                  It's free for all. Additional mints cost 0.005 eth per NFT.
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" style={{fontFamily: '"DynaPuff", cursive', cursor: 'url(config/images/cursor.png), pointer'}} id="faqPage3" onClick={changeDisplay3}>How many can I mint?</h2>
              <div className="faq-body" id="faqBody3" style={{display: 'none'}}>
                <p style={{fontFamily: '"DynaPuff", cursive'}}>
                  1 free per wallet. 10 per tnx for additional mints.
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" style={{fontFamily: '"DynaPuff", cursive', cursor: 'url(config/images/cursor.png), pointer'}} id="faqPage4" onClick={changeDisplay4}>What are $carrots?</h2>
              <div className="faq-body" id="faqBody4" style={{display: 'none'}}>
                <p style={{fontFamily: '"DynaPuff", cursive'}}>
                  I guess we'll never know. Or... will we?
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
            <div className="faq-three">
            <h2 className="faq-page" style={{fontFamily: '"DynaPuff", cursive', cursor: 'url(config/images/cursor.png), pointer'}} id="faqPage5" onClick={changeDisplay5}>What is the maximum supply?</h2>
              <div className="faq-body" id="faqBody5" style={{display: 'none'}}>
                <p style={{fontFamily: '"DynaPuff", cursive'}}>
                  10,000 Wabbits will be around on the blockchain.
                </p>
              </div>
            </div>
            <hr className="hr-line"></hr>
          </section>
        </div>
      </div>

      <footer>
        <div className="test" style={{width: '100%', height: '70px', backgroundColor: 'var(--secondary)'}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/TW-Wabbits.png" style={{width: '50px', marginTop: '12px', marginRight: '10%'}}></img>
            </a>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/OS-Wabbits.png" style={{width: '50px', marginTop: '12px', marginLeft: '10%'}}></img>
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
background-image: linear-gradient(0deg,transparent 90%,#000), linear-gradient(180deg,transparent 100%,#F8F6F4), url("/config/images/last_supper.jpg");
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
height: 85vh; 
minWidth: 100%;
background-image: url("/config/images/paw_background.png");
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
height: 85vh; 
minWidth: 100%;
background-image: url("/config/images/paw_background.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  height: 80vh;
}
`;

export const Slider = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 60vh; 
minWidth: 100%;
background-image: url("/config/images/paw_background.png");
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
