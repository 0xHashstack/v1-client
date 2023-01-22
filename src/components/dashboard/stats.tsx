import Image from "next/image";
import statsIcon from "../../assets/images/statsIcon.svg";

const StatsBoard = () => {
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
          background: "black",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
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
        </div>
        <Image
          src={statsIcon}
          alt="Navbar Logo"
          style={{ marginLeft: "20px" }}
          height="20px"
          width="20px"
        />
      </div>
      <div className="stat-card"></div>
      <div
        className="stat-card"
        style={{
          width: "50%",
          background: "black",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          gap: "30px",
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
          style={{ marginLeft: "20px" }}
          height="20px"
          width="20px"
        />
      </div>
      <div className="stat-card"></div>
    </div>
  );
};

export default StatsBoard;
