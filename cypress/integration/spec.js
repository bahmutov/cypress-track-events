/// <reference types="cypress" />

beforeEach(() => {
  Cypress.track = cy.stub().as('track')
})

afterEach(() => {
  // clean up Cypress.track property
  delete Cypress.track
})

it('sends a form', () => {
  cy.visit('public/index.html')

  cy.intercept('POST', '/api/v1/message', {}).as('post')
  cy.get('form').within(() => {
    cy.get('input[name=name]').type('John Doe')
    cy.get('input[name=email]').type('joe@doe.com')
    cy.get('input[name=phone]').type('+1 (555) 555-5555')
    cy.get('input[name=message]').type('Hello World')
    cy.get('input[type=submit]').click()
  })

  // hmm, how do we verify the request as sent by the application?
  cy.get('@track')
    .should('be.calledWith', 'form')
    .its('firstCall.args.1')
    // you can confirm some properties of the sent data
    // Tip: use https://github.com/bahmutov/cy-spok
    // for similar object and array assertions
    .should('deep.include', {
      name: 'John Doe',
      message: 'Hello World',
    })
    .then((data) => {
      cy.log(JSON.stringify(data))
      // confirm the network request was sent correctly
      cy.wait('@post')
        .its('request.body', { timeout: 0 })
        .should('deep.equal', data)
    })
})
