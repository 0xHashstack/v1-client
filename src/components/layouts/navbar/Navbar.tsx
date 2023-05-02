import React from "react";
import Image from "next/image";
import Link from "next/link";

// import "./navbar.css";

import arrowDown from "../../../assets/images/ArrowDownDark.svg";
import arrowUp from "../../../assets/images/ArrowUpDark.svg";
import starknetLogoBordered from "../../../assets/images/starknetLogoBordered.svg";
import transferDeposit from "../../../assets/images/transferDeposit.svg";
import languageArrow from "../../../assets/images/languageArrow.svg";
import dashboardIcon from "../../../assets/images/dashboardIcon.svg";
import hoverDashboardIcon from "../../../assets/images/hoverDashboardIcon.svg";
import contributeEarnIcon from "../../../assets/images/contributeEarnIcon.svg";
import hoverContributeEarnIcon from "../../../assets/images/hoverContributeEarnIcon.svg";
import tickMark from "../../../assets/images/tickMark.svg";
import moreIcon from "../../../assets/images/moreIcon.svg";
import hoverMoreIcon from "../../../assets/images/hoverMoreIcon.svg";
import stake from "../../../assets/images/stake.svg";
import hoverStake from "../../../assets/images/hoverStake.svg";
import starknetIcon from "../../../assets/images/starknetWallet.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  selectNavDropdowns,
  setNavDropdown,
} from "@/store/slices/dropdownsSlice";
import { Center, background } from "@chakra-ui/react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navDropdowns = useSelector(selectNavDropdowns);

  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName));
  };

  const moreOptions = ["Liquidations", "Dummy1", "Dummy2", "Dummy3"];
  const walletConnectionDropdown = ["Disconnect", "Switch wallet"];
  return (
    <div
      style={{
        zIndex: "10",
        position: "fixed",
        padding: "0.4rem 0",
        backgroundColor: "#161B22",
        width: "100vw",
        // height: "10%",
        color: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="navbar"
    >
      <div
        className="d-flex"
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          width: "70%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "1.5rem",
            marginRight: "0.5rem",
          }}
        >
          <Link href="/">
            <div style={{ height: "100%", width: "9rem" }}>
              <Image
                // style={{ marginLeft: "20px" }}
                src="./hashstackLogo.svg"
                alt="Navbar Logo"
                height="40"
                width="177"
              />
            </div>
          </Link>
        </div>

        <label
          style={{
            padding: "10px",
            fontSize: "12px",
            borderRadius: "5px",
            color: "#FFF",
            cursor: "pointer",
            marginBottom: "0px",
            // backgroundColor: "#393D4F",
          }}
          className="button"
        >
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            // onClick={() => {
            //   toggleCustom("1");
            // }}
          >
            <Image
              src={dashboardIcon}
              alt="Picture of the author"
              width="15"
              height="15"
              style={{ cursor: "pointer" }}
            />
            &nbsp;&nbsp;
            <span style={{ fontSize: "larger" }}>Dashboard</span>
          </span>
        </label>

        <a
          href="https://hashstack.crew3.xyz/questboard"
          target="_blank"
          rel="noreferrer"
        >
          <label
            style={{
              padding: "10px",
              fontSize: "12px",
              borderRadius: "5px",
              color: "#FFF",
              cursor: "pointer",
              marginBottom: "0px",
            }}
            className="button"
          >
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {" "}
              <Image
                src={contributeEarnIcon}
                alt="Picture of the author"
                width="15"
                height="15"
                style={{ cursor: "pointer" }}
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "larger" }}>Contribute-2-Earn</span>
            </span>
          </label>
        </a>

        <label
          style={{
            padding: "3px 0px",
            fontSize: "12px",
            borderRadius: "5px",
            color: "#FFF",
            cursor: "pointer",
            marginBottom: "0px",
            display: "flex",
            flexDirection: "column",
            // backgroundColor: "#393D4F",
          }}
          className="button navbar"
          onClick={() => handleDropdownClick("moreButtonDropdown")}
        >
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="navbar-button"
          >
            {" "}
            <Image
              src={moreIcon}
              alt="Picture of the author"
              width="20"
              height="20"
              style={{ cursor: "pointer" }}
            />
            &nbsp;&nbsp; <span style={{ fontSize: "larger" }}>More </span>
          </span>
          {navDropdowns.moreButtonDropdown && (
            <div
              style={{
                width: "200%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: "7px",
                padding: "0.5rem 0",
              }}
              className="dropdown-container"
            >
              {moreOptions.map((val, idx) => {
                return (
                  <div
                    key={idx}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      backgroundColor: `${idx == 0 ? "#0366d6" : "none"}`,
                    }}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          )}
        </label>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
            marginRight: "1rem",
          }}
        >
          <label
            style={{
              //   backgroundColor: "#2A2E3F",
              padding: "0.4rem 1rem",
              fontSize: "12px",
              borderRadius: "6px",
              color: "#FFF",
              cursor: "pointer",
              margin: "0",
              border: "0.5px solid #57606A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            className="button"
          >
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {" "}
              <Image
                src={transferDeposit}
                alt="Picture of the author"
                width="20"
                height="20"
                style={{ cursor: "pointer" }}
              />
              &nbsp;&nbsp;&nbsp;{" "}
              <span style={{ fontSize: "larger" }}>Transfer Deposit</span>
            </span>
          </label>

          <label
            style={{
              //   height: "48px",
              backgroundColor: "#30363d",
              padding: "0.4rem 1rem",
              fontSize: "12px",
              borderRadius: "6px",
              color: "#FFF",
              width: "14rem",
              cursor: "pointer",
              margin: "0",
              border: "0.5px solid #57606A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexGrow: "1",
            }}
            className="button navbar-button"
            onClick={() => {
              dispatch(setNavDropdown("walletConnectionDropdown"));
            }}
            // onClick={() => {
            //   handleButtonConnectWallet();
            // }}
            // onClick={() => {
            //   setLiquidateDropDown(false);
            //   setSettingDropDown(false);
            //   setConnectWallet(false);
            //   setConnectWalletArrowState({
            //     bool: !connectWalletArrowState.bool,
            //     direction: "./connectWalletArrowDown.svg",
            //   });
            // }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              // className="navbar-button"
            >
              {
                //   account ? (
                //     <>
                //       &nbsp;
                //       <Image
                //         // onClick={() => {
                //         //   setConnectWallet(false);
                //         // }}
                //         alt=""
                //         src={starknetLogoBordered}
                //         width="18px"
                //         height="18px"
                //         style={{ cursor: "pointer" }}
                //       />
                //       <div style={{ fontSize: "larger" }}>
                //         &nbsp;&nbsp;&nbsp;&nbsp;
                //         {`${account.substring(0, 3)}...${account.substring(
                //           account.length - 10,
                //           account.length
                //         )}`}{" "}
                //         &nbsp;&nbsp;&nbsp;
                //       </div>
                //     </>
                //   ) :
                <>
                  <span
                    style={{
                      fontSize: "larger",
                    }}
                  >
                    Connect Wallet&nbsp;&nbsp;&nbsp;
                  </span>
                </>
              }
              <Image
                src="./connectWalletArrowDown.svg"
                alt="arrow"
                width="14"
                height="14"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "0.8rem",
                }}
              />
            </span>
            {navDropdowns.walletConnectionDropdown && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "7px",
                  padding: "0.5rem 0",
                }}
                className="dropdown-container"
              >
                {walletConnectionDropdown.map((val, idx) => {
                  return (
                    <div
                      key={idx}
                      style={{
                        // width: "100%",
                        padding: "4px 11px",
                        marginRight: "8px",
                        borderRadius: "6px",
                        border: "1px solid #2B2F35",
                      }}
                    >
                      {val}
                    </div>
                  );
                })}
                {/* <hr />
                <div>
                  <div>Network</div>
                  <div></div>
                </div> */}
                <hr
                  style={{
                    height: "1px",
                    borderWidth: "0",
                    backgroundColor: "#2B2F35",
                    width: "96%",
                    marginRight: "5px",
                    // marginLeft: "10px",
                  }}
                />
                <div style={{ marginRight: "14px" }}>
                  <div style={{ float: "right" }}>Network</div>
                  <div
                    style={{
                      color: "white",
                      // backgroundColor: "blue",
                      // marginRight: "-15px",
                      // marginLeft: "50px",
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "5px",
                      marginRight: "10px",
                    }}
                  >
                    <Image
                      src="./green.svg"
                      alt="Picture of the author"
                      height="6"
                      width="6"
                    />
                    Starknet
                    {/* <img
                    src={`${dropDownArrow}`}
                    alt="Picture of the author"
                    width="14px"
                    height="14px"
                    style={{
                      marginTop: "3px",
                      cursor: "pointer",
                    }}
                  /> */}
                  </div>
                </div>
              </div>
            )}
          </label>
          <Image
            // onClick={() => {
            //   setLiquidateDropDown(false);
            //   setSettingDropDown(!settingDropDown);
            //   setConnectWalletArrowState({
            //     bool: false,
            //     direction: "./connectWalletArrowDown.svg",
            //   });
            // }}
            src="./settingIcon.svg"
            alt="Picture of the author"
            width="25"
            height="25"
            style={{
              cursor: "pointer",
            }}
          />
          {/* <div>{navDropdowns.moreButtonDropdown && <p>hey</p>}</div> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
