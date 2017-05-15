# b-arch

_A Backup Archiver._

Author: luca.mella@studio.unibo.it

# Goal

Have you ever lost any bookmarked article/paper because it has been moved/removed by the publisher? Well sometimes it happens and this project may help you to overcome this case without relying on [the faith](https://www.archive.org).

# Project

The b-arch project aim to provide a simple mechanism to obtail a local copy of your bookmarks. In order to achive this objective it provides:

* _Bookmark Parser_, to parse netscape-like html bookmarks (commonly supported by major browsers)
* _Fetchers_ , github and bitbucket repository fetchers (master.zip), PDF document fetcher, and a generic HTML to PDF fetcher. 
* _Bookmark Archive_, to store the downloaded documents (file based at the moment)

# Usage

Currently, only linux platform are supported due system executable dependencies (forgive me, I was too lazy to use npm-only dependencies at this time).

How to run:

```
npm install
node index.js -f /tmp/test_session -b mybookmarks.html
```

Then a folder with `YYYY-MM-DD` should appear into `/tmp/test_session`, it will be filled with your bookmark tree containing donwlaoded resources.


## Dependencies

All dependencies expressed in _package.json_, except:

* wget
* wkhtmltopdf  

