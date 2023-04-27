import React from "react";
import Image from "next/image";
import Link from "next/link";

// import arrowDown from "../../../assets/images/ArrowDownDark.svg";
// import arrowUp from "../../../assets/images/ArrowUpDark.svg";
// import starknetLogoBordered from "../../../assets/images/starknetLogoBordered.svg";
import transferDeposit from "../../../assets/images/transferDeposit.svg";
// import languageArrow from "../../../assets/images/languageArrow.svg";
import dashboardIcon from "../../../assets/images/dashboardIcon.svg";
import contributeEarnIcon from "../../../assets/images/contributeEarnIcon.svg";
import moreIcon from "../../../assets/images/moreIcon.svg";

const Navbar = () => {
  return (
    <div
      style={{
        zIndex: "10",
        position: "fixed",
        padding: "0.5rem 0",
        backgroundColor: "#1C202F",
        width: "100vw",
        // height: "10%",
        color: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        className="d-flex"
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          //   height: "100%",
          width: "70%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "1.5rem",
          }}
        >
          <Link href="/">
            <div style={{ height: "100%" }}>
              <img
                // style={{ marginLeft: "20px" }}
                src="./hashstackLogo.svg"
                alt="Navbar Logo"
                height="40px"
                width={"177px"}
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
            className="hover:text-gray-400"
          >
            <Image
              src={dashboardIcon}
              alt="Picture of the author"
              width="15"
              height="15"
              style={{ cursor: "pointer" }}
            />
            &nbsp;&nbsp;
            <span style={{ fontSize: "larger", cursor: "pointer" }}>
              Dashboard
            </span>
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
            //   setSettingDropDown(false);
            //   setConnectWalletArrowState({
            //     bool: false,
            //     direction: "./connectWalletArrowDown.svg",
            //   });
            //   setLiquidateDropDown(!liquidateDropDown);
            // }}
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
        </label>
      </div>
      <div
        style={{
          width: "40%",
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
              padding: "0.6rem 1.4rem",
              fontSize: "12px",
              borderRadius: "5px",
              color: "#FFF",
              cursor: "pointer",
              margin: "0",
              border: "1px solid #57606a",
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
              padding: "15px",
              fontSize: "12px",
              borderRadius: "5px",
              color: "#FFF",
              cursor: "pointer",
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
              <span
                style={{
                  fontSize: "larger",
                }}
              >
                Connect Wallet&nbsp;&nbsp;&nbsp;
              </span>
              <img
                src="./connectWalletArrowDown.svg"
                alt="arrow"
                width="14px"
                height="14px"
                style={{ cursor: "pointer" }}
              />
            </span>
          </label>
          <img
            src="./settingIcon.svg"
            alt="Picture of the author"
            width="25px"
            height="25px"
            style={{
              cursor: "pointer",
            }}
          />
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
