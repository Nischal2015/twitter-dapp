import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { CHAIN_NAMESPACES } from "@web3auth/base";

export const webAuth = async () => {
  const web3auth = new Web3AuthCore({
    clientId: import.meta.env.VITE_CLIENT_ID!,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x13881",
      rpcTarget: import.meta.env.VITE_RPC_TARGET,
      blockExplorer: "https://etherscan.io/",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
  });

  const openLoginAdapter = new OpenloginAdapter({
    adapterSettings: {
      clientId: "u9uW4T193pNKKJ3JonHkhN3HfwuTU2lA",
      network: "testnet",
      uxMode: "popup",
      whiteLabel: {
        name: "Twitter DApp",
        defaultLanguage: "en",
        dark: true,
      },
      loginConfig: {
        google: {
          name: "Custom Auth Login",
          verifier: "google-test-nischal",
          typeOfLogin: "google",
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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

  return { web3auth };
};
