#!/bin/bash -e

# URL of the ethereum RPC node to use. Choose this based on your target network
# (e.g., this deploys to goerli optimism testnet)
RPC_URL=https://eth-goerli.g.alchemy.com/v2/x949f60GYj-0Z9PYHhowKw4xrW3QSbeX

# Name and symbol for the test token.
TOKEN_NAME="My token B"
TOKEN_SYMBOL="TEST B"
# Fill this in with your wallet address, 0x....
INITIAL_MINT="0x3394ccdeA874E2a2D0C80dce2E716283424598Ef"

# Note the -l here uses a ledger wallet to deploy your contract. You may need to change this
# option if you are using a different wallet.
#forge create ERC20Mock --rpc-url $RPC_URL --private-key 6b7a5d840c23cb58f79dfffcc51745cc2d0685298f430cbf750316a6c6bb51bc --constructor-args "$TOKEN_NAME" "$TOKEN_SYMBOL" "$INITIAL_MINT" "0"

forge verify-contract \
    --chain-id 5 \
    --watch \
    --constructor-args $(cast abi-encode "constructor(string,string,address,uint256)" "My token B" "TEST B" 0x3394ccdeA874E2a2D0C80dce2E716283424598Ef 0) \
    --compiler-version v0.8.4 \
    0x436F4B0b4147504A4c8Be8f4D985c0E5CC3347f3 \
    ERC20Mock DJ7ZG1ZC8PY2USGF54FTBJS92P1VA4MQUU


#cast send --rpc-url https://eth-goerli.g.alchemy.com/v2/x949f60GYj-0Z9PYHhowKw4xrW3QSbeX --private-key 6b7a5d840c23cb58f79dfffcc51745cc2d0685298f430cbf750316a6c6bb51bc 0x436F4B0b4147504A4c8Be8f4D985c0E5CC3347f3 "mint(address,uint256)" 0x3394ccdeA874E2a2D0C80dce2E716283424598Ef 100000000000000000
