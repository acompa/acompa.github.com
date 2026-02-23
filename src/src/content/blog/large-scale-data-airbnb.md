---
title: "Large-scale data-driven initiatives at Airbnb"
description: "Any conversation about data work at Airbnb should probably start with Airflow. Since its open-sourcing back in 2015, this data pipeline framework has been adopted by almost 200 companies, including my former employers at iHeartRadio and my current employers at Devoted Health. slaps roof of framework This bad boy fits …"
pubDate: 2019-05-22
---

Any conversation about data work at Airbnb should probably start with Airflow. Since its [open-sourcing back in 2015](https://medium.com/airbnb-engineering/airflow-a-workflow-management-platform-46318b977fd8), this data pipeline framework has been adopted by [almost 200 companies](https://github.com/apache/incubator-airflow#who-uses-airflow), including my former employers at iHeartRadio and my current employers at Devoted Health. **slaps roof of framework** This bad boy fits a hell of a lot of ETL jobs! It is also an example of the challenge of executing on data science initiatives at a massive scale.

Imagine you are asked to build a model that predicts the number of blood-testing machines your company will sell next month. This model could dramatically alter contract negotiations with your company's main client, a popular American pharmacy chain. You shape a dataset from your warehouse, train and tune a model in a Jupyter notebook, pitch it to your stakeholders, and turn it into a library covered with tests and logging (riiiiiight?). To deploy and train the model on a recurring schedule, you rely on Ansible/chef/puppet and `cron`. Easy!

Now scale this to hundreds of models. Not easy! But: a data pipeline framework can help.

You can now track your models on a dashboard. You run and backfill your pipelines via this dashboard or command line tools. As your pipelines increase in complexity, you can encode dependencies and refactor common ETL operations into other jobs, saving you compute time _and_ the stress of job scheduling.

![](https://i.imgur.com/JaLIQ8I.png)

![](https://i.imgur.com/PHPTJvt.png)

Building a data pipeline framework requires months of engineering time. That's a significant investment -- almost ~~100~~ ~~3.5~~ 10,000 Bitcoins! The goal of this investment, like any other, is to generate a nice return. At the scale of Airbnb's data operations - [about 150 data scientists and engineers, over 18 petabytes of data on HDFS](https://www.youtube.com/watch?v=6QVXPNrSbLU) - this return is guaranteed. A properly-designed framework saves this team many hours of work operationalizing each model and ETL job. Add this up over all active data projects, and even a multi-quarter, multi-engineer effort to build a data pipeline framework yields positive returns very quickly.

[Airbnb is a $30 billion company](https://www.nytimes.com/2016/06/29/business/dealbook/airbnb-is-said-to-be-seeking-funding-valuing-it-at-30-billion.html?_r=0) that relies on scale to develop an insurmountable advantage over their competitors in the travel business. Ben Thompson summarizes this nicely [when outlining aggregation theory on Stratechery](https://stratechery.com/2015/aggregation-theory/), his excellent newsletter and website:

> Airbnb and the sharing economy have commoditized trust, enabling a new business model based on aggregating resources and managing the customer relationship \[...\] Airbnb is integrating property management and customer management, enabling it to scale worldwide.

"Oh wow, Alex. 'VC-backed company takes funding, hopes to outgrow its competitors' - what an insight!" This is not exactly novel analysis, but consider Airbnb's data investments in the context of the company's goals. Scale and aggregation are Airbnb's competitive advantages in the travel industry. It is notable, then, that many of their publicly-discussed data projects bolster this advantage. Consider:

-   [By building classifiers to identify fraudulent transactions](https://medium.com/airbnb-engineering/fighting-financial-fraud-with-targeted-friction-82d950d8900e), Airbnb provides hosts with confidence in their revenue streams. Meanwhile, [optimizing search results using embeddings](https://medium.com/airbnb-engineering/listing-embeddings-for-similar-listing-recommendations-and-real-time-personalization-in-search-601172f7603e) decreases friction in trip-planning and encourages guests to use Airbnb again in the future. Both of these features improve host-to-guest matching, so that Airbnb continues aggregating supply and demand for travel.
    
-   Significant investments in online experimentation, most notably [an experimentation framework](https://medium.com/airbnb-engineering/https-medium-com-jonathan-parks-scaling-erf-23fd17c91166), increase the velocity with which Airbnb tests and launches new features. This leads to faster turnaround on product feedback from hosts and guests. Meanwhile, the data team spends less time launching and monitoring A/B tests, a process which can be excruciating (as I'm sure you know!).
    
-   Airbnb has also open-sourced several tools for data infrastructure. In addition to Airflow, I've also heard great things about [Superset](https://medium.com/airbnb-engineering/superset-scaling-data-access-and-visual-insights-at-airbnb-3ce3e9b88a7f?source=collection_category---5------7---------------------) - a tool that simplifies data analysis for users without warehouse access - as well.
    
-   Even Airbnb's thought leadership in data science and data infrastructure affects their scale. Their [Medium blog](https://medium.com/airbnb-engineering/data/home) and [submissions to conferences like KDD 2018](https://medium.com/airbnb-engineering/airbnb-engineering-and-data-science-at-kdd-2018-1f53a97b896e) market the team to talented engineers and scientists, who might then join Airbnb to help meet their scaling needs!
    

These initiatives demonstrate how Airbnb's business goals propagate through the organization to their data science and data platform groups, and how these teams deliver projects that directly impact the company's financial results. That is a significant achievement for _any_ data team, much less a data team at a company with an 11-figure valuation. Airbnb serves as an example of a company whose scale justifies significant investments in data science and data infrastructure.
