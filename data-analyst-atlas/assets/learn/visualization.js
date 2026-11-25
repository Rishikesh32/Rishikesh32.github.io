window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["visualization"] = {
  quiz: {
    "chart-choice": [
      { q: "Which chart type is best suited for showing the distribution and spread of continuous revenue data across five product categories?",
        choices: ["Pie chart", "Box plot or violin plot", "Stacked 100% bar chart", "Radar chart"],
        answer: 1,
        why: "Box plots and violin plots show median, quartiles, spread, and individual outliers simultaneously across categories." },
      { q: "You want to show how a total revenue figure of $10M breaks down into 12 different regional sales figures. Why is a standard pie chart a poor choice?",
        choices: ["Pie charts cannot render more than 2 slices", "Human perception struggles to accurately compare angles and 2D area slices, especially with many similar-sized slices; a horizontal bar chart sorted by value is far easier to read", "Pie charts require logarithmic scaling", "Pie charts do not work in web browsers"],
        answer: 1,
        why: "Humans judge length along a common aligned scale far more accurately than slice angles or 2D circle areas." },
      { q: "Which visual best displays correlation between two continuous variables (e.g., marketing spend vs new signups)?",
        choices: ["Scatter plot", "Gauge chart", "Treemap", "Donut chart"],
        answer: 0,
        why: "Scatter plots map each observation to an (x, y) Cartesian coordinate, revealing linear or non-linear relationships, clusters, and bivariate outliers." }
    ],
    "perception": [
      { q: "According to Cleveland & McGill's graphical perception hierarchy, which visual channel enables the most accurate quantitative judgment by the human eye?",
        choices: ["Color saturation / shade", "Position along a common aligned scale", "Area of a circle", "Angle of a wedge"],
        answer: 1,
        why: "Cleveland & McGill proved experimentally that position along a common aligned scale (as in bar charts and dot plots) is decoded with the highest precision." },
      { q: "Where does color hue (red vs blue vs green) rank on the visual encoding hierarchy for quantitative numbers?",
        choices: ["At the very top", "At the very bottom—color hue encodes qualitative categories, not quantitative magnitudes", "Equal to aligned position", "Better than line length"],
        answer: 1,
        why: "Color hue represents distinct categories well (e.g. Chrome vs Safari), but humans cannot intuitively decode numerical magnitudes from rainbow hues." },
      { q: "What is the Preattentive Processing effect in visual perception?",
        choices: ["Taking 5 minutes to understand a diagram", "Visual features (like an accent color or line width) that the human visual cortex processes in under 200ms before conscious attention occurs", "The rate at which computer monitors refresh", "Reading text upside down"],
        answer: 1,
        why: "Preattentive attributes (color, size, orientation) pop out instantaneously to guide the viewer's eye directly to key insights." }
    ],
    "color": [
      { q: "When should you use a diverging color palette (e.g., dark blue to white to dark red)?",
        choices: ["When visualizing unordered categories like city names", "When data has a meaningful critical midpoint or baseline (such as 0% growth, net margin, or budget target) with significant deviations in both positive and negative directions", "Only for temperature forecasts", "Never, rainbow palettes are always preferred"],
        answer: 1,
        why: "Diverging palettes emphasize distance from a neutral midpoint in two opposite directions, drawing attention to extreme positives and negatives." },
      { q: "Why should you avoid rainbow/jet colormaps for continuous data heatmaps?",
        choices: ["They have uneven perceptual luminance gradients, creating artificial boundaries where none exist, and are completely illegible to people with color vision deficiency", "They require too much server bandwidth", "They only work in Python 2", "They invert negative numbers"],
        answer: 0,
        why: "Rainbow colormaps lack perceptual uniformity and obscure real data patterns while misleading readers." },
      { q: "Approximately what percentage of men have some form of Color Vision Deficiency (CVD / color blindness)?",
        choices: ["About 0.01%", "About 8% (roughly 1 in 12 men)", "Over 50%", "Exactly 0%"],
        answer: 1,
        why: "Approximately 8% of males (and 0.5% of females) have red-green color deficiency. Using accessible palettes (Viridis, ColorBrewer) ensures readability for all users." }
    ],
    "python-viz": [
      { q: "What is the primary conceptual distinction between Matplotlib and Seaborn in Python?",
        choices: ["Matplotlib is a low-level imperative drawing canvas providing granular control over every artist/pixel; Seaborn is a high-level statistical visualization library built on top of Matplotlib that handles DataFrames, grouping, and error bands declaratively", "Matplotlib only works on Mac", "Seaborn cannot produce scatter plots", "Matplotlib is written in C++"],
        answer: 0,
        why: "Matplotlib provides low-level figure/axes primitives; Seaborn abstracts multi-variable statistical grouping directly from Pandas DataFrames." },
      { q: "When is an interactive plotting library like Plotly preferred over static image output?",
        choices: ["When rendering thousands of static PDF reports in batch", "When users need hover tooltips for exact values, zoom/pan exploration, and interactive filtering in web dashboards", "When you have no internet connection", "Plotly cannot create bar charts"],
        answer: 1,
        why: "Plotly renders responsive HTML/SVG with interactive tooltips, cross-filtering, and dynamic zooms ideal for web consumption." },
      { q: "In Matplotlib, what does <code>fig, ax = plt.subplots()</code> return?",
        choices: ["A single pandas series", "The top-level Figure object (the overall canvas/window) and an Axes object (the actual plot area with ticks, labels, and data lines)", "A database connection", "A CSV file"],
        answer: 1,
        why: "The object-oriented interface separates the container Figure from the plotting Axes coordinate systems." }
    ],
    "misleading": [
      { q: "Why is truncating the y-axis (not starting at zero) on a bar chart misleading?",
        choices: ["It crashes the browser renderer", "Because bar length directly encodes visual magnitude; starting above zero distorts relative proportions and exaggerates minor differences", "Bar charts cannot display numbers greater than 100", "Zero does not exist in standard SQL"],
        answer: 1,
        why: "Readers decode bar charts by the length of the bar. A bar twice as tall implies twice the value; truncating the baseline misleads this perception." },
      { q: "When is a non-zero y-axis baseline acceptable and encouraged?",
        choices: ["On bar charts comparing revenues", "On line charts tracking continuous time-series fluctuations (such as stock prices or body temperature) where the relative rate of change matters more than distance from zero", "On pie chart angles", "Never"],
        answer: 1,
        why: "On line charts, position and slope encode change over time. Zooming in on the relevant range highlights meaningful fluctuations without distorting bar lengths." },
      { q: "What makes dual-axis charts with different units (e.g. revenue in dollars on left, conversion rate on right) dangerous?",
        choices: ["The author can arbitrarily scale and align the axes to manufacture optical correlations or false intersection points between unrelated trends", "Dual axes double the file size", "Databases cannot query two metrics at once", "They require two monitors"],
        answer: 0,
        why: "By manipulating the min/max of either axis, an author can make two lines look perfectly correlated or cross wherever they choose. Two separate stacked charts are much safer." }
    ],
    "chart-stories": [
      { q: "What is the recommended best practice for labeling lines in a multi-line chart?",
        choices: ["Use an alphabetical legend box placed in the top right corner", "Direct labeling: place category names and final values directly next to the end of each line", "Use a 12-color legend at the bottom of the page", "Require readers to inspect source code"],
        answer: 1,
        why: "Direct labeling eliminates cognitive friction: the reader doesn't have to repeatedly dart their eyes back and forth between a disconnected legend box and data lines." },
      { q: "How should an analytical chart title be phrased to maximize executive comprehension?",
        choices: ["'Chart 1: Metric vs Date'", "'Sales by Region and Quarter Q1-Q4'", "State the key takeaway or finding as an active headline (e.g. 'West Region revenue grew 24% after Q2 retail expansion')", "Leave the title blank so readers interpret it themselves"],
        answer: 2,
        why: "Actionable titles state the primary insight upfront, framing the visual evidence that follows and preventing misinterpretation." },
      { q: "What does visual decluttering (reducing non-data ink) involve?",
        choices: ["Deleting the chart entirely", "Removing heavy dark gridlines, redundant borders, 3D effects, and unnecessary decimal places so the data stands out clearly", "Making all text 8pt size", "Using 3D drop shadows"],
        answer: 1,
        why: "Maximizing the data-ink ratio (as championed by Edward Tufte) removes visual noise, letting the data and core takeaway shine." }
    ]
  }
};
