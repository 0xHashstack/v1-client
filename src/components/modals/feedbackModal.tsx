import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Card,
  Text,
  Tooltip,
  Box,
  Portal,
  Skeleton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import TransactionFees from "../../../TransactionFees.json";
import SliderTooltip from "../uiElements/sliders/sliderTooltip";
import { useDisclosure } from "@chakra-ui/react";
import InfoIcon from "@/assets/icons/infoIcon";
import BTCLogo from "../../assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import USDTLogo from "@/assets/icons/coins/usdt";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import ETHLogo from "@/assets/icons/coins/eth";
import SmallEth from "@/assets/icons/coins/smallEth";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import SmallJediswapLogo from "@/assets/icons/coins/smallJediswap";
import TableMySwap from "../layouts/table/tableIcons/mySwap";
import TableMySwapDull from "../layouts/table/tableIcons/mySwapDull";
import TableJediswapLogo from "../layouts/table/tableIcons/jediswapLogo";
import TableJediswapLogoDull from "../layouts/table/tableIcons/jediswapLogoDull";
import {
  selectInputSupplyAmount,
  setCoinSelectedSupplyModal,
  selectWalletBalance,
  setInputSupplyAmount,
  selectSelectedDapp,
  setTransactionStatus,
  selectActiveTransactions,
  setActiveTransactions,
  setTransactionStartedAndModalClosed,
} from "@/store/slices/userAccountSlice";
import {
  selectAprAndHealthFactor,
  selectEffectiveApr,
  selectHealthFactor,
  selectUserLoans,
} from "@/store/slices/readDataSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalDropdown,
  selectModalDropDowns,
  resetModalDropdowns,
} from "@/store/slices/dropdownsSlice";
import ArrowUp from "@/assets/icons/arrowup";
import useSwap from "@/Blockchain/hooks/Writes/useSwap";
import AnimatedButton from "../uiElements/buttons/AnimationButton";
import ErrorButton from "../uiElements/buttons/ErrorButton";
import SuccessButton from "../uiElements/buttons/SuccessButton";
import { useAccount, useWaitForTransaction } from "@starknet-react/core";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import Image from "next/image";
import mixpanel from "mixpanel-browser";
import BtcToDai from "@/assets/icons/pools/btcToDai";
import ReactStars from "react-stars";
import axios from "axios";
import html2canvas from "html2canvas";
const FeedbackModal = ({
  borrowIDCoinMap,
  borrowIds,
  currentId,
  currentMarketCoin,
  BorrowBalance,
  currentSwap,
  setCurrentSwap,
  borrowAPRs,
}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();


  const [currentSelectedCoin, setCurrentSelectedCoin] =
    useState("Select a market");
  const [currentBorrowMarketCoin, setCurrentBorrowMarketCoin] =
    useState(currentMarketCoin);
  const [currentBorrowId, setCurrentBorrowId] = useState(currentId);
  const [inputAmount, setinputAmount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [transactionStarted, setTransactionStarted] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState(BorrowBalance);
  const [uniqueID, setUniqueID] = useState(0);
  const [feedbackSelected, setFeedbackSelected] = useState("")
  const [starRating, setstarRating] = useState(0)
  const [titleBugFeedback, setTitleBugFeedback] = useState("")
  const [descriptionBugFeedback, setdescriptionBugFeedback] = useState("")
  const [titleSuggestions, setTitleSuggestions] = useState("")
  const [descriptionSuggestions, setdescriptionSuggestions] = useState("")
  const getUniqueId = () => uniqueID;

  const dispatch = useDispatch();

  let activeTransactions = useSelector(selectActiveTransactions);

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const handleCaptureClick = async () => {
    const element: any = document.getElementById('buttonclick');
    html2canvas(element).then((canvas) => {
      const screenshotDataUrl = canvas.toDataURL('image/png');
      console.log(screenshotDataUrl, "url")

      // Now you have the screenshot in a data URL format
      // You can send it to the backend using an HTTP request.
    });
  };
  // const borrowIds = [
  //     "ID - 123456",
  //     "ID - 123457",
  //     "ID - 123458",
  //     "ID - 123459",
  //     "ID - 1234510",
  // ];
  const userLoans = useSelector(selectUserLoans);
  //This Function handles the modalDropDowns

  const ratingChanged = (newRating: any) => {
    setstarRating(newRating);
    console.log(starRating, "rating")
  }
  //   mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
  //     debug: true,
  //     track_pageview: true,
  //     persistence: "localStorage",
  //   });
  // const avgs=useSelector(selectAprAndHealthFactor)


  // console.log(onOpen)


  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setFeedbackSelected("");
    setstarRating(0);
  };

  const handleRating = async () => {
    const lastResponseTime = localStorage.getItem('RatingTime');
    if (lastResponseTime) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      if (new Date(lastResponseTime) >= twentyFourHoursAgo) {
        // Rating feature is disabled, so don't make the API call
        console.log('Rating feature is disabled for 24 hours.');
        return;
      }
    }
    axios.post('/api/feedback/rating', { starRating, address })
      .then((response) => {
        if (response) {
          const currentTime = new Date();
          localStorage.setItem('RatingTime', currentTime.toISOString());
        }
        console.log(response, "response"); // Log the response from the backend.
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  const handleBugFeedback=async()=>{
    axios.post('/api/feedback/bug',{address:address,title:titleBugFeedback,description:descriptionBugFeedback,screenshot:""})
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{
      console.log(error);
    })
  }
  return (
    <div>
      <Box>
        <Button
          position="fixed"
          color="white"
          bg="purple"
          top="42vh"
          right="0"
          transform="rotate(-90deg)"
          style={{
            transformOrigin: 'bottom right', // Rotate from the bottom right corner
          }}
          onClick={onOpen}
        >
          Feedback
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetStates();
          }}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay bg="rgba(244, 242, 255, 0.5);" mt="3.8rem" />
          <ModalContent
            bg="white"
            borderRadius="md"
            maxW="464px"
            zIndex={1}
            mt="8rem"
            className="modal-content"
          >
            {feedbackSelected == "" ? <ModalHeader
              // mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
              bg="blue"
              textAlign="center"
              color="white"
            >
              Feedback & Support
            </ModalHeader> : <ModalHeader
              // mt="1rem"
              fontSize="14px"
              fontWeight="600"
              fontStyle="normal"
              lineHeight="20px"
              bg="blue"
              textAlign="center"
              color="white"
            >
              <Box onClick={() => { setFeedbackSelected("") }} cursor="pointer">
                <BtcToDai />

              </Box>
              Feedback & Support
            </ModalHeader>}

            <ModalCloseButton mr="1rem" color="white" />
            <ModalBody>
              {feedbackSelected == "" ?
                <Box>
                  <Box display="flex" gap="2rem" mt="1rem" cursor="pointer" _hover={{ background: "grey" }} onClick={() => { setFeedbackSelected("rating") }}>
                    <Box>
                      <InfoIcon />
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Text fontWeight="600">
                        Rate your experience
                      </Text>
                      <Text>
                        How is your experience so far with
                      </Text>
                      the testnet?
                    </Box>
                  </Box>
                  <Box display="flex" gap="2rem" mt="1rem" cursor="pointer" _hover={{ background: "grey" }} onClick={() => { setFeedbackSelected("reportIssue") }}>
                    <Box>
                      <InfoIcon />
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Text fontWeight="600">
                        Report an issue
                      </Text>
                      <Text>
                        Something broken? Let us know!
                      </Text>
                    </Box>
                  </Box>
                  <Box display="flex" gap="2rem" mt="1rem" cursor="pointer" _hover={{ background: "grey" }} onClick={() => { setFeedbackSelected("suggestion") }}>
                    <Box>
                      <InfoIcon />
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Text fontWeight="600">
                        Send an idea
                      </Text>
                      <Text>
                        Let us know how we can improve
                      </Text>
                    </Box>
                  </Box>
                </Box>
                : feedbackSelected == "rating" ?
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Text textAlign="center">
                      How would you rate our experience
                    </Text>
                    <ReactStars
                      count={5}
                      size={50}
                      color2={'#ffd700'}
                      value={starRating}
                      onChange={ratingChanged}
                    />
                    <Button onClick={handleRating}>
                      Submit
                    </Button>
                  </Box>
                  : feedbackSelected == "reportIssue" ?
                    <Box>
                      <Text textAlign="center">Tell us what's broken</Text>
                      <Input mt="0.4rem" placeholder='Add a title' required value={titleBugFeedback} onChange={(e)=>{setTitleBugFeedback(e.target.value)}} />
                      <Textarea
                        mt="0.8rem"
                        placeholder="Describe the bug in detail"
                        resize="none"
                        value={descriptionBugFeedback}
                        onChange={(e)=>{setdescriptionBugFeedback(e.target.value)}}
                      // resize="vertical" // This allows the textarea to resize vertically as needed
                      />
                      <Box>
                        <Button onClick={handleCaptureClick} mt="0.4rem">
                          Capture
                        </Button>
                      </Box>
                      <Box textAlign="center">

                        <Button mt="0.8rem" textAlign="center" type="submit" isDisabled={!(titleBugFeedback && descriptionBugFeedback)}>
                          Submit
                        </Button>
                      </Box>
                    </Box>
                    : feedbackSelected == "suggestion" ?
                      <Box>
                        <Text textAlign="center">Tell us how we can improve</Text>
                        <Input mt="0.4rem" placeholder='Give your idea a name' value={titleSuggestions} onChange={(e)=>{setTitleSuggestions(e.target.value)}} />
                        <Textarea
                          mt="0.8rem"
                          placeholder="tell us more,including the problem it solves"
                          resize="none"
                          value={descriptionSuggestions}
                          onChange={(e)=>{setdescriptionSuggestions(e.target.value)}}
                        // resize="vertical" // This allows the textarea to resize vertically as needed
                        />
                        <Button onClick={handleCaptureClick} mt="0.4rem">
                          Capture
                        </Button>
                        <Box textAlign="center">

                          <Button mt="0.8rem" textAlign="center" isDisabled={!(titleSuggestions && descriptionSuggestions)}>
                            Submit
                          </Button>
                        </Box>
                      </Box>
                      :

                      ""}

            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};
export default FeedbackModal;
