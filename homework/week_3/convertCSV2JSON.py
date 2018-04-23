import csv
import json

# read csvfile and write to jsonfile
csvlego = open('11302984_legofile_csv.csv', 'r')
jsonlego = open('11302984_legofile_json.json', 'w')

fieldnames = ("year","num_parts_MEAN")

# seperate by newline and convert an object to a string with .dump
reader = csv.DictReader(csvlego, fieldnames)
for row in reader:
    json.dump(row, jsonlego)
    jsonlego.write('\n')
