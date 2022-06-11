library("plotly")
library("dplyr")

currArea <- "Otter_Tail"

currRotationResults <- read.table(paste0("C:/Users/Geoffrey House User/Documents/GitHub/MN_cropRotations/imgData/cnty/", currArea, "/", currArea,"_allYears.csv"), header = T, sep = ",")

# Get total area of each of the areas (total num pixels) for all of the years
# This will eventually be used as denom to make percentage of the area.
currYearTotalPixelNumHolder <- currRotationResults %>% group_by(X, yearFrom) %>% summarise(totalPixels = sum(numPixelsWiZone))

if(length(unique(currYearTotalPixelNumHolder$totalPixels)) != 1){
  print(paste0("The current area is: ", currArea))
  stop("The current area varies in number of pixels represented per year. Cannot calculate percentages. Exiting.")
}

# The 6 most planted crops across all years are the ones plotted here
# Code  Crop
# 1     Corn
# 5     Soy
# 23    Spring wheat
# 36 and 37 Alfalfa and other hay
# 41    Sugarbeets
# 42    Dry beans

# USe the crop codes to assign one of the 6 crops above or 'other' to all to/from 
# crops, giving 49 possible crop rotation types.


# Also code the data for polar plotting. Crops are the radius
# 7 = corn
# 6 = soy
# 5 = springWheat
# 4 = sugarbeets
# 3 = dryBeans
# 2 = hay
# 1 = other

# Years are the angles (0 degrees is 'east', going CCW); 90 deg is up
# 2008 = 90
# 2009 = 67.5
# 2010 = 45
# 2011 = 22.5
# 2012 = 0
# 2013 = 337.5
# 2014 = 315
# 2015 = 292.5
# 2016 = 270
# 2017 = 247.5
# 2018 = 225
# 2019 = 202.5
# 2020 = 180
# 2021 = 157.5

rotationLabel <- currRotationResults %>% mutate(cropFrom = case_when(
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
)) %>% mutate(cropRotate = paste(cropFrom,cropTo, sep = "_")) %>% mutate(plotRadFrom = case_when(
  cropFrom == "corn" ~ 7,
  cropFrom == "soy" ~ 6,
  cropFrom == "springWheat" ~ 5,
  cropFrom == "sugarbeets" ~ 4,
  cropFrom == "dryBeans" ~ 3,
  cropFrom == "hay" ~ 2,
  cropFrom == "other" ~ 1
)) %>% mutate(plotRadTo = case_when(
  cropTo == "corn" ~ 7,
  cropTo == "soy" ~ 6,
  cropTo == "springWheat" ~ 5,
  cropTo == "sugarbeets" ~ 4,
  cropTo == "dryBeans" ~ 3,
  cropTo == "hay" ~ 2,
  cropTo == "other" ~ 1
)) %>% mutate(plotThetaFrom = case_when(
  yearFrom == 2008 ~ 90,
  yearFrom == 2009 ~ 67.5,
  yearFrom == 2010 ~ 45,
  yearFrom == 2011 ~ 22.5,
  yearFrom == 2012 ~ 0,
  yearFrom == 2013 ~ 337.5,
  yearFrom == 2014 ~ 315,
  yearFrom == 2015 ~ 292.5,
  yearFrom == 2016 ~ 270,
  yearFrom == 2017 ~ 247.5,
  yearFrom == 2018 ~ 225,
  yearFrom == 2019 ~ 202.5,
  yearFrom == 2020 ~ 180,
  yearFrom == 2021 ~ 157.5
)) %>% mutate(plotThetaTo = case_when(
  yearTo == 2008 ~ 90,
  yearTo == 2009 ~ 67.5,
  yearTo == 2010 ~ 45,
  yearTo == 2011 ~ 22.5,
  yearTo == 2012 ~ 0,
  yearTo == 2013 ~ 337.5,
  yearTo == 2014 ~ 315,
  yearTo == 2015 ~ 292.5,
  yearTo == 2016 ~ 270,
  yearTo == 2017 ~ 247.5,
  yearTo == 2018 ~ 225,
  yearTo == 2019 ~ 202.5,
  yearTo == 2020 ~ 180,
  yearTo == 2021 ~ 157.5))

rotationTabulate_cropRotationYear <- rotationLabel %>% 
  group_by(yearFrom, yearTo, cropRotate, plotRadFrom, plotRadTo, plotThetaFrom,
           plotThetaTo, cropFrom, cropTo) %>% summarise(totalNumPixels = sum(numPixelsWiZone),
                                                        totalPercPixelsWiArea = (totalNumPixels / unique(currYearTotalPixelNumHolder$totalPixels)) * 100)

# For testing. Open in Excel and use Pivot table with year to/from crop to/from and numPixels
# to verify that the num pixels for each cover type across all rotation types (i.e. corn) is identical
# between the 'from' year count and the 'to' year count. They should be, now that I've made the 'other'
# category, and they are. Also confirmed that the total percent of cover across the 7 types is 
# 100% for each year.

write.table(x = rotationTabulate_cropRotationYear, file = "C:/Users/Geoffrey House User/Downloads/otterTailTest.csv", row.names = F, sep = ",")
                                                      

