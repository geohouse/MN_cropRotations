library("plotly")
library("dplyr")

otterTailTest <- read.table("C:/Users/Geoffrey House User/Documents/GitHub/MN_cropRotations/imgData/cnty/Otter_Tail/Otter_Tail_allYears.csv", header = T, sep = ",")

# Get total area of each of the areas (total num pixels) for all of the years
# This will eventually be used as denom to make percentage of the area.
currYearTotalPixelNumHolder <- otterTailTest %>% group_by(X, yearFrom) %>% summarise(totalPixels = sum(numPixelsWiZone))
  

# The 6 most planted crops across all years are the ones plotted here
# Code  Crop
# 1     Corn
# 5     Soy
# 23    Spring wheat
# 36 and 37 Alfalfa and other hay
# 41    Sugarbeets
# 42    Dry beans

# use the cropCodeFrom to keep all areas of the 6 crops for each year (regardless of whether they
# are then planted to one of the 6 crops again, or are planted to some other crop instead.
otterTailTest_subsetCrops <- otterTailTest %>% filter(cropCodeFrom %in% c(1,5,23,36,37,41,42))


                                                      

