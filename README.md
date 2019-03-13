# The Black Hole

This is a social news [website](https://the-black-hole.netlify.com/) serving as the frontend to the NC-Knews [API](https://shumanator-nc-knews.herokuapp.com/api) for which the git can be found [here](https://github.com/theshumanator/the-black-hole-be). 

The application allows you to post articles to new or existing topics and comment + vote on the articles.

## Getting Started

### Prerequisites

It is assumed that VS code (or another appropriate alternative) runs on your machine. 

You also need node (at least v11.0.0) and npm (at least version 6.4.1) installed on your machine.

### Installing

#### Get the code

Fork the project from git. Then copy the git url and in the appropriate folder on your machine:

```
git clone <url from git>
```
This will create the project on your local machine. Open the project in VS code (or alternative app).

#### Install dependencies

Run the following to install body-parser, chai, express, nodemon, knex, mocha, pg & supertest. 

```
npm install 
```

Once all required dependencies are installed, you can check the node_modules folder (which should be created now) to see if the folders for each of these libraries exists.

## Running the tests 

Coming soon...

## Running the app

To run the app:
```
npm start
```

## Tech used

### Front end

#### Frameworks
The front-end was developed using React and most of the styling was done via React Bootstrap. I considered other frameworks such as semantics but I preferred the styling provided by React Bootstrap.

#### Pagination vs Infinite Scrolling
Because the back-end returns paginated results, I had a choice to implement infinite scrolling or pagination. I initially started with infinite scrolling but ran into issues so I switched to pagination then revisited infinite scrolling. The website now has infinite scrolling and shouldn't take more than half a second before it begins loading the new set of data.

#### Testing
Testing was done with Cypress. Given the limited time, not all of the test cases were incorporated.

### Back end
The database holding the article info is Postgres and Express was used to build the server. Supertest, Mocha and Chai were used for testing.

### Sprint management
A Trello board was used to track the todo list.

## Authors

* **Fatmeh Shuman** - [theshumanator](https://github.com/theshumanator)

