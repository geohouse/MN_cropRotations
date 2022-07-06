# This is a script to read in geojson files that were used to make the Mapbox tile sets, extract just the entries for the 
# field entries that are used to make image markers in Mapbox, and then export a new JSON that links each unique field entry to the 
# URL where the thumbnail image for that field entry is located (will be used in the Mapbox script to import the correct image for each
# point)

# Some of these geojson files include other header info about type and name. Only want dict entry for the 'features' key, and then that's
# a list of dicts to parse.

# 070622 This is working correctly.

import json

jsonRaw_state = open(r'E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_stateCentroid_CRS4326.geojson', 'r')
jsonData_state = json.load(jsonRaw_state)

jsonRaw_counties = open('E:/USDA_CroplandDataLayers_MN/MN_boundaries_GeoJSON/MN_countyCentroids_CRS4326_v3.geojson', 'r')
jsonData_counties = json.load(jsonRaw_counties)

jsonRaw_tr =  open(r'E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_townshipRangeCentroids_CRS4326.geojson', 'r')
jsonData_tr = json.load(jsonRaw_tr)

jsonRaw_tr_sec =  open(r'E:\USDA_CroplandDataLayers_MN\MN_boundaries_GeoJSON\MN_sectionCentroids_CRS4326_v3.geojson', 'r')
jsonData_tr_sec = json.load(jsonRaw_tr_sec)

#print(jsonData_state)
#print(jsonData_counties)
#print(jsonData_tr_sec)

# These are the field (column) names in the input data for the different spatial scales that are used to determine the different
# centroid names for image placement. These are defined in the 'icon-image' lookup calls in the Mapbox layout call for each
# Mapbox layer

colNameToPull_state = "STATE"
colNameToPull_county = "COUN_LC"
colNameToPull_tr = "TWP_LABEL"
# For sections, the only field remaining is a url field that was pre-built for what I thought the image url would be, but it's different in the final iteration,
colNameToPull_tr_sec = "TWP_SEC_LABEL"

stateLabels = [state for state in jsonData_state['features'][0]['properties'][colNameToPull_state]]
countyLabels = []
for county in jsonData_counties['features']:
    countyName = county['properties'][colNameToPull_county]
    countyLabels.append(countyName)

trLabels = []
for tr in jsonData_tr['features']:
    trName = tr['properties'][colNameToPull_tr]
    trLabels.append(trName)

tr_secLabels = []
for trSec in jsonData_tr_sec['features']:
    trSecName = trSec['properties'][colNameToPull_tr_sec]
    tr_secLabels.append(trSecName)

print(stateLabels)
print(countyLabels)
#print(trLabels)
print(tr_secLabels)

# // >>> import json
# // >>> test = [{'a':"tester"},{'b':"tester2"}]
# // >>> json.dumps(test)
# // '[{"a": "tester"}, {"b": "tester2"}]'

# Need list of dicts (each dict for 1 centroid with keys 'url' and 'id')

# For the state, the geojson entry's a little odd, so handle that differently
stateJSON_holder = []
stateURL = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/state/MN_CRPlot_resized.png"
stateID = "Y"
stateJSON_holder.append({'id':stateID, 'url':stateURL})
stateJSON_dumped = json.dumps(stateJSON_holder)

with open(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\json\state_CR_images.json", 'w') as stateJSON_outFile:
    stateJSON_outFile.write(stateJSON_dumped)

countyJSON_holder = []
countyURL_stem = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/cnty/"

for label in countyLabels:
    # This label conversion is for the url formation, not the ID part of each entry.
    # Remove any periods in the county names (e.g. St. Louis)
    label_converted = label.replace(".","")
    # Convert any spaces to underscores
    label_converted = label_converted.replace(" ","_")
    countyURL = countyURL_stem + label_converted + "/" + label_converted + "_CRPlot_resized.png"
    countyID = label
    countyJSON_holder.append({'id': countyID, 'url': countyURL})

countyJSON_dumped = json.dumps(countyJSON_holder)

with open(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\json\cnty_CR_images.json", 'w') as countyJSON_outFile:
    countyJSON_outFile.write(countyJSON_dumped)


trJSON_holder = []
trURL_stem = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/tr_sec/"

for label_tr in trLabels:
    #print(label_tr)
    # This label conversion is for the url formation, not the ID part of each entry.
    # Remove any periods in the county names (e.g. St. Louis)
    label_tr_converted = label_tr.replace(".","")
    # Convert any spaces to underscores
    label_tr_converted = label_tr_converted.replace(" ","_")
    trURL = trURL_stem + label_tr_converted + "/" + label_tr_converted + "_CRPlot_resized.png"
    trID = label_tr
    trJSON_holder.append({'id': trID, 'url': trURL})

trJSON_dumped = json.dumps(trJSON_holder)

with open(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\json\tr_CR_images.json", 'w') as trJSON_outFile:
    trJSON_outFile.write(trJSON_dumped)

secJSON_holder = []
secURL_stem = "https://raw.githubusercontent.com/geohouse/MN_cropRotations/main/img/tr_sec/"

for label_sec in tr_secLabels:
    #print(label_sec)
    # This label conversion is for the url formation, not the ID part of each entry.
    # Remove any periods in the county names (e.g. St. Louis)
    label_sec_converted = label_sec.replace(".","")
    # Convert any spaces to underscores
    label_sec_converted = label_sec_converted.replace(" ","_")
    # Take only the first 2 elements for the town/range info for the given section. This is the parent folder name for each 
    # specific section folder
    label_sec_converted_trOnly = "_".join(label_sec_converted.split("_")[0:2])

    secURL = secURL_stem + label_sec_converted_trOnly + "/" + label_sec_converted + "/" + label_sec_converted + "_CRPlot_resized.png"
    secID = label_sec
    secJSON_holder.append({'id': secID, 'url': secURL})

secJSON_dumped = json.dumps(secJSON_holder)

with open(r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\json\tr_sec_CR_images.json", 'w') as secJSON_outFile:
    secJSON_outFile.write(secJSON_dumped)

