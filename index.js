#!/usr/bin/env node

//require debounce package so that whenever we want to stop a function
//from being called too often, we can pass that function into the
//debounce function
const debounce = require('lodash.debounce');
//require in the chokidar package
const chokidar = require('chokidar');
//require caporal.  Calling it program rather than caporal because
//caporals job is to return an object that represents the program
//itself. So program will make a lot more sense to anyone
//reading the code, deciphering what it's doing.
const program = require('caporal');
//following the syntax outlined in the caporal documentation,
//call prgram and chain on the parts needed
program
	//chain on version with whatever version we decide this is
	.version('0.0.1')
	//chain on argument and specify the argument that I expect
	//this program to be invoked with. It will be optional so using
	//square brackets.  It's optional because we will set it up
	//so that index.js will run by default if no filename is provided
	//the second argument for argument is documentation
	//for the user. Put in a string that you want the user to see
	//if they ever try to print out some help about what this command
	//is doing
	.argument('[filename]', 'Name of a file to execute')
	//there aren't any more arguments or options that we need so we
	//can move on to chaining on the action call to invoke the program
	//the first argument that action will receive is args, which will
	//be an object of all the different arguments that were provided
	.action((args) => {
		console.log(args);
	});
//to get the above program to work, we need to add the following
//line, per caporal documentation
program.parse(process.argv);
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
	//.on('add', () => console.log('FILE ADDED'))
	//replaced callback from above function with the start
	//function passed in as the second argument
	.on('add', start)
	.on('change', () => console.log('FILE CHANGED'))
	//this is called when a file is deleted
	.on('unlink', () => console.log('FILE UNLINKED'));
