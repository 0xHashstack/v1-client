import { useEffect } from "react";
import { useRouter } from "next/router";
import { cookieToInitialState } from "wagmi";
import { GetServerSideProps } from "next";
import { config } from "@/services/wagmi/config";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const initialState:any = cookieToInitialState(config, context.req.headers.cookie)
  if(initialState){
    if (initialState.connections instanceof Map) {
      initialState.connections = Array.from(initialState.connections.entries());
    }
    return {
      props: {
        initialState,
      },
    };
  }
  return {
    props: {
      initialState,
    },
  }
}

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/v1");
  }, []);
}
