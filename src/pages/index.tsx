import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [render, setRender] = useState(false);
  const router = useRouter();
  const href = "/market";
  useEffect(() => {
    // setRender(true);
    router.push(href);
  }, [router]);
  return (
    <main className={`${inter.className}`}>
      {render && (
        <>
          <Link href={"/market"}>Market</Link>
        </>
      )}
    </main>
  );
}
