import { useState } from "react";
import { Button, Modal } from "reactstrap";
const ToastModal = ({
  success,
  heading,
  desc,
  textToCopy,
}: {
  success: boolean;
  heading: string;
  desc: string;
  textToCopy: string;
}) => {
  const [modal, setModal] = useState(true);
  const [copySuccessMessage, setCopySuccessMessage] = useState("Text Copied !!");
  const [showOnCopy, setShowOnCopy] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccessMessage("Copied !!");
      setShowOnCopy(true);
      setTimeout(() => setShowOnCopy(false), 1000)
    }
    catch (error) {
      console.log(error);
    }
  }

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
            {success ? (
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
          <div onClick={copyToClipboard} style={{ cursor: 'pointer', marginTop: "20px" }}>
            <u>{
              showOnCopy ?
                copySuccessMessage
                :
                desc
            }</u>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ToastModal;
