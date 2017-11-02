# Name: Orin Habich
# Student number: 10689508

'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry contains Title, Rating, Genres, Actors and Runtime
    '''

    tvserieslist = []

    # iterate over highest rated TV-series
    for tvseries in dom.by_tag("div.lister-item-content"):

        # extract title and add to tvserieslist
        tvserieslist.append(tvseries.by_tag("a")[0].content.encode('utf-8'))

        # extract rating and add to tvserieslist
        tvserieslist.append(tvseries.by_tag("strong")[0].content)

        # extract genre and add to tvserieslist
        tvserieslist.append(tvseries.by_class("genre")[0].content.strip())

        # extract actors/actresses and add to tvserieslist
        actors = ""
        for actor in tvseries.by_tag("p")[2].by_tag("a"):
            actors += ', ' + actor.content.encode('utf-8')
        tvserieslist.append(actors.strip(","))

        # extract runtime and add to tvserieslist
        tvserieslist.append(tvseries.by_class("runtime")[0].content.strip(" min"))

    return tvserieslist

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    writer.writerow(tvseries)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as a backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
