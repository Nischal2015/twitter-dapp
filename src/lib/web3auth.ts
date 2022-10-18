import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import "dotenv/config";

const web3auth = new Web3AuthCore({
  clientId: process.env.WEB3AUTH_CLIENT_ID!,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: process.env.MUMBAI_CHAIN_ID!,
    rpcTarget: process.env.MUMBAI_RPC_URL!,
    blockExplorer: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
});

const openLoginAdapter = new OpenloginAdapter({
  adapterSettings: {
    clientId: process.env.AUTH0_CLIENT_ID!,
    network: "testnet",
    uxMode: "popup",
    whiteLabel: {
      name: "Twitter DApp",
      defaultLanguage: "en",
      dark: true,
    },
    loginConfig: {
      jwt: {
        name: "Custom Auth Login",
        verifier: "twitter-dapp-nischal",
        typeOfLogin: "twitter",
        clientId: process.env.AUTH0_CLIENT_ID!,
      },
    },
  },
});

const torusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {},
  walletInitOptions: {
    whiteLabel: {
      theme: { isDark: true, colors: { primary: "#00a8ff" } },
      logoDark: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      logoLight: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    useWalletConnect: true,
    enableLogging: true,
  },
});

web3auth.configureAdapter(openLoginAdapter);
await web3auth.addPlugin(torusPlugin);
await web3auth.init();
