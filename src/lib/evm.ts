import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

type TweetsProps = {
  name: string;
  description: string;
  upvotes: number;
  comments: string[];
  fromAddress: string;
};

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  private connectContract() {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY!;

    const web3 = createAlchemyWeb3(alchemyKey, {
      writeProvider: this.provider,
    });

    const contractABI = require("../data/contract-abi.json");
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    return new web3.eth.Contract(contractABI, contractAddress);
  }

  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);

      const accounts = await web3.eth.getAccounts();

      return accounts;
    } catch (error: unknown) {
      return error as string[];
    }
  }

  async sendUpVoteTransaction(tweetIndex: string): Promise<string> {
    try {
      const helloWorldContract = this.connectContract();

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .upvote(tweetIndex)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async sendAddCommentTransaction(
    tweetIndex: number,
    comment: string
  ): Promise<string> {
    try {
      const helloWorldContract = this.connectContract();

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .addComment(tweetIndex, comment)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async sendWriteTweetTransaction(
    tweetName: string,
    tweetDescription: string
  ): Promise<string> {
    try {
      const helloWorldContract = this.connectContract();

      let accounts = await this.getAccounts();

      await helloWorldContract.methods
        .writeTweet(tweetName, tweetDescription)
        .send({ from: accounts[0] });

      return "success";
    } catch (error) {
      return error as string;
    }
  }

  async getAllTweets(): Promise<TweetsProps[] | []> {
    try {
      const helloWorldContract = this.connectContract();
      return await helloWorldContract.methods.getAllTweets().call();
    } catch (error) {
      return [];
    }
  }
}
