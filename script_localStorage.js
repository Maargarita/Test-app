'use strict';

let localStorageFuncs = {

	//Запись данных в LocalStorage
	setLocalStorage: function(name, obj){
		localStorage.setItem(name, JSON.stringify(obj));
	},

	//Получение данных из LocalStorage
	getLocalStorage: function(name){
		return JSON.parse(localStorage.getItem(name));
	}
}

export let setLocalStorage = localStorageFuncs.setLocalStorage;
export let getLocalStorage = localStorageFuncs.getLocalStorage;