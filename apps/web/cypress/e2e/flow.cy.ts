describe('TaskBoard Flow', () => {
    const email = `e2e_${Date.now()}@test.com`;
    const password = 'password123';
    const name = 'Cypress User';

    it('Register -> Login -> CRUD Task', () => {
        // 1. Register
        cy.visit('/register');
        cy.get('input[name="name"]').type(name);
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();

        // Should pass to login
        cy.url().should('include', '/login');

        // 2. Login
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();

        // Should be on dashboard
        cy.url().should('include', '/dashboard');
        cy.contains('TaskBoard');

        // 3. Create Task
        cy.contains('New Task').click();
        cy.get('input[name="title"]').type('My First Task');
        cy.get('textarea[name="description"]').type('Testing with Cypress');
        cy.get('button').contains('Save Task').click();

        // Verify task exists
        cy.contains('My First Task').should('be.visible');

        // 4. Update Status (mocked via UI interaction if implemented, or edit)
        // Click edit
        cy.contains('My First Task').parent().parent().find('button').first().click(); // Edit icon
        cy.get('select[name="status"]').select('IN_PROGRESS');
        cy.get('button').contains('Save Task').click();

        cy.contains('IN PROGRESS'); // Checking badge text

        // 5. Open details (optional if we added link, but we have /tasks/[id])
        // We didn't add a link in dashboard title, let's skip navigation check unless we add it.

        // 6. Delete Task
        cy.contains('My First Task').parent().parent().find('button').last().click(); // Delete icon
        // Handle confirm
        cy.on('window:confirm', () => true);

        // Verify deleted
        cy.contains('My First Task').should('not.exist');
    });
});
