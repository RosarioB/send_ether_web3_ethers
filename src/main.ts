import { Web3 } from "web3";
import { ETH_DATA_FORMAT } from "web3";
import 'dotenv/config'

const main = async () => {
    // Configuring the connection to an Ethereum node
    const network = process.env.ETHEREUM_NETWORK;
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            process.env.INFURA_API_KEY ?? "",
        ),
    );
    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        "0x" + process.env.SIGNER_PRIVATE_KEY,
    );
    web3.eth.accounts.wallet.add(signer);

    const limit = await web3.eth
    .estimateGas(
      {
        from: signer.address,
        to: "0xAED01C776d98303eE080D25A21f0a42D94a86D9c",
        value: web3.utils.toWei("0.0001", "ether"),
      },
      "latest",
      ETH_DATA_FORMAT,
    );

  // Creating the transaction object
  const tx = {
    from: signer.address,
    to: "0x350a97Aa777CcfE518197C34342C5bA262825B35",
    value: web3.utils.toWei("0.0001", "ether"),
    gas: limit,
    nonce: await web3.eth.getTransactionCount(signer.address),
    maxPriorityFeePerGas: web3.utils.toWei("3", "gwei"),
    maxFeePerGas: web3.utils.toWei("300", "gwei"),
    chainId: 11155111,
    type: 0x2,
  };
    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey);
    console.log("Raw transaction data: " + signedTx.rawTransaction);
    // Sending the transaction to the network
    const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
        console.log(`Mining transaction ...`);
        console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})