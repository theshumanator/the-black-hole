describe( 'The black hole web tests', () => {
    it( 'Healthcheck: site is accessible', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.contains( 'The Black Hole' );
        cy.contains( 'Signup or login' );        
    } );

    it( 'Login using valid username gives the welcome message and logged in buttons', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.get( '[data-cy=loginField]' ).type( 'shumi' );            
        cy.get( '[data-cy=loginButton]' ).click();
        cy.contains( 'Welcome back, shumi' );
        cy.get( '[data-cy=cyCreateTopic]' );
        cy.get( '[data-cy=cyCreateArticle]' );
    } );

    it( 'Login using an invalid username gives an error message', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.get( '[data-cy=loginField]' ).type( 'shumiss' );            
        cy.get( '[data-cy=loginButton]' ).click();
        cy.contains( 'Invalid username. Try again.' );
    } );
    it( 'Clicking on show all users button navigates to page with all valid users', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.get( '[data-cy=cyAllUsers]' ).click();
        cy.url().should( 'eq', 'http://localhost:3000/users' );
        cy.contains( 'You can use any of these usernames to login' );
        cy.contains( 'jessjelly' );
    } );
    it( 'Clicking on a user in the users page navigates to user dashboard', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.get( '[data-cy=cyAllUsers]' ).click();
        cy.url().should( 'eq', 'http://localhost:3000/users' );
        cy.get( '[data-cy=jessjelly]' ).click();
        cy.contains( 'User dashboard: jessjelly' );
        cy.contains( 'Name: Jess Jelly' );
    } );    
    it( 'Visiting an article url will return article and comments', () => {
        cy.server();
        cy.visit( 'http://localhost:3000/articles/52' );
        cy.contains( 'What is up with the cold weather' );
        cy.contains( 'shumi comment on this' );
        cy.contains( 'it is very cold' );
    } );
    it( 'Liking an articling increments the like count', () => {
        cy.server();
        cy.visit( 'http://localhost:3000' );
        cy.get( '[data-cy=loginField]' ).type( 'shumi' );            
        cy.get( '[data-cy=loginButton]' ).click();
        cy.visit( 'http://localhost:3000/articles/52' );
        cy.get( '[data-cy=cyArticleVotes]' ) ;
        cy.get( '[data-cy=cyUpVote]' ).click();
        cy.get( '[data-cy=cyArticleVotes]' ).should( 'contain', '15' );
    } );
} );

//data-cy="loginField" cyArticleVotes (Dis)Likes: 

/* 
data-cy="cyUpVote"
data-cy="cyDownVote"
To test:
-signup
-like article
-comment on article
-like a comment
*/