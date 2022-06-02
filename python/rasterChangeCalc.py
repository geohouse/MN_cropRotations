import rasterio
import numpy as np

# Needs to be run in the Anaconda Powershell Prompt on Windows using:
# python "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\rasterChangeCalc.py"

yearsToProcess = [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]

# For testing only
yearsToProcess = [2008,2009]

for index in range(0,len(yearsToProcess) - 1):
    print(f"{yearsToProcess[index]},{yearsToProcess[index+1]}")
    year1 = yearsToProcess[index]
    year2 = yearsToProcess[index + 1]
    with rasterio.open(f"E:\\USDA_CroplandDataLayers_MN\CDL_{year1}_27.tif") as cdl_1, rasterio.open(f"E:\\USDA_CroplandDataLayers_MN\CDL_{year2}_27.tif") as cdl_2:
        cdl_1_band = cdl_1.read(1) 
        cdl_2_band = cdl_2.read(1)
    
        print("OK")

        def checkRasterMetadataMatches(raster1, raster2):
            if(raster1.width == raster2.width and 
                raster1.height == raster2.height and
                raster1.bounds == raster2.bounds and
                raster1.transform == raster2.transform and 
                raster1.dtypes[0] == raster2.dtypes[0]):
                print(f"Rasters {raster1} and {raster2} PASSED all compatibility checks")
            
            else:
                print(f"Rasters {raster1} and {raster2} FAILED compatibility checks")

        checkRasterMetadataMatches(cdl_1, cdl_2)

        counter = 0

        #cdl_concat = np.empty([cdl_1.height,cdl_1.width], dtype='uint16')

        # for currRow in cdl_1_band:
        #     for currColumn in currRow:
        #         counter += 1
        #         if (counter % 1000000 == 0):
        #             print(counter)
        #         cdl_concat

        def concatEntries(cellValue1, cellValue2):
            # Combines the numbers of the two rasters
            # to later decode the crop change for each 
            # pixel in the two years being compared (after
            # splitting the numbers apart again and looking up
            # the crop codes for each). To make this lookup easier,
            # buffer the second entries with any needed zeros to 
            # make a 3 digit entry.

            strValue1 = str(cellValue1)
            initialValue2 = str(cellValue2)

            if(len(initialValue2) == 3):
                strValue2 = initialValue2
            elif (len(initialValue2) == 2):
                strValue2 = '0' + initialValue2
            elif (len(initialValue2) == 1):
                strValue2 = '00' + initialValue2

            return int(strValue1 + strValue2)


        #testArray = np.array([[1,2,3],[4,5,6],[7,8,9]])
        #testArray2 = np.array([[1,10,100],[42,6,126],[132,8,65]])


        concatEntriesVector = np.vectorize(concatEntries)

        testOutput = concatEntriesVector(cdl_1_band, cdl_2_band)

        #print(testOutput)


