import json
import csv
import os
import re

# This is a test script to convert a csv file to JSON for plotly
# impot/plotting with the crop rotations. This is to make the data import
# more standardized through normal promises instead of needing a 
# D3 function, and hopefully can be faster/better performance

# Currently the csvs for the marker plotting have year from/year to
# encoding, like the csvs for the line plotting, but the markers
# don't need that level of detail since they just need the plotting 
# info for each year, not to/from as well. This removes that extra unneeded info
# for smaller file sizes and faster loading.

# The toFromSelector will be either 'to' or 'from' and will
# be added to the dict key stem in order to correctly select
# entries from the rowDict based on whether 'to' or 'from fields
# (like toYear or fromYear) should be selected.
def reformatRowDictForOutput_markers(inputRowDict, toFromSelector):
    reformattedRowDict = {}
    reformattedRowDict["year"] = inputRowDict[f'year{toFromSelector}']
    reformattedRowDict["color"] = inputRowDict[f'plottingColor{toFromSelector}']
    reformattedRowDict["x"] = inputRowDict[f'plotXAxis{toFromSelector}']
    reformattedRowDict["y"] = inputRowDict[f'plotYAxis{toFromSelector}']
    reformattedRowDict["percCov"] = inputRowDict[f'totalPercPixelsWiArea_cropYear{toFromSelector}']    
    return reformattedRowDict


def convertCsvToJSON_markers(inputCSV, outputJSONPath):
    
    # The above re-format reduces number of fields per entry. Also need 
    # to reduce the number of entries, because there are 7 entries for each
    # point for each of the crop rotation combinations, but they're all identical.
    # Make a dict with year strings as keys and arrays as the values. Arrays
    # will keep track of the colors encountered for each year, and output the row
    # if it contains a new color for that year, otherwise skips
    colorBasedEntryScreenerDict = {'2008':[],
    '2009':[],
    '2010':[],
    '2011':[],
    '2012':[],
    '2013':[],
    '2014': [],
    '2015': [],
    '2016': [],
    '2017': [],
    '2018': [],
    '2019': [],
    '2020': [],
    '2021': []}
    
    #print(inputCSV)
    dataHolder = {}
    with open(inputCSV, 'r', encoding="utf-8-sig") as inputCSVFile:
        # csv.DictReader turns each row as a dict of key/value pairs
        # where the key is the col number and the value is the value
        # for the current row that's in that column
        # Will need to subset these entries to build dict
        csvReader = csv.DictReader(inputCSVFile)
        # Can't keep the line number with enumerate in the loop because need to 
        # manually double increment it when the yearfrom is 2020 in order
        # to also pick up the yearto entries from 2021
        lineNumber = 1
        for line in csvReader:
            #print(line.strip())
            #print(lineNumber)
            #print(line)
            # pull the information from the 'from' entr
            currYearFrom = line["yearFrom"]
            currColorFrom = line["plottingColorFrom"]
            if(currColorFrom not in colorBasedEntryScreenerDict[currYearFrom]):
                colorBasedEntryScreenerDict[currYearFrom].append(currColorFrom)
                dataHolder[str(lineNumber)] = reformatRowDictForOutput_markers(line,'From')
                lineNumber +=1
            # Process these entries for 2021 using the 'to' entries from the 
            # last lines (where 2020 is the 'from' entry). These are accessing
            # different info from the same lines already processed above when 'yearFrom' == 2020,
            # so need to manually increment the lineNum to act as the index, otherwise
            # 2020 and 2021 entries would have duplicate lineNum keys, which JSON can't have.
            if(line['yearTo'] == "2021"):
                currYearTo = line["yearTo"]
                currColorTo = line["plottingColorTo"]
                if(currColorTo not in colorBasedEntryScreenerDict[currYearTo]):
                    colorBasedEntryScreenerDict[currYearTo].append(currColorTo)
                    dataHolder[str(lineNumber)] = reformatRowDictForOutput_markers(line, 'To')
                    lineNumber+=1
    #print(dataHolder)

    with open(outputJSONPath, 'w', encoding='utf-8') as jsonOutFile:
        jsonOutFile.write(json.dumps(dataHolder, indent=4))
            

#convertCsvToJSON_markers(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\imgData\state\MN_forPlotlyMarkers.csv", r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\imgData\state\MN_forPlotlyMarkers.json")

#Unfortunately the JSON conversion for the lines data makes the data
# ~4x larger (from 137kb to ~500kb). So only converting the data for state, counties, and township/ranges (not sections)
# to keep the size of the repo down (the section functionality isn't working anyway because loading/showing even the static plots on the map
# bogs Mapbox too much.)

def convertCsvToJSON_lines(inputCSV, outputJSONPath):
    dataHolder = {}
    with open(inputCSV, 'r', encoding="utf-8-sig") as inputCSVFile:
        # csv.DictReader turns each row as a dict of key/value pairs
        # where the key is the col number and the value is the value
        # for the current row that's in that column
        # Will need to subset these entries to build dict
        csvReader = csv.DictReader(inputCSVFile)
        # Can't keep the line number with enumerate in the loop because need to 
        # manually double increment it when the yearfrom is 2020 in order
        # to also pick up the yearto entries from 2021
        lineNumber = 1
        for line in csvReader:
            currHolder = {}
            #print(line.strip())
            #print(lineNumber)
            #print(line)
            currHolder["x"] = line["xCoords"]
            currHolder["y"] = line["yCoords"]
            currHolder["perCov"] = line["width"]
            currHolder["color"] = line["colorToUse"]
            dataHolder[str(lineNumber)] = currHolder
            lineNumber += 1
    with open(outputJSONPath, 'w', encoding='utf-8') as jsonOutFile:
        jsonOutFile.write(json.dumps(dataHolder, indent=4))


#convertCsvToJSON_lines(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\imgData\state\MN_forPlotlyLines.csv", r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\imgData\state\MN_forPlotlyLines.json")

# RE to detect if the current root dir is for a section (and skip if it is)

sectionRE = re.compile("_S[0-9]{1,2}")

# Previous run of this code output .json files for markers for sections (current code doesn't do that)

for root, dirs, files in os.walk(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\imgData"):
    #print(root)
    if(sectionRE.search(root)):
        print(f"skipping root: {root}")
        continue
    else:
        for file in files:
            # Functional, but commented out to prevent re-run
            if file.endswith("_forPlotlyMarkers.csv"):
                fileStem = file.split("_forPlotlyMarkers.csv")[0]
                fullFilePath_markers = os.path.join(root, file)
                jsonFileOutputName = fileStem + "_forPlotlyMarkers.json"
                jsonFullFilePath_markers = os.path.join(root, jsonFileOutputName)
                print(file)
                print(fullFilePath_markers)
                print(jsonFullFilePath_markers)
                convertCsvToJSON_markers(fullFilePath_markers, jsonFullFilePath_markers)
            # if file.endswith("_forPlotlyLines.csv"):
            #     fileStem = file.split("_forPlotlyLines.csv")[0]
            #     fullFilePath_lines = os.path.join(root, file)
            #     jsonFileOutputName = fileStem + "_forPlotlyLines.json"
            #     jsonFullFilePath_lines = os.path.join(root, jsonFileOutputName)
            #     print(file)
            #     print(fullFilePath_lines)
            #     print(jsonFullFilePath_lines)
            #     convertCsvToJSON_lines(fullFilePath_lines, jsonFullFilePath_lines)

