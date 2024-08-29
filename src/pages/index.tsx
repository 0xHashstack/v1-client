import { useEffect } from "react";
import { useRouter } from "next/router";
import { cookieToInitialState } from "wagmi";
import { GetServerSideProps } from "next";
import { config } from "@/services/wagmi/config";
export const getServerSideProps: GetServerSideProps = async (context) => {
  let initialState: any = cookieToInitialState(config, context.req.headers.cookie);

  if (initialState) {
    // Handle connections Map serialization
    if (initialState.connections instanceof Map) {
      initialState.connections = Array.from(initialState.connections.entries());
    }

    // Replace undefined values with null for JSON serialization
    initialState = JSON.parse(JSON.stringify(initialState, (key, value) =>
      value === undefined ? null : value
    ));
  }

  return {
    props: {
      initialState: initialState || {},
    },
  };
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/v1");
  }, []);

  return null; // or a loading spinner, or some other component as needed
}
