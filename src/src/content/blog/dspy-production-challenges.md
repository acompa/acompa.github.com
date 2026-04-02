---
title: "DSPy solves prompting problems and creates production ones"
description: "DSPy is an invaluable tool for AI workflow prototypes which creates new headaches in production."
pubDate: 2026-04-02
---

I felt a pang of jealousy after enjoying [Skylar Payne's write-up on DSPy](https://skylarbpayne.com/posts/dspy-engineering-patterns/). Fantastic post! It deserves a read for its all-too-accurate description of the path taken by [DSPy](https://dspy.ai) (or any half-baked implementation of its concepts) into production, as well as the centrality of 
- typed signatures,
- composable modules, and
- prompt optimizers
in successful AI workflows.

My jealousy stems from procrastinating on a similar post describing my experiences building production workflows with DSPy for two separate projects in 2025 at [Not Diamond](https://www.notdiamond.ai/).[^1] This is that post. Thanks, Skylar, for the well-written kick-to-the-butt.

## The concepts don't block adoption

Anyway, we diverge on his conclusion. Skylar writes:

> DSPy has adoption problems because it asks you to think differently before you’ve actually felt the pain of thinking the same way everyone else does.

> The patterns DSPy embodies aren’t optional. If your AI system gets complex enough, you will reinvent them. The only question is whether you do it deliberately or accidentally.

We agree that AI engineers absolutely must understand signatures and interfaces, both exemplified by the ubiquity of structured outputs. Optimizers - as a component of workflow evals - are similarly critical today. 

But these concepts are not too esoteric to hinder DSPy’s adoption. Engineers can use DSPy's heaps of excellent documentation to quickly learn its concepts, which align with common practices for evals and workflow optimization. Let's give folks the benefit of the doubt, and assume a new user can quickly reach competency in DSPy.

My view is that Skylar has mixed up the causality here. Engineers don't struggle with DSPy because of its novel concepts. Instead, **DSPy's limitations hinder the creation of modular, optimizable AI workflows**.

During our testing I observed three concrete limitations in DSPy:
- Its optimized programs have limited portability,
- It takes a strongly-opinionated approach to concurrency, and
- It has an LLM client dependency which can be challenging to work with and tedious to replace.

## Conflicting concurrency

Both of my team's attempts at integrating DSPy into live workflows involved distributed, asynchronous training and dynamic model-switching via Celery with `gevent`. Users switch LMs via `dspy.configure`, but we encountered [this](https://github.com/stanfordnlp/dspy/blob/main/dspy/dsp/utils/settings.py#L159-L163) configuration issue:

```python
if not in_ipython and config_owner_async_task != asyncio.current_task():
	raise RuntimeError(
		"dspy.configure(...) can only be called from the same async task that called it first. Please "
		"use `dspy.context(...)` in other async tasks instead."
	)
```

As suggested, we tried `dspy.context` to avoid async task conflicts. But every model switch required context managers, [as demonstrated by this example snippet](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/tutorials/cache/index.md?plain=1#L178-L181):

```python
with dspy.context(lm=dspy.LM("openai/gpt-5-mini")):
    result1 = predict(question="Who is the GOAT of soccer?")

with dspy.context(lm=dspy.LM("openai/gpt-5-nano")):
    result2 = predict(question="Who do *you* think is the GOAT of soccer?")
```

In a Markdown doc or Jupyter notebook this reads fine. In a production codebase this practically _invites_ bugs. We abandoned both efforts shortly thereafter.

While DSPy 3.0 shipped async improvements, [limitations in configurability](https://github.com/stanfordnlp/dspy/issues/8197) and async support still persist:
- program training still [requires a synchronous context](https://github.com/stanfordnlp/dspy/issues/9075)
- `dspy.settings` has [mixed support](https://github.com/stanfordnlp/dspy/issues/8197) across coroutines
- multi-model workflows have limited support across [different concurrency models](https://github.com/stanfordnlp/dspy/issues/8797)

More broadly, **this anti-modular design emerges from DSPy's tightly-coupled inference-time story**. By optimizing your program with DSPy, you've also bought into the library's architectural decisions for concurrency. This is no more evident than [in the FastAPI tutorial](https://dspy.ai/tutorials/deployment/#deploying-with-fastapi), where the user defers concurrency management to DSPy via `dspy.asyncify`. But production deployments require performance optimizations tailored to the needs of *your* workflows - not those of a library dependency.

## Pulling prompts

What did I mean earlier by a "tightly-coupled inference-time story?" Let's say you want to use your optimized prompts outside of DSPy. You'd have to extract them [like so](https://github.com/stanfordnlp/dspy/issues/7830):

```python
{
  name: adapter.format(
    p.signature,
    demos=p.demos,
    inputs={k: f"{{{k}}}" for k in p.signature.input_fields},
  )
  for name, p in program.named_predictors()
}
```

Omar Khattab[^2] has [explained the intention](https://github.com/stanfordnlp/dspy/issues/8042#issuecomment-2773833904) behind this choice:

> DSPy does a lot of heavy-lifting indeed, and it's very common that people try to extract the optimized prompt but end up hurting quality in the process. We do not usually advise that you extract anything for this reason, since the optimized prompt assumes a lot of DSPy behavior like the way the inference calls are made. 

> That said, if you really want to get a prompt you can apply this process. Note that it gives you a list of messages.

He's right, of course. Many of DSPy's optimizers[^3] treat signatures as optimizable parameters. If the user decouples those components from the underlying prompts, they can inadvertently unwind performance gains. 

But...that's _my_ prompt. Now, though, it has limited applicability. Concretely: **this inference-time requirement creates a golden-path dependency on DSPy.** 

This bleeds into other concerns. For eg. observability, we faced a choice between forking the library to add spans or adopting [MLflow](https://dspy.ai/tutorials/observability/#tracing). If your production service doesn't use Python, you're instead relying on unofficial ports[^4]. If your prompt needs to land in a non-software workflow handled by Claude Cowork or Codex? You're back to Omar's earlier snippet.


## Dealing with dependencies

DSPy also relies on leaky abstractions thanks to its underlying LLM client library, LiteLLM. Several years ago, LiteLLM's cross-provider compatibility and ease of implementation made it the de-facto LLM client for workflow prototyping. Since then the AI ecosystem aligned onto OpenAI-style messages, and Skylar’s post demonstrates common patterns in client usage and request retries.

LiteLLM poses its own issues in production contexts, however, such as poor logging configuration. It produces verbose, poorly-formatted logs at `INFO` level, which polluted Datadog, Sentry and our local testing tools:[^5]

![Commonly seen in logs across Jupyter notebooks and dev environments](/images/dspy-litellm-logs.png)

LiteLLM also recently experienced [a supply chain vulnerability](https://docs.litellm.ai/blog/security-update-march-2026) after a core maintainer's PyPI credentials were compromised. This risk exists for any OSS project, but if LiteLLM is not proxying your requests then your alternatives can be as simple as `openai.OpenAI` and `tenacity`. [^6]

In DSPy, users can swap out the underlying client library with some effort. [There's no documentation on this capability](https://dspy.ai/learn/programming/language_models/#advanced-building-custom-lms-and-writing-your-own-adapters). A DSPy contributor is working on extracting LiteLLM into an extra dependency [while redesigning  `dspy.LM` ](https://github.com/stanfordnlp/dspy/issues/9514), which significantly helps production users once the change lands.

## What it is and what it is not

Admittedly, our experience with DSPy could confirm "Khattab's Law" as proposed by Skylar:

> Any sufficiently complicated AI system contains an ad hoc, informally-specified, bug-ridden implementation of half of DSPy.

Our prompting layer leverages typed signatures, a separate eval harness and first-party provider SDKs to optimize prompts over eval datasets. 

But none of the facts I've laid out above dilute the usefulness of DSPy. It's still a fantastic exploratory tool for prompt optimization. Our broader AI ecosystem benefits from research produced by labs like Stanford NLP and MIT CSAIL, whose researchers primarily maintain DSPy.

That said, it's worth acknowledging difficulties integrating it into production systems with optimized concurrency, comprehensive monitoring, and tight requirements for environment builds. 

As Skylar noted, DSPy’s concepts form the basis of any well-designed AI workflow. I believe that applying those concepts inward - to the library’s architecture and interfaces - would broaden its impact far beyond prototyping and research.

*Thanks to Devansh Jain and James Kunstle for input on this write-up*.

[^1]: Astute readers will note that Not Diamond offers [Prompt Optimization](https://www.notdiamond.ai/#prompt-optimization). If you haven't closed this tab yet, I *solemnly vow* to avoid any sales in this post.

[^2]: Lead author on [the original DSPy paper](https://arxiv.org/abs/2310.03714) and core contributor to the open-source library.

[^3]: Notably, this is not true of GEPA, where users can [seamlessly extract prompts](https://x.com/LakshyAAAgrawal/status/1978198977985069348) from the optimized adapter. While GEPA is available in DSPy, this capability is primarily available in the underlying `gepa-ai` [library](https://gepa-ai.github.io/gepa/).

[^4]: There are community-built libraries for languages like [TypeScript](https://github.com/ruvnet/dspy.ts) and [Rust](https://github.com/krypticmouse/DSRs). They lack feature parity or ongoing support.

[^5]: Honestly, "Local Engineer Complains About Dependency Logging Configs" is the least surprising headline of the day! But LiteLLM's usage of `INFO` for low-signal logs feels disconnected from common logging practices in production systems. It's symptomatic of LiteLLM's other issues, a discussion of which falls well outside of this post's scope.

[^6]: I expect most AI engineers writing Python have battle scars with `openai.OpenAI` and `tenacity.retry` at this point.
