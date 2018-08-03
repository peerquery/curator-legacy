
# Curator v3
Advanced content curator interface and with a voting bot for Steem.

## How to install:

* clone the repo:
* navigate to the local repo folder in Git bash or CMD,
* npm install to install dependencies
* setup your own email STMP server and enter details in .env file - or use Ethereal.email for testing
* configure every single blank field in the .env file, see sample.env for hint
* start server using: node/nondemon setup
* view Curator at http://localhost

## Features
* **Frontend ready**: curator is not a backend-only headless CMS solution. We have a nice interface built on APIs and EJS(html) files so you can easily tweak it to your taste!
* **Powerful curation system**: curators can approve or reject a post. Moderators can approve a rejected post or reject an approved post.
* **Powerful community functions**: community comes with pages for each user to see their total curation stats, their approved and rejected posts with the associated curators and their comments.
* **Native reputation system**: curator gives all users a custom reputation based on the weight of their total approved curations!
* **Powerful blacklist system**: types of the blacklist: reported, probation, banned and opt_out. All team members are automatically put on `opt_out` so none of their posts are curated. You can add people to any type of blacklist and none of their content will be curated.
* **Powerful stats**: Stats are live on the homepage and the sponsor's page. Get live stats about the total authors, the total curation, the total amount rewarded and more!
* **Powerful chat for team**: no more dependency on Discord, Steemit.chat or Facebook groups for curators. Chat is inbuilt for the team with three modes: personal messaging, public chat and *snap-chat* like chat
* **Team with roles and capabilities**: there are owners(super-admins), admins, moderators and curators each with distinct capabilities.
* **Full payment model**: bot votes/pays all parties in a curation system: author, curators, other curation team members(admins and moderators), and the project's blog
* **Live settings**: curator has a settings page for admins and owners. this page allows for live updating of system configs without needing for server restart or edit or `.env`!
* **Bot resting day**: curator has a bot resting day in-built by default. The resting day is designated as a day that the bot will not vote but recharge its voting power. it is expected there would be no curation done on the said day, allowing the system to have full resources to do CPU intensive tasks such as deleting all none-curated content(yet to be implemented), deleting all data about any user who requests for data deletion(yet to be implemented) and more
* **State of the art auth system**: curator comes with an Oauth 2 login system built on bcrypt hashed passwords, stateless user auth using JWT stored in `httpOnly` + `signed` cookies. all APIs and routes used by logged-in team members are secured to be accessed only by a client with valid auth cookies and the right user authority. the secure system allows new users to set their own password and change it anytime securely. email is sent to approve every password reset and email confirmations follow every successful password change
* **Much features you would have to discover for yourself as well as new features and improvements which are still in development!**


## Roadmap
* Move project to Steem Institute, with Peer Query's continued support
* Improve the UI and add lots of new promised improvements
* Add a themeable interface so users can have their custom interfaces
* Add an API-powered network to serve as a common interface to access the products and services of multiple curator projects
* Full documentation

## Read more
* [Curator 1: Introductory post](https://steemit.com/utopian-io/@dzivenu/introducing-curator-advanced-standalone-curation-interface-and-the-age-of-curation-as-a-service)
* [Curator 2: User capability segregation, reputation, wallet, trail and community pages, and more](https://steemit.com/utopian-io/@dzivenu/introducing-curator-2-understanding-how-curator-works-important-details-and-how-it-could-affect-the-community)
* [Curator 3: Full compensation implementation, chat, bot pages and more](#)
* [Curator: insights and feasibility](https://steemit.com/utopian-io/@dzivenu/curator-2-trail-community-pages-reputation-wallet-lots-of-new-features-and-improvements)


## Tech stack
* **Backend**: Node.js, Express.js, MYSQL, EJS, DSteem, Socket.io. See `package.json` for more.
* **Frontend**: JQuery, Semantic UI, Font Awesome

## Advantages for users:

* They can keep using their favorite client
* there is not reward splitting for the service

## Who can use Curator?

* community-driven curation services
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