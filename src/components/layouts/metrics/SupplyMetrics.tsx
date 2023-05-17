import React from 'react'
import { Box } from '@chakra-ui/react'
import AssetUtilizationChart from '../charts/AssetUtilization'
import AssetUtilizationRateChart from '../charts/AssetUtilizationRate'
import SupplyAprChart from '../charts/SupplyApr'
import BorrowAprChart from '../charts/BorrowApr'
const SupplyMetrics = () => {
  return (
    <Box display="flex" gap="30px">
        <Box display="flex" flexDirection="column" gap="8px">
            <Box display="flex" flexDirection="column" alignItems="flex-start"  border="1px solid #2B2F35" color="#E6EDF3" padding="24px 24px 16px" fontSize="20px" fontStyle="normal" fontWeight="600" lineHeight="30px" borderRadius="6px">
                Supply APR:
            </Box>
                <SupplyAprChart/>
        </Box>
        <Box display="flex" flexDirection="column" gap="8px">
            <Box display="flex" flexDirection="column" alignItems="flex-start"  border="1px solid #2B2F35" color="#E6EDF3" padding="24px 24px 16px" fontSize="20px" fontStyle="normal" fontWeight="600" lineHeight="30px" borderRadius="6px">
                    Borrow APR:
            </Box>
                <BorrowAprChart/>
        </Box>
    </Box>
  )
}

export default SupplyMetrics