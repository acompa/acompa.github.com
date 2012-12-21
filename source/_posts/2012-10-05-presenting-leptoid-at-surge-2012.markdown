---
layout: post
title: "Presenting leptoid at Surge 2012"
date: 2012-10-05 17:11
comments: true
categories: 
---
I spent my summer at Knewton working on an autoscaling project. I learned a lot along the way about capacity planning, queuing theory, code instrumentation, and server management and deployment, and I recently presented about what I learned at [Surge Conference 2012](http://omniti.com/surge/2012).

The talk focused on instrumentation more than anything else, and you can check out the slides [here](https://www.dropbox.com/s/7wcaj6c892we2n5/Autoscaling%20with%20Leptoid-Final.pdf). If capacity planning sounds interesting, we also open-sourced leptoid -- the autoscaling library I worked on -- so that you could review the source on [Github](https://github.com/knewton/leptoid).

I also had a chance to speak with two excellent guys, Nathan Harvey and Dave Zwieback, for [an interview](http://foodfightshow.org/2012/09/surge-update-knewton.html) on Food Fight. During that interview I talked about my Surge presentation and experiences as a junior engineer at Knewton.

During my talk I mentioned the unimportance of a good capacity forecasting model relative to good instrumentation and deployment practices. This was revelatory. I actually spent the majority of my summer outside of my machine learning & statistical wheelhouse, instead working on this autoscaling project with Knewton's systems team. Lots of time went into

* instrumenting code with [statsd](https://github.com/etsy/statsd) and Coda Hale's [metrics](https://github.com/codahale/metrics)
* managing a cluster of [Graphite](https://github.com/graphite-project) hosts
* fumbling around with [Chef](http://www.opscode.com/chef/)

That list of items looks really obnoxious, I know, but I don't want to forget about them. I simultaneously studied operating systems at NYU during this project, and have a list of topics I'd like to dig into once things slow down:

* scheduling and thread prioritization (beyond aging and "NRU" scheduling algorithms)
* networking, especially DNS lookups and comparisons between proxies
* sharding (or distributed storage, especially w.r.t something like HDFS)
* kernel v. user modes, and how they work in practice

Either way, I feel like a better developer after this summer. It was an excellent experience, and Dave and Peter Norton (who really needs to get on Twitter or Pinterest or something) were excellent mentors.
