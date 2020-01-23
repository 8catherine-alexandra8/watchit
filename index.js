#!/usr/bin/env node

//require in the chokidar package
const chokidar = require('chokidar');

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
