import csv
import json

fieldnames = ("year","num_parts_MEAN")

# read the csv file
with open('11302984_legofile.csv') as csv_f:
    reader = csv.DictReader(csv_f, fieldnames)
    rows = list(reader)

# write to json file, making it a dict
with open('11302984_legofile_json.json', 'w') as json_f:
    json_f.write('{"data":' )
    json.dump(rows, json_f)
    json_f.write('}')
