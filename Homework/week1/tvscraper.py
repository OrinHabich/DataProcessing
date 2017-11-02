# Name: Orin Habich
# Student number: 10689508

'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

# import sys
# reload(sys)
# sys.setdefaultencoding('utf8')

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # NOTE: All unicode characters are replaced by two questionmarks.
    # https://stackoverflow.com/questions/13093727/how-to-replace-unicode-characters-in-string-with-something-else-python
    # https://stackoverflow.com/questions/3828723/why-should-we-not-use-sys-setdefaultencodingutf-8-in-a-py-script

    tvserieslist = []

    # iterate over highest rated TV-series
    for tvseries in dom.by_tag("div.lister-item-content"):

        # extract title
        tvserieslist.append(tvseries.by_tag("a")[0].content\
            .encode('utf-8'))

        # tvserieslist.append(unicode(tvseries.by_tag("a")[0].content, "utf-8", errors="ignore"))

        #tvserieslist.append(tvseries.by_tag("a")[0].content)


        # extract rating
        tvserieslist.append(tvseries.by_tag("strong")[0].content)

        # extract genre
        tvserieslist.append(tvseries.by_class("genre")[0].content.strip())

        # extract actors/actresses
        # actors = ""
        # for actor in tvseries.by_tag("p")[2].by_tag("a"):
        #     actors += ', ' + actor.content\
        #         .decode('unicode_escape').encode('ascii','replace')
        # tvserieslist.append(actors.strip(","))

        # extract runtime
        tvserieslist.append(tvseries.by_class("runtime")[0].content\
            .strip(" min"))

    print tvserieslist

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

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
