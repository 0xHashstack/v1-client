import { Box, Button, HStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PageCard from "@/components/layouts/pageCard";

const submissionsData = [
  {
    type: "Article",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
    img: "",
  },
  {
    type: "Twitter Thread",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Review",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Tiktok Feature",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Article",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Twitter Thread",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Review",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Tiktok Feature",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
  {
    type: "Article",
    points: 100,
    link: "http://localhost:3000/v1/ccp_submissions/",
  },
];

const filterButtons = [
  "Medium Article",
  "Twitter Tweet",
  "Youtube Video",
  "Telegram Post",
  "Instagram Reels",
  "Instagram Post",
  "Reddit Post",
  "TikTok Video",
];

interface SubmissionData {
  "Content Platform": string;
  Link: string;
  Timestamp: string;
  "Wallet Address (StarkNet)": string;
  Allocated: string;
  "Recommended (Community Team)": string;
}

const CcpSubmissions: NextPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("Medium Article");
  const [filteredSubmissionData, setFilteredSubmissionData] = useState<
    SubmissionData[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { walletAddress } = router.query;

  useEffect(() => {
    try {
      setLoading(true);
      const fetchUserCCPData = async () => {
        const res = await axios.get(
          `https://hstk.fi/api/ccp/submission/${walletAddress}`
        );
        setFilteredSubmissionData(
          (res?.data as SubmissionData[]).filter(
            (item) => item["Content Platform"] === selectedFilter
          )
        );
      };
      if (walletAddress) {
        fetchUserCCPData();
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, walletAddress]);

  return (
    <PageCard pt="6.5rem">
      <HStack
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        width="95%"
      >
        <Box
          bg="transparent"
          fontSize="14px"
          lineHeight="20px"
          letterSpacing="-0.15px"
          padding="1.125rem 0.4rem"
          borderRadius="0px"
          borderBottom={"2px solid #4D59E8"}
          color="#B1B0B5"
          marginTop=".5rem"
          display="flex"
        >
          Leaderboard/Submissions/CCP/{" "}
          <Text color="#fff">
            {walletAddress?.toString().substring(0, 5)}...
            {walletAddress
              ?.toString()
              .substring(walletAddress?.length - 5, walletAddress?.length)}
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={{ base: ".5rem", sm: "1rem" }}
          marginTop="2.6rem"
          overflowX="auto"
          width="100%"
        >
          {filterButtons.map((item, i) => (
            <Button
              key={i}
              color={selectedFilter === item ? "white" : "#676C9B"}
              background={selectedFilter === item ? "#4D59E8" : "#140E2D"}
              padding={{ base: "0rem .5rem", sm: "0rem .7rem" }}
              borderRadius="md"
              fontSize={{ base: "12px", sm: "14px" }}
              fontWeight="semibold"
              height="2rem"
              _hover={{ bg: "#4D59E8", color: "white" }}
              onClick={() => setSelectedFilter(item)}
            >
              {item === "Medium Article" ? "Article" : item}
            </Button>
          ))}
        </Box>
      </HStack>

      <HStack
        display="grid"
        gridTemplateColumns={{
          sm: "auto",
          md: "auto auto",
          lg: "auto auto auto",
        }}
        gap="1.5rem"
        width="95%"
        marginTop="1.5rem"
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Text color="#fff">Loading...</Text>
          </Box>
        ) : (
          filteredSubmissionData?.map((item, i) => (
            <Box borderRadius="lg" border="1px solid #282A44" key={i}>
              <Box
                height={200}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/submission_placeholder.svg"
                  width={137}
                  height={81}
                  alt="img"
                  style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                />
              </Box>
              <Box
                background="#16162C"
                display="flex"
                flexDirection="column"
                alignItems="start"
                width="100%"
                padding=".8rem .8rem"
                gap=".8rem"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Text color="white">CCP 1 - {item["Content Platform"]}</Text>
                  <Box
                    color="black"
                    background="#B3894D"
                    height="1.5rem"
                    paddingX=".4rem"
                    fontSize="md"
                    fontWeight="semibold"
                    borderRadius="md"
                  >
                    Points - {item["Recommended (Community Team)"]}
                  </Box>
                </Box>
                <Link href="#">
                  <Text
                    color="#4F59E9"
                    fontSize="sm"
                    // isTruncated={item.Link.length > 30}
                  >
                    {item.Link.length > 30
                      ? item.Link.substring(0, 40) + "..."
                      : item.Link}
                    {/* {item.Link} */}
                  </Text>
                </Link>
              </Box>
            </Box>
          ))
        )}
      </HStack>
    </PageCard>
  );
};

export default CcpSubmissions;
