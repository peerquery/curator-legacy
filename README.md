
# Curator v2
Advanced content curator interface and with voting bot for Steem.

## How to install:

* clone the repo:
* navigate to the in the local repo folder in Git bash or CMD,
* npm install to install dependencies
* setup your own email STMP server and enter details in .env file - or use Ethereal.email for testing
* configure every single blank field in the .env file, see sample.env for hint
* start server using: node/nondemon setup
* view Curator at http://localhost

Full docs coming soon.

## Advantages for users:

* They can keep using their favorite client
* there is not reward splitting for the service

## Who can use Curator?

* community driven curation services
* curation team of steem dapps/ apps

## Curator demo

* See site: [http://steem-curator.herokuapp.com](http://steem-curator.herokuapp.com)
* See emails: [https://ethereal.email/messages](https://ethereal.email/messages)

### Demo owner login
* Owner email: wctobf7h64hu47cm@ethereal.email
* Owner pass: wBtvmTueTBxm9HaMZr

### Demo curator login
* Login: makafuigdzivenu
* Pass: nice_password

### Email login
* Ethereal.email user: sdn3qwp64xb5gyzl@ethereal.email
* Ethereal.email pass: jbFTVaMGZ4QhdF6tB5

### Recommendation

To be able to fully and independently test the demo, I would recommend that you created your own account using the team page and then using that account to explore Curator.

### "Warning"

This new version(v2) contains breaking changes and will NOT run on the DB of v1. If you already have version 1 installed, please consider emptying the schema of the current DB, or use a new DB.