'use strict';

import {setLocalStorage, getLocalStorage} from '/script_localStorage.js';
import {testItemsParse, userItemsParse, userTestsParse} from '/script_data.js';

let authorisationForm = document.querySelector('.authorisation-form'),
	resetBtn = document.querySelector('.reset-btn'),
	authorisationContainer = document.querySelector('.js-authorisation'),
	errorContainer = document.querySelector('.js-error'),
	testsContainer = document.querySelector('.js-tests'),
	usersContainer = document.querySelector('.js-users'), 
	body = document.querySelector('body');

//Авторизация
authorisationForm.addEventListener('submit', function(e){
	e.preventDefault();
	formValidation();

	setTimeout(resetAauthorisation(), 500)
})

//Проверка логина и пароля
function formValidation(){

	let inputLogin = document.getElementById('inputLogin'),
		inputPassword = document.getElementById('inputPassword'),
		userData = {
 			userLogin: inputLogin.value, 
 			userPassword: inputPassword.value}

	if(inputLogin.value == "Administrator" && inputPassword.value == "12345"){
		userData.success = true;
		setLocalStorage("user", userData);
		goFromTo(authorisationContainer, testsContainer); 
	}else{
		userData.success = false;
		setLocalStorage("user", userData);
		goFromTo(authorisationContainer, errorContainer);
	}
}

//Появление навигации
function addNav(elem){

	let navHTML = "";

  	navHTML = `
  		<nav>
			<ul>
				<li><a data-id="tests" class="nav-link">Тесты</a></li>
				<li><a data-id="users" class="nav-link">Пользователи</a></li>
			</ul>

				<button class="button exit-btn">Выйти</button>
			</nav>               
  	`;

  	elem.insertAdjacentHTML("afterBegin", navHTML);

  	//Появление навигации и выделение пункта активной секции 
  	setTimeout(() => {

  		let activeLink = document.querySelector('.nav-link[data-id = '+document.querySelector('.is-active').dataset.id+']');

  		activeLink.classList.add('active');
  		document.querySelector('nav').classList.add('out');
  	}, 500)
}

//Переход между секциями
function goFromTo(from, to){
	from.classList.remove('is-active');

	//Удаление навигации у предыдущей секции
	if(document.querySelector('nav')){
		from.querySelector('nav').remove();
	}
	
	//Добавление навигации следующей секции
	if(to.dataset.id){
		addNav(to);
	}

	to.classList.add('is-active');

	//Добавление тестов из документа
	if(to = testsContainer){
		testItemsParse("data_tests.xml", document.querySelector('.tests-block')); 
	}
	
	//Добавление пользователей из документа
	if(to = usersContainer){
		userItemsParse("data_users.xml", document.querySelector('.users-block')); 
	}
}

//Очистка формы авторизации
function resetAauthorisation(){
	inputLogin.value = '';
	inputPassword.value = '';
}

//Возвращение к авторизации, после сообщения об ошибке
resetBtn.addEventListener('click', function(){
	backToAuthorisation();
})

//Возвращение к авторизации
function backToAuthorisation(){
	authorisationContainer.classList.add('is-active');
	testsContainer.classList.remove('is-active');
	exitAreaContainer.classList.remove('out');
	errorContainer.classList.remove('is-active');
	usersContainer.classList.remove('is-active');

	if(document.querySelector('nav')){
		document.querySelector('nav').remove();
	}
}

let exitAreaContainer = document.querySelector('.js-exit-area'),
	exitContainer = document.querySelector('.js-exit'),
	createAreaContainer = document.querySelector('.js-create-tests-area'),
	createContainer = document.querySelector('.js-create-tests'), 
	userInfoContainer = document.querySelector('.js-user-info'),
	userInfoAreaContainer = document.querySelector('.js-user-info-area');

window.addEventListener('click', function(event){
	
	//Выход из учетной записи 
	if(event.target.classList.contains('exit-btn')){

		exitAreaContainer.classList.add('out');
		exitContainer.classList.add('out');

		let yesBtn = document.querySelector('.button[data-id = "yes"]'),
			noBtn = document.querySelector('.button[data-id = "no"]');

		//Выход из учетной записи, при нажатии Да 
		yesBtn.addEventListener('click', function(e){
			e.preventDefault();
			backToAuthorisation();
		})
		
		//Закрытие окна вызхода из учетной записи, при нажатии Нет
		noBtn.addEventListener('click', function(){
			exitAreaContainer.classList.remove('out');
		})
		
		//Закрытие окна вызхода из учетной записи, при нажатии вне окна
		exitAreaContainer.addEventListener('click', function(){
			exitAreaContainer.classList.remove('out');
		})
	}

	//Удаление вопроса в тесте
	if(event.target.classList.contains('delete-question')){
		event.preventDefault();
		cancelDelete(".test-question", "вопрос");
	}

	//Прокрутка вверх или переход к другой секции через навигацию
	if(event.target.classList.contains('nav-link')){

		if(event.target.classList.contains("active")){
			window.scrollTo({top: 0, behavior: "smooth"});
		}else{
			goFromTo(document.querySelector('.is-active'), document.querySelector('.js-' + event.target.dataset.id));
		}
	}

	//Включенние и отключение тестов
	if(event.target.classList.contains('switch-btn')){
		if(event.target.classList.contains('switch-on')){
			event.target.classList.remove('switch-on');
		}else{
			event.target.classList.add('switch-on');
		}
	}

	//Удаление теста
	if(event.target.dataset.action === 'delete'){
		cancelDelete(".test-item", "тест");
	}

	//Просмотр статистики пользователя
	if(event.target.classList.contains('more-btn')){
		userInfoContainer.classList.add('out');
		body.classList.add('create-open');

		let selectBlock = document.querySelector('.user-tests-block select'),
		triesList = document.querySelector('.user-tries-list'),
		userInfoBlockHeader = document.querySelector('.user-info-block-header');

		//Добавление статистики из документа
		userTestsParse("data_user_tests.xml", event.target);

		//Закрытие статистики пользователя и очистка блоков
		userInfoAreaContainer.addEventListener('click', function(){
			userInfoContainer.classList.remove('out');
			body.classList.remove('create-open');

			userInfoBlockHeader.innerHTML = "";
			triesList.innerHTML = "";
			selectBlock.innerHTML = "";
		})
	}

	//Добавление вопроса теста
	if(event.target.classList.contains('add-question')){

		event.preventDefault();

		let questionHTML = "",
			questionsBlock = document.querySelector('.questions-block'),
			testsBlockWarnings,
			testQuestions;

		testQuestions = document.querySelectorAll('.test-question');
		testsBlockWarnings = document.querySelectorAll('.questions-block-warning');

		//Вопросов не может быть больше 15
		if(testQuestions.length < 15){
			questionHTML = `
	  			<div class="test-question">
					<label class="label">
						<h2 class="label-text">Вопрос</h2>
						<input class="input question-name" type="text" placeholder="Введите вопрос" value="Вопрос">
					</label>
			
					<div class = "test-options">

						<div class = "options">
							<label class="label">
								<h2 class="label-text">Вариант ответа: </h2>
								<input class="input" type="text" placeholder="Введите вариант ответа" value="Вариант ответа">
							</label>
							<label class="label">
								<h2 class="label-text">Вариант ответа: </h2>
								<input class="input" type="text" placeholder="Введите вариант ответа" value="Вариант ответа">
							</label>
							<label class="label">
								<h2 class="label-text">Вариант ответа: </h2>
								<input class="input" type="text" placeholder="Введите вариант ответа" value="Вариант ответа">
							</label>
							<label class="label">
								<h2 class="label-text">Вариант ответа: </h2>
								<input class="input" type="text" placeholder="Введите вариант ответа" value="Вариант ответа">
							</label>
						</div>
		
						<div class="answer">
							<h1>Правильний вариант</h1>
							<input type="radio" name="answer-${testQuestions.length}">
							<input type="radio" name="answer-${testQuestions.length}">
							<input type="radio" name="answer-${testQuestions.length}">
							<input type="radio" name="answer-${testQuestions.length}">
						</div>
					</div>
					<button class="button delete-question">Удалить вопрос</button>	
				</div>
			`;

			questionsBlock.insertAdjacentHTML("beforeEnd", questionHTML);

			//Удалиние предупреждений
			for(let i = 0; i < testsBlockWarnings.length; i++){
				testsBlockWarnings[i].remove();
			}
		}else{
			questionHTML = `
  				<h1 class="questions-block-warning">Тест не может содержать больше, чем 15 вопросов</h1>
			`;

			questionsBlock.insertAdjacentHTML("beforeEnd", questionHTML);
		}
	}

	//Добавление теста
	if(event.target.classList.contains('add-test')){

		event.preventDefault();
		
		let questionHTML = "",
			questionsBlock = document.querySelector('.questions-block'),
			testsBlockWarnings,
			testQuestions,
			testsBlock = document.querySelector('.tests-block');

		testQuestions = document.querySelectorAll('.test-question');
		testsBlockWarnings = document.querySelectorAll('.questions-block-warning');
			
		//Вопросов не может быть меньше 5 
		if(testQuestions.length >= 5){

			let createdTestName = createContainer.querySelector('.test-name').value;
			
			questionHTML = `
	  				<div class="test-item" data-id="1">
						<div class="test-name">${createdTestName}</div>
						<div class="switch-btn"></div>
						<div data-action="delete" class="test-delete"><svg data-action="delete" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><line data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g><g><circle data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" cx="32" cy="32" r="30.999"/></g></svg></div>
					</div>
			`;

			testsBlock.insertAdjacentHTML("afterBegin", questionHTML);

			createContainer.classList.remove('out');
			body.classList.remove('create-open');

			questionsBlock.innerHTML = "";

		}else{

			//Удалиние предупреждений
			for(let i = 0; i < testsBlockWarnings.length; i++){
				testsBlockWarnings[i].remove();
			}

			questionHTML = `
	  			<h1 class="questions-block-warning">Тест не может содержать меньше, чем 5 вопросов</h1>
			`;

			questionsBlock.insertAdjacentHTML("beforeEnd", questionHTML);
		}
	}
})

let createBtn = document.querySelector('.create-btn');

//Открытие секции создания теста
createBtn.addEventListener('click', function(){

	createContainer.classList.add('out');
	body.classList.add('create-open');

	//Закрытие секции создания теста
	createAreaContainer.addEventListener('click', function(){
		createContainer.classList.remove('out');
		body.classList.remove('create-open');
	})
})

//Удаление блока, с возможностью возвращения
function cancelDelete(parentItem, name){

	let currentParent = event.target.closest(parentItem),
		cancelDeleteHTML = document.createElement('div'),
		timerCounterNumber = 4;

	//Блок удаления
  	cancelDeleteHTML.className = "test-deleted";
  	cancelDeleteHTML.innerHTML = `
  		<div class="test-deleted-timer">
	        <div class="timer-left">
				<div class="timer-counter">
   					<span class="timer-counter-number">${timerCounterNumber}</span>
       				<svg class="timer-counter-circle"><circle r="15" cx="20" cy="20"></circle></svg>
          		</div>
				<div class="timer-title">Вы удалили ${name}</div>
	       	</div>
	    	<div class="timer-return">Вернуть</div>                   
	   	</div>                
  	`;
		
	//Замена блока на блок удаления 
	currentParent.after(cancelDeleteHTML);
	currentParent.style.display = "none";
		
	//Обратный отсчет до удаления
	let setTimeoutID = setTimeout(function(){

		//Удаление блоко
		currentParent.remove();
		cancelDeleteHTML.remove();

	},4000);
		
	let timerReturn = cancelDeleteHTML.querySelector('.timer-return'),
		timerCounter = cancelDeleteHTML.querySelector('.timer-counter-number');
		
	//Отображение обратного отсчета до удаления
	let setIntervalID = setInterval(function(){

		timerCounterNumber -= 1;

		if(timerCounterNumber === 0){
			clearTimeout(setIntervalID);
		}
			
		timerCounter.innerText = timerCounterNumber;

	}, 1000);

	//Отмена удаления при нажатии на кнопку Вернуть
	timerReturn.addEventListener('click', function(e){
		e.preventDefault();

		//Возврат блока, удаление блока удаления и очистка таймера
		currentParent.style.display = "flex";
		cancelDeleteHTML.remove();
		clearTimeout(setTimeoutID);

	});
}
