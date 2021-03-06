# Name: Michael Zonneveld
# Studentnumber: 11302984

import csv
import json

# setting keys for indexing later on 
fieldnames = ("year","num_parts_MEAN")

# read the csv file
with open('11302984_legofile.csv') as csv_f:
    reader = csv.DictReader(csv_f, fieldnames)
    rows = list(reader)

# write to json file, making it a dict
with open('11302984_legofile.json', 'w') as json_f:
    json_f.write('{"stats":' )
    json.dump(rows, json_f)
    json_f.write('}')
