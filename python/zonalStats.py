import geopandas
import pandas as pd
from rasterstats import zonal_stats
import os

# This is working correctly 060322

# Needs to be run in the Anaconda Powershell Prompt on Windows using:
# python "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\zonalStats.py"

# Input geojson vector outlines for counties, range/township, sections to use when calculating the zonal stats on the rasters.
counties  = geopandas.read_file(r"E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_countyBoundaries_CRS5070.geojson")
townRange = geopandas.read_file(r"E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_townshipRangeBoundaries_CRS5070.geojson")
sections = geopandas.read_file(r"E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_sectionBoundaries_CRS5070.geojson")

# Dir containing the tiffs to process (1 per year transition) with the zonal stats at the county, township/range, and section levels
inputDataPath = r"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs"

# For testing only
#inputDataPath = r"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs\changeCalc_2008_2009.tiff"

outputDataPath = r"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs\cropChangeProcessedForGraphing"

def createSpatialStats(inputVector, inputRaster, colForNames, spatialLevel, fromYear, toYear):
    
    print(f"Processing: {inputVector}")
    print(f"At spatial scale: {spatialLevel}")

    print(f"The Vector CRS is: {inputVector.crs}")

    # Using zonal_stats outputs a dict with the order of entries (keys) being the same as the order of 
    # features in the input vector file (i.e. for the counties, the key[0] corresponds to the zonal stats for 
    # Lake of the Woods county, which is the first feature in the file)
    zonalStatsOutput = zonal_stats(vectors=inputVector['geometry'], raster = inputRaster, categorical = True) 

    # Number of entries in output list (each is a dict with key of the change code
    # and value as the number of pixels)
    #len(zonalStatsOutput)

    # This should equal the number of counties (or polygons to aggregate
    # by in the vector file)
    #counties.shape[0]
    print("Finished calculating the zonal stats.")
    print(f"Do the num. results of zonal stats equal the number of input features? {len(zonalStatsOutput) == len(inputVector)}")

    # Transform the output results to a dataframe with the county as 
    # the row and the crop rotation code as the columns
    # filling in any NaN entries with 0 instead.
    zonalStatsOutput_df = pd.DataFrame.from_dict(zonalStatsOutput).fillna(0)
    print("Finished converting to data frame.")
    
    # Code below works correctly, but no longer converting to % here in Python and instead keeping as pixel counts
    # so that I can tabulate total number of acres represented by each rotation for each area(30m pixels). Can calc % per 
    # area in R script if needed.
    # Convert entries from pixel counts to percentages of total number
    # of pixels for each county
    # axis 1 gets the sum for each county (row) across all land use transitions (columns)
    # Rounding to 2 decimals makes it so that the sums by county (row) at the end of this are >> 99%
    # Rounding to 1 decimal made the sums by county ~98% - >99%
    #zonalStatsOutput_df_perc = zonalStatsOutput_df.apply(lambda x: round(x/x.sum()*100,2), axis = 1)
    #print("Finished calculating percentage from pixel numbers")
    
    # Make a re-naming dictionary needed to rename the rows of the dataframe from 
    # 0-86 (for counties) to the actual county names (from the 'COUN_LC' column)

    renameDict = {}
    for index in range(0,len(inputVector)):
        renameDict[index] = inputVector[colForNames][index]
    # Do the row re-naming
    zonalStatsOutput_df_rowNamed = zonalStatsOutput_df.rename(index = renameDict)

    
    # Now melt the df so that there is 1 row per county/crop code combination with the number of pixels of the county represented by 
    # that combination
    zonalStatsOutput_df_rowNamed_melt_base =  pd.melt(zonalStatsOutput_df_rowNamed, ignore_index = False)
    print("Finished melting into long format.")
    # Do column re-naming after melting
    zonalStatsOutput_df_rowNamed_melt = zonalStatsOutput_df_rowNamed_melt_base.rename(columns = {'variable': 'cropCode', 'value': 'numPixelsWiZone'})

    # Remove any rows where the given crop rotation combo isn't present in the county (removes ~90% of rows)
    zonalStatsOutput_df_rowNamed_melt_short = zonalStatsOutput_df_rowNamed_melt[zonalStatsOutput_df_rowNamed_melt.numPixelsWiZone != 0.00]

    # Parsing the from crop code is harder because it doesn't have leading 0 pads, so need to parse it using the total
    # length of the entry. This causes errors when the full code is 0 or less than 3 digits, so need to deal with those cases here
    def parseFromCropCode(inputCode):
        # Shortest viable crop code (1 digit for from, 3 digits (with padding as needed) for to)
        if len(str(inputCode)) >=4:
            fromCode = str(inputCode)[0:len(str(inputCode)) - 3]
            return fromCode
        else:
            return 0

    zonalStatsOutput_df_rowNamed_melt_short['cropCodeFrom'] = zonalStatsOutput_df_rowNamed_melt_short['cropCode'].apply(parseFromCropCode)
    
    # Parse to crop code from the second year for the file being parsed. Parsed from the right 3 digits of the crop code
    # then converted to int which removes any leading 0.
    zonalStatsOutput_df_rowNamed_melt_short['cropCodeTo'] = zonalStatsOutput_df_rowNamed_melt_short['cropCode'].apply(lambda x: int(str(x)[-3:]))

    print("Finished parsing crop codes.")
    # Add yearFrom and yearTo column entries to make sure all of the needed info is here
    # When assign a single value to the column, it gets repeated as many times as rows and fills all column entries 
    # automatically
    zonalStatsOutput_df_rowNamed_melt_short['yearFrom'] = int(fromYear)
    zonalStatsOutput_df_rowNamed_melt_short['yearTo'] = int(toYear)

    outputFileName = f"cropRotationTabulatedForGraphing_{spatialLevel}_{fromYear}_{toYear}.csv"
    print("Writing output.")
    zonalStatsOutput_df_rowNamed_melt_short.to_csv(os.path.join(outputDataPath, outputFileName))
    print("Finished writing output.")

with os.scandir(inputDataPath) as inputDirList:
    for entry in inputDirList:
        if entry.name.endswith(".tiff") and entry.is_file():
            print(f"Processing {entry}")
            # Parse the 2 years being compared from the raster file name
            fromYear = entry.name.split("changeCalc_")[1].split("_")[0]
            toYear = entry.name.split(fromYear + "_")[1].split(".tiff")[0]
            print(fromYear)
            print(toYear)
            # Need to call the function 3 time for each input TIFF - 1 for each spatial scale to process.
            createSpatialStats(counties, os.path.join(inputDataPath,entry), "COUN_LC", "county", fromYear, toYear)
            createSpatialStats(townRange, os.path.join(inputDataPath,entry), "TWP_LABEL", "townshipRange", fromYear, toYear)
            createSpatialStats(sections, os.path.join(inputDataPath,entry), "SECT_LABEL", "section", fromYear, toYear)