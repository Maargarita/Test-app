'use strict';

let xmlParse = {

	//Добавление тестов из документа
	testItemsParse: function(fileName, htmlBlock) {

		//Создание запроса
		let xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		
    		//Получение xml докумета при успешной отправке запроса 
    		if (this.readyState == 4 && this.status == 200) {

		  		let xmlDoc = xhttp.responseXML,
  					textHTML="",
					xmlDocItems = xmlDoc.getElementsByTagName("testItem");

				//Проход по всем записям и создание HTML кода
	  			for (let i = 0; i < xmlDocItems.length; i++) {

  					let itemId = xmlDocItems[i].getElementsByTagName("id")[0].textContent,
  						itemName = xmlDocItems[i].getElementsByTagName("name")[0].textContent;
			
					textHTML +=`
						<div class="test-item" data-id="${itemId}">
							<div class="test-name">${itemName}</div>
							<div class="switch-btn"></div>
							<div data-action="delete" class="test-delete"><svg data-action="delete" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><line data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g><g><line data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g><g><circle data-action="delete" fill="none" stroke="#ffffff" stroke-width="4" stroke-miterlimit="10" cx="32" cy="32" r="30.999"/></g></svg></div>
						</div>
					`;
  				}
				
				//Добавление кода в блок
	  			htmlBlock.innerHTML = textHTML;
			}	
		}

		//Отправка запроса
		xhttp.open("GET", fileName, true);
	  	xhttp.send();
	},

	//Добавление пользователей из документа
	userItemsParse: function(fileName, htmlBlock) {

		//Создание запроса
		let xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		
    		//Получение xml докумета при успешной отправке запроса 
    		if (this.readyState == 4 && this.status == 200) {
 
		  		let xmlDoc = xhttp.responseXML,
  					textHTML="",
					xmlDocItems = xmlDoc.getElementsByTagName("userItem");

	  			//Проход по всем записям и создание HTML кода
	  			for (let i = 0; i < xmlDocItems.length; i++) {

  					let itemId = xmlDocItems[i].getElementsByTagName("id")[0].textContent,
  						itemName = xmlDocItems[i].getElementsByTagName("name")[0].textContent;
			
					textHTML +=`
						<div class="user-item" data-id="${itemId}">
							<div class="user-name">${itemName}</div>
							<button class="button more-btn">Посмотреть статистику</button>
						</div>
					`;
  				}

  				//Добавление кода в блок
	  			htmlBlock.innerHTML = textHTML;
			}	
		}

		//Отправка запроса
		xhttp.open("GET", fileName, true);
	  	xhttp.send();
	},

	//Добавление статистики пользователей из документа
	userTestsParse: function(fileName, target) {

		//Создание запроса
		let xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		
    		//Получение xml докумета при успешной отправке запроса 
    		if (this.readyState == 4 && this.status == 200) {
 
		  		let xmlDoc = xhttp.responseXML,
					xmlDocItems = xmlDoc.getElementsByTagName("userTest"),
					currentParent = target.closest('.user-item'),
					userId = currentParent.dataset.id,
					selectBlock = document.querySelector('.user-tests-block select'),
					selectOptionHTML = "",
					triesListBlock = document.querySelector('.user-tries-list'),
					userInfoBlockHeader = document.querySelector('.user-info-block-header');
	
				//Заполение выпадающего списка	
				selectOptionHTML = ` <option> </option> `;
				selectBlock.insertAdjacentHTML("beforeEnd", selectOptionHTML);

				for (let i = 0; i < xmlDocItems.length; i++) {

  					let xmlUserId = xmlDocItems[i].getElementsByTagName("userId")[0].textContent,
  						testName = xmlDocItems[i].getElementsByTagName("testName")[0].textContent;

  					if(userId == xmlUserId){
  						selectOptionHTML = ` <option>${testName}</option> `;
						selectBlock.insertAdjacentHTML("beforeEnd", selectOptionHTML);
  					}	
  				}

				//Вывод статистики выбранного теста
				selectBlock.addEventListener('change',  function(){

					userInfoBlockHeader.innerHTML = "";
					triesListBlock.innerHTML = "";
				
					for (let i = 0; i < xmlDocItems.length; i++) {

	  					let xmlUserId = xmlDocItems[i].getElementsByTagName("userId")[0].textContent,
  							testName = xmlDocItems[i].getElementsByTagName("testName")[0].textContent,
  							testTotal = xmlDocItems[i].getElementsByTagName("total")[0].textContent;
						
						//Вывод статистики теста, имя которого совпадает с выбранным в выпадающем списке
  						if(userId == xmlUserId && testName == selectBlock.value){

  							let triesInfo = xmlDocItems[i].getElementsByTagName("try"),
  								allTries = triesInfo.length,
								successTries = 0,
								successPercent, 
								averageScore, 
								allTriesScore = 0;

							//Проход по всем попытка пользователя в выбранном тесте
							for (let i = 0; i < allTries; i++) {
								
								let tryInfo = triesInfo[i],
									tryDate = tryInfo.getElementsByTagName("date")[0].textContent,
									tryTime = tryInfo.getElementsByTagName("time")[0].textContent,
									tryAnswers = tryInfo.getElementsByTagName("answers")[0].textContent;

								//Правильные ответы пользователя совпадают с общим количеством вопросов в тесте
								if(tryAnswers == testTotal){
									successTries++
								}

								//Процент правильных ответов
								allTriesScore += (tryAnswers*100)/testTotal;

								selectOptionHTML = `
									<div class="users-try">
										<h2>Дата и время начала теста: <span>${tryDate}</span></h2>
										<h2>Время, затраченое на прохождение: <span>${tryTime}</span> минут</h2>
										<h2>Количество правильных ответов: <span>${tryAnswers}</span> из ${testTotal}</h2>
									</div> 
								`;

								triesListBlock.insertAdjacentHTML("beforeEnd", selectOptionHTML);
							}

							//Процент успешных попыток и средний балл
							successPercent = (successTries*100)/allTries;
							averageScore = allTriesScore/allTries;
										
							selectOptionHTML = ` 
								<h2>Общее количество попыток: <span>${allTries}</span> </h2>
								<h2>Количество успешных попыток: <span>${successTries}</span> или <span>${successPercent}</span>%</h2>
								<div class="percentage-pie">
									<div class="pie animate" style="--percentage:${successPercent};--border:10px;--color:white;">${successPercent}%</div>
								</div>
								<h2>Средний балл: <span>${averageScore}</span>%</h2>
								<h2>Список всех попыток: </h2> 
							`;

							userInfoBlockHeader.insertAdjacentHTML("afterBegin", selectOptionHTML);
						}
					}
				})			
  			}					
		}

		//Отправка запроса
		xhttp.open("GET", fileName, true);
	  	xhttp.send();
	}

}

export let testItemsParse = xmlParse.testItemsParse;
export let userItemsParse = xmlParse.userItemsParse;
export let userTestsParse = xmlParse.userTestsParse;
