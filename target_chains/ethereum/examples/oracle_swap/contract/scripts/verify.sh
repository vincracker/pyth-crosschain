forge verify-contract \
    --chain-id 5 \
    --num-of-optimizations 1000000 \
    --watch \
    --constructor-args $(cast abi-encode "constructor(string,string,address)" "My token B" "TEST B" 0x3394ccdeA874E2a2D0C80dce2E716283424598Ef) \
    --etherscan-api-key DJ7ZG1ZC8PY2USGF54FTBJS92P1VA4MQUU \
    --compiler-version v0.8.4 \
    0x3394ccdeA874E2a2D0C80dce2E716283424598Ef \
    ERC20Mock