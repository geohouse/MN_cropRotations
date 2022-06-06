import rasterio
import numpy as np
import math

# Working correctly 060222

# Needs to be run in the Anaconda Powershell Prompt on Windows using:
# python "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\rasterChangeCalc.py"

yearsToProcess = [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]

# For testing only
#yearsToProcess = [2008,2009]
#tyearsToProcess = [2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021]

for index in range(0,len(yearsToProcess) - 1):
    print(f"{yearsToProcess[index]},{yearsToProcess[index+1]}")
    year1 = yearsToProcess[index]
    year2 = yearsToProcess[index + 1]
    with rasterio.open(f"E:\\USDA_CroplandDataLayers_MN\CDL_{year1}_27.tif") as cdl_1, rasterio.open(f"E:\\USDA_CroplandDataLayers_MN\CDL_{year2}_27.tif") as cdl_2:
        
        # Convert to numpy arrays
        cdl_1_band = cdl_1.read(1) 
        cdl_2_band = cdl_2.read(1)
    
        print("OK")

        # Make sure all the characteristics of the 2 rasters match
        def checkRasterMetadataMatches(raster1, raster2):
            if(raster1.width == raster2.width and 
                raster1.height == raster2.height and
                raster1.bounds == raster2.bounds and
                raster1.transform == raster2.transform and 
                raster1.dtypes[0] == raster2.dtypes[0] and 
                raster1.crs == raster2.crs):
                print(f"Rasters {raster1} and {raster2} PASSED all compatibility checks")
            
            else:
                print(f"Rasters {raster1} and {raster2} FAILED compatibility checks")

        checkRasterMetadataMatches(cdl_1, cdl_2)

        # Should be 19372
        rasterWidth = cdl_1.width
        print(f"Width is: {rasterWidth}")
        # Should be 21739
        rasterHeight = cdl_1.height
        print(f"Height is: {rasterHeight}")
        rasterTransform = cdl_1.transform
        print(f"Transform is: {rasterTransform}")
        rasterCRS = cdl_1.crs
        print(f"CRS is: {rasterCRS}")

        # 421127908

        # 9686
        raster_halfWidth = math.ceil(rasterWidth / 2)
        # 10870
        raster_halfHeight = math.ceil(rasterHeight / 2)


       
        # Cast as string (3 chars each)
        #cdl1_str = cdl_1.astype('<U3')
        #cdl2_str = cdl_2.astype('<U3')
        # Right justify the cdl_2 entries with 3 chars (pad with zeros to left as needed)
        #cdl2_ str_just = np.char.rjust(cdl2_str, 3, '0')
        # Concatenates each element in each array
        # combined_str = np.char.add(cdl1_str, cdl2_str_just)
        # Convert from string entries back to int entries
        # combined_int = combined_str.astype(int)
        # Save to .npy file
        #np.save(r"E:\USDA_CroplandDataLayers_MN\testOutput.npy",combined_int)
        # Load .npy file
        #testLoad = np.load(r"E:\USDA_CroplandDataLayers_MN\testOutput.npy")


        def processQuadrantData(inputArray1, inputArray2, quadrantNum):
            # Cast as string (3 chars each)
            print("Converting array 1.")
            inArray1_str = inputArray1.astype('<U3')
            print("Converted array 1. Converting array 2.")
            inArray2_str = inputArray2.astype('<U3')
            print("Converted array 2. Justifying entries.")
            # Right justify the most recent years entries (will appear 2nd in the concat
            # entries) to make sure has 3 chars (pad with 0 on left as needed)
            inArray2_str_just = np.char.rjust(inArray2_str,3,'0')
            print("Finished justifying. Concatenating the two.")
            # Concat each element in each array
            combinedArray_str = np.char.add(inArray1_str, inArray2_str_just)
            print("Finished concat. Converting concat array to int.")
            # Convert from string back to int
            combinedArray_int = combinedArray_str.astype(int)
            print("Converted to int. Saving.")
            # Save to .npy file
            np.save(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\Numpy_processed_{year1}_{year2}_quad_{quadrantNum}.npy", combinedArray_int)
            print("Done saving.")
        
        # Splits each numpy array into quarters and processes each
        # separately (needed because of memory usage)
        #   0   |   1
        #  -------------- 
        #   2   |   3
        
        
        for quadrant in range(0,4):
            if quadrant == 0:
                # Indexing works like range - will go to raster_halfHeight - 1
                cdl1_quarter = cdl_1_band[0:raster_halfHeight,0:raster_halfWidth]
                cdl2_quarter = cdl_2_band[0:raster_halfHeight, 0:raster_halfWidth]
                print("quad 0")
                processQuadrantData(cdl1_quarter, cdl2_quarter, quadrant)
            elif quadrant == 1:
                cdl1_quarter = cdl_1_band[0:raster_halfHeight, raster_halfWidth:rasterWidth]
                cdl2_quarter = cdl_2_band[0:raster_halfHeight, raster_halfWidth:rasterWidth]
                print("quad 1")
                processQuadrantData(cdl1_quarter, cdl2_quarter, quadrant)
            elif quadrant == 2:
                cdl1_quarter = cdl_1_band[raster_halfHeight:rasterHeight,0:raster_halfWidth]
                cdl2_quarter = cdl_2_band[raster_halfHeight:rasterHeight,0:raster_halfWidth]
                print("quad 2")
                processQuadrantData(cdl1_quarter, cdl2_quarter, quadrant)           
            elif quadrant == 3:
                cdl1_quarter = cdl_1_band[raster_halfHeight:rasterHeight, raster_halfWidth:rasterWidth]
                cdl2_quarter = cdl_2_band[raster_halfHeight:rasterHeight, raster_halfWidth:rasterWidth]
                print("quad 3")
                processQuadrantData(cdl1_quarter, cdl2_quarter, quadrant)

        # Read in the quadrant processed .npy files from above for loop and 
        # concat them all back to the full size for saving.
        # Doing this by concat quad 0 and quad 1 on axis 1,
        # quad 2 and quad 3 on axis 1,
        # then those 2 on axis 0.
        quad_0 = np.load(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\Numpy_processed_{year1}_{year2}_quad_0.npy")
        quad_1 = np.load(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\Numpy_processed_{year1}_{year2}_quad_1.npy")

        northCatQuads = np.concatenate((quad_0, quad_1), axis = 1)

        quad_2 = np.load(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\Numpy_processed_{year1}_{year2}_quad_2.npy")
        quad_3 = np.load(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\Numpy_processed_{year1}_{year2}_quad_3.npy")

        southCatQuads = np.concatenate((quad_2, quad_3), axis = 1)
        fullCatQuads = np.concatenate((northCatQuads, southCatQuads), axis = 0)
        print("fullCat shape is:")
        print(fullCatQuads.shape)
        print(fullCatQuads.dtype)
        #counter = 0

        # write out as geotiff
        with rasterio.open(fr"E:\USDA_CroplandDataLayers_MN\NumpyProcessed\changeCalcGeoTiffs\changeCalc_{year1}_{year2}.tiff",
            'w',
            driver = 'GTiff',
            height = rasterHeight,
            width = rasterWidth,
            count = 1,
            dtype = fullCatQuads.dtype,
            crs = rasterCRS,
            transform = rasterTransform) as outputGeoTIFF:
                outputGeoTIFF.write(fullCatQuads,1)

