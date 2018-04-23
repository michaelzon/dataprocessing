import csv
import json
#
# # open the file
# open_lego_file = open('11302984_legofile_csv.csv')
#
# # read the file and seperate by comma's
# csv_file = csv.reader(open_lego_file, delimiter = ',')
#
# lego_dict = {}
#
# # skip over the first line of the file for the headers
# fields = csv_file.next()
#
# # Iterate over each row of the csv file, zip together field -> value
# for row in csv_file:
#     lego_dict.append(dict(zip(fields, row)))
#
#  # Close the CSV file
#  opened_file.close()



fieldnames = ("year","num_parts_MEAN")

with open('11302984_legofile.csv') as csv_f:
    reader = csv.DictReader(csv_f, fieldnames)
    rows = list(reader)

print(rows)

with open('11302984_legofile_json.json', 'w') as json_f:
    json_f.write('data{')
    json.dump(rows, json_f)
    json_f.write(']')
    json_f.write('}')
