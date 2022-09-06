Downloaded MN files only 2006-2021 from https://nassgeodata.gmu.edu/CropScape/

2006, 2007 have 56m x 56m pixels that don't register with 2008-2021 (30m x 30m pixels registered with each other). So will go ahead with 2008-2021 to make it easier to start with (otherwise would need to re-sample and increase pixel size)

Converted all MN PLSS shapefiles to geojson for Mapbox (needs CRS 4326 and manually deleting the crs line in the output .geojson before can import ok)

Uploaded each to Mapbox and converted to tileset

QGIS Used Vector -> Geometry -> Centroids to get a point layer of the centroids of each of the 3 boundary input layers (will be used to locate the graph markers for each area)

Wrote script rasterChangeCalc.py in the GitHub repo to loop through all consecutive year pairs, calculate the crop type for each pixel for both years together, and outputting that as a geotiff.

(Under the hood it coverts the int values from each input raster to str (padding the most recent year entry to 3 digits with zeros if needed), concat the 2 str entries together (firstYearPixelValue + secondYearPixelValue) and back converting that to an int, then saving as geotiff following the same parameters as the input files. Due to memory limits on PC, need to split each input raster into quarters, run the conversion on each of them, then re-stitch them together to form the whole converted raster. This is done internally to the script).

How to decode the change entries
'1001' - means pixel was '1' for both years ([0] for first year, and [1:3] for second year with 0 pads
'1010' - '1' for first year, '10' for second year
'1100' - '1' for first year, '100' for second year
'10001' - '10' for first year, '1' for second year
'10001' - '10' for first year, '1' for second year
'100001' - '100' for first year, '1' for second year
'100100' - '100' for both first and second year.

---

Made separate script for rasterstats to calc zonal stats for each county/TR/section for each crop rotation type

Using zonal_stats outputs a dict with the order of entries (keys) being the same as the order of
features in the input vector file (i.e. for the counties, the key[0] corresponds to the zonal stats for Lake of the Woods county, which is the first feature in the file)

This is in zonalStats.py

---

Explored the results (state-wide) in R (MN_cropRotationResultsExplore.R). Found that the acreage of crops for each year doesn't align (but is usually close, except for hay) when looking at the rotation to a crop in a given year vs. the rotation away from that crop in the following year. Verified this is not a problem with the GIS zonal stats, and is instead due to rotation in/out of fallow or other land uses that coded as crops, and therefore aren't considered during the tabulation when only crop rows are used.

Across all years, corn, soy, spring wheat, hay (combine alfalfa and other hay), sugarbeets, and dry beans are the 6 crops with an average of over 100,000 acres from 2008-2021 and will be the ones I'll focus on for the small graphs.

Python libraries -

- rasterio
- numpy
- geopandas
- pandas
- rasterstats

Built Python function to convert .csv input for graphing to .json instead, and streamlined the input data to be ~1/14 the number of data points, with no lost necessary info (did this by removing double logging of to/from for each year (only needed for lines), and removing to/from crop info (also only needed for lines)). Reduces file size needed for marker plotting from 50kb to 15kb.

Transitioned the plotly marker plotting to use these streamlined JSON data, which also makes easier data import directly with promises and doesn't need a D3 library (also paves the way to remove the web url loading of plotly with odd version requirement and include as a bundled library instead)
