---
title: "DSPy's abstractions worked for us, but its runtime didn't"
description: "DSPy is a useful AI workflow development tool, but its runtime configuration introduced issues for our production workflows."
pubDate: 2026-04-06
---

I greatly enjoyed Skylar Payne's write-up on [DSPy](https://skylarbpayne.com/posts/dspy-engineering-patterns/). I felt it would be helpful to share my experiences building production workflows with DSPy for two separate projects in 2025 at [Not Diamond](https://www.notdiamond.ai/).[^1] 

This is that post. Thanks, Skylar, for the well-written kick-to-the-butt.

## Learning the library v. using it

I agree with the criticality of signatures, modules and optimizers in modern AI workflows. DSPy uses these concepts to great effect; between that, its comprehensive library of prompt-optimizing algorithms, and its excellent documentation, we quickly learned the library.

That said, I tried to apply DSPy to a specific flavor of distributed system: async-optimized throughput, cross-provider targets, supporting multi-workflow stakeholders in enterprise settings. Its runtime didn't work with our production system, however, so we pulled it.

## Conflicting concurrency

Both of my team's attempts at integrating DSPy into live workflows involved distributed, asynchronous training and dynamic model-switching via Celery with `gevent`. We abandoned DSPy shortly after encountering [this](https://github.com/stanfordnlp/dspy/blob/main/dspy/dsp/utils/settings.py#L159-L163) configuration issue:

```python
if not in_ipython and config_owner_async_task != asyncio.current_task():
	raise RuntimeError(
		"dspy.configure(...) can only be called from the same async task that called it first. Please "
		"use `dspy.context(...)` in other async tasks instead."
	)
```

So we used `dspy.context`, as suggested to avoid async task conflicts. As mentioned before, though, we wanted to switch models, which obligated [this example snippet](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/tutorials/cache/index.md?plain=1#L178-L181):

```python
with dspy.context(lm=dspy.LM("openai/gpt-5-mini")):
    result1 = predict(question="Who is the GOAT of soccer?")

with dspy.context(lm=dspy.LM("openai/gpt-5-nano")):
    result2 = predict(question="Who do *you* think is the GOAT of soccer?")
```

While DSPy 3.0 shipped async improvements, [limitations in configurability](https://github.com/stanfordnlp/dspy/issues/8197) and async support still persist:
- program training seems to [require a synchronous context](https://github.com/stanfordnlp/dspy/issues/9075)
- `dspy.settings` has [mixed support](https://github.com/stanfordnlp/dspy/issues/8197) across coroutines
- multi-model workflows have limited support across [different concurrency models](https://github.com/stanfordnlp/dspy/issues/8797)

More broadly, **this design tightly couples DSPy's runtime to your production setting**. By optimizing your program with DSPy, you've also bought into the library's architectural decisions for concurrency. This is no more evident than [in the FastAPI tutorial](https://dspy.ai/tutorials/deployment/#deploying-with-fastapi), where the user's concurrency management must be deferred to DSPy via `dspy.asyncify`. 

Our production deployment requires performance optimizations tailored to the needs of *our* workflows, instead of those of a library dependency. To avoid conflicts between Celery and DSPy's concurrency management, we essentially distributed prompt optimization by model and ran each optimizer serially within a task. 

This architecture wrecked the system's overall throughput. DSPy's optimizers were now the slowest part of our optimization stack. 
## Pulling prompts

Once optimization completed, we encountered additional challenges when porting optimized prompts out of the distributed tasks. These prompts needed to pass human review for use in workflows which did not depend on DSPy, or existed outside of automated pipelines altogether (like AI chat interfaces).

 Let's say you want to use your optimized prompts outside of DSPy. You'd have to extract prompts [like this](https://github.com/stanfordnlp/dspy/issues/7830):

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

Note that many of DSPy's optimizers[^2] treat signatures as optimizable parameters. If the user decouples those components from the underlying prompts, they can inadvertently unwind performance gains. Users should preserve DSPy's programs as-is.

**But these programs do not willingly exit the DSPy runtime**. We attempted to extract programs using the above snippet, as well as applying various scripts to DSPy's JSON I/O options and its `Signature` and `ChatAdapter` classes. None of these approaches ultimately met the requirements of our end users for workflow compatibility and human understanding.
## Dealing with dependencies

Our production runtime deploys into environments with tighly-constrained requirements, so we require control over our supply chain. DSPy, however, executes all of its LLM client requests via LiteLLM. Introducing DSPy meant accepting LiteLLM into our carefully-curated environments and observability stack.

I've found that LiteLLM presents significant issues in non-trivial production contexts. The library introduces verbose, poorly-formatted logs at `INFO` level, which polluted Datadog and our local testing tools:[^3]

![A common sight if you forgot to set the LiteLLM root logger to `WARN`.](public/images/dspy-litellm-logs.png)

Our supply chain requirements extend to security concerns, so it's worth noting LiteLLM recently experienced [a supply chain vulnerability](https://docs.litellm.ai/blog/security-update-march-2026), where a core maintainer's PyPI credentials were seemingly compromised. 

We overcame these challenges by building our own client logic with `openai.OpenAI` and `tenacity` which extends across structured outputs and function calling.[^4] As of today there's broad support for `chat.completions` across AI providers. Our in-house client library works comprehensively and reliably, thanks to strong compatibility with our observability stack.

## What it is and what it is not

If you need to manage your own concurrency, port your prompts to different settings, or keep an orderly deployment environment, you might find that DSPy's dependency stack and runtime don't fit your needs.

For other scenarios, though, DSPy can help launch and optimize your workflow prototypes very quickly, and its concepts will endure well into the production phase of your project.

*Thanks to Devansh Jain and James Kunstle for input on this write-up*.

[^1]: Astute readers will note that one of our products at Not Diamond is [Prompt Optimization](https://www.notdiamond.ai/#prompt-optimization). If you haven't closed this tab yet, I *solemnly vow* to avoid any sales in this post.

[^2]: Notably, this is not true of GEPA, where users can [seamlessly extract prompts](https://x.com/LakshyAAAgrawal/status/1978198977985069348) from the optimized adapter. While GEPA is available in DSPy, this capability is primarily available in the underlying `gepa-ai` [library](https://gepa-ai.github.io/gepa/).

[^3]: Honestly, "Local Engineer Complains About Dependency Logging Configs" is the least surprising headline of the day! But LiteLLM's usage of `INFO` for low-signal logs feels disconnected from common logging practices in production systems.

[^4]: I expect most AI engineers writing Python have battle scars with `openai.OpenAI` and `tenacity.retry` at this point. `RETRYABLE_HTTP_ERROR_CODES` should be a permanent fixture of Pythonic AI project templates.
