#!/usr/bin/env python
# Name: Michael Zonneveld
# Student number: 11302984
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    """
    Extracts a list of highest rated TV series from DOM (of IMDB page).
    """

    serie_info = dom.find_all("div", {"class":"lister-item-content"})
    series = []

    # Indexing every serie information section
    for i in range(len(serie_info)):
    # beter was geweest:
    # for serie in serie_info;

        # For every serie all the info is stored in the list 'serie_info'
        serie_info = []

        # Extracting all the info from IMDB
        serie_title = dom.find_all("h3", {"class":"lister-item-header"})[i]
        serie_info.append(serie_title.a.text)

        serie_rating = dom.find_all("div", {"class":"ratings-bar"})[i]
        serie_info.append(serie_rating.strong.text)

        serie_genre = dom.find_all("span", {"class":"genre"})[i]
        serie_info.append(serie_genre.text.strip().replace("\n",""))

        serie_stars = dom.find_all("div", {"class":"lister-item-content"})[i]
        serie_stars = serie_stars.contents[9].text
        serie_info.append(serie_stars.strip().replace("\n","").replace("Stars:",""))

        serie_runtime = dom.find_all("span", {"class":"runtime"})[i]
        serie_info.append(serie_runtime.text.replace("min","").replace(" ",""))

        # All the information from al the series are stored in list 'series'
        series.append(serie_info)

    return series

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Write serie information on seperate rows
    for serie in tvseries:
        writer.writerow(serie)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # Get HTML content at target URL
    html = simple_get(TARGET_URL)

    # Save a copy to disk in the current directory, this serves as an backup
    # Of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
