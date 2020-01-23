#!/usr/bin/env node

//require debounce package so that whenever we want to stop a function
//from being called too often, we can pass that function into the
//debounce function
const debounce = require('lodash.debounce');
//require in the chokidar package
const chokidar = require('chokidar');
//declare start function that will eventually be used to start
//up a user's code. It's not doing anything yet except console
//logging a phrase.  The function is wrapped in debounce to keep it
//from being called too many times in quick succession
const start = debounce(() => {
	console.log('STARTING USERS PROGERAM');
	//added 100ms as second argument to debounce to tell debounce
	//that I want 100ms to pass, without the add event being
	//triggered before the start function should actually be
	//invoked
}, 100);
//using the syntax outlined in chokidar documentation,
//tell chokidar to watch the current directory and add
//an event listener for three different events that will
//result in corresponding console logged responses
chokidar
	.watch('.')
	//this function will occur both when a file is added, but
	//also the first time our program is opened each time
	//and chokidar sees all the files that are in it
	.on('add', () => console.log('FILE ADDED'))
	.on('change', () => console.log('FILE CHANGED'))
	//this is called when a file is deleted
	.on('unlink', () => console.log('FILE UNLINKED'));
