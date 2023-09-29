import React, { useEffect, useState } from "react";
import { useRef } from "react";
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
import StarRating from "@/assets/icons/starRating";
import BugIcon from "@/assets/icons/bugIcon";
import FeedbackIcon from "@/assets/icons/feedbackIcon";
import BackIconFeedback from "@/assets/icons/backIconFeedback";
import CaptureBugIcon from "@/assets/icons/captureBugIcon";
import AddFiles from "@/assets/icons/addFiles";
import CancelIcon from "@/assets/icons/cancelIcon";
import CancelIconSmall from "@/assets/icons/cancelIconSmall";
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
  const [feedbackSelected, setFeedbackSelected] = useState("");
  const [starRating, setstarRating] = useState(0);
  const [titleBugFeedback, setTitleBugFeedback] = useState("");
  const [descriptionBugFeedback, setdescriptionBugFeedback] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState("");
  const [descriptionSuggestions, setdescriptionSuggestions] = useState("");
  const [bugScreenshoturl, setBugScreenshoturl] = useState("");
  const [bugScreenshotFilename, setBugScreenshotFilename] = useState("");
  const [suggestionScreenshotFilename, setSuggestionScreenshotFilename] =
    useState("");
  const [suggestionUrl, setSuggestionUrl] = useState("");
  const [descriptionRatingFeedback, setdescriptionRatingFeedback] =
    useState("");
  const [ratingFeedbackSubmitted, setRatingFeedbackSubmitted] = useState(false);
  const [bugFeedbackSubmitted, setBugFeedbackSubmitted] = useState(false);
  const [suggestionFeedbackSubmitted, setsuggestionFeedbackSubmitted] =
    useState(false);
  const [ratingDisabled, setRatingDisabled] = useState(false);
  const [bugFeedbackDisabled, setBugFeedbackDisabled] = useState(false);
  const [suggestionFeedbackDisabled, setSuggestionFeedbackDisabled] =
    useState(false);
  const dispatch = useDispatch();

  let activeTransactions = useSelector(selectActiveTransactions);
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  // console.log(suggestionUrl,"url")
  const handleImageUploadBug = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      console.log(file.name, "file name");
      setBugScreenshotFilename(file.name);
      // Read the selected image file as a base64 string
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          setBugScreenshoturl(event.target.result as string);
          // console.log("bug  url(upload):-=",event.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
    }
  };
  const handleImageUploadSugegstion = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setSuggestionScreenshotFilename(file.name);
      // Read the selected image file as a base64 string
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          setSuggestionUrl(event.target.result as string);

          //     console.log("base64:-",event.target.result);
          // console.log("sugg  url(upload):-=",event.target.result)
        }
      };
      reader.readAsDataURL(file);
    } else {
    }
  };
  const handleCaptureClick = async () => {
    const element: any = document.getElementById("buttonclick");
    html2canvas(document.body).then((canvas) => {
      const screenshotDataUrl = canvas.toDataURL("image/png");
      setBugScreenshoturl(screenshotDataUrl);
      const timestamp = new Date().getTime();
      const filename = `screenshot_${timestamp}.png`;
      setBugScreenshotFilename(filename);
      // const localURL = window.URL.createObjectURL(
      //   new Blob([atob(screenshotDataUrl)], { type: 'image/png' })
      // );
      // setScreenshotDataLocalhostUrl(localURL);
      console.log("bug  url(capture):-=", screenshotDataUrl);

      const objectURL = window.URL.createObjectURL(
        new Blob([atob(screenshotDataUrl.split(",")[1])], {
          type: screenshotDataUrl.split(":")[1],
        })
      );
    });
  };

  const handleCaptureClickSuggestions = async () => {
    const element: any = document.getElementById("buttonclick");
    html2canvas(document.body).then((canvas) => {
      const screenshotDataUrl = canvas.toDataURL("image/png");
      setSuggestionUrl(screenshotDataUrl);
      const timestamp = new Date().getTime();
      const filename = `screenshot_${timestamp}.png`;
      setSuggestionScreenshotFilename(filename);
      console.log("sugg  url(capture):-=", screenshotDataUrl);

      // Now you have the screenshot in a data URL format
      // You can send it to the backend using an HTTP request.
    });
  };
  const ratingChanged = (newRating: any) => {
    setstarRating(newRating);
  };
  //   mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || "", {
  //     debug: true,
  //     track_pageview: true,
  //     persistence: "localStorage",
  //   });
  // const avgs=useSelector(selectAprAndHealthFactor)

  // console.log(onOpen)

  const deleteBugScreenshot = () => {
    setBugScreenshoturl("");
    setBugScreenshotFilename("");
  };

  const deleteSuggestionScreenshot = () => {
    setSuggestionUrl("");
    setSuggestionScreenshotFilename("");
  };

  const handleClick = () => {
    inputRef.current.click();
  };
  const inputRef: any = useRef();
  const suggestioninputref: any = useRef();
  const handleClickSuggestionUpload = () => {
    suggestioninputref.current.click();
  };
  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  const resetStates = () => {
    setFeedbackSelected("");
    setstarRating(0);
    setTitleBugFeedback("");
    setdescriptionBugFeedback("");
    setBugScreenshoturl("");
    setSuggestionUrl("");
    setTitleSuggestions("");
    setdescriptionSuggestions("");
  };

  const handleRating = async () => {
    const lastResponseTime = localStorage.getItem("RatingTime");
    if (lastResponseTime) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      if (new Date(lastResponseTime) >= twentyFourHoursAgo) {
        // Rating feature is disabled, so don't make the API call
        setRatingDisabled(true);
        console.log("Rating feature is disabled for 24 hours.");
        return;
      }
    }

    axios
      .post(
        "https://5c8l45vyxb.execute-api.ap-southeast-1.amazonaws.com/api/feedback/rating",
        { starRating, address }
      )
      .then((response) => {
        if (response) {
          setRatingFeedbackSubmitted(true);
          const currentTime = new Date();
          localStorage.setItem("RatingTime", currentTime.toISOString());
        }
        console.log(response, "response"); // Log the response from the backend.
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleBugFeedback = async () => {
    const lastResponseTime = localStorage.getItem("BugTime");
    if (lastResponseTime) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 72);
      if (new Date(lastResponseTime) >= twentyFourHoursAgo) {
        // Rating feature is disabled, so don't make the API call
        setBugFeedbackDisabled(true);
        console.log("Bug reporting is disabled for 72 hours.");
        return;
      }
    }
    axios
      .post(
        "https://5c8l45vyxb.execute-api.ap-southeast-1.amazonaws.com/api/feedback/bug",
        {
          address: address,
          title: titleBugFeedback,
          description: descriptionBugFeedback,
          screenshot: bugScreenshoturl,
        }
      )
      .then((response) => {
        if (response) {
          setBugFeedbackSubmitted(true);
          const currentTime = new Date();
          localStorage.setItem("BugTime", currentTime.toISOString());
          console.log(response, "res");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSuggestionFeedback = async () => {
    const lastResponseTime = localStorage.getItem("SuggestionTime");
    if (lastResponseTime) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 96);
      if (new Date(lastResponseTime) >= twentyFourHoursAgo) {
        // Rating feature is disabled, so don't make the API call
        setSuggestionFeedbackDisabled(true);
        console.log("Suggestion reporting is disabled for 96 hours.");
        return;
      }
    }
    axios
      .post(
        "https://5c8l45vyxb.execute-api.ap-southeast-1.amazonaws.com/api/feedback/suggestion",
        {
          address: address,
          title: titleSuggestions,
          description: descriptionSuggestions,
          screenshot: suggestionUrl,
        }
      )
      .then((response) => {
        if (response) {
          setsuggestionFeedbackSubmitted(true);
          const currentTime = new Date();
          localStorage.setItem("SuggestionTime", currentTime.toISOString());
          console.log(response, "res");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Box>
        <Button
          position="fixed"
          color="#F0F0F5"
          border="1px solid var(--Blue-dark, #3841AA)"
          bg="#4D59E8"
          top="42vh"
          right="0"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="20px"
          transform="rotate(-90deg)"
          _hover={{ backgroundColor: "#4D59E8" }}
          transformOrigin="bottom right"
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
            bg="#02010F"
            borderRadius="md"
            maxW="464px"
            height="520px"
            zIndex={1}
            mt="8rem"
            className="modal-content"
          >
            {feedbackSelected == "" ? (
              <ModalHeader
                // mt="1rem"
                fontSize="14px"
                fontWeight="600"
                fontStyle="normal"
                lineHeight="20px"
                mt="1rem"
                color="white"
              >
                Feedback & Support
              </ModalHeader>
            ) : feedbackSelected == "rating" ? (
              <ModalHeader
                // mt="1rem"
                fontSize="14px"
                fontWeight="600"
                fontStyle="normal"
                lineHeight="20px"
                mt="1rem"
                color="white"
                display="flex"
                gap="2rem"
              >
                <Box
                  onClick={() => {
                    resetStates();
                  }}
                  cursor="pointer"
                  mt="0.1rem"
                >
                  <BackIconFeedback />
                </Box>
                Rate your experience
              </ModalHeader>
            ) : feedbackSelected == "reportIssue" ? (
              <ModalHeader
                // mt="1rem"
                fontSize="14px"
                fontWeight="600"
                fontStyle="normal"
                lineHeight="20px"
                mt="1rem"
                color="white"
                display="flex"
                gap="2rem"
              >
                <Box
                  onClick={() => {
                    resetStates();
                  }}
                  cursor="pointer"
                  mt="0.1rem"
                >
                  <BackIconFeedback />
                </Box>
                Report an issue
              </ModalHeader>
            ) : feedbackSelected == "suggestion" ? (
              <ModalHeader
                // mt="1rem"
                fontSize="14px"
                fontWeight="600"
                fontStyle="normal"
                lineHeight="20px"
                mt="1rem"
                color="white"
                display="flex"
                gap="2rem"
              >
                <Box
                  onClick={() => {
                    resetStates();
                  }}
                  cursor="pointer"
                  mt="0.1rem"
                >
                  <BackIconFeedback />
                </Box>
                Suggestions
              </ModalHeader>
            ) : (
              ""
            )}
            <ModalCloseButton mr="1rem" mt="1rem" color="white" />
            <ModalBody>
              {feedbackSelected == "" ? (
                <Box>
                  <Box
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    borderRadius="6px"
                    bg="rgba(103, 109, 154, 0.10)"
                    display="flex"
                    mt="1rem"
                    cursor="pointer"
                    onClick={() => {
                      setFeedbackSelected("rating");
                    }}
                  >
                    <Box mt="1.2rem" ml="1rem">
                      <StarRating />
                    </Box>
                    <Box display="flex" flexDirection="column" p="16px">
                      <Text
                        fontWeight="700"
                        color="#D4BFF8"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        Rate your experience
                      </Text>
                      <Text
                        fontWeight="400"
                        color="#B1B0B5"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        How is your experience so far with the testnet?
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    borderRadius="6px"
                    bg="rgba(103, 109, 154, 0.10)"
                    display="flex"
                    mt="1rem"
                    cursor="pointer"
                    onClick={() => {
                      setFeedbackSelected("reportIssue");
                    }}
                  >
                    <Box mt="1.2rem" ml="1rem">
                      <BugIcon />
                    </Box>
                    <Box display="flex" flexDirection="column" p="16px">
                      <Text
                        fontWeight="700"
                        color="#D4BFF8"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        Report an issue
                      </Text>
                      <Text
                        fontWeight="400"
                        color="#B1B0B5"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        Something broken? Let us know!
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    bg="rgba(103, 109, 154, 0.10)"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    borderRadius="6px"
                    display="flex"
                    mt="1rem"
                    cursor="pointer"
                    onClick={() => {
                      setFeedbackSelected("suggestion");
                    }}
                  >
                    <Box mt="1.2rem" ml="1.5rem">
                      <Image
                        src={"/feedbackIcon.png"}
                        alt="Picture of the author"
                        width="32"
                        height="32"
                        style={{ cursor: "pointer" }}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      p="16px"
                      ml="0.3rem"
                    >
                      <Text
                        fontWeight="700"
                        color="#D4BFF8"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        Suggestions
                      </Text>
                      <Text
                        fontWeight="400"
                        color="#B1B0B5"
                        fontSize="14px"
                        fontStyle="normal"
                      >
                        Let us know how we can improve
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ) : feedbackSelected == "rating" ? (
                ratingDisabled ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="22px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Feedback limit is reached.
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      Please try again after 24 hours
                    </Text>
                  </Box>
                ) : ratingFeedbackSubmitted ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="18px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Thank you!
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      We Really appreciate your feedback.
                    </Text>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent={"space-between"}
                    alignItems="center"
                    mt="1rem"
                  >
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="14px"
                      fontStyle="normal"
                    >
                      How would you rate our experience
                    </Text>
                    <ReactStars
                      count={5}
                      size={60}
                      color2={"#ffd700"}
                      value={starRating}
                      onChange={ratingChanged}
                    />
                    <Button
                      onClick={() => {
                        setRatingFeedbackSubmitted(true);
                        if (!ratingFeedbackSubmitted) {
                          handleRating();
                        }
                      }}
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      color="#6E7681"
                      size="sm"
                      width="100%"
                      mt="14.5rem"
                      mb="1.5rem"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    >
                      Submit
                    </Button>
                  </Box>
                )
              ) : feedbackSelected == "reportIssue" ? (
                bugFeedbackDisabled ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="22px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Feedback limit is reached.
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      Please try again after 72 hours
                    </Text>
                  </Box>
                ) : bugFeedbackSubmitted ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="18px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Thank you!
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      We Really appreciate your feedback.
                    </Text>
                  </Box>
                ) : (
                  <Box height={"100%"} display={"flex"} flexDirection="column">
                    <Box
                      height={"80%"}
                      display="flex"
                      flexDirection="column"
                      justifyContent={"start"}
                      mt="1rem"
                    >
                      <Box
                        display={"flex"}
                        flexDirection="column"
                        height={"70%"}
                      >
                        <Text
                          textAlign="center"
                          fontWeight="400"
                          color="#B1B0B5"
                          fontSize="14px"
                          fontStyle="normal"
                        >
                          Tell us what&apos;s broken
                        </Text>
                        <Input
                          mt="0.4rem"
                          placeholder="Add a title"
                          color="white"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          required
                          value={titleBugFeedback}
                          onChange={(e) => {
                            setTitleBugFeedback(e.target.value);
                          }}
                        />
                        <Textarea
                          mt="0.8rem"
                          placeholder="Describe the bug in detail"
                          resize="none"
                          height="160px"
                          color="white"
                          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                          borderRadius="6px"
                          value={descriptionBugFeedback}
                          onChange={(e) => {
                            setdescriptionBugFeedback(e.target.value);
                          }}
                          // resize="vertical" // This allows the textarea to resize vertically as needed
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        height={"10%"}
                      >
                        <Box
                          onClick={handleCaptureClick}
                          mt="0.4rem"
                          bg="none"
                          cursor="pointer"
                          display="flex"
                          justifyContent="flex-end"
                        >
                          <CaptureBugIcon />
                        </Box>

                        <Box>
                          <Box
                            mt="0.4rem"
                            bg="none"
                            cursor="pointer"
                            display="flex"
                            justifyContent="flex-end"
                          >
                            <Box
                              fontSize={"14px"}
                              color={"white"}
                              cursor="pointer"
                              display="flex"
                              justifyContent="center"
                              onClick={handleClick}
                            >
                              {" "}
                              <AddFiles />
                              <Input
                                hidden={true}
                                ref={inputRef}
                                type={"file"}
                                accept="image/*"
                                onChange={handleImageUploadBug}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {bugScreenshotFilename ? (
                        <Box
                          height={"20%"}
                          mt="0.4rem"
                          color={"white"}
                          display="flex"
                          alignItems={"center"}
                          justifyContent="flex-end"
                        >
                          {/* {bugScreenshotUrl ? <Image width={200} height={200} src={bugScreenshotUrl} alt="Selected" ></Image> : <></>
} */}
                          <Box>{bugScreenshotFilename}</Box>
                          <Box cursor={"pointer"} onClick={deleteBugScreenshot}>
                            <CancelIconSmall />
                          </Box>
                        </Box>
                      ) : (
                        <Box height={"20%"}></Box>
                      )}
                    </Box>
                    <Box
                      height={"20%"}
                      display="flex"
                      flexDirection={"column"}
                      textAlign="center"
                    >
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#6E7681"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        isDisabled={
                          !(titleBugFeedback && descriptionBugFeedback)
                        }
                        onClick={() => {
                          setBugFeedbackSubmitted(true);
                          if (!bugFeedbackSubmitted) {
                            handleBugFeedback();
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )
              ) : feedbackSelected == "suggestion" ? (
                suggestionFeedbackDisabled ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="22px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Feedback limit is reached.
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      Please try again after 96 hours
                    </Text>
                  </Box>
                ) : suggestionFeedbackSubmitted ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    mt="5rem"
                  >
                    <Text
                      fontWeight="700"
                      color="#D4BFF8"
                      fontSize="18px"
                      fontStyle="normal"
                      mt="1rem"
                    >
                      Thank you!
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="16px"
                      fontStyle="normal"
                    >
                      We Really appreciate your feedback.
                    </Text>
                  </Box>
                ) : (
                  <Box height={"100%"} display="flex" flexDirection="column" mt="1rem">
                   <Box flex={'column'}   height={"80%"}>
                    <Box flex="column">
                    <Text
                      textAlign="center"
                      fontWeight="400"
                      color="#B1B0B5"
                      fontSize="14px"
                      fontStyle="normal"
                    >
                      Tell us how we can improve
                    </Text>
                    <Input
                      mt="0.4rem"
                      placeholder="Add a title"
                      color="white"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      value={titleSuggestions}
                      onChange={(e) => {
                        setTitleSuggestions(e.target.value);
                      }}
                    />
                    <Textarea
                      mt="0.8rem"
                      placeholder="Description"
                      resize="none"
                      height="160px"
                      color="white"
                      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                      borderRadius="6px"
                      value={descriptionSuggestions}
                      onChange={(e) => {
                        setdescriptionSuggestions(e.target.value);
                      }}
                      // resize="vertical" // This allows the textarea to resize vertically as needed
                    />
                    {/* <Box onClick={handleCaptureClickSuggestions} mt="0.4rem" bg="none" cursor="pointer" display="flex" width="100%" justifyContent="flex-end">
                          <CaptureBugIcon/>
                        </Box> */}
                        </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Box
                        onClick={handleCaptureClickSuggestions}
                        mt="0.4rem"
                        bg="none"
                        cursor="pointer"
                        display="flex"
                        width="100%"
                        justifyContent="flex-end"
                      >
                        <CaptureBugIcon />
                      </Box>

                      <Box>
                        <Box
                          mt="0.4rem"
                          bg="none"
                          cursor="pointer"
                          display="flex"
                          justifyContent="flex-end"
                        >
                          <Box
                            mt="0.4rem"
                            fontSize={"14px"}
                            color={"white"}
                            cursor="pointer"
                            display="flex"
                            justifyContent="center"
                            onClick={handleClickSuggestionUpload}
                          >
                            {" "}
                            <AddFiles />
                            <Input
                              hidden={true}
                              ref={suggestioninputref}
                              type={"file"}
                              accept="image/*"
                              onChange={handleImageUploadSugegstion}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
<Box flex="column">
                    {suggestionScreenshotFilename ? 
                      <Box
                        mt="0.4rem"
                        color={"white"}
                        display="flex"
                        alignItems={"center"}
                        justifyContent="flex-end"
                      >
                    
                        <Box>{suggestionScreenshotFilename}</Box>
                        <Box
                          cursor={"pointer"}
                          onClick={deleteSuggestionScreenshot}
                        >
                          <CancelIconSmall />
                        </Box>
                      </Box>
                    :<Box></Box>}
                    </Box>
                    </Box>
                    <Box textAlign="center">
                      <Button
                        background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                        color="#6E7681"
                        size="sm"
                        width="100%"
                        mt="1.5rem"
                        mb="1.5rem"
                        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                        isDisabled={
                          !(titleSuggestions && descriptionSuggestions)
                        }
                        onClick={() => {
                          setsuggestionFeedbackSubmitted(true);
                          if (!suggestionFeedbackSubmitted) {
                            handleSuggestionFeedback();
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )
              ) : (
                <></>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};
export default FeedbackModal;
