<h1 align="center">Secretle API - TypeScript</h1>
<p align="center">
  <img src="assets/logo.png" width="100px" alt="Secretle"/>
</p>
<h2 align="center">A Wordle variation focused on no-cheating gameplay</h2>
<p align="center">
Every Wordle variation I tried had an easy way to cheat for the answers, but not this one!<br>
Features a Daily Challenge with Global Stats, a Free Play mode with shareable links and an Adversarial mode.  
</p>
<br>
<br>

<p align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Next.JS-100000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
<img src="https://img.shields.io/badge/Jasmine-4B275F?style=for-the-badge&logo=jasmine&logoColor=white" alt="Jasmine">
</p>
</p>
<p align="center">
<a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2jrcamelo%2Secretle-TS" title="Deploy on Vercel">
<img src="https://img.shields.io/badge/Vercel-Deploy%20project-111111?style=for-the-badge&logo=vercel&labelColor=black">
</a>
<a href="https://github.dev/jrcamelo/Secretle-TS" title="Open in VSCode Web">
<img src="https://img.shields.io/badge/VSCode%20Web-Open%20project-0450db?style=for-the-badge&logo=visualstudiocode&logoColor=blue&labelColor=f2f2f2">
</a>
</p>
<br>
<br>


# 🔧 Environment Variables
Create a `.env.development.local` and follow the variable names based on `.env.TEMPLATE`.  

### Set the Database
This project utilizes [MongoDB](https://www.mongodb.com/) as the database, with [Mongoose](https://mongoosejs.com/) as the ORM.  
Set `DB_CONN_STRING` pointing to your MongoDB instance.  
You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/) to create a free MongoDB instance.  

### Set the Seeds
The `DAILY_SEED` will randomize the list of answers.  
`VALID_WORDS_SEED` will randomize the codes generated for sharing games.  
The seeds can be any random string, so go ahead and change them to something else.  

# 🚀 Start the project
Install the dependencies with `yarn`.  
Then start the project with `yarn run dev`

## Unit Tests
This project uses [Jasmine](https://jasmine.github.io/) as the testing framework.  
Run the tests with `yarn run test`.  
I recommend the following [VSCode](https://code.visualstudio.com/) extensions to tests easily:  
- [Jasmine Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-jasmine-test-adapter)  
- [Jasmine Test Runner](https://marketplace.visualstudio.com/items?itemName=DmitriyMuraviov.vscode-jasmine-test-runner)

## Lint
Lint the code with `yarn run lint` or `yarn run lint-fix`.  
Configure the rules by editing `.eslintrc`.  
Linting also runs on every pull request with [GitHub Actions](https://github.com/features/actions).


# 📦 Deployment
You can deploy easily by using [Vercel](https://vercel.com/).  

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2jrcamelo%2Secretle-TS)

# 🚪 Endpoint Summary
You can get the [Swagger UI](https://swagger.io) at the main page, `http://localhost:3000/`.  
The Swagger YAML is also available at [/public/swagger.yaml](/public/swagger.yaml) or `http://localhost:3000/swagger.yaml`.

### /game
Takes a token and returns an ongoing game or a new one if there is none.  
You can use the mode parameter to choose the game mode.  
This sets your user token in the cookies as well.  
### /playing/guess
Takes a token and a word, and, if there is an ongoing game, adds a guess to the guess list
### /playing/random
Takes a token and, if there is an ongoing game, makes a random guess
### /playing/giveup
Takes a token, and if there is an ongoing game, finishes it
### /stats
Gets a list of statistics about the daily Wordle games, and can take a game number
### /me
Takes a token and returns a list of statistics about the player past games
