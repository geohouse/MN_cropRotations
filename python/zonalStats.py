import geopandas
import pandas as pd
from rasterstats import zonal_stats

# Needs to be run in the Anaconda Powershell Prompt on Windows using:
# python "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\zonalStats.py"


counties  = geopandas.read_file(r"E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_countyBoundaries_CRS5070.geojson")

# Verify CRS
counties.crs 

rasterTest = r"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs\changeCalc_2008_2009.tiff"

# Parse the 2 years being compared from the raster file name
fromYear = rasterTest.split("changeCalc_")[1].split("_")[0]
toYear = rasterTest.split(fromYear + "_")[1].split(".tiff")[0]

# Using zonal_stats outputs a dict with the order of entries (keys) being the same as the order of 
# features in the input vector file (i.e. for the counties, the key[0] corresponds to the zonal stats for 
# Lake of the Woods county, which is the first feature in the file)
zonalStats_counties = zonal_stats(vectors=counties['geometry'], raster = rasterTest, categorical = True) 

# Number of entries in output list (each is a dict with key of the change code
# and value as the number of pixels)
len(zonalStats_counties)

# This should equal the number of counties (or polygons to aggregate
# by in the vector file)
counties.shape[0]

len(zonalStats_counties) == counties.shape[0]

# Transform the output results to a dataframe with the county as 
# the row and the crop rotation code as the columns
# filling in any NaN entries with 0 instead.
zonalStats_counties_df = pd.DataFrame.from_dict(zonalStats_counties).fillna(0)

# Convert entries from pixel counts to percentages of total number
# of pixels for each county
# axis 1 gets the sum for each county (row) across all land use transitions (columns)
# Rounding to 2 decimals makes it so that the sums by county (row) at the end of this are >> 99%
# Rounding to 1 decimal made the sums by county ~98% - >99%
zonalStats_counties_df_perc = zonalStats_counties_df.apply(lambda x: round(x/x.sum()*100,2), axis = 1)

# Make a re-naming dictionary needed to rename the rows of the dataframe from 
# 0-86 (for counties) to the actual county names (from the 'COUN_LC' column)

renameDict = {}
for index in range(0,87):
    renameDict[index] = counties['COUN_LC'][index]
# Do the row re-naming
zonalStats_counties_df_perc_rowNamed = zonalStats_counties_df_perc.rename(index = renameDict)

# Now melt the df so that there is 1 row per county/crop code combination with the percentage of the county represented by 
# that combination
zonalStats_counties_df_perc_rowNamed_melt =  pd.melt(zonalStats_counties_df_perc_rowNamed, ignore_index = False)

# Remove any rows where the given crop rotation combo isn't present in the county (removes ~90% of rows)
zonalStats_counties_df_perc_rowNamed_melt_short = zonalStats_counties_df_perc_rowNamed_melt[zonalStats_counties_df_perc_rowNamed_melt.percWithinCounty != 0.00]


