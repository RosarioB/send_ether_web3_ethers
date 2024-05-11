import ethers, { InfuraProvider, Wallet, parseUnits } from "ethers";
import 'dotenv/config'

const main = async () => {
  // Configuring the connection to an Ethereum node
  const network: String = "sepolia";
  const provider = new InfuraProvider(
    "sepolia",
    process.env.INFURA_PROJECT_ID,
    process.env.INFURA_PROJECT_SECRET
  );
  // Creating a signing account from a private key
  const signer = new Wallet(process.env.SIGNER_PRIVATE_KEY ?? "", provider);

  // Creating and sending the transaction object
  const tx = await signer.sendTransaction({
    to: "0x350a97Aa777CcfE518197C34342C5bA262825B35",
    value: parseUnits("0.001", "ether"),
  });
  console.log("Mining transaction...");
  console.log(`https://${network}.etherscan.io/tx/${tx.hash}`);
  // Waiting for the transaction to be mined
  const receipt = await tx.wait();
  // The transaction is now on chain!
  if(receipt != null){
    console.log(`Mined in block ${receipt.blockNumber}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})