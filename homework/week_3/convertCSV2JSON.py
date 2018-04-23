import csv
import json
import glob
import os

for filename in glob.glob("michaelzonneveld/desktop/dataprocessing/week_3"):
    csvfile = os.path.splitext(filename)[0]
    jsonfile = csvfile + '.json'

    with open('11302984_legofile_csv.csv') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    with open('11302984_legofile_json.json', 'w') as f:
        json.dump(rows, f)


# import csv
# import json
#
# # read csvfile and write to jsonfile
# csvlego = open('11302984_legofile_csv.csv', 'r')
# jsonlego = open('11302984_legofile_json.json', 'w')
#
# jsonlego_list = []
# fieldnames = ("year","num_parts_MEAN")
#
# # seperate by newline and convert an object to a string with .dump
# reader = csv.DictReader(csvlego, fieldnames)
# for row in reader:
#     json.dump(row, jsonlego)
#     jsonlego.write
#
# jsonlego_list.append(jsonlego)
# print(jsonlego_list)
