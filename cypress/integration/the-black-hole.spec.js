describe( 'The black hole web tests', () => {

    describe( 'Website healthcheck', () => {
        it( 'Healthcheck: site is accessible', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.contains( 'The Black Hole' );
            cy.contains( 'Signup or login' );        
        } );
    } );
    
    describe( 'Login and signup checks', () => {
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

        //commenting out because i dont want too many random users in the system
        /* it( 'Signup works using a random number', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=signup]' ).click();    
            const randomNumber = Math.round( Math.random( 1, 1000 ) * 100 );        
            cy.get( '[data-cy=inputUsername]' ).type( `test_${ randomNumber }` );            
            cy.get( '[data-cy=inputName]' ).type( `test ${ randomNumber }` );  
            cy.get( '[data-cy=signMeUp]' ).click();          
            cy.contains( `Welcome back, test_${ randomNumber }` );
        } ) ; */
 
        it( 'Signup fails using an existing user', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=signup]' ).click();            
            cy.get( '[data-cy=inputUsername]' ).type( 'shumi' );            
            cy.get( '[data-cy=inputName]' ).type( 'shumi' );            
            cy.get( '[data-cy=signMeUp]' ).click();
            cy.get( '[data-cy=signupError]' ).contains( 'Could not sign you up' );            
        } );

    } );

    describe( 'Main page button checks', () => {
        it( 'Clicking on show all users button navigates to page with all valid users', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=cyAllUsers]' ).click();
            cy.url().should( 'eq', 'http://localhost:3000/users' );
            cy.contains( 'You can use any of these usernames to login' );
            cy.contains( 'jessjelly' );
        } );
    } );
    
    describe( 'User dashboard checks', () => {
        it( 'Clicking on a user in the users page navigates to user dashboard', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=cyAllUsers]' ).click();
            cy.url().should( 'eq', 'http://localhost:3000/users' );
            cy.get( '[data-cy=jessjelly]' ).click();
            cy.contains( 'User dashboard: jessjelly' );
            cy.contains( 'Name: Jess Jelly' );
        } ); 
    } );
    
    describe( 'Article loading, voting and comment checks', () => {
        it( 'Visiting an article url will return article and comments', () => {
            cy.server();
            cy.visit( 'http://localhost:3000/articles/52' );
            cy.contains( 'What is up with the cold weather' );
            cy.contains( 'shumi comment on this' );
            cy.contains( 'it is very cold' );
        } );
        it( 'Liking an article increments the like count', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=loginField]' ).type( 'shumi' );            
            cy.get( '[data-cy=loginButton]' ).click();
            cy.visit( 'http://localhost:3000/articles/52' );        
            let currVotes;
            cy.get( '[data-cy=cyArticleVotes]' ).invoke( 'text' ).then( ( text ) => {
                currVotes = +text;
            } );
            cy.get( '[data-cy=singleArticle]' ).get( '[data-cy=cyUpVote]' ).click();
            cy.visit( 'http://localhost:3000/articles/52' );        
            let newVotes;
            cy.get( '[data-cy=singleArticle]' ).get( '[data-cy=cyArticleVotes]' ).invoke( 'text' ).then( ( text ) => {
                newVotes = +text;
                expect( newVotes ).to.be.greaterThan( currVotes );
            } );        
        } );
        it( 'Disliking an article decrements the like count', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=loginField]' ).type( 'shumi' );            
            cy.get( '[data-cy=loginButton]' ).click();
            cy.visit( 'http://localhost:3000/articles/52' );        
            let currVotes;
            cy.get( '[data-cy=singleArticle]' ).get( '[data-cy=cyArticleVotes]' ).invoke( 'text' ).then( ( text ) => {
                currVotes = +text;
            } );
            cy.get( '[data-cy=singleArticle]' ).get( '[data-cy=cyDownVote]' ).click();
            cy.visit( 'http://localhost:3000/articles/52' );        
            let newVotes;
            cy.get( '[data-cy=singleArticle]' ).get( '[data-cy=cyArticleVotes]' ).invoke( 'text' ).then( ( text ) => {
                newVotes = +text;
                expect( newVotes ).to.be.lessThan( currVotes );
            } );        
        } );
        it( 'Comment on an article displays the comment on the page', () => {
            cy.server();
            cy.visit( 'http://localhost:3000' );
            cy.get( '[data-cy=loginField]' ).type( 'shumi' );            
            cy.get( '[data-cy=loginButton]' ).click();
            cy.visit( 'http://localhost:3000/articles/51' );   
            cy.get( '[data-cy=addCommentButton' ).click(); 
            cy.get( '[data-cy=formComment]' ).type( 'New Comment here by meeee' );
            cy.get( '[data-cy=postNewComment' ).click(); 
            cy.visit( 'http://localhost:3000/articles/51' );   
            cy.get( '[data-cy=cyCommentList]' ).contains( 'New Comment here by meeee' );
        } );
    } );
    
} );
