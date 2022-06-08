
# This is a script to move all of the '_allYears.csv' concatenated files 
# across all crop rotation years for each county and township/Range (copying sections also is too much space)
# created by the MN_cropRotation_concat_imgData.R script into the GitHub repo
# along with the directory structure. This does NOT move the individual year .csv
# files used to make the allYears file into the GitHub repo

#py "C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations\python\copy_cropRotationConcat_csv_toGitHubDir.py"

# Needs Python >3.5

import os
import re
import shutil

pathToGitHubDir = r"C:\Users\Geoffrey House User\Documents\GitHub\MN_cropRotations"

pathToLocalDir = r"E:\USDA_CroplandDataLayers_MN"

# Make the main imgData directory in the GitHub folder if not there already
os.makedirs(os.path.join(pathToGitHubDir, "imgData"), exist_ok=True)

# RE to check if the current root is a county folder
# Have to use an r string because of the backslash in the re,
# and escape it.
countyDirRE = r"cnty\\{1}[a-z,A-Z,_]+$"
countyDirCheck = re.compile(countyDirRE)
# Testing to reduce the number of sections with data/graphs to those that are most agricultural - south (just N of Twin Cities metro
# to be able to look at urban growth),
#  then up a narrow Western edge to Canada
# Include any with T < 33 R < 33
# T < 122 and T > 100
# T < 125 and R > 39
# T >= 125 and R > 43
# Gives 1066 TRs out of 2516

TR_count_sectionSubset = 0
# RE to check whether the current dir is a TR parent dir
townRangeDirRE = "T[0-9]{1,3}_R[0-9]{1,3}W$"
townRangeDirCheck = re.compile(townRangeDirRE)
TR_looped = 0
TR_list = []
# Keep track of how many sections are contained in the subset TRs.
countOfSubsetSections = 0

# takes root, dirs, files, and type (tr-subset, tr-no-subset or cnty) to transfer the correct folders/files
# for each case
# Make needed folders first, then copy in the allYears files.
def copyDirsFiles(root, dirs, files, type):
    if type == "cnty":
        print("In county")
        countyName = root.split("\\")[-1]
        # Make the directory
        os.makedirs(os.path.join(pathToGitHubDir, "imgData", "cnty", countyName), exist_ok=True)
        expectedFileName = countyName + "_allYears.csv"
        print(expectedFileName)
        if expectedFileName in files:
            shutil.copyfile(os.path.join(root, expectedFileName), os.path.join(pathToGitHubDir, "imgData", "cnty", countyName, expectedFileName))
            print(f"Copied file for county: {countyName}")
        else:
            print(f"Could not find the expected file for county: {countyName}. Skipping")
    if type == "tr-subset":
        pass
    if type == "tr-no-subset":
        pass


for(root, dirs, files) in os.walk(os.path.join(pathToLocalDir, "imgData"), topdown=True):
    
    if "cnty" in root:
        print(root)

    # If the current root is a county directory
    if(countyDirCheck.search(root)):
        print("yes")
        copyDirsFiles(root, dirs, files, "cnty")

    # If the current root is a township/range directory
#     if(townRangeDirCheck.search(root)):

#         #print(root)
#         TR_looped += 1
#         currTown = int(root.split("\\")[-1].split("_")[0].split("T")[1])
#         currRange = int(root.split("\\")[-1].split("_")[1].split("R")[1].split("W")[0])
#         #print(f"{currTown} {currRange}")
#         TR_list.append(f"{currTown}_{currRange}")
#         if(TR_looped % 100 == 0):
#             print(f"Processed {TR_looped} TRs")

#         if currTown < 33 and currRange < 33:
#             TR_count_sectionSubset += 1
#             #print("in subset")
#             countOfSubsetSections += len(dirs)
#             continue
#         elif currTown > 100 and currTown < 122:
#             TR_count_sectionSubset += 1
#             #print("in subset")
#             countOfSubsetSections += len(dirs)
#             continue
#         elif currTown < 125 and currRange > 39:
#             TR_count_sectionSubset += 1
#             #print("in subset")
#             countOfSubsetSections += len(dirs)
#             continue
#         elif currTown >= 125 and currRange > 43:
#             TR_count_sectionSubset += 1
#             #print("in subset")
#             countOfSubsetSections += len(dirs)
#             continue

    
#     #print(dirs)
#     #print(files)

# print(f"The count of the TRs that would be kept for section mapping is: {TR_count_sectionSubset}.")
# print(TR_list)
# print(len(TR_list))
# print(f"The number of subset sections is: {countOfSubsetSections}")
# Walk through the imgData directory in the local dir, copy 
#"C:\Users\Geoffrey House User\Downloads\test.csv"