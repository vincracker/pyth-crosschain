import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { BigNumber } from "ethers";
import { TokenConfig, numberToTokenQty, tokenQtyToNumber } from "./utils";
import IPythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";
import OracleSwapAbi from "./abi/OracleSwapAbi.json";
import { approveToken, getApprovedQuantity } from "./erc20";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

/**
 * The order entry component lets users enter a quantity of the base token to buy/sell and submit
 * the transaction to the blockchain.
 */
export function OrderLiquidity(props: {
    web3: Web3 | undefined;
    account: string | null;
    isAdd: boolean;
    approxPrice: number | undefined;
    baseToken: TokenConfig;
    quoteToken: TokenConfig;
    priceServiceUrl: string;
    pythContractAddress: string;
    swapContractAddress: string;
}) {
    const [lpQty, setlpQty] = useState<string>("1");
    const [qty, setQty] = useState<string>("1");
    //   const [quoteQty, setQuoteQty] = useState<string>("1");
    const [qtyBn, setQtyBn] = useState<BigNumber | undefined>(
        BigNumber.from("1")
    );
    const [quoteQtyBn, setQuoteQtyBn] = useState<BigNumber | undefined>(
        BigNumber.from("1")
    );

    const [lpQtyBn, setlpQtyBn] = useState<BigNumber | undefined>(
        BigNumber.from("1")
    ); 

    const [authorizedQty, setAuthorizedQty] = useState<BigNumber>(
        BigNumber.from("0")
    );

    const [authorizedQuoteQty, setAuthorizedQuoteQty] = useState<BigNumber>(
        BigNumber.from("0")
    );
    const [authorizeLpQty, setAuthorizeLpQty] = useState<BigNumber>(BigNumber.from("0"))

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isQuoteAuthorized, setIsQuoteAuthorized] = useState<boolean>(false);
    const [isLpAuthorized, setIsLpAuthorized] = useState<boolean>(false);

    const [spentToken, setSpentToken] = useState<TokenConfig>(props.baseToken);
    const [approxQuoteSize, setApproxQuoteSize] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (props.isAdd) {
            setSpentToken(props.quoteToken);
        } else {
            setSpentToken(props.baseToken);
        }
    }, [props.isAdd, props.baseToken, props.quoteToken]);

    useEffect(() => {
        async function helper() {
            if (props.web3 !== undefined && props.account !== null) {
                setAuthorizedQty(
                    await getApprovedQuantity(
                        props.web3!,
                        props.baseToken.erc20Address,
                        props.account!,
                        props.swapContractAddress
                    )
                );
                setAuthorizedQuoteQty(
                    await getApprovedQuantity(
                        props.web3!,
                        props.quoteToken.erc20Address,
                        props.account!,
                        props.swapContractAddress
                    )
                );
            } else {
                setAuthorizedQty(BigNumber.from("0"));
                setAuthorizedQuoteQty(BigNumber.from("0"));
            }
        }

        helper();
        const interval = setInterval(helper, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [props.web3, props.account, props.swapContractAddress, spentToken]);

    useEffect(() => {

        try {
            const qtyBn = numberToTokenQty(qty, props.baseToken.decimals);
            let quoteQtyBn = numberToTokenQty(qty, props.quoteToken.decimals);
            if (approxQuoteSize !== undefined) {
                quoteQtyBn = numberToTokenQty(approxQuoteSize, props.quoteToken.decimals);
            }
            //   console.log(quoteQtyBn);
            setQtyBn(qtyBn);
            setQuoteQtyBn(quoteQtyBn);
        } catch (error) {
            setQtyBn(undefined);
            setQuoteQtyBn(undefined);
        }
    }, [props.baseToken.decimals, qty]);

    useEffect(() => {
        if (qtyBn !== undefined) {
            setIsAuthorized(authorizedQty.gte(qtyBn));
        } else {
            setIsAuthorized(false);
        }

        if (quoteQtyBn !== undefined) {
            setIsQuoteAuthorized(authorizedQuoteQty.gte(quoteQtyBn));
        } else {
            setIsQuoteAuthorized(false);
        }
    }, [qtyBn, quoteQtyBn, authorizedQty, authorizedQuoteQty]);

    useEffect(() => {
        if (qtyBn !== undefined && props.approxPrice !== undefined) {
            setApproxQuoteSize(
                tokenQtyToNumber(qtyBn, props.baseToken.decimals) * props.approxPrice
            );
            //   setLiquidityPair([qty,qty]);
        } else {
            setApproxQuoteSize(undefined);
        }
    }, [props.approxPrice, props.baseToken.decimals, qtyBn]);


    useEffect(() => {
        async function helper() {
            if (props.web3 !== undefined && props.account !== null) {
                setAuthorizeLpQty(
                    await getApprovedQuantity(
                        props.web3!,
                        props.swapContractAddress,
                        props.account!,
                        props.swapContractAddress
                    )
                );
            } else {
                setAuthorizeLpQty(BigNumber.from("0"));
            }
        }

        helper();
        const interval = setInterval(helper, 3000);

        return () => {
            clearInterval(interval);
        };
    },[
        lpQty,props.baseToken.decimals
    ]);

    useEffect(() => {
        if (lpQtyBn !== undefined) {
            setIsLpAuthorized(authorizeLpQty.gte(lpQtyBn));
        } else {
            setIsLpAuthorized(false);
        }

    }, [lpQtyBn, authorizeLpQty]);

    useEffect(() => {

        try {
            const lpQtyBn = numberToTokenQty(lpQty, props.baseToken.decimals);
            //   console.log(quoteQtyBn);
            setlpQtyBn(lpQtyBn);
        } catch (error) {
            setlpQtyBn(undefined);
        }
    }, [props.baseToken.decimals, lpQty]);

    return (
        <div>

            {props.isAdd ? (
            <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>

                <div>
                    <p>
                        <input
                            type="text"
                            name="base"
                            value={qty}
                            onChange={(event) => {
                                setQty(event.target.value);
                            }}
                        />
                        {props.baseToken.name}
                    </p>
                    {/* {qtyBn !== undefined && approxQuoteSize !== undefined ? (
      props.isAdd ? (
        <p>
          Pay {approxQuoteSize.toFixed(3)} {props.quoteToken.name} to
          receive{" "}
          {tokenQtyToNumber(qtyBn, props.baseToken.decimals).toFixed(3)}{" "}
          {props.baseToken.name}
        </p>
      ) : (
        <p>
          Pay {tokenQtyToNumber(qtyBn, props.baseToken.decimals).toFixed(3)}{" "}
          {props.baseToken.name} to receive {approxQuoteSize.toFixed(3)}{" "}
          {props.quoteToken.name}
        </p>
      )
    ) : (
      <p>Transaction details are loading...</p>
    )} */}

                    <div className={"swap-steps"}>
                        {props.account === null || props.web3 === undefined ? (
                            <div>Connect your wallet to approve</div>
                        ) : (
                            <div>
                                <button
                                    onClick={async () => {
                                        await approveToken(
                                            props.web3!,
                                            props.baseToken.erc20Address,
                                            props.account!,
                                            props.swapContractAddress
                                        );
                                    }}
                                    disabled={isAuthorized}
                                >
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <div>
                    <p>
                        <input
                            disabled
                            type="text"
                            name="quote"
                            value={approxQuoteSize ? approxQuoteSize : qty}
                        />
                        {props.quoteToken.name}
                    </p>
                    {/* {qtyBn !== undefined && approxQuoteSize !== undefined ? (
      props.isAdd ? (
        <p>
          Pay {approxQuoteSize.toFixed(3)} {props.quoteToken.name} to
          receive{" "}
          {tokenQtyToNumber(qtyBn, props.baseToken.decimals).toFixed(3)}{" "}
          {props.baseToken.name}
        </p>
      ) : (
        <p>
          Pay {tokenQtyToNumber(qtyBn, props.baseToken.decimals).toFixed(3)}{" "}
          {props.baseToken.name} to receive {approxQuoteSize.toFixed(3)}{" "}
          {props.quoteToken.name}
        </p>
      )
    ) : (
      <p>Transaction details are loading...</p>
    )} */}
                    <div className={"swap-steps"}>
                        {props.account === null || props.web3 === undefined ? (
                            <div>Connect your wallet to approve</div>
                        ) : (
                            <div>
                                <button
                                    onClick={async () => {
                                        await approveToken(
                                            props.web3!,
                                            props.quoteToken.erc20Address,
                                            props.account!,
                                            props.swapContractAddress
                                        );
                                    }}
                                    disabled={isQuoteAuthorized}
                                >
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className={"swap-steps"}>
                    {props.account === null || props.web3 === undefined ? (
                        <div>Connect your wallet to approve</div>
                    ) : (
                        <div>
                            <button
                                onClick={async () => {
                                    await addLiquidityTx(
                                        props.web3!,
                                        props.priceServiceUrl,
                                        props.baseToken.pythPriceFeedId,
                                        props.quoteToken.pythPriceFeedId,
                                        props.pythContractAddress,
                                        props.swapContractAddress,
                                        props.account!,
                                        qtyBn!,
                                    );
                                }}
                                disabled={!isAuthorized || !isQuoteAuthorized}
                            >
                                {props.isAdd ? "Add Liquidity" : "Remove Liquidity"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            </div>
            ) : <div>
                <p>
                    <input
                        type="text"
                        name="lpToken"
                        value={lpQty}
                        onChange={(event) => {
                            setlpQty(event.target.value);
                        }}
                    />
                    {"LpToken"}
                </p>


                <div className={"swap-steps"}>
                    {props.account === null || props.web3 === undefined ? (
                        <div>Connect your wallet to approve</div>
                    ) : (
                        <div>
                            <button
                                onClick={async () => {
                                    await approveToken(
                                        props.web3!,
                                        props.swapContractAddress,
                                        props.account!,
                                        props.swapContractAddress
                                    );
                                }}
                                disabled={isLpAuthorized}
                            >
                                Approve
                            </button>
                        </div>
                    )}

                </div>
                <div>
                        <div className={"swap-steps"}>
                            {props.account === null || props.web3 === undefined ? (
                                <div>Connect your wallet to approve</div>
                            ) : (
                                <div>
                                    <button
                                        onClick={async () => {
                                            await removeLiquidityTx(
                                                props.web3!,
                                                props.priceServiceUrl,
                                                props.baseToken.pythPriceFeedId,
                                                props.quoteToken.pythPriceFeedId,
                                                props.pythContractAddress,
                                                props.swapContractAddress,
                                                props.account!,
                                                lpQtyBn!
                                            );
                                        }}
                                        disabled={!isLpAuthorized}
                                    >
                                        Remove Liquidity
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


 

            </div>}










        </div>
    );
}

async function addLiquidityTx(
    web3: Web3,
    priceServiceUrl: string,
    baseTokenPriceFeedId: string,
    quoteTokenPriceFeedId: string,
    pythContractAddress: string,
    swapContractAddress: string,
    sender: string,
    qtyWei: BigNumber,
) {

    const pythPriceService = new EvmPriceServiceConnection(priceServiceUrl);
    const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
        baseTokenPriceFeedId,
        quoteTokenPriceFeedId,
    ]);


    const pythContract = new web3.eth.Contract(
        IPythAbi as any,
        pythContractAddress
    );


    const updateFee = await pythContract.methods
        .getUpdateFee(priceFeedUpdateData)
        .call();


    const swapContract = new web3.eth.Contract(
        OracleSwapAbi as any,
        swapContractAddress
    );

    await swapContract.methods
        .addLiquidity(qtyWei, priceFeedUpdateData)
        .send({ value: updateFee, from: sender });
}

async function removeLiquidityTx(
    web3: Web3,
    priceServiceUrl: string,
    baseTokenPriceFeedId: string,
    quoteTokenPriceFeedId: string,
    pythContractAddress: string,
    swapContractAddress: string,
    sender: string,
    lpQtyWei: BigNumber,
) {
    const pythPriceService = new EvmPriceServiceConnection(priceServiceUrl);
    const priceFeedUpdateData = await pythPriceService.getPriceFeedsUpdateData([
        baseTokenPriceFeedId,
        quoteTokenPriceFeedId,
    ]);


    const pythContract = new web3.eth.Contract(
        IPythAbi as any,
        pythContractAddress
    );


    const updateFee = await pythContract.methods
        .getUpdateFee(priceFeedUpdateData)
        .call();

    const swapContract = new web3.eth.Contract(
        OracleSwapAbi as any,
        swapContractAddress
    );

    await swapContract.methods
        .removeLiquidity(lpQtyWei, priceFeedUpdateData)
        .send({ value: updateFee, from: sender });
}
