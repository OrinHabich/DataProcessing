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
infile = 'rain_2016.csv'
outfile = 'rain_2016.json'

# this array will contain per data-point a dictionary
data = []

with open(infile) as csvfile:
    raw_data = csv.reader(csvfile)

    # iterate over data-points
    for row in raw_data:

        # extract what data represents
        if (row[0][:1] == "#"):
            name_x_coordinate = row[0].strip("#").strip()
            name_y_coordinate = row[1].strip()

        else:
            # create dictionary with all information at this data-point
            dic = {}
            dic[name_x_coordinate] = row[0].strip()
            dic[name_y_coordinate] = int(row[1].strip())

            data.append(dic)

# write to outfile, with nice layout
with open(outfile, 'w') as outfile:
    json.dump(data, outfile, indent = 1, sort_keys = True)
