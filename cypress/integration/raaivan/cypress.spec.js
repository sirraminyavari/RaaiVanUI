describe('Cypress is working', () => {
  it('is working', () => {
    expect(true).to.equal(true);
  });
});

describe('The Login Page', () => {
  it('visits the login page', () => {
    cy.visit('/auth/login');
  });
});
