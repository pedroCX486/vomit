# vomit
A console app made in node to post on various fediverse apps and/or twitter.
  
# Setup
To setup the whole thing you **WILL NEED** an Access Token (only if you're gonna use Mastodon or Misskey or Pleroma) and/or Twitter's Consumer Key and Secret and Twitter's Access Key and Secret, from an Twitter App with **Elevated Access to the v2 API** (good luck, twitter makes it hell to get it, easier to use only Mastodon) *if* you're gonna use Twitter.
  
After that put the required info in the files located in the `utils/auth` folder, then configure things to your preference on the `utils\settings.ts` file to have it run the way you want.
  
**You won't need to touch the `index.ts` and other files not mentioned here to have it running.**
  
# Installing and Running
Run `npm i` to install, `npm run build` to build (duh) and `npm start -- 'your short message'` to run the thing and post on your social networks.

# Global terminal shortcut

So, you're a terminal goon like me and want to use this from anywhere in your system? The attached `vomit.sh` is the tool you need, except not. It just receives an argument and runs the node script. To make it run globally you need to configure your system to do it.

For MacOS (zsh) I did the following:

1- Open your `.zprofile`, add the following (change from `vomit` to whatever the heck you want):
```
export PATH=~/scripts:$PATH
alias vomit='vomit.sh'
```

2- Create a folder on your user folder called `scripts` (again can be whatever you want, just don't forget to change in the `.zprofile` code) and put the `vomit.sh` script in there and remember to edit the script to put the folder where the app is located.

3- That's it. As for Windows you can just create a folder, a bat file with a similar idea and point to it using the PATH. (I don't use Windows, sooo...) I imagine it's similar to MacOS when doing it for Linux.
  
# Hacking at it
Your main point of interest would be `index.ts` file, where the main code resides, check it out if you like having nightmares at night.
  
# License
[WTFPL](http://www.wtfpl.net/txt/copying)
  
# Contributing
Don't. If you want to change anything, fork it. Issues and PRs will be promptly closed because I don't have enough shits to give.