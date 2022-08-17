import { settings } from "./utils/settings";

import twitter from 'twitter-lite';
import Mastodon from 'mastodon';

import { twitterKeys, twitterUserData } from "./utils/auth/twitter-auth-data";
import { mastodonAuthData } from "./utils/auth/mastodon-auth-data";

const twitterClient = new twitter(twitterKeys);
const mastodonClient = new Mastodon(mastodonAuthData);

let twitterErrorCount = 0;
let mastodonErrorCount = 0;

let postArg = process.argv[2];

const init = async (): Promise<any> => {
  console.log('ConsolePoster - pedrocx486 - WTFPL');
  
  if (!!postArg.length) {
    if (settings.postOnMastodon) {
      await postToMastodon(postArg);
    }

    if (settings.postOnTwitter) {
      await postToTwitter(postArg);
    }
  } else {
    console.error('Nothing to post passed as argument.\nDid you send your post as an arg between quotes "like this"?\nExiting.');
  }
}

const postToTwitter = async (tweetContent: string): Promise<void> => {
  if (tweetContent.length > 280) {
    console.error(`\nTwitter: Tweet exceeds maximum allowed length of 180 characters. Not tweetin' this one.`);
    return
  }

  await twitterClient.post('statuses/update', { status: tweetContent }).then(response => {
    console.log('\nTweeted: ', `https://twitter.com/${twitterUserData.username}/status/${response.id_str}`);
    twitterErrorCount = 0;
  }).catch(error => {
    console.error('\nError when posting to Twitter:', error.errors[0].message);
    twitterErrorCount++;

    // Retry.
    if (twitterErrorCount < settings.retries) {
      console.log(`\nRetrying in ${settings.retryAfterHowManySeconds} seconds...`);
      setTimeout(() => {
        postToTwitter(tweetContent);
      }, settings.retryAfterHowManySeconds * 1000);
    }
  });
}

const postToMastodon = async (postContent: string): Promise<void> => {
  await mastodonClient.post('statuses', { status: postContent }).then((response: any) => {
    console.log('\nPosted: ', response.data.url);
    mastodonErrorCount = 0;
  }).catch((error: any) => {
    console.error('\nError when posting to Mastodon:', error);
    mastodonErrorCount++;

    // Retry.
    if (mastodonErrorCount < settings.retries) {
      console.log(`\nRetrying in ${settings.retryAfterHowManySeconds} seconds...`);
      setTimeout(() => {
        postToMastodon(postContent);
      }, settings.retryAfterHowManySeconds * 1000);
    }
  });
}

init();