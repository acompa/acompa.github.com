---
title: "Git for data science at iHeartRadio"
description: "Last year, I walked iHeartRadio's Data Science team through the theory and practice of git. Version control falls into the category of practical stuff you learn after finishing grad school."
pubDate: 2017-04-17
---

Last year, I walked iHeartRadio's Data Science team through the theory and practice of git.

Version control falls into the category of "practical stuff you learn _after_ finishing grad school," and many folks -- such as [Software Carpentry](http://swcarpentry.github.io/git-novice/), [Trey Causey](http://treycausey.com/software_dev_skills.html), and [Kaggle](http://blog.kaggle.com/2012/10/04/engineering-practices-in-data-science/) -- have written about it at length. I figured I would toss in my two cents, with a focus on our situation and goals at the time.

Some context: around the time I joined iHeartRadio, collaboration within the Data Science team had been limited to analyses and dashboards. We had not operationalized much software, and most of our work lived in a single Github repository with folders named after their owners.

Our team had (and continues to have!) ambitious plans for different projects, but this approach to version control didn't scale to projects with multiple owners (either within or across teams). We agreed to adopt best practices for version control, and I presented git's theory and tools for collaboration. A lot has changed since then, and we now use Jenkins and Kubernetes to test our various repositories on commit, build releases after merges to master, and push package updates to PyPI.

Here are the slides for my talk:

<iframe src="https://docs.google.com/presentation/d/1kz6dT2jhPqDrzQthU5WwIxy-jWYtRTpgd86tk5vYLw4/embed?start=false&amp;loop=false&amp;delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
