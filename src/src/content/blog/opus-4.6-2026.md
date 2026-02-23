---                                                                                                     
  title: "What seems to be happening after Claude Opus 4.6"
  description: "How the emergence of useful agentic coding in late 2025 might affect everything."
  pubDate: 2026-02-23                                                                                     
---    
I think today's AI moment in software is less about replacing engineers and more about collapsing organizational depth. That's the frame that's been clarifying things for me, or at least helping me sleep at night.[^1]

Here's what I mean. Model output right now is roughly junior-to-mid level engineering work, which is useful with lots of steering and context. We get solid reasoning and codegen, only to find an edge function has several open SEVs or your auth system allows empty usernames or duplicate accounts. 

The volume and speed is new, though. You're not hoping a junior engineer maybe lands something in a sprint, because an LLM lands it in hours. Across a team the math changes *really* fast, and companies are clearly acting on this now. Hiring budgets are paused, and executives (like my former CTO at Spotify) are mandating AI adoption. Leadership isn't waiting for experiments, it wants to see results now.

If you project that trajectory forward, I think that large teams start to make less sense. They exist to enact leadership vision across layers of coordination, but LLMs compress that need.[^2] The meeting becomes a prompt or a couple of tools, and turnaround goes from days or weeks to minutes or hours. If coordination *and* delivery speed up, then what purpose does the current layer of middle managers serve?[^3]

I think this leads to two things:

1. High-skill experts can accomplish way more, because LLMs are fast and coordination costs collapse. The bottleneck shifts to "does someone know what to build and why."
2. The people sitting closer to the business - the soft-touch, cross-functional side of the work - become more important. If orgs are shallower, we (as engineers) can't hide behind their craft. We have to interact with non-engineers to get things done. 

These things are *actually* kinda powerful! Your coordination focuses outward, on high-leverage work, instead of inward on managing handoffs. The rote work melts away (as long as we adopt speech-to-text, or increase our typing speed). 

It feels like a moment for people with deep domain expertise who are willing to pick up new skills and who have a "secret" in the Thiel sense.

Obviously this is chaotic. I'm a comparative baby in genAI (2024) and a geezer in "data work" (2009), and while I expected some version of this, it hits different when you're living through it. What I'm focused on is what's in my control: continuing to learn about modern AI techniques like DPO, evals, and SFT; getting better at managing agent teams and building harnesses; growing my non-engineering skills so I can collaborate more effectively across functions; and looking for opportunities that are too small for the labs to chase in the near term.

I don't think engineers are doomed. But I do think the ones who thrive will be the ones who treat this as a structural shift in how orgs work.

[^1]: The title is subjective, of course - don't forget to choose your model + statement from the following:
    - GPT-3 ("wow it's occasionally coherent")
    - GPT-4 Turbo ("wow it only creates slightly-wrong SQL queries")
    - Claude Sonnet 3.7 ("wow it thinks")
    - GPT-5 ("wow it adapts to my prompts" (so much for that router...))
    - GPT-5.2 Thinking ("wow this mid-tier model beats SOTA 3 months ago" (this is me, btw))
    - Claude Opus 4.6 ("wow it adapts how much it thinks about my prompts")

[^2]: The end of ZIRP has been an incredibly tough time for middle managers in software. Larger teams atop of their people duties _and_ higher expectations for hands-on work.

[^3]: Maybe the answer is "managers start to code again," which would blow up my thesis! Unsurprisingly, the names we typically expect to chime in here have liberally shared GitHub punchcard screenshots.
