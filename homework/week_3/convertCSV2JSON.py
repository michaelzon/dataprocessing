import csv
import json

csvlego = open('11302984_legofile_csv.csv', 'r')
jsonlego = open('11302984_legofile_json.json', 'w')

fieldnames = ("year","num_parts_MEAN")
reader = csv.DictReader(csvlego, fieldnames)
for row in reader:
    json.dump(row, jsonlego)
    jsonlego.write('\n')
