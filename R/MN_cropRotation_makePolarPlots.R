library("plotly")
library("dplyr")
library("ggplot2")
library("svglite")
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

# This is a 2-index lookup to get the y axis end point of a line connecting
# any two crops in either direction.
# Crops are coded:
# 7 - corn
# 6 - soy
# 5 - hay
# 4 - spring wheat
# 3 - sugarbeets
# 2 - dry beans
# 1 - other
# To use this lookup for getting the y axis ends of the connector lines, double index
# with the 'from' crop code first, then the 'to' crop code. E.g.
# From corn to other is accessed [[7]][1] and gives 1.6 ('from' wrt corn)
# From other to corn is accessed [[1]][7] and gives 5.8 ('to' wrt corn)
# From corn to corn is accessed [[7]][7] and gives 6.4
# From sugarbeets to hay is accessed [[3]][5] and gives 3.0

yLineEndLookupList <- list(seq(1.0,1.6, by = 0.1),seq(1.8, 2.4, by = 0.1), 
                           seq(2.6,3.2, by = 0.1), seq(3.4,4.0, by = 0.1), 
                           seq(4.2,4.8,by = 0.1), seq(5.0,5.6,by = 0.1), 
                           seq(5.8,6.4, by = 0.1))

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
    cropFrom == "corn" ~ 6.4,
    cropFrom == "soy" ~ 5.5,
    cropFrom == "springWheat" ~ 3.7,
    cropFrom == "sugarbeets" ~ 2.8,
    cropFrom == "dryBeans" ~ 1.9,
    cropFrom == "hay" ~ 4.6,
    cropFrom == "other" ~ 1
  )) %>% mutate(plotYAxisTo = case_when(
    cropTo == "corn" ~ 6.4,
    cropTo == "soy" ~ 5.5,
    cropTo == "springWheat" ~ 3.7,
    cropTo == "sugarbeets" ~ 2.8,
    cropTo == "dryBeans" ~ 1.9,
    cropTo == "hay" ~ 4.6,
    cropTo == "other" ~ 1
  )) %>% mutate(cropOrderTo = case_when(
    cropTo == "corn" ~ 7,
    cropTo == "soy" ~ 6,
    cropTo == "springWheat" ~ 4,
    cropTo == "sugarbeets" ~ 3,
    cropTo == "dryBeans" ~ 2,
    cropTo == "hay" ~ 5,
    cropTo == "other" ~ 1
  )) %>% mutate(cropOrderFrom = case_when(
    cropFrom == "corn" ~ 7,
    cropFrom == "soy" ~ 6,
    cropFrom == "springWheat" ~ 4,
    cropFrom == "sugarbeets" ~ 3,
    cropFrom == "dryBeans" ~ 2,
    cropFrom == "hay" ~ 5,
    cropFrom == "other" ~ 1
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
                

# Need these as indexes for the columns to use for lookup, not the col names
# because apply sends vectors without names to the function
cropOrderFromColIndex <- which(colnames(rotationLabel) == "cropOrderFrom")
cropOrderToColIndex <- which(colnames(rotationLabel) == "cropOrderTo")

lookupLineEnd <- function(inputRow){
  print(inputRow)
}

# Initialize holder lists
yEndFrom_streamlined <- vector("list", nrow(rotationLabel))
yEndTo_streamlined <- vector("list", nrow(rotationLabel))

# Loop through the rows, using the to/from order to do the lookups from the list
# and putting the results in the correct list and position
for(rowNum in seq(1,nrow(rotationLabel),1)){
  currRow <- rotationLabel[rowNum,]
  currRowCropOrderFrom <- currRow[cropOrderFromColIndex]
  currRowCropOrderTo <- currRow[cropOrderToColIndex]
  # Need the unlist calls because the Order to/from is a list
  yEndFrom_streamlined[[rowNum]] <- yLineEndLookupList[[unlist(currRowCropOrderFrom)]][unlist(currRowCropOrderTo)]
  yEndTo_streamlined[[rowNum]] <- yLineEndLookupList[[unlist(currRowCropOrderTo)]][unlist(currRowCropOrderFrom)]
}

# Add the filled-out holder lists to the dataframe (flattened to numeric vectors)
rotationLabel$yEndFrom_streamlined <- as.numeric(yEndFrom_streamlined)
rotationLabel$yEndTo_streamlined <- as.numeric(yEndTo_streamlined)

rotationTabulate_cropRotationYear <- rotationLabel %>% 
  group_by(yearFrom, yearTo, cropRotate, plotRadFrom, plotRadTo, plotThetaFrom,
           plotThetaTo, cropFrom, cropTo, plottingColorFrom, plottingColorTo,
           plotXAxisFrom, plotXAxisTo, plotYAxisFrom, plotYAxisTo,m,b,yEndFrom,yEndTo,
           xEndFrom, xEndTo, yEndFrom_revised, yEndTo_revised, yEndFrom_streamlined,
           yEndTo_streamlined) %>% 
  summarise(totalNumPixels_cropTransition = sum(numPixelsWiZone),
            totalPercPixelsWiArea_cropTransition = (totalNumPixels_cropTransition / unique(currYearTotalPixelNumHolder$totalPixels)) * 100) 

pointSizes_from <- rotationLabel %>% group_by(yearFrom, cropFrom) %>%
  summarise(totalNumPixels_cropYearFrom = sum(numPixelsWiZone),
            totalPercPixelsWiArea_cropYearFrom = (totalNumPixels_cropYearFrom / unique(currYearTotalPixelNumHolder$totalPixels)) * 100)

pointSizes_to <- rotationLabel %>% group_by(yearTo, cropTo) %>%
  summarise(totalNumPixels_cropYearTo = sum(numPixelsWiZone),
            totalPercPixelsWiArea_cropYearTo = (totalNumPixels_cropYearTo / unique(currYearTotalPixelNumHolder$totalPixels)) * 100)

# Join the point sizes to the crop rotation data for plotting
rotationTabulate_cropRotationYear <- dplyr::left_join(rotationTabulate_cropRotationYear, pointSizes_from)
rotationTabulate_cropRotationYear <- dplyr::left_join(rotationTabulate_cropRotationYear, pointSizes_to)

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
  geom_segment(aes(x = plotXAxisFrom, y = plotYAxisFrom, xend = xEndFrom, yend = yEndFrom_streamlined, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear, show.legend = FALSE) + 
  geom_segment(aes(x = plotXAxisTo, y = plotYAxisTo, xend = xEndTo, yend = yEndTo_streamlined, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear, show.legend = FALSE) + 
  #geom_curve(aes(x = plotXAxisFrom, y = plotYAxisFrom, xend = xEndFrom + 0.2, yend = yEndFrom_revised, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear, curvature = -0.5, angle = 160) + 
  geom_segment(aes(x = xEndTo, y = yEndTo_streamlined, xend = xEndTo - 0.2, yend = yEndTo_streamlined, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear, show.legend = FALSE) + 
  geom_segment(aes(x = xEndFrom, y = yEndFrom_streamlined, xend = xEndFrom + 0.2, yend = yEndFrom_streamlined, size = totalPercPixelsWiArea / 2, color = plottingColorTo), data = rotationTabulate_cropRotationYear, show.legend = FALSE) + 
  # geom_segment(aes(x = xEndTo, y = yEndTo_revised, xend = xEndTo - 0.2, yend = yEndTo_revised, size = totalPercPixelsWiArea / 2, color = plottingColorFrom), data = rotationTabulate_cropRotationYear) + 
  # 
    geom_point(shape = 21, aes(x = plotXAxisFrom, y = plotYAxisFrom, fill = plottingColorFrom, size = totalPercPixelsWiArea_cropYearFrom / 10), data = rotationTabulate_cropRotationYear, show.legend = FALSE, color = "white", stroke = 1) +  
  geom_point(shape = 21, aes(x = plotXAxisTo, y = plotYAxisTo,fill = plottingColorTo, size = totalPercPixelsWiArea_cropYearTo / 10), data = rotationTabulate_cropRotationYear, show.legend = FALSE, color = "white", stroke = 1) + 
  theme_bw() + scale_color_identity() + scale_fill_identity() + theme(axis.title.x=element_blank(),
                                              axis.text.x=element_blank(),
                                              axis.text.y = element_blank(),
                                              axis.title.y = element_blank(),
                                              axis.ticks.y = element_blank()) + scale_x_continuous(n.breaks = 14)
test

#ggsave(file="C:/Users/Geoffrey House User/Documents/GitHub/MN_cropRotations/img/cnty/Otter Tail2.png", plot=test, width=3, height=3)

# Need to use geom_path to make the lines so that they're cleanly joining the diagonal and the horizontal lines
# This requires re-formatting the data so that each line segment (3 x,y points) is separated 
# from each other with NA in both an x and y vector of locations. There are 2 such line segments encoded
# on each line of the data (one from, one to)
# x, y, width, color

x_holder <- vector(mode = "list", length = nrow(rotationTabulate_cropRotationYear) * 8)
y_holder <- vector(mode = "list", length = nrow(rotationTabulate_cropRotationYear) * 8)
width_holder <- vector(mode = "list", length = nrow(rotationTabulate_cropRotationYear) * 8)
color_holder <- vector(mode = "list", length = nrow(rotationTabulate_cropRotationYear) * 8)

# plotXAxisFrom, plotXAxisTo, plotYAxisFrom, plotYAxisTo, xEndFrom, xEndTo, xEndFrom + 0.2, xEndTo - 0.2, yEndFrom_streamlined, yEndTo_streamlined

plotXAxisFrom_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plotXAxisFrom")
plotXAxisTo_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plotXAxisTo")
plotYAxisFrom_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plotYAxisFrom")
plotYAxisTo_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plotYAxisTo")

xEndFrom_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "xEndFrom")
xEndTo_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "xEndTo")

yEndFrom_streamlined_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "yEndFrom_streamlined")
yEndTo_streamlined_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "yEndTo_streamlined")

# The width is symmetrical between the from and to, so only 1 width type needed for each of the 2 lines per row
width_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "totalPercPixelsWiArea_cropTransition")

colorFrom_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plottingColorFrom")
colorTo_colIndex <- which(colnames(rotationTabulate_cropRotationYear) == "plottingColorTo")

# Loop through rows
for(rowNum in seq(1,nrow(rotationTabulate_cropRotationYear),1)){
  currRow <- rotationTabulate_cropRotationYear[rowNum,]
  
  plotXAxisFrom <- as.numeric(currRow[plotXAxisFrom_colIndex])
  plotXAxisTo <- as.numeric(currRow[plotXAxisTo_colIndex])
  plotYAxisFrom <- as.numeric(currRow[plotYAxisFrom_colIndex])
  plotYAxisTo <- as.numeric(currRow[plotYAxisTo_colIndex])
  
  xEndFrom <- as.numeric(currRow[xEndFrom_colIndex])
  xEndTo <- as.numeric(currRow[xEndTo_colIndex])
  
  # Make the horizontal 'whisker' extension x coordinates
  xEndFromWhisker <- xEndFrom + 0.2
  xEndToWhisker <- xEndTo - 0.2
  
  yEndFrom_streamlined <- as.numeric(currRow[yEndFrom_streamlined_colIndex])
  yEndTo_streamlined <- as.numeric(currRow[yEndTo_streamlined_colIndex])
  
  width <- as.numeric(currRow[width_colIndex])
  
  colorFrom <- as.character(currRow[colorFrom_colIndex])
  colorTo <- as.character(currRow[colorTo_colIndex])
  
  # Use the rowNum to calculate the index for the start of the 8 entries per row (2 * 4entries each) 
  holderStartPosition <- ((rowNum - 1) * 8) + 1
  
  for(offset in seq(0,7,1)){
    
    # These are the gaps between line segment codings to split the lines in geom_path
    if(offset == 3 || offset == 7){
      width_holder[[holderStartPosition + offset]] <- NA
      color_holder[[holderStartPosition + offset]] <- NA
      x_holder[[holderStartPosition + offset]] <- NA
      y_holder[[holderStartPosition + offset]] <- NA
    }
    
    if(offset != 3 && offset != 7){
      width_holder[[holderStartPosition + offset]] <- width
    }
    
    #offset 0-3 is the from line; offset 4-7 is the to line
    if(offset == 0){
      x_holder[[holderStartPosition + offset]] <- plotXAxisFrom
      y_holder[[holderStartPosition + offset]] <- plotYAxisFrom
      color_holder[[holderStartPosition + offset]] <- colorTo
      
    }
    
    if(offset == 1){
      x_holder[[holderStartPosition + offset]] <- xEndFrom
      y_holder[[holderStartPosition + offset]] <- yEndFrom_streamlined
      color_holder[[holderStartPosition + offset]] <- colorTo
    }
    
    if(offset == 2){
      x_holder[[holderStartPosition + offset]] <- xEndFromWhisker
      y_holder[[holderStartPosition + offset]] <- yEndFrom_streamlined
      color_holder[[holderStartPosition + offset]] <- colorTo
    }
    
    if(offset == 4){
      x_holder[[holderStartPosition + offset]] <- plotXAxisTo
      y_holder[[holderStartPosition + offset]] <- plotYAxisTo
      color_holder[[holderStartPosition + offset]] <- colorFrom
      
    }
    
    if(offset == 5){
      x_holder[[holderStartPosition + offset]] <- xEndTo
      y_holder[[holderStartPosition + offset]] <- yEndTo_streamlined
      color_holder[[holderStartPosition + offset]] <- colorFrom
    }
    
    if(offset == 6){
      x_holder[[holderStartPosition + offset]] <- xEndToWhisker
      y_holder[[holderStartPosition + offset]] <- yEndTo_streamlined
      color_holder[[holderStartPosition + offset]] <- colorFrom
    }
    
    
  }
  
}

dataForPathPlotting <- data.frame(xCoords = unlist(x_holder), yCoords = unlist(y_holder),
                                  width = unlist(width_holder), colorToUse = unlist(color_holder))


testForPlot <- dataForPathPlotting[9:12,]

# Need to include a dummy grouping (group = 1) to group everything together to get the lines to 
# break correctly at NAs. Without this, the color aesthetic kept lines that should have been broken
# into multiple segments together.
cropRotatePlot <- ggplot(data = dataForPathPlotting, mapping = aes(x = xCoords, y = yCoords, color = colorToUse, group = 1)) + 
  geom_path(aes(size = width / 2), show.legend = FALSE, linejoin = "round", lineend = "round") + 
  geom_point(shape = 21, aes(x = plotXAxisFrom, y = plotYAxisFrom, fill = plottingColorFrom, size = totalPercPixelsWiArea_cropYearFrom / 10), data = rotationTabulate_cropRotationYear, show.legend = FALSE, color = "white", stroke = 1) +  
  geom_point(shape = 21, aes(x = plotXAxisTo, y = plotYAxisTo,fill = plottingColorTo, size = totalPercPixelsWiArea_cropYearTo / 10), data = rotationTabulate_cropRotationYear, show.legend = FALSE, color = "white", stroke = 1) + 
  theme_bw() + scale_color_identity() + scale_fill_identity() + theme(axis.title.x=element_blank(),
                                                                      axis.text.x=element_blank(),
                                                                      axis.text.y = element_blank(),
                                                                      axis.title.y = element_blank(),
                                                                      axis.ticks.y = element_blank()) + scale_x_continuous(n.breaks = 14)
cropRotatePlot

ggsave(file="C:/Users/Geoffrey House User/Documents/GitHub/MN_cropRotations/img/cnty/Otter Tail2.png", plot=test, width=3, height=3)

