describe('Проверяем  приложение', () => {
    const testingUrl = 'http://localhost:4000';

    beforeEach('Перехваты запросов', () => {
        // Перехватываем запрос на получение ингредиентов и используем фикстуру
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json',}).as('getIngredients');
        // Перехватываем запрос на авторизацию
        cy.intercept('GET', 'api/auth/user', {fixture: 'user.json'});
        // Перехватываем запрос на оформление заказа
        cy.intercept('POST', 'api/orders', { fixture: 'order.json'}).as('postOrder');

        window.localStorage.setItem('refreshToken',JSON.stringify('test-refreshToken'));

        cy.setCookie('accessToken', 'test-accessToken');
        cy.viewport(1300, 800);
        // Вход на страницу
        cy.visit(testingUrl);
        cy.wait('@getIngredients');
      });

      afterEach('Очистка после каждого теста', () => {
        //Очистка после теста
        cy.clearLocalStorage();
        cy.clearCookies();
      });
    
      it('Тестировать добавление булок, начинок и соусов в конструктор', ()=>{
        cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();//Добавление ингредиента из раздела "Булки"
        cy.get('[data-cy="constructor-bun-top"]').should('exist');//Проверяет добавление первой булки
        cy.get('[data-cy="constructor-bun-bottom"]').should('exist');//И второй булки
        cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();//Добавляет ингредиент из раздела "Начинки"
        cy.get('[data-cy="constructor-element"]').should('exist');//Проверяет его добавление
        cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();//Проверяет добавление ингредиента из раздела "Соусы"
        cy.get('[data-cy="constructor-element"]').should('exist');//Проверяет его добавление
      });

      it('Тестировать открытие модального окна ингредиента и закрытие его по клику на крестик', () => {
        cy.get('[data-cy="ingredient-item-1"]').click();//Открывает модальное окно
        cy.get('[data-cy="modal"]').should('be.visible');//Проверяет, что модальное окно открылось
        cy.get('[data-cy="modal-close-btn"]').click();//Закрывает модальное окно по клику на крестик
        cy.get('[data-cy="modal"]').should('not.exist');//Проверяет, что модальное окно закрылось
      });
    
      it('Тестировать закрытие модального окна ингредиента по клику на оверлей', () => {
        cy.get('[data-cy="ingredient-item-1"]').click();//Открывает модальное окно
        cy.get('[data-cy="modal"]').should('be.visible');////Проверяет, что модальное окно открылось
        cy.get('[data-cy="modal-overlay"]').click('topRight', { force: true });//Закрывает модальное окно по клику на оверлей
        cy.get('[data-cy="modal"]').should('not.exist');////Проверяет, что модальное окно закрылось
      });
    
      it('Тестировать создания и обработки заказа', () => {
        cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
        cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();
        cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();
        cy.get('[data-cy=order-price] button').click();//Оформить заказ
        cy.get('[data-cy="modal"]').contains('44330').should('exist');//Показ модального окна
        cy.get('[data-cy="modal-close-btn"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
        cy.get('[data-cy=constructor]').contains('Ингредиент 1').should('not.exist');//Проверка конструктора на пустоту
        cy.get('[data-cy=constructor]').contains('Ингредиент 3').should('not.exist');//Проверка конструктора на пустоту
        cy.get('[data-cy=constructor]').contains('Ингредиент 4').should('not.exist');//Проверка конструктора на пустоту
      });
}); 
