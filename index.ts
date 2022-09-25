import { settings } from "./utils/settings";

import twitter from 'twitter-lite';

import { twitterKeys, twitterUserData } from "./utils/auth/twitter-auth-data";
import { mastodonAuthData } from "./utils/auth/mastodon-auth-data";
import { misskeyAuthData } from "./utils/auth/misskey-auth-data";
import { pleromaAuthData } from "./utils/auth/pleroma-auth-data";

const twitterClient = new twitter(twitterKeys);
import generator, { Entity, Response } from 'megalodon';

let twitterErrorCount = 0;
let mastodonErrorCount = 0;
let misskeyErrorCount = 0;
let pleromaErrorCount = 0;

let postArg = process.argv[2];

const postToTwitter = async (tweetContent: string): Promise<void> => {
  if (tweetContent.length > 280) {
    console.error(`\nTwitter: Tweet exceeds maximum allowed length of 180 characters. Not tweetin' this one.`);
    return
  }

  await twitterClient.post('statuses/update', { status: tweetContent }).then(response => {
    console.log('\nPosted to Twitter: ', `https://twitter.com/${twitterUserData.username}/status/${response.id_str}`);
    twitterErrorCount = 0;
  }).catch(error => {
    console.error('\nError when posting to Twitter: ', error.errors[0].message);
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
  const client = generator('mastodon', mastodonAuthData.base_url, mastodonAuthData.access_token);
  client.postStatus(postContent).then((res: Response<Entity.Status>) => {
    console.log('\nPosted to Mastodon: ', `${res.data.uri}`);
    mastodonErrorCount = 0;
  }).catch((error: any) => {
    console.error('\nError when posting to Mastodon: ', error);
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

const postToMisskey = async (postContent: string): Promise<void> => {
  const client = generator('misskey', misskeyAuthData.base_url, misskeyAuthData.access_token);
  client.postStatus(postContent).then((res: Response<Entity.Status>) => {
    console.log('\nPosted to Misskey: ', `${misskeyAuthData.base_url}/notes/${res.data.id}`);
    misskeyErrorCount = 0;
  }).catch((error: any) => {
    console.error('\nError when posting to Misskey: ', error);
    misskeyErrorCount++;

    // Retry.
    if (misskeyErrorCount < settings.retries) {
      console.log(`\nRetrying in ${settings.retryAfterHowManySeconds} seconds...`);
      setTimeout(() => {
        postToMisskey(postContent);
      }, settings.retryAfterHowManySeconds * 1000);
    }
  })
}

const postToPleroma = async (postContent: string): Promise<void> => {
  const client = generator('pleroma', pleromaAuthData.base_url, pleromaAuthData.access_token);
  client.postStatus(postContent).then((res: Response<Entity.Status>) => {
    console.log('\nPosted to Pleroma: ', `${res.data.url}`);
    pleromaErrorCount = 0;
  }).catch((error: any) => {
    console.error('\nError when posting to Pleroma: ', error);
    pleromaErrorCount++;

    // Retry.
    if (pleromaErrorCount < settings.retries) {
      console.log(`\nRetrying in ${settings.retryAfterHowManySeconds} seconds...`);
      setTimeout(() => {
        postToPleroma(postContent);
      }, settings.retryAfterHowManySeconds * 1000);
    }
  })
}

(async (): Promise<any> => {
  console.log('vomit - birdsite/fediverse console client by @pedrocx486');

  if (!!postArg.length) {
    if (settings.postOnTwitter) {
      await postToTwitter(postArg);
    } else if (settings.postOnMastodon) {
      await postToMastodon(postArg);
    } else if (settings.postOnMisskey) {
      await postToMisskey(postArg);
    } else if (settings.postOnPleroma) {
      await postToPleroma(postArg);
    } else {
      console.error('No social network is enabled to post on!');
    }
  } else {
    console.error('Nothing to post passed as argument.\nDid you send your post as an arg between quotes "like this"?\nExiting.');
  }
})();
