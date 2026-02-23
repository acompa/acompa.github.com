---
title: "Beyond Trending Topics: identifying important conversations in communities"
description: "Detecting unusual spikes in Twitter community activity using time series decomposition, built at Betaworks with Rohit Jain."
pubDate: 2015-09-01
---

Last summer, while at Betaworks, [Rohit Jain](http://twitter.com/rj_here) and I co-wrote a blog post on detecting trending topics. Here's a blurb:

> [Scale Model](http://scalemodel.com), one of the newest companies to launch out of betaworks, helps identify, follow and reach communities on Twitter. While there’s a great visual dashboard that gives us a way to look at what’s bubbling up from within communities, it is still hard to evaluate which items appear on a regular basis, and which are more unique. For example, in the [US politics](http://scalemodel.com/dashboard/33/) model, the [#WakeUpAmerica](http://scalemodel.com/dashboard/shares/33/hashtags/WakeUpAmerica) hashtag is used on a regular basis by conservatives, hence appears on the dashboard quite often. Wouldn’t it be great to know when activity around a certain hashtag is unique? Or more specifically, deviates from the expected behavior? Since we can’t expect users to be continuously glued to our dashboard, it’d be great if we could send out notifications whenever something important happens.

Rohit and I spent quite a bit of time discussing time series decomposition and the messier parts of working with short-form text pulled from social network activity. I especially liked the use of a chat bot to check the output of a key model. Rohit deserves full credit for that great idea (as well as the rest of the working code).

I'm not sure if this work made it into Scale Model or any of the tooling they offer to their clients -- I left before I could convert Rohit's prototype to a working service -- but this is definitely a problem Frank and his team continue to work on.

Head on over to [the full post](http://data.betaworks.com/beyond-trending-topics-identifying-important-conversations-in-communities/) on the Dataworks blog for more.
