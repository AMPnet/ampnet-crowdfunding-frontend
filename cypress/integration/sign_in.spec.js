/// <reference types="cypress" />

context('Sign In', () => {
    // beforeEach(() => {
    //     cy.visit('https://example.cypress.io/commands/actions')
    // })

    it('signs in success', () => {
        cy.visit('/cypress-1')
        cy.get('button').contains('Sign In').click()

        cy.get('#email').type('matija@ampnet.io')
        cy.get('#password').type('wrongpassword')
        cy.get('#emailForm button').should('contain', 'Sign In').click()

        cy.get('.popup-error').contains('Invalid username or password.')
        cy.get('.popup-error button').contains('OK').click()

        cy.get('#password').clear().type('password')
        cy.get('#emailForm button').should('contain', 'Sign In').click()

        cy.url().should('include', '/dash/offers')
    });
})
