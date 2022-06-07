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


# List township/ranges with full paths. This is recursive, so will get the TR dirs
# as well as the nested Section dirs. Those 2 cases are dealt with separately below.
trSecList_full <- list.dirs(path = parentFolderForOutput_townRange, full.names = TRUE)
trSecList_justNames <- list.dirs(path = parentFolderForOutput_townRange, full.names = FALSE)

for(entry in trSecList_full){
  print(entry)
  
  # if the parent folder itself (listed in the list.dirs step above, don't know why), skip
  if(grepl(pattern = "tr_sec$", x = entry)){
    next
  }
  
  # If the dir name ends with S##, then it's a section directory, and need to 
  # process that a bit differently 
  if(grepl(pattern = "S[[:digit:]]+$", x = entry)){
    # List all of the per-year csv files for the current section
    currSecFileList <- list.files(path = entry, pattern = "[20][[:digit:]]{2}[:.:]csv$")
    # Returns ie "T102_R45W_S7" (which is nested within the "T102_R45W" directory)
    currSecName <- unlist(strsplit(trSecList_justNames[which(trSecList_full == entry)], "/"))[2]
    # ie E:/USDA_CroplandDataLayers_MN/imgData/tr_sec/T102_R45W/T102_R45W_S7/T102_R45W_S7_allYears.csv
    outputFilePathName_sec <- paste0(entry, "/", currSecName, "_allYears.csv")
    
    print("SECTION")
    #print(currSecFileList)
    #print(currSecName)
    #print(outputFilePathName_sec)
    
    
    for(fileNum in seq(1,length(currSecFileList))){
      currTable <- read.table(file = paste(entry, currSecFileList[[fileNum]], sep = "/"), sep = ",", header = TRUE)
      if(fileNum == 1){
        tempHolder <- currTable
      } else{
        tempHolder <- rbind(tempHolder, currTable)
      }

      if(fileNum == length(currSecFileList)){
        write.table(x = tempHolder, file = outputFilePathName_sec, sep = ",", row.names = FALSE)
      }
    }

    } else{
      # Else it is a Township/range directory and need to process the files in it
      currTRFileList <- list.files(path = entry, pattern = "[20][[:digit:]]{2}[:.:]csv$")
      currTRName <- trList_justNames[[which(trList_full == entry)]]
      outputFilePathName_tr <- paste0(entry, "/", currTRName, "_allYears.csv")
      
      print("TownRange")
      #print(currTRFileList)
      #print(currTRName)
      #print(outputFilePathName_tr)
      
      for(fileNum in seq(1,length(currTRFileList))){
        currTable <- read.table(file = paste(entry, currTRFileList[[fileNum]], sep = "/"), sep = ",", header = TRUE)
        if(fileNum == 1){
          tempHolder <- currTable
        } else{
          tempHolder <- rbind(tempHolder, currTable)
        }

        if(fileNum == length(currTRFileList)){
          write.table(x = tempHolder, file = outputFilePathName_tr, sep = ",", row.names = FALSE)
        }

      }
    
    }
}
 