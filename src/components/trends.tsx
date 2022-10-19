import React from "react";

function Trends() {
  return (
    <>
      <div className='trendings'>
        <h3>Trends for you</h3>

        <a href='http://web3auth.io/' title='' target='_blank' rel='noreferrer'>
          <strong>#Web3Auth</strong>

          <span>125k tweets</span>
        </a>

        <a
          href='http://goerlifaucet.com/'
          title=''
          target='_blank'
          rel='noreferrer'
        >
          <strong>#GoerliFaucet</strong>

          <span>98k tweets</span>
        </a>

        <a
          href='http://twitter.com/hashtag/EthereumMerge'
          title=''
          target='_blank'
          rel='noreferrer'
        >
          <strong>#EthereumMerge</strong>

          <span>53k tweets</span>
        </a>

        <a
          href='https://metaschool.so/'
          title=''
          target='_blank'
          rel='noreferrer'
        >
          <strong>#Metaschool</strong>

          <span>42k tweets</span>
        </a>
      </div>
    </>
  );
}

export default Trends;
