# convertCSV2JSON.py
# Minor programmeren; DataProcessing; intro D3
# Orin Habich 10689508
# Takes a .csv file as input, reads this, puts content in JSON
# then writes to .json file.
# The csv file should have the names of the measured data on top
# preceded by a #.
# This program is only suitable for 2-dimensional data.

# convertCSV2JSON.py
# Minor programmeren; DataProcessing; intro D3
# Orin Habich 10689508
# Takes a .csv file as input, reads this, puts content in JSON
# then writes to .json file.
# The csv file should have the names of the measured data on top
# preceded by a #.
# This program is only suitable for 2-dimensional data.

import csv
import json

# bron data infile:
# http://cdn.knmi.nl/knmi/map/page/klimatologie/gegevens/maandgegevens/mndgeg_260_rh24.txt
infile = 'RainJune2016BiltEindhoven.csv'
outfile = 'RainJune2016BiltEindhoven.json'

# this array will contain per data-point a dictionary
data = []
values1 = []
values2 = []

with open(infile) as csvfile:
    raw_data = csv.reader(csvfile)

    # iterate over data-points
    for row in raw_data:

        # extract what data represents
        if (row[0][:1] == "#"):
            name_x_coordinate = row[0].strip("#").strip()
            name_y1_coordinate = row[1].strip()
            name_y2_coordinate = row[2].strip()
            name_y3_coordinate = row[3].strip()
            name_y4_coordinate = row[4].strip()
            name_y5_coordinate = row[5].strip()
            name_y6_coordinate = row[6].strip()
        else:
            # create dictionary with all information at this data-point
            dic_values1 = {}
            dic_values1[name_x_coordinate] = row[0].strip()[6:8]
            dic_values1[name_y1_coordinate] = int(row[1].strip())
            dic_values1[name_y2_coordinate] = int(row[2].strip())
            dic_values1[name_y3_coordinate] = int(row[3].strip())
            values1.append(dic_values1)
            dic_values2 = {}
            dic_values2[name_x_coordinate] = row[0].strip()[6:8]
            dic_values2[name_y4_coordinate] = int(row[4].strip())
            dic_values2[name_y5_coordinate] = int(row[5].strip())
            dic_values2[name_y6_coordinate] = int(row[6].strip())
            values2.append(dic_values2)

dic1 = {}
dic1["key"] = "De Bilt"
dic1["values"] = values1
data.append(dic1)
dic2 = {}
dic2["key"] = "Eindhoven"
dic2["values"] = values1
data.append(dic2)
# write to outfile, with nice layout
with open(outfile, 'w') as outfile:
    json.dump(data, outfile, indent = 1, sort_keys = True)