import { UseTransactionReceiptResult } from "@starknet-react/core";
import { ReactNode } from "react";
import { Id, toast, ToastOptions, TypeOptions } from "react-toastify";
import { Spinner } from "reactstrap";
import { Status } from "starknet/types";

export class TxToastManager {
  static txToastMap: { [tx: string]: { id: Id; stage: Status } } = {};

  static handleTxToast(
    receipt: UseTransactionReceiptResult,
    purpose: string,
    onlyL2Confirm = true
  ) {
    const hash = receipt.data?.transaction_hash;
    if (!hash) return;
    let hasToast = this.txToastMap[hash];
    console.log("handleTxToast", {
      hash,
      hasToast,
      data: receipt.data,
    });
    if (receipt.data?.status == "RECEIVED") {
      let msg = (
        <p style={{ margin: 0 }}>
          <Spinner
            animation="border"
            style={{ marginRight: "10px", marginBottom: "-1px" }}
            size={"sm"}
          />
          {/* Transaction sent, waiting to confirm... {`${hash.substring(hash.length-5, hash.length)}`} */}
          {purpose}
        </p>
      );
      this._showToast(hash, hasToast, msg, "default", receipt.data?.status, 0);
    } else if (receipt.data?.status == "PENDING" && !onlyL2Confirm) {
      // Read: https://community.starknet.io/t/cairo-v0-6-2-api-change-pending-block/195

      // let msg = (<p style={{margin: 0}}>
      //     <Spinner animation="border" style={{marginRight: '10px', marginBottom: '-1px'}} size={'sm'}/>
      //         Almost done...
      //     </p>)
      // this._showToast(hash, hasToast,msg, 'default', receipt.data?.status, 0, 0.7)
      this._showToast(hash, hasToast, purpose, "success", receipt.data?.status);
    } else if (receipt.data?.status == "ACCEPTED_ON_L2") {
      this._showToast(hash, hasToast, purpose, "success", receipt.data?.status);
    } else if (receipt.data?.status == "REJECTED") {
      this._showToast(hash, hasToast, purpose, "error", receipt.data?.status);
    }
  }

  static nonTransactionToast(
    message: ReactNode | string,
    type: TypeOptions,
    status: Status,
    timeout = 5000,
    progress = 1
  ) {
    let options: ToastOptions = {
      type,
      //   toastId: Math.random(),
      position: "bottom-right",
      autoClose: timeout == 0 ? false : timeout,
      hideProgressBar: timeout == 0 ? true : false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    const id = toast(message, options);
  }

  static _showToast(
    hash: string,
    existingId: { id: Id; stage: Status },
    message: ReactNode | string,
    type: TypeOptions,
    status: Status,
    timeout = 5000,
    progress = 1
  ) {
    console.log("_showToast", {
      hash,
      existingId,
      message,
      type,
      status,
    });
    let options: ToastOptions = {
      type,
      toastId: hash,
      position: "bottom-right",
      autoClose: timeout == 0 ? false : timeout,
      hideProgressBar: timeout == 0 ? true : false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    if (!existingId) {
      // if(existingId?.id) {
      //     toast.dismiss(existingId.id)
      // }
      //  /
      const id = toast(message, options);
      this.txToastMap[hash] = { id, stage: status };
    } else if (existingId.stage != status) {
      toast.update(hash, {
        render: message,
        ...options,
        autoClose: false,
        closeButton: true,
        hideProgressBar: false,
      });
      this.txToastMap[hash].stage = status;
    }
  }
}
