# This is a script to downsize all of the crop rotation images produced by R into
# a size that works better.

# PNG saved to 1000 W x 800H (pixels) with 300dpi in R; renderer in R makes points much too big if render smaller than that,
# but need the images on the webmap to be smaller, so need to then scale the R images in Python here to be 275 x 200 pixels.

# This is safe to run multiple times; will not re-write any previously converted output.
# Also, this only runs when all 3 expected output files are created for each county/tr/sec, which ensures it's not
# trying to convert a currently being written PNG from the R script, because after the R script outputs the PNG, it 
# writes a table, so if that table is present, then PNG must being complete and set for scaling.

from PIL import Image
import os

# For each county/tr/sec, need to check for 3 files:
# For county and TR:
# .../imgData/<'cnty' or 'tr_sec'>/<geographic area>_forPlotlyLines.csv
# .../imgData/<'cnty' or 'tr_sec'>/<geographic area>_forPlotlyMarkers.csv
# .../img/<'cnty' or 'tr_sec'>/<geographic area>_CRPlot.png


# For sections:
# .../imgData/tr_sec/<Township Range folder>/<geographic area>/<geographic area>_forPlotlyLines.csv
# .../imgData/tr_sec/<Township Range folder>/<geographic area>/<geographic area>_forPlotlyMarkers.csv
# .../img/tr_sec/<Township Range folder>/<geographic area>/<geographic area>_CRPlot.png

# Do the os.walking within the /img folder (structure identical to the /imgData folder)

# For each image file, keep track of whether the other 2 associated img data  files are present or not. Only re-scale the image if all 3 are present.
plotlyLinesTrigger = False
plotlyMarkersTrigger = False


for(root, dirs, files) in os.walk(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\img", topdown=True):

    for file in files:
        # There shouldn't be any other file name endings, but skip any that are found.
        if not file.endswith("_CRPlot.png"):
            next
        # Reset triggers
        plotlyLinesTrigger = False
        plotlyMarkersTrigger = False
        # Version of the root for looking at the corresponding imgData folder instead.
        imgDataRoot = root.replace("img", "imgData")
        fileRoot = file.split("_CRPlot.png")[0]
        plotlyLinesTestName = os.path.join(imgDataRoot, fileRoot + "_forPlotlyLines.csv")
        plotlyMarkersTestName = os.path.join(imgDataRoot, fileRoot + "_forPlotlyMarkers.csv")

        # Only proceed if the two other files are found.
        if os.path.exists(plotlyLinesTestName) and os.path.exists(plotlyMarkersTestName):
            print(f"True for file: {file}, {plotlyLinesTestName},{plotlyMarkersTestName}")
            rescaledFileName = fileRoot + "_CRPlot_resized.png"

            # Don't overwrite any existing re-scaled images
            if os.path.exists(os.path.join(root, rescaledFileName)):
                print(f"Skipping re-scaling for {root}, {file} because it's already been re-scaled.")
                next

            try:
                rawImage = Image.open(os.path.join(root, file))
                rawImage.thumbnail((275,275))
                rawImage.save(os.path.join(root, rescaledFileName))
                print(f"Finished re-scaling {root}, {rescaledFileName}")
            except IOError:
                pass


    #print(f"{root},{dirs},{files}")
    #for file in files:
        