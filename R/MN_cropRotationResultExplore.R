library(dplyr)

# These are the crop code classes from the NASS
crops <- c(seq(1,20),seq(21,40),seq(41,60), seq(66,80), seq(204,255))
developed <- c(82,seq(121,124))
other <- c(81,seq(83,109),seq(111,112),seq(131,195),seq(61,65))

cropsKey <- list(`1` = "corn",`2` = "cotton",`3` = "rice",`4` = "sorghum",
                 `5` = "soy", `6` = "sunflower", `10` = "peanut", `11` = "tobacco",
                 `12` = "sweet corn", `13` = "popcorn", `14` = "mint",
                 `21` = "barley", `22` = "durum wheat", `23` = "spring wheat",
                 `24` = "winter wheat", `25` = "other small grains",
                 `26` = "double crop winter wheat/soy", `27` = "rye",
                 `28` = "oats", `29` = "millet", `30` = "speltz", `31` = "canola",
                 `32` = "flaxseed", `33` = "safflower", `34` = "rapeseed",
                 `35` = "mustard", `36` = "alfalfa", `37` = "other hay not alfalfa",
                 `38` = "camelina", `39` = "buckwheat", `41` = "sugarbeets",
                 `42` = "dry beans", `43` = "potatoes", `44` = "other crops",
                 `45` = "sugarcane", `46` = "sweet potatoes", `47` = "misc veg and fruit",
                 `48` = "watermelons", `49` = "onions", `50` = "cucumbers",
                 `51` = "chick peas", `52` = "lentils", `53` = "peas",
                 `54` = "tomatoes", `55` = "cranberries", `56` = "hops",
                 `57` = "herbs", `58` = "clover/wildflowers", `59` = "sod/grass seed",
                 `60` = "switchgrass", `66` = "cherries", `67` = "peaches",
                 `68` = "apples", `69` = "grapes", `70` = "christmas trees",
                 `71` = "other tree crops", `72` = "citrus", `74` = "pecans",
                 `75` = "almonds", `76` = "walnuts", `77` = "pears",
                 `204` = "pistachios", `205` = "triticale", `206` = "carrots",
                 `207` = "asparagus", `208` = "garlic", `209` = "cantaloupes",
                 `210` = "prunes", `211` = "olives", `212` = "oranges", 
                 `213` = "honeydew melons", `214` = "broccoli", `215` = "avocados",
                 `216` = "peppers", `217` = "pomegranates", `218` = "nectarines",
                 `219` = "greens", `220` = "plums", `221` = "strawberries",
                 `222` = "squash", `223` = "apricots", `224` = "vetch", 
                 `225` = "double crop winter wheat/corn", `226` = "double crop oats/corn",
                 `227` = "lettuce", `229` = "pumpkins", `230` = "double crop lettuce/durum wheat",
                 `231` = "double crop lettuce/cantaloupe", `232` = "double crop lettuce/cotton",
                 `233` = "double crop lettuce/barlye", `234` = "double crop durum wheat/sorghum",
                 `235` = "double crop barley/sorghum", `236` = "double crop winter wheat/sorghum",
                 `237` = "double crop barley/corn", `238` = "double crop winter wheat/cotton",
                 `239` = "double crop soy/cotton", `240` = "double crop soy/oats",
                 `241` = "double crop corn/soy", `242` = "blueberries", `243` = "cabbage",
                 `244` = "cauliflower", `245` = "celery", `246` = "radishes", `247` = "turnips",
                 `248` = "eggplant", `249` = "gourds", `250` = "cranberries",
                 `254` = "double crop barley/soy")

# Lookup the crop names from the crop codes
lookupCrop <- function(inputCode){
    cropName <- unlist(cropsKey[which(names(cropsKey) == inputCode)])
    return(cropName)
}


# Working POC for lookup
#test2 <- unlist(cropsKey[which(names(cropsKey) == test)])

# Conversion factor between number of pixels and number of square meters or acres
pixelSizeSqM <- 900
pixelSizeAcres <- 0.222395

test <- read.table("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_county_2020_2021.csv", sep = ",", header = T)

test_agg <- test %>% group_by(cropCode, cropCodeFrom, cropCodeTo) %>% 
  filter(cropCodeFrom %in% crops & cropCodeTo %in% crops) %>%
  summarise(totalPixels = sum(numPixelsWiZone)) %>% arrange(desc(totalPixels)) %>%
  mutate(areaAcres = totalPixels * pixelSizeAcres)

fromCropName <- unlist(lapply(test_agg$cropCodeFrom, FUN = lookupCrop))
toCropName <- unlist(lapply(test_agg$cropCodeTo, FUN = lookupCrop))

test_agg$fromCropName <- fromCropName
test_agg$toCropName <- toCropName

hist(log10(test_agg$areaAcres))


for(year in seq(2008,2020)){
  
  # quality check to make sure the crop acreages match for same years across rotations
  # (i.e. that 2008 corn acreage measured both from 2007-2008 and 2008-2009 datasets
  # is the same)
  print(year)
  # Testing only
  #year <- 2019
  
  currFileName <- paste0("E:/USDA_CroplandDataLayers_MN/NumpyProcessed/changeCalcGeoTiffs/cropChangeProcessedForGraphing/cropRotationTabulatedForGraphing_county_", year, "_", year + 1, ".csv")
  currRotationResults <- read.table(currFileName, sep = ",", header = T)
  
  # Screen out just the crop rows
  currRotationResults_cropsOnly <- currRotationResults %>%
    filter(cropCodeFrom %in% crops & cropCodeTo %in% crops)
    
  # Add the crop names
  fromCropName <- unlist(lapply(currRotationResults_cropsOnly$cropCodeFrom, FUN = lookupCrop))
  toCropName <- unlist(lapply(currRotationResults_cropsOnly$cropCodeTo, FUN = lookupCrop))
  
  currRotationResults_cropsOnly$fromCropName <- fromCropName
  currRotationResults_cropsOnly$toCropName <- toCropName
  
  currRotationResults_areaTabByCrop_from <- currRotationResults_cropsOnly %>% group_by(fromCropName) %>%
    summarise(totalPixels = sum(numPixelsWiZone)) %>% arrange(desc(totalPixels)) %>%
    mutate(areaAcres = totalPixels * pixelSizeAcres)
  
  names(currRotationResults_areaTabByCrop_from) <- c(paste0("fromCropName_", year),paste0("fromCropTotalPixels_", year), paste0("fromCropAreaAcres_", year))
  
  currRotationResults_areaTabByCrop_to <- currRotationResults_cropsOnly %>% group_by(toCropName) %>%
    summarise(totalPixels = sum(numPixelsWiZone)) %>% arrange(desc(totalPixels)) %>%
    mutate(areaAcres = totalPixels * pixelSizeAcres)
  
  names(currRotationResults_areaTabByCrop_to) <- c(paste0("toCropName_", year + 1),paste0("toCropTotalPixels_", year + 1), paste0("toCropAreaAcres_", year + 1))
  
  # If the first year, initialize the results holder, else join to the existing holder
  if(year == 2008){
    resultsHolder <- currRotationResults_areaTabByCrop_from
    resultsHolder <- dplyr::full_join(resultsHolder, currRotationResults_areaTabByCrop_to, by = c("fromCropName_2008" = "toCropName_2009"))
  } else{
    resultsHolder <- dplyr::full_join(resultsHolder, currRotationResults_areaTabByCrop_from, by = c("fromCropName_2008" = paste0("fromCropName_",year)))
    resultsHolder <- dplyr::full_join(resultsHolder, currRotationResults_areaTabByCrop_to, by = c("fromCropName_2008" = paste0("toCropName_",year + 1)))
    
  }
  
  
  # Separate test to see what the largest rotations are (top 6 crops to/from each other
  # and to/from Other)
  
  rotationTabulate <- currRotationResults %>% mutate(cropFrom = case_when(
    cropCodeFrom == 1 ~ "corn",
    cropCodeFrom == 5 ~ "soy",
    cropCodeFrom == 23 ~ "springWheat",
    cropCodeFrom == 36 | cropCodeFrom == 37 ~ "hay",
    cropCodeFrom == 41 ~ "sugarbeets",
    cropCodeFrom == 42 ~ "dryBeans",
    TRUE ~ "other"
  ), cropTo = case_when(
    cropCodeTo == 1 ~ "corn",
    cropCodeTo == 5 ~ "soy",
    cropCodeTo == 23 ~ "springWheat",
    cropCodeTo == 36 | cropCodeFrom == 37 ~ "hay",
    cropCodeTo == 41 ~ "sugarbeets",
    cropCodeTo == 42 ~ "dryBeans",
    TRUE ~ "other"
  )) %>% mutate(cropRotate = paste(cropFrom,cropTo, sep = "_"))
  
  rotationTotalAreaTabulate <- rotationTabulate %>% select(numPixelsWiZone, 
                                                           yearFrom,
                                                           yearTo,
                                                           cropRotate) %>%
    group_by(cropRotate, yearFrom, yearTo) %>%
    summarise(totalRotationPixels = sum(numPixelsWiZone))
  
  totalPix <- sum(rotationTotalAreaTabulate$totalRotationPixels)
  print(totalPix)
  if(year == 2008){
    totalRotationAreaTabulate <- rotationTotalAreaTabulate
    totalPixTabulate <- totalPix
  } else{
    totalRotationAreaTabulate <- dplyr::left_join(totalRotationAreaTabulate, rotationTotalAreaTabulate, by = c("cropRotate" = "cropRotate"))
    totalPixTabulate <- c(totalPixTabulate, totalPix)
  }
  
}


totalRotationAreaTabulate_pixColumns <- totalRotationAreaTabulate %>% group_by(cropRotate) %>% select(starts_with("totalRotationPixels"))
totalRotationAreaTabulate_pixColumns$totalPixCount <- rowSums(totalRotationAreaTabulate_pixColumns[,2:ncol(totalRotationAreaTabulate_pixColumns_df)])
