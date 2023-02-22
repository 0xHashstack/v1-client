import { useContext, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import BarChartComponent from "../charts/barChart";
import Chart from "../charts/Chart";
import Chart2 from "../charts/Chart2";

const ProtocolMatrics = () => {
  const { customActiveTab, toggleCustom } = useContext(TabContext);
  const [CoinsSupplyMetrics, setCoinsSupplyMetrics] = useState("");
  const [CoinsBorrowMetrics, setCoinsBorrowMetrics] = useState("");
  return (
    <>
      <Card
        style={{
          height: "118rem",
          // overflowY: "scroll",
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
            Protocol Metrics
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

          <Row>
            <div style={{ display: "flex" }}>
              <Col style={{ padding: "25px" }}>
                <div style={{ gap: "15px", display: "flex" }}>
                  <div
                    style={{
                      padding: "10px 12px",
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
                      Supplied Liquidity:
                    </span>
                    <div style={{ fontSize: "20px" }}>$ 1,000,952</div>
                  </div>
                  <div
                    style={{
                      padding: "10px 12px",
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
                      Borrowed Liquidity:
                    </span>
                    <div style={{ fontSize: "20px" }}>$ 1,000,952</div>
                  </div>
                </div>
              </Col>
              <Col style={{ padding: "25px" }}>
                <div style={{ gap: "15px", display: "flex" }}>
                  <div
                    style={{
                      padding: "10px 12px",
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
                    <div style={{ fontSize: "20px" }}>$ 8932.5</div>
                  </div>
                  <div
                    style={{
                      padding: "10px 12px",
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
                    <div style={{ fontSize: "20px" }}>15.5%</div>
                  </div>
                </div>
              </Col>
            </div>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "30px",
              margin: "20px 25px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1D2131",
                padding: "35px 0px",
                boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                width: "48%",
              }}
            >
              <BarChartComponent
                title={"Asset Utilisation:"}
                tokenImage="./btcGraph.svg"
                tokenName="BTC"
              />
            </div>

            <div
              style={{
                backgroundColor: "#1D2131",
                padding: "35px 0px",

                boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                width: "48%",
              }}
            >
              <Chart
                title={"Asset Utilisation rate:"}
                tokenImage="./btcGraph.svg"
                tokenName="BTC"
              />
            </div>
          </div>

          <Row>
            <div style={{ display: "flex" }}>
              <Col style={{ padding: "25px" }}>
                <div style={{ gap: "15px", display: "flex" }}>
                  <div
                    style={{
                      padding: "10px 12px",
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
                      Average Supply Apr:
                    </span>
                    <div style={{ fontSize: "20px" }}>3.6 %</div>
                  </div>
                </div>
              </Col>
              <Col style={{ padding: "25px" }}>
                <div style={{ gap: "15px", display: "flex" }}>
                  <div
                    style={{
                      padding: "10px 12px",
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
                      Average Borrow Apr:
                    </span>
                    <div style={{ fontSize: "20px" }}>$ 8932.5</div>
                  </div>
                </div>
              </Col>
            </div>
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "30px",
              margin: "20px 25px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1D2131",
                padding: "35px 0px",
                boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                width: "48%",
              }}
            >
              <Chart title={"Supply APR:"} />
            </div>

            <div
              style={{
                backgroundColor: "#1D2131",
                padding: "35px 0px",

                boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                width: "48%",
              }}
            >
              <Chart title={"Borrow APR:"} />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "30px",
              margin: "80px 25px 20px 25px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1D2131",
                padding: "35px 0px",
                boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
                width: "100%",
              }}
            >
              <Chart2 title={"Risk premium:"} />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ProtocolMatrics;
