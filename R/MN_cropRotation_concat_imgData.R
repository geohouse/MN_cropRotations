# This script is run after the MN_cropRotation_package_imgData.R script
# 
# and is run to combine all of the per-year files for each county/tr/section
# into a single output file covering all years (keeping the per-year files intact)


parentFolderForOutput_counties <- "E:/USDA_CroplandDataLayers_MN/imgData/cnty"
# Will also hold the section outputs (nested within the correct town/range folder)
parentFolderForOutput_townRange <- "E:/USDA_CroplandDataLayers_MN/imgData/tr_sec"

# List counties with full paths
countiesList_full <- list.dirs(path = parentFolderForOutput_counties, full.names = TRUE)
countiesList_justNames <- list.dirs(path = parentFolderForOutput_counties, full.names = FALSE)
for(county in countiesList_full){
  print(county)
  
  # if the parent folder itself (listed in the list.dirs step above, don't know why), skip
  if(grepl(pattern = "cnty$", x = county)){
    next
  }
  # List any files ending with a 20## date (avoids concatting the allYears.csv
  # file with the others if this script has already been run)
  # Use [:.:] to match a literal period .
  currCountyFileList <- list.files(path = county, pattern = "[20][[:digit:]]{2}[:.:]csv$")
  print(currCountyFileList)
  currCountyName <- countiesList_justNames[[which(countiesList_full == county)]]
  print(currCountyName)
  
  for(fileNum in seq(1,length(currCountyFileList))){
    currTable <- read.table(file = paste(county, currCountyFileList[[fileNum]], sep = "/"), sep = ",", header = TRUE)
    if(fileNum == 1){
      tempHolder <- currTable
    } else{
      tempHolder <- rbind(tempHolder, currTable)
    }
    
    if(fileNum == length(currCountyFileList)){
      write.table(x = tempHolder, file = paste0(county, "/", currCountyName, "_allYears.csv"), sep = ",", row.names = FALSE)
    }
    
  }
  
}