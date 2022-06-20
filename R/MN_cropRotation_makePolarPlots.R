library("plotly")
library("dplyr")
library("ggplot2")
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
  cropFrom == "corn" ~ 6,
  cropFrom == "soy" ~ 5,
  cropFrom == "springWheat" ~ 3,
  cropFrom == "sugarbeets" ~ 2,
  cropFrom == "dryBeans" ~ 1,
  cropFrom == "hay" ~ 4,
  cropFrom == "other" ~ 7
)) %>% mutate(plotRadTo = case_when(
  cropTo == "corn" ~ 6,
  cropTo == "soy" ~ 5,
  cropTo == "springWheat" ~ 3,
  cropTo == "sugarbeets" ~ 2,
  cropTo == "dryBeans" ~ 1,
  cropTo == "hay" ~ 4,
  cropTo == "other" ~ 7
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
  yearTo == 2021 ~ 157.5)) %>% mutate(plottingColorFrom = case_when(
    cropFrom == "corn" ~ "#ffd300",
    cropFrom == "soy" ~ "#267000",
    cropFrom == "springWheat" ~ "#d8b56b",
    cropFrom == "sugarbeets" ~ "#a800e2",
    cropFrom == "dryBeans" ~ "#a50000",
    cropFrom == "hay" ~ "#ffa5e2",
    cropFrom == "other" ~ "#888888"
  )) %>% mutate(plottingColorTo = case_when(
    cropTo == "corn" ~ "#ffd300",
    cropTo == "soy" ~ "#267000",
    cropTo == "springWheat" ~ "#d8b56b",
    cropTo == "sugarbeets" ~ "#a800e2",
    cropTo == "dryBeans" ~ "#a50000",
    cropTo == "hay" ~ "#ffa5e2",
    cropTo == "other" ~ "#888888"
  )) %>% mutate(plotXAxisFrom = case_when(
    yearFrom == 2008 ~ 1,
    yearFrom == 2009 ~ 2,
    yearFrom == 2010 ~ 3,
    yearFrom == 2011 ~ 4,
    yearFrom == 2012 ~ 5,
    yearFrom == 2013 ~ 6,
    yearFrom == 2014 ~ 7,
    yearFrom == 2015 ~ 8,
    yearFrom == 2016 ~ 9,
    yearFrom == 2017 ~ 10,
    yearFrom == 2018 ~ 11,
    yearFrom == 2019 ~ 12,
    yearFrom == 2020 ~ 13,
    yearFrom == 2021 ~ 14 
  )) %>% mutate(plotXAxisTo = case_when(
    yearTo == 2008 ~ 1,
    yearTo == 2009 ~ 2,
    yearTo == 2010 ~ 3,
    yearTo == 2011 ~ 4,
    yearTo == 2012 ~ 5,
    yearTo == 2013 ~ 6,
    yearTo == 2014 ~ 7,
    yearTo == 2015 ~ 8,
    yearTo == 2016 ~ 9,
    yearTo == 2017 ~ 10,
    yearTo == 2018 ~ 11,
    yearTo == 2019 ~ 12,
    yearTo == 2020 ~ 13,
    yearTo == 2021 ~ 14 
  )) %>% mutate(plotYAxisFrom = case_when(
    cropFrom == "corn" ~ 7,
    cropFrom == "soy" ~ 6,
    cropFrom == "springWheat" ~ 4,
    cropFrom == "sugarbeets" ~ 3,
    cropFrom == "dryBeans" ~ 2,
    cropFrom == "hay" ~ 5,
    cropFrom == "other" ~ 1
  )) %>% mutate(plotYAxisTo = case_when(
    cropTo == "corn" ~ 7,
    cropTo == "soy" ~ 6,
    cropTo == "springWheat" ~ 4,
    cropTo == "sugarbeets" ~ 3,
    cropTo == "dryBeans" ~ 2,
    cropTo == "hay" ~ 5,
    cropTo == "other" ~ 1
  )) %>% mutate(m = (plotYAxisTo - plotYAxisFrom)/(plotXAxisTo - plotXAxisFrom)) %>%
  mutate(b = -1 * ((m * plotXAxisFrom) - plotYAxisFrom)) %>%
  mutate(yEndFrom = (m * (plotXAxisFrom + 0.2)) + b) %>%
  mutate(yEndTo = (m * (plotXAxisTo - 0.2)) + b) %>%
  mutate(xEndFrom = plotXAxisFrom + 0.2) %>%
  mutate(xEndTo = plotXAxisTo - 0.2) %>%
  mutate(yEndTo_revised = case_when(
    plotYAxisTo == 1 ~ 1 + ((plotYAxisFrom/10) - 0.1),
    plotYAxisTo == 7 ~ 7 - ((7 - plotYAxisFrom) / 10),
    TRUE ~ plotYAxisTo + ((plotYAxisFrom - 4)/10) 
  )) %>%
  mutate(yEndFrom_revised = case_when(
    plotYAxisFrom == 1 ~ 1 + ((plotYAxisTo/10) - 0.1),
    plotYAxisFrom == 7 ~ 7 - ((7 - plotYAxisTo) / 10),
    TRUE ~ plotYAxisFrom + ((plotYAxisTo - 4)/10) 
  ))


rotationTabulate_cropRotationYear <- rotationLabel %>% 
  group_by(yearFrom, yearTo, cropRotate, plotRadFrom, plotRadTo, plotThetaFrom,
           plotThetaTo, cropFrom, cropTo, plottingColorFrom, plottingColorTo,
           plotXAxisFrom, plotXAxisTo, plotYAxisFrom, plotYAxisTo,m,b,yEndFrom,yEndTo,
           xEndFrom, xEndTo, yEndFrom_revised, yEndTo_revised) %>% 
  summarise(totalNumPixels = sum(numPixelsWiZone),
            totalPercPixelsWiArea = (totalNumPixels / unique(currYearTotalPixelNumHolder$totalPixels)) * 100)

# For testing. Open in Excel and use Pivot table with year to/from crop to/from and numPixels
# to verify that the num pixels for each cover type across all rotation types (i.e. corn) is identical
# between the 'from' year count and the 'to' year count. They should be, now that I've made the 'other'
# category, and they are. Also confirmed that the total percent of cover across the 7 types is 
# 100% for each year.

write.table(x = rotationTabulate_cropRotationYear, file = "C:/Users/Geoffrey House User/Downloads/otterTailTest.csv", row.names = F, sep = ",")
                                                      

test <- data.frame(r = c(1,3,2,5,4,2,1), t = c(0,22.5,45,90,180,270,360))

polar <- plot_ly(
  type = 'scatterpolar',
  r = test$r,
  theta = test$t,
  mode = "lines"
)
polar

polar_crop <- plot_ly(
  type = 'scatterpolar',
  r = rotationTabulate_cropRotationYear$plotRadTo,
  theta = rotationTabulate_cropRotationYear$plotThetaTo,
  mode = "lines"
)
polar_crop

#htmlwidgets::saveWidget(partial_bundle(polar_crop), file = "C:/Users/Geoffrey House User/Documents/GitHub/MN_cropRotations/tests/testPlotlyHTML.html", selfcontained =  TRUE)

test <- ggplot(data = rotationTabulate_cropRotationYear, mapping = aes(x = plotXAxisFrom, y = plotYAxisFrom)) + 
  #geom_segment(aes(x = plotXAxisFrom, y = plotYAxisFrom, xend = xEndFrom, yend = yEndFrom_revised, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear) + 
  geom_segment(aes(x = plotXAxisTo, y = plotYAxisTo, xend = xEndTo, yend = yEndTo_revised, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear) + 
  geom_curve(aes(x = plotXAxisFrom, y = plotYAxisFrom, xend = xEndFrom + 0.2, yend = yEndFrom_revised, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear, curvature = -0.5, angle = 160) + 
  geom_segment(aes(x = xEndTo, y = yEndTo_revised, xend = xEndTo - 0.2, yend = yEndTo_revised, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear) + 
  # geom_segment(aes(x = xEndFrom, y = yEndFrom_revised, xend = xEndFrom + 0.2, yend = yEndFrom_revised, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear) + 
  # geom_segment(aes(x = xEndTo, y = yEndTo_revised, xend = xEndTo - 0.2, yend = yEndTo_revised, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear) + 
  # 
    geom_point(aes(x = plotXAxisFrom, y = plotYAxisFrom, color = plottingColorFrom), size = 2, data = rotationTabulate_cropRotationYear) +  geom_point(aes(x = plotXAxisTo, y = plotYAxisTo, color = plottingColorTo), size = 2, data = rotationTabulate_cropRotationYear) + theme_bw() + scale_color_identity()
test
