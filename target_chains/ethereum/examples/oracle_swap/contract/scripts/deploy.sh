#!/bin/bash -e

# URL of the ethereum RPC node to use. Choose this based on your target network
# (e.g., this deploys to goerli optimism testnet)
RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/oOYCTVePUP2MgycnfRRatbS8bwL2LVk5

# The address of the Pyth contract on your network. See the list of contract addresses here https://docs.pyth.network/pythnet-price-feeds/evm
PYTH_CONTRACT_ADDRESS="0xff1a0f4744e8582DF1aE09D5611b887B6a12925C"
# The Pyth price feed ids of the base and quote tokens. The list of ids is available here https://pyth.network/developers/price-feed-ids
# Note that each feed has different ids on mainnet and testnet.
BASE_FEED_ID="0x08f781a893bc9340140c5f89c8a96f438bcfae4d1474cc0f688e3a52892c7318"
QUOTE_FEED_ID="0x1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588"
# The address of the base and quote ERC20 tokens.
# BASE_ERC20_ADDR="0x5683CBaFC61139F4334794B0a6Ecf4B5B29dd9eF"
# QUOTE_ERC20_ADDR="0x519bFd2da092B7d393bFaE8233eE02AdDB3c4314"
BASE_ERC20_ADDR="0xB3a2EDFEFC35afE110F983E32Eb67E671501de1f"
QUOTE_ERC20_ADDR="0x8C65F3b18fB29D756d26c1965d84DBC273487624"

# Note the -l here uses a ledger wallet to deploy your contract. You may need to change this
# option if you are using a different wallet.
forge create src/OracleSwap.sol:OracleSwap \
  --rpc-url $RPC_URL \
  --private-key c231c43fa2aa48ffafe191a2b4fa42b9396bf52b4991cf079ff77cd7c2312d3b \
  --constructor-args \
  $PYTH_CONTRACT_ADDRESS \
  $BASE_FEED_ID \
  $QUOTE_FEED_ID \
  $BASE_ERC20_ADDR \
  $QUOTE_ERC20_ADDR
