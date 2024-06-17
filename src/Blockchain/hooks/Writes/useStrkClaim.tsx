import { etherToWeiBN } from '@/Blockchain/utils/utils'
import { useContractWrite } from '@starknet-react/core'
import { useState } from 'react'

const useClaimStrk = () => {
  const [round, setRound] = useState('1')
  const [strkAmount, setstrkAmount] = useState<number>(100)

  const [proof, setProof] = useState([
    '0x133dc8a91a6503962a20ffebf1c5974713e217a19932709d7e844740ff1242e',
    '0x7957d036cf1e60858a601df12e0fb2921114d4b5facccf638163e0bb2be3c34',
    '0x1baa08224a2fbc4dc71734549e0ad1bbf85b3586014d3d7aa229b85474aae67',
  ])
  const {
    data: datastrkClaim,
    error: errorstrkClaim,
    reset: resetstrkClaim,
    write: writestrkClaim,
    writeAsync: writeAsyncstrkClaim,
    isError: isErrorstrkClaim,
    isIdle: isIdlestrkClaim,
    isSuccess: isSuccessstrkClaim,
    status: statusstrkClaim,
  } = useContractWrite({
    calls: [
      {
        contractAddress:
          '0x02e20db0cd0af6739ff3e3003ea6932409867040b227bf9ba822239e5ba0dcaf',
        entrypoint: 'claim',
        calldata: [strkAmount, proof].flat(),
      },
    ],
  })
  return {
    round,
    setRound,
    strkAmount,
    setstrkAmount,
    proof,
    setProof,
    datastrkClaim,
    errorstrkClaim,
    resetstrkClaim,
    writestrkClaim,
    writeAsyncstrkClaim,
    isErrorstrkClaim,
    isIdlestrkClaim,
    isSuccessstrkClaim,
    statusstrkClaim,
  }
}

export default useClaimStrk
