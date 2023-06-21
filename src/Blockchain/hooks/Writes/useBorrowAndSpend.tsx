import {
  useAccount,
  useContractWrite,
} from "@starknet-react/core";
import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
import { Method, NativeToken, Token } from "@/Blockchain/interfaces/interfaces";
import { useState } from "react";
import { diamondAddress } from "@/Blockchain/stark-constants";
import { etherToWeiBN } from "@/Blockchain/utils/utils";

const useBorrowAndSpend = () => {
  const { address: account } = useAccount();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [asset, setAsset] = useState<NativeToken>("USDT");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<Method>("SWAP");
  const [l3App, setL3App] = useState<string>("JEDI_SWAP");

  // func borrow_and_spend_with_rToken{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
  //   asset: felt, amount: Uint256, rToken: felt, rTokenAmount: Uint256, recipient: felt,
  //   integration: felt, 
  //   calldata_len: felt,
  //   calldata: felt*, // first should be loan_id, second method, rest additional data if needed
  // ) -> (loan_id: felt)


  const {
    data: dataBorrowAndSpend,
  } = useContractWrite({
    calls: {
      contractAddress: diamondAddress,
      entrypoint: "borrow_and_spend_with_rToken",
      calldata: [
        tokenAddressMap["USDT"],
      ]
    }
  });



  return {
    dataBorrowAndSpend,
  };
};

export default useBorrowAndSpend;
