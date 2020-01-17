# Belly Button Biodiversity

View the deployed project [here](https://maivey.github.io/plotly-challenge/BellyButtonBiodiversity/index.html)

## Summary
Builds an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonize human navels. The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.


![Bacteria by filterforge.com](BellyButtonBiodiversity/Images/bacteria.jpg)

This script builds an interactive dashboard to explore the [Belly Button Biodiversity dataset](http://robdunnlab.com/projects/belly-button-biodiversity/), which catalogs the microbes that colonize human navels.
The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.


## Setup
 * [Plotly.js documentation](https://plot.ly/javascript/)
 * Include in [index.html](BellyButtonBiodiversity/index.html):
```
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script src="./static/js/app.js"></script>
  ```

## Steps
1. Uses the D3 library to read in `samples.json`.
2. Creates a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
* `sample_values` are the values for the bar chart.
* `otu_ids` are the labels for the bar chart.
* `otu_labels` is the hovertext for the chart.
  ![bar Chart](BellyButtonBiodiversity/Images/hw01.png)
3. Create a bubble chart that displays each sample.
* `otu_ids` are the x values.
* `sample_values` are the y values.
* `sample_values` are the the marker size.
* `otu_ids` are the marker colors.
* `otu_labels` are the text values.
![Bubble Chart](BellyButtonBiodiversity/Images/bubble_chart.png)
4. Displays the sample metadata, i.e., an individual's demographic information.
5. Displays each key-value pair from the metadata JSON object on the page.
![hw](BellyButtonBiodiversity/Images/hw03.png)
6. Updates all of the plots any time that a new sample is selected.

7. Creates a gauge chart to plot the weekly washing frequency of the individual
* account for values ranging from 0 through 9.
* Update the chart whenever a new sample is selected.
![Weekly Washing Frequency Gauge](BellyButtonBiodiversity/Images/gauge.png)


### About the Data
Hulcr, J. et al.(2012) _A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable_. Retrieved from: [http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/](http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/)
- - -
