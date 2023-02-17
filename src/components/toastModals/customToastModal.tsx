import { useState } from "react";
import { Modal } from "reactstrap";
const ToastModal = ({
  bool,
  heading,
  desc,
}: {
  bool: boolean;
  heading: string;
  desc: string;
}) => {
  const [modal, setModal] = useState(true);

  return (
    <div>
      <Modal
        isOpen={modal}
        style={{
          width: "512px",
          height: "308px",
          outline: "none",
        }}
      >
        <div
          style={{
            height: "308px",
            backgroundColor: "#1D2131",
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ textAlign: "right", margin: "40px" }}>
            <img
              src="./cross.svg"
              alt="successToast"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={() => setModal(false)}
            />
          </div>
          <div style={{ margin: "40px 220px 20px 220px" }}>
            {bool ? (
              <img
                src="./successToast.svg"
                alt="successToast"
                style={{ width: "60px", height: "60px" }}
              />
            ) : (
              <img
                src="./errorToast.svg"
                alt="successToast"
                style={{ width: "60px", height: "60px" }}
              />
            )}
          </div>
          <div style={{ fontSize: "24px" }}>{heading}</div>
          <div style={{ marginTop: "20px" }}>
            <u>{desc}</u>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ToastModal;
