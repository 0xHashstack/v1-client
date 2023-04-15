import { useContext, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import { NumericFormat } from "react-number-format";
import MySpinner from "../mySpinner";

const YourMatrics = () => {
  const {
    customActiveTab,
    toggleCustom,
    YourSupply,
    YourBorrows,
    NetEarnedApr,
    effectiveapr,
  } = useContext(TabContext);
  const [CoinsSupplyMetrics, setCoinsSupplyMetrics] = useState("");
  const [CoinsBorrowMetrics, setCoinsBorrowMetrics] = useState("");
  return (
    <>
      <Card
        style={{
          height: "25rem",
        }}
      >
        <CardBody
          style={{
            backgroundColor: "rgb(42, 46, 63)",
            overflowX: "hidden",
            marginTop: "-20px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Your Metrics
            <span
              onClick={() => {
                toggleCustom("1");
              }}
            >
              <img
                src="./cross.svg"
                alt="cross"
                style={{ cursor: "pointer" }}
              />
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <Col style={{ padding: "15px" }}>
              <div style={{ gap: "15px", display: "flex" }}>
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Total Supply
                  </span>
                  <div style={{ fontSize: "25px" }}>
                    {" "}
                    {YourSupply !== undefined ? (
                      <NumericFormat
                        displayType="text"
                        value={YourSupply.toFixed(2)}
                        thousandSeparator=","
                        prefix={"$"}
                      />
                    ) : (
                      <MySpinner />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Total Apr Earned
                  </span>
                  <div style={{ fontSize: "25px" }}> $ {NetEarnedApr}</div>
                </div>
              </div>
              <div
                style={{
                  gap: "35px",
                  padding: "15px 0px",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Active Supply Markets
                  </span>

                  <div
                    style={{
                      fontSize: "20px",
                      textAlign: "center",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <div style={{}}>
                      {CoinsSupplyMetrics !== "" ? (
                        <img src={`./${CoinsSupplyMetrics}.svg`} alt="BTC" />
                      ) : null}
                    </div>
                    <span>{CoinsSupplyMetrics}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* important note */}
                  {/* Use formula here wile mapping that position is relative and left to be -10*(index-1) while mapping to give the effect */}
                  {/* also zindex value to be 1000-index */}
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsSupplyMetrics === "BTC" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      zIndex: "999",
                      cursor: "pointer",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsSupplyMetrics("BTC");
                    }}
                  >
                    <img
                      src="./BTC.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsSupplyMetrics === "USDT" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      position: "relative",
                      left: "-10px",
                      zIndex: "998",
                      cursor: "pointer",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsSupplyMetrics("USDT");
                    }}
                  >
                    <img
                      src="./USDT.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsSupplyMetrics === "USDC" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      position: "relative",
                      left: "-20px",
                      cursor: "pointer",
                      zIndex: "997",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsSupplyMetrics("USDC");
                    }}
                  >
                    <img
                      src="./USDC.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col style={{ padding: "15px" }}>
              <div style={{ gap: "15px", display: "flex" }}>
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Your Borrow
                  </span>
                  <div style={{ fontSize: "25px" }}>
                    {YourBorrows !== undefined ? (
                      <NumericFormat
                        displayType="text"
                        value={YourBorrows.toFixed(2)}
                        thousandSeparator=","
                        prefix={"$"}
                      />
                    ) : (
                      <MySpinner />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Effective Borrow Apr
                  </span>
                  <div style={{ fontSize: "25px" }}>
                    {effectiveapr !== undefined ? (
                      <NumericFormat
                        displayType="text"
                        value={effectiveapr.toFixed(2)}
                        thousandSeparator=","
                        suffix="%"
                      />
                    ) : (
                      <MySpinner />
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  gap: "35px",
                  padding: "15px 0px",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    padding: "2px 12px",
                    width: "fit-content",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(111, 111, 111)",
                      fontSize: "13px",
                    }}
                  >
                    Active Borrow Markets
                  </span>

                  <div
                    style={{
                      fontSize: "20px",
                      textAlign: "center",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <div>
                      {CoinsBorrowMetrics !== "" ? (
                        <img src={`./${CoinsBorrowMetrics}.svg`} alt="BTC" />
                      ) : null}
                    </div>
                    <span>{CoinsBorrowMetrics}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* important note */}
                  {/* Use formula here wile mapping that position is relative and left to be -12*(index-1) while mapping to give the effect */}
                  {/* also zindex value to be 1000-index */}
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsBorrowMetrics === "BTC" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      zIndex: "999",
                      cursor: "pointer",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsBorrowMetrics("BTC");
                    }}
                  >
                    <img
                      src="./BTC.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsBorrowMetrics === "USDT" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      position: "relative",
                      left: "-10px",
                      cursor: "pointer",
                      zIndex: "998",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsBorrowMetrics("USDT");
                    }}
                  >
                    <img
                      src="./USDT.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px",
                      backgroundColor:
                        CoinsBorrowMetrics === "USDC" ? "white" : "#1C202F",
                      borderRadius: "37px",
                      position: "relative",
                      left: "-20px",
                      cursor: "pointer",
                      zIndex: "997",
                      boxShadow: "4px 2px 5px black",
                    }}
                    onClick={() => {
                      setCoinsBorrowMetrics("USDC");
                    }}
                  >
                    <img
                      src="./USDC.svg"
                      alt="BTC"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </div>
          <div style={{ padding: "15px" }}>
            Think we should provide additional insights?{" "}
            <a href="mailto:hello@hashstack.finance" style={{color: "#fff"}}>
              <span style={{ textDecoration: 'underline' }}>Write to us</span>
            </a>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default YourMatrics;
