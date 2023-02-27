import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import browserWallet from "../../assets/images/browserWallet.svg";
export default function EthWalletButton() {
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <label
                      onClick={openConnectModal}
                      style={{
                        backgroundColor: "#2A2E3F",
                        width: "100%",
                        marginBottom: "10px",
                        padding: "15px 10px",
                        fontSize: "18px",
                        borderRadius: "5px",
                        border: "2px solid #00000050",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "15px",
                            color: "#FFF",
                          }}
                        >
                          &nbsp;Connect Browser Wallet
                        </div>
                        <div
                          style={{
                            marginRight: "10px",
                            marginTop: "4px",
                          }}
                        >
                          <Image
                            src={browserWallet}
                            alt="Picture of the author"
                            width="25px"
                            height="25px"
                          />
                        </div>
                      </div>
                    </label>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }

                return (
                  <label
                    onClick={openConnectModal}
                    style={{
                      backgroundColor: "#000",
                      width: "100%",
                      marginBottom: "10px",
                      padding: "15px 10px",
                      fontSize: "18px",
                      borderRadius: "5px",
                      border: "2px solid #00000050",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#FFF",
                        }}
                      >
                        &nbsp;Connect Browser Wallet
                      </div>
                      <div
                        style={{
                          marginRight: "10px",
                          marginTop: "4px",
                        }}
                      >
                        <Image
                          src={browserWallet}
                          alt="Picture of the author"
                          width="25px"
                          height="25px"
                        />
                      </div>
                    </div>
                  </label>
                );

                // return (
                //   <div style={{ display: "flex", gap: 12 }}>
                //     <button
                //       onClick={openChainModal}
                //       style={{
                //         display: "flex",
                //         alignItems: "center",
                //       }}
                //       type="button"
                //     >
                //       {chain.hasIcon && (
                //         <div
                //           style={{
                //             background: chain.iconBackground,
                //             width: 12,
                //             height: 12,
                //             borderRadius: 999,
                //             overflow: "hidden",
                //             marginRight: 4,
                //           }}
                //         >
                //           {chain.iconUrl && (
                //             <img
                //               alt={chain.name ?? "Chain icon"}
                //               src={chain.iconUrl}
                //               style={{ width: 12, height: 12 }}
                //             />
                //           )}
                //         </div>
                //       )}
                //       {chain.name}
                //     </button>

                //     <button onClick={openAccountModal} type="button">
                //       {account.displayName}
                //       {account.displayBalance
                //         ? ` (${account.displayBalance})`
                //         : ""}
                //     </button>
                //   </div>
                // );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
