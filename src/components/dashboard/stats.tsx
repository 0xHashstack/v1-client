import Image from "next/image";
import { useEffect, useState } from "react";
import statsIcon from "../../assets/images/statsIcon.svg";
import OffchainAPI from "../../services/offchainapi.service";
import { TabContext } from "../../hooks/contextHooks/TabContext";
import { useContext } from "react";

const StatsBoard = () => {
  const { customActiveTab, toggleCustom } = useContext(TabContext);

  const [oraclePrices, setOraclePrices] = useState<any>();
  const [deposits, setDeposits] = useState<any>();
  const [loans, setLoans] = useState<any>();

  useEffect(() => {
    OffchainAPI.getOraclePrices().then((val) => {
      console.log("got them", val);
    });
  }, []);

  return (
    <div
      className="stats-board"
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "20px 20px",
        gap: "20px",
      }}
    >
      <div
        className="stat-card"
        style={{
          width: "50%",
          background: "#2A2E3F",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
          boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
        }}
      >
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Net Worth</p>
          <h4>$8,932.14</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Your Supply</p>
          <h4>$5,536.83</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Your Borrow</p>
          <h4>$536.83</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Net APR</p>
          <h4>15.5%</h4>
        </div >
        <Image
          src={statsIcon}
          alt="Navbar Logo"
          style={{ marginLeft: "20px" ,cursor:"pointer"}}
          height="20px"
          width="20px"
          onClick={()=>{toggleCustom("7")}}
    
        />
      </div>
      <div className="stat-card"></div>
      <div
        className="stat-card"
        style={{
          width: "50%",
          background: "#2A2E3F",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
          boxShadow: "rgba(0, 0, 0, 0.5) 2.4px 2.4px 3.2px",
        }}
      >
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Total Reserves</p>
          <h4>531000.00</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Available Reserves</p>
          <h4>531000.00</h4>
        </div>
        <div className="Net Worth">
          <p style={{ marginBottom: "10px" }}>Asset utilisation rate</p>
          <h4>53.1%</h4>
        </div>
        <Image
          src={statsIcon}
          alt="Navbar Logo"
          style={{ marginLeft: "20px",cursor:"pointer" }}
          height="20px"
          width="20px"
          onClick={()=>{toggleCustom("8")}}
        />
      </div>
      <div className="stat-card"></div>
    </div>
  );
};

export default StatsBoard;
