
# Needs to be run in the Anaconda Powershell Prompt on Windows using:
# python "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\zonalStats.py"


counties  = geopandas.read_file(r"E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_countyBoundaries_CRS5070.geojson")

# Verify CRS
counties.crs 

rasterTest = r"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs\changeCalc_2008_2009.tiff"

zonalTest = zonal_stats(vectors=counties['geometry'], raster = rasterTest, categorical = True) 

# Number of entries in output list (each is a dict with key of the change code
# and value as the number of pixels)
len(zonalTest)

# This should equal the number of counties (or polygons to aggregate
# by in the vector file)
counties.shape[0]

len(zonalTest) == counties.shape[0]