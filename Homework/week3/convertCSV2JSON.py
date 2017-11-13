# convertCSV2JSON.py
# Minor programmeren; DataProcessing; intro D3
# Orin HAbich 10689508
# Takes a .csv file as input, reads this, puts content in JSON
# then writes to .json file

import csv
import json

infile = 'regen_zomer_2017.csv'
outfile = 'regen_zomer_2017.json'

with open(infile) as csvfile:
    data = csv.reader(csvfile)
    data_string = "{"
    for row in data:
        data_string += "\"" + row[0].strip() + "\":" + row[1].strip() + ","
    data_string = data_string.strip(",")
    data_string += "}"
data = json.loads(data_string)

with open(outfile, 'w') as outfile:
    json.dump(data, outfile, indent = 1, sort_keys = True)
