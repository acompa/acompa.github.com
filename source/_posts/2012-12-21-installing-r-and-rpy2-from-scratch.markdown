---
layout: post
title: "Installing R and rpy2 from scratch"
date: 2012-09-07 18:40
comments: true
categories: 
---
Python has seen a bit of an explosion in packages for statistics, machine learning, and data structures to support the two. Between [pandas](pandas.pydata.org), [statsmodels](statsmodels.sourceforge.net), [scikit-learn](scikit-learn.org), and [scipy.stats](http://docs.scipy.org/doc/scipy/reference/stats.html) Python developers now have a miniature data stack for econometrics, machine learning algorithms, or statistics, as well as sensible data structures with tons of convenience functions.

Still, those packages may not provide *everything* you need to get the job done. If, like me, you're a Python dev analyzing some time series data, you might need to visit [an old friend](r-project.org) with excellent, full-featured statistical packages like [caret](http://cran.r-project.org/web/packages/caret/index.html) and [forecast](http://robjhyndman.com/software/forecast/).

You'll be happy to know that, with [rpy2](http://rpy.sourceforge.net/rpy2.html), you can have your cake and eat it too. Installing rpy2 can be painful, however, especially if you're working with EC2 instances on Amazon Web Services. New instances contain little or no GNU tools, making an R + rpy2 installation harder than

    sudo apt-get install r-base r-base-dev python-dev python-setuptools
    sudo easy_install pip
    for pkg in numpy scipy rpy2; do
        sudo pip install pkg
    done

I've attached a script below to help devs get past this problem. It has been tested to work on Ubuntu 11.10, and I don't expect any compatibility issues with newer versions. 

[Here's a Gist](https://gist.github.com/3700827) with the script. If you run into issues, please let me know and I'll try to fix them and update the script.
