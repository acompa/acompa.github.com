---
layout: post
title: "Sleeplessness &amp;rarr; bad code"
date: 2012-08-03 18:42
comments: true
categories: 
---
David Smith recently pushed out [an excellent episode](http://developingperspective.com/2012/08/02/70/) of his "Developing Perspectives" podcast. In it, he discusses the importance of rest, especially as it relates to the quality of a developer's work.

A big product launch at Knewton and a semester-long OS class compressed into 10 weeks leaves little time for rest, so I wasn't surprised to notice a sizable drop-off in my cognitive ability while working on my last OS lab a few weeks ago. My lab (a toy virtual memory management unit responsible for virtual paging) is written in Java -- a language I'm learning this summer -- and while I have a rational understanding of how it works (having studied it in a programming languages class last semester), I'm not 100% comfortable with it just yet.

That discomfort manifested as a few, time-consuming mistakes during a couple of tough, sleepless weeks. As an example, I'll talk about how I made a silly type casting mistake.

My toy virtual memory manager (VMM) needed to swap pages in and out of physical memory whenever new instructions would arrive. There are a number of algorithms for page replacement, so I gave the user the option of selecting from a subset of these:

	private ReplacementAlgorithm algo;
    ...
    // Attach the right algorithm.
    this.algo = selectReplacementAlgorithm(algo);
	...
    private ReplacementAlgorithm selectReplacementAlgorithm(String choice) {
    	if (choice.matches("N")) {
            return new NRUAlgorithm();
        } else if (choice.matches("l")) {
            return new LRUAlgorithm();
        ...
    }
    
Each of those algorithm objects implement basic methods from a ReplacementAlgorithm interface, but they also have their own logic (eg. debugging output or actions performed on internal queues). Thus, the VMM calls various methods depending on the page replacement algorithm selected by the user:

    if (this.printAdditionalDetails) {
        if (this.algo instanceof FIFOAlgorithm) {
            ((FIFOAlgorithm) this.algo).printQueueContents();
            System.out.printf("\n");
        } else if (this.algo instanceof PhysicalClockAlgorithm) {
            ((PhysicalClockAlgorithm) this.algo).printClock();
            System.out.printf("\n");
    ...
        
At one point, one of the replacement algorithms was not updating its internal state correctly, thus causing it to replace pages incorrectly. Here's where the sleep deprivation came in: I actually spent a non-trivial amount of time (about 1-2 hours) refactoring my code because I thought the type checking statements above identified every algorithm as a ReplacementAlgorithm, and not as a LRUAlgorithm, NRUAlgorithm, etc. 

In retrospect, it was a dumb assumption. Java interfaces are a basic example of OO inheritance, and an object of a class that implements an interface clearly has both the class's type and the interface's type. The behavior is the same in Python--here's an example:

    >>> class Foo(object): pass
    >>> class Bar(Foo): pass
    >>> isinstance(Bar(), Foo)
    True

Anyway, just an example of a silly mistake fueled by sleep deprivation that cost a few hours of lost dev time. Make sure to get your sleep!
