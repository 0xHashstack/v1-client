import { useStarknetExecute } from "@starknet-react/core";
import { tokenAddressMap } from "../../stark-constants";
import { GetErrorText, NumToBN } from "../../utils";
import { toast } from "react-toastify";
import useMyAccount from "../walletDetails/getAddress";

const useMySwap = (diamondAddress: string, asset: any, toTokenName: any) => {
    const {
		data: dataMySwap,
		loading: loadingMySwap,
		error: errorMySwap,
		reset: resetMySwap,
		execute: executeMySwap,
	} = useStarknetExecute({
		calls: {
			contractAddress: diamondAddress,
			entrypoint: 'interact_with_l3',
			calldata: ["30814223327519088", 2, asset?.loanId, tokenAddressMap[toTokenName]],
		},
	});

    const handleMySwap = async () => {
        try {
          const val = await executeMySwap();
        } catch (err) {
          console.log(err, "err repay");
        }
        if (errorMySwap) {
          toast.error(`${GetErrorText(`Swap for Loan ID${asset.loanId} failed`)}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            closeOnClick: true,
          });
          return;
        }
      }

    return {
        executeMySwap, 
        loadingMySwap, 
        dataMySwap,
        errorMySwap, 
        handleMySwap
    }

}

export default useMySwap;