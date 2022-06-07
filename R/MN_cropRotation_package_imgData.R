# This is a script to loop through the crop rotation tabulation results
# (provided by rotation year for all counties/townshipRanges/sections)
# and to re-package it as individual files for each county/townshipRange/section
# for each rotation year separately. The script MN_cropRotation_concat_imgData.R
# Then can be run to combine all of the per-year files for each county/tr/section
# into a single output file covering all years (keeping the per-year files intact)

parentFolderForOutput_counties <- "E:/USDA_CroplandDataLayers_MN/imgData/cnty"
# Will also hold the section outputs (nested within the correct town/range folder)
parentFolderForOutput_townRange <- "E:/USDA_CroplandDataLayers_MN/imgData/tr_sec"

# This is for running after initial tests. For full run, change the first
# year in the seq call to be 2008.
for(year in seq(2009,2020)){
#for(year in seq(2008,2020)){
  
  currFileName_county <- paste0("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_county_", year, "_", year + 1, ".csv")
  currRotationResults_county <- read.table(currFileName_county, sep = ",", header = T)
  
  currFileName_tr <- paste0("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_townshipRange_", year, "_", year + 1, ".csv")
  currRotationResults_tr <- read.table(currFileName_tr, sep = ",", header = T)
  
  currFileName_sec <- paste0("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_section_", year, "_", year + 1, ".csv")
  currRotationResults_sec <- read.table(currFileName_sec, sep = ",", header = T)
  
  
  # Testing only
  #year <- 2008
  
  print(year)
  
  # Get the unique names
  uniqueCounties <- unique(currRotationResults_county$X)
  unique_tr <- unique(currRotationResults_tr$X)
  unique_sections <- unique(currRotationResults_sec$X)
  
  # Processing for counties
  for(uniqueCounty in uniqueCounties){
    print(uniqueCounty)
    # Replace all spaces with underscores and remove '.' in county names to make directory names reliable
    uniqueCounty_replaced <- gsub(" ", "_", uniqueCounty)
    uniqueCounty_replaced <- gsub("\\.","", uniqueCounty_replaced)
    outputFolderName_county <- paste(parentFolderForOutput_counties, uniqueCounty_replaced, sep = "/")
  
    # Make the output dirs if needed
    if(year == 2008){
      
      if (!dir.exists(outputFolderName_county)){
        dir.create(outputFolderName_county) 
      } else{
        print((paste0("Output dir for ", uniqueCounty_replaced, " already exists.")))
      }
    }
    
    countyDataSubset <- currRotationResults_county[currRotationResults_county$X == uniqueCounty,]
    
    write.table(countyDataSubset, file = paste0(outputFolderName_county, "/", uniqueCounty_replaced, "_", year, "_", year + 1,".csv"), sep = ",", row.names = FALSE)
  }
  
  # Processing for the township/ranges
  for(uniqueTownRange in unique_tr){
    
    # There is one town/range entry of "" that needs to be skipped.
    if(uniqueTownRange == ""){
      next
    }
    print(uniqueTownRange)
    # Replace spaces with underscores (e.g. 'T168_R34W')
    uniqueTownRange_replaced <- gsub(" ", "_", uniqueTownRange)
    outputFolderName_tr <- paste(parentFolderForOutput_townRange, uniqueTownRange_replaced, sep = "/")
    
    # Make the output dirs if needed
    if(year == 2008){
      if (!dir.exists(outputFolderName_tr)){
        dir.create(outputFolderName_tr) 
      } else{
        print((paste0("Output dir for ", uniqueTownRange_replaced, " already exists.")))
      }
    }
    
    townRangeSubset <- currRotationResults_tr[currRotationResults_tr$X == uniqueTownRange,]
    
    write.table(townRangeSubset, file = paste0(outputFolderName_tr, "/", uniqueTownRange_replaced, "_", year, "_", year + 1,".csv"), sep = ",", row.names = FALSE)
    
    # Processing for the sections within each township/range
    for(sectionNum in seq(1,36)){
      print(sectionNum)
      # Put together the township/range/section information to see if there's an
      # entry for the current combination in the section data output
      # This has spaces as delimiters
      currTRS <- paste0(uniqueTownRange, " S", sectionNum)
      # Underscores as delimiters
      currTRS_replaced <- gsub(" ", "_", currTRS)
      print(currTRS)
      if(currTRS %in% unique_sections){
        # The section folder is nested within the current TR folder
        outputFolderName_sec <- paste(outputFolderName_tr, currTRS_replaced, sep = "/")
        
        # Make the nested output dir if needed
        if(year == 2008){
          if (!dir.exists(outputFolderName_sec)){
            dir.create(outputFolderName_sec) 
          } else{
            print((paste0("Output dir for ", currTRS_replaced, " already exists.")))
          }
        }
        
        sectionSubset <- currRotationResults_sec[currRotationResults_sec$X == currTRS,]
        write.table(sectionSubset, file = paste0(outputFolderName_sec, "/", currTRS_replaced, "_", year, "_", year + 1,".csv"), sep = ",", row.names = FALSE)
        
      }
    }
  }
}