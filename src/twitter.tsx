import { useEffect } from "react";

import Leftbar from "./components/leftbar";

import AddTweet from "./components/addtweet";

import TweetListings from "./components/TweetsListings";

import Search from "./components/search";

import Trends from "./components/trends";

function Twitter(props: any) {
  useEffect(() => {
    props.fetchAllTweets();
  }, [""]);

  return (
    <div className='twitter-main'>
      <Leftbar signout={props.logoutButton} />

      <div className='center'>
        <AddTweet
          handleNewTweetDescriptionChange={
            props.handleNewTweetDescriptionChange
          }
          handleNewTweetNameChange={props.handleNewTweetNameChange}
          addNewTweet={props.addNewTweet}
          fetchAllTweets={props.fetchAllTweets}
          refresh={props.refresh}
          username={props.username}
          profileimage={props.profileimage}
        ></AddTweet>

        <TweetListings
          tweets={props.tweets}
          upVote={props.upVote}
          handleCommentChange={props.handleCommentChange}
          addComment={props.addComment}
        ></TweetListings>
      </div>

      <div className='rightbar'>
        <Search />
        <Trends />
      </div>
    </div>
  );
}

export default Twitter;
