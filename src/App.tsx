import { useEffect, useState } from "react";
import { Web3AuthCore } from "@web3auth/core";
import { WALLET_ADAPTERS, SafeEventEmitterProvider } from "@web3auth/base";
import { ToastContainer, toast } from "react-toastify";
import { webAuth } from "./lib/web3auth";
import RPC from "./lib/evm";
import Twitter from "./twitter";
import google from "./assets/google.png";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [tweets, setTweets] = useState<Array<any> | null>(null);
  const [comment, setComment] = useState<string | "">("");
  const [userName, setUserName] = useState<string | "">("");
  const [profileImage, setProfileImage] = useState<string | "">("");
  const [newTweetName, setNewTweetName] = useState<string | "">("");
  const [newTweetDescription, setNewTweetDescription] = useState<string | "">(
    ""
  );
  const refreshTime = 30 * 1000;

  useEffect(() => {
    const init = async () => {
      try {
        const { web3auth } = await webAuth();

        setWeb3auth(web3auth);

        if (web3auth.provider) {
          setProvider(web3auth.provider);

          let user = await web3auth.getUserInfo();
          if (
            user.name &&
            user.name !== null &&
            user.name !== " " &&
            user.name !== ""
          )
            setUserName(user.name);

          if (
            user.profileImage &&
            user.profileImage !== null &&
            user.profileImage !== " " &&
            user.profileImage !== ""
          )
            setProfileImage(user.profileImage);
        }

        await fetchAllTweets();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);
  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );

    setProvider(web3authProvider);

    if (web3authProvider) {
      let user = await web3auth.getUserInfo();

      if (
        user.name &&
        user.name !== null &&
        user.name !== " " &&
        user.name !== ""
      )
        setUserName(user.name);

      if (
        user.profileImage &&
        user.profileImage !== null &&
        user.profileImage !== " " &&
        user.profileImage !== ""
      )
        setProfileImage(user.profileImage);
    }
  };

  const refresh = (e: any) => {
    e.preventDefault();
    fetchAllTweets();
  };

  const fetchAllTweets = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    try {
      let fetchedTweets = await rpc.getAllTweets();
      let tweets = [...fetchedTweets];
      setTweets(tweets.reverse());
    } catch (error) {
      console.log("error in fetching tweets", error);
    }
  };

  const upVote = async (tweetIndex: any) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      await rpc.sendUpVoteTransaction(tweetIndex);

      fetchAllTweets();
    } catch (error) {
      console.log("failed to execute upvote transaction", error);
    }
  };

  const addNewTweet = (e: any) => {
    e.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);
      toast.success("Tweet added successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      rpc.sendWriteTweetTransaction(newTweetName, newTweetDescription);
      setTimeout(function () {
        fetchAllTweets();
      }, refreshTime);

      fetchAllTweets();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute new tweet transaction", error);
    }
  };

  const addComment = async (event: any, tweetIndex: any) => {
    event.preventDefault();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }

    try {
      const rpc = new RPC(provider);

      toast.success("Comment added successfully - refresh after 30 sec", {
        position: toast.POSITION.TOP_CENTER,
      });
      await rpc.sendAddCommentTransaction(tweetIndex, comment);
      fetchAllTweets();
    } catch (error) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_LEFT,
      });
      console.log("failed to execute add comment transaction", error);
    }
  };

  // Event handlers
  const handleCommentChange = async (event: any) => {
    setComment(event.target.value);
  };

  const handleNewTweetNameChange = async (event: any) => {
    setNewTweetName(event.target.value);
  };

  const handleNewTweetDescriptionChange = async (event: any) => {
    setNewTweetDescription(event.target.value);
  };

  const unloggedInView = (
    <div className='login-account'>
      <button className='twitter-bg btn login' onClick={login}>
        <img src={google} alt='' className='login-btn-img' />
        Sign in with Google
      </button>
    </div>
  );

  return (
    <div className='grid'>
      {provider ? (
        <Twitter
          logoutButton={logout}
          handleNewTweetDescriptionChange={handleNewTweetDescriptionChange}
          handleNewTweetNameChange={handleNewTweetNameChange}
          addNewTweet={addNewTweet}
          fetchAllTweets={fetchAllTweets}
          tweets={tweets}
          upVote={upVote}
          handleCommentChange={handleCommentChange}
          addComment={addComment}
          refresh={refresh}
          username={userName}
          profileimage={profileImage}
        />
      ) : (
        unloggedInView
      )}{" "}
      <ToastContainer />
    </div>
  );
}

export default App;
