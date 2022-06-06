# This is a script to loop through the crop rotation tabulation results
# (provided by rotation year for all counties/townshipRanges/sections)
# and to re-package it as a single file containing all results for all years
# for each county/townshipRange/section separately

parentFolderForOutput <- "E:/USDA_CroplandDataLayers_MN/imgData/cnty"

for(year in seq(2008,2020)){
  currFileName_county <- paste0("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_county_", year, "_", year + 1, ".csv")
  currRotationResults_county <- read.table(currFileName_county, sep = ",", header = T)
  
  print(year)
  # Testing only
  #year <- 2008
  
  # Get the unique county names
  uniqueCounties <- unique(currRotationResults_county$X)
  
  for(uniqueCounty in uniqueCounties){
    print(uniqueCounty)
    # Remove all spaces and '.' in county names to make directory names reliable
    uniqueCounty_replaced <- gsub(" ", "", uniqueCounty)
    uniqueCounty_replaced <- gsub("\\.","", uniqueCounty_replaced)
    outputFolderName <- paste(parentFolderForOutput, uniqueCounty_replaced, sep = "/")
  
    # Make the output dirs if needed
    if(year == 2008){
      
      if (!dir.exists(outputFolderName)){
        dir.create(outputFolderName) 
      } else{
        print((paste0("Output dir for ", uniqueCounty_replaced, " already exists.")))
      }
    }
    
    countyDataSubset <- currRotationResults_county[currRotationResults_county$X == uniqueCounty,]
    
    write.table(countyDataSubset, file = paste0(outputFolderName, "/", uniqueCounty_replaced, "_", year, "_", year + 1,".csv"), sep = ",", row.names = FALSE)
  
    
  }
  
  
}