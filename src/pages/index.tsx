import { useEffect } from "react";
import { useRouter } from "next/router";
import { cookieToInitialState } from "wagmi";
import { GetServerSideProps } from "next";
import { config } from "@/services/wagmi/config";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/v1");
  }, []);

  return null; // or a loading spinner, or some other component as needed
}
