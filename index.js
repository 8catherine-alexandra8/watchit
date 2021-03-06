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
//add in require for fs so that we can access files in hard drive
const fs = require('fs');
//require in the spawn function of the child processes module
//so that this program can run a program inside of it.
const { spawn } = require('child_process');
//require in chalk to style message to user differently than console logs
const chalk = require('chalk');
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
	//since filename is the only argument, we can pass in filename
	//destructured from the args object, rather than passing in the
	//whole args object.  this function is wrapping an promised function
	//so need to wrap it in async.
	.action(async ({ filename }) => {
		//check to see if user entered a filename so that we can
		//default to index.js if no filename was entered by user.
		//Also need to ensure that entered filename actually
		//exists within the directory so that we can show an error
		//if the file doesn't exist in the directory.
		const name = filename || 'index.js';
		//use the promise based version of the built in access method
		//to check program for the filename specified by the user.
		//if the name file doesn't exist, then the function below will
		//error, so wrapping it in try/catch to deal with that
		try {
			await fs.promises.access(name);
		} catch (err) {
			//if there's an error, I already know that it's because the
			//file doesn't exist or user doesn't have access to it, so
			//the only way I need to deal with the error is to explain
			//the issue to the user
			throw new Error(`Could not find the file ${name}`);
		}
		//declare a process variable so that it can be used in the
		//start function to kill the previously running instance of the
		//program before restarting it
		let proc;
		//declare start function that will eventually be used to start
		//up a user's code. It will call the spawn function so that
		//this program can run another program.
		// The function is wrapped in debounce to keep it
		//from being called too many times in quick succession
		const start = debounce(() => {
			//before running spawn, check to see if proc is already defined
			if (proc) {
				//if it is defined, kill the currently running process
				//before restarting it
				proc.kill();
			}
			//let user know that previous process ended and new process
			//is starting now
			//wrapped this console log in chalk styling to distinguish it
			//from the program's console log responses
			console.log(chalk.yellow('>>>>>Starting process...'));
			//call spawn and pass in the command that I want to run
			//which is node and the name of the file that I want
			//to run which is this program or the name of the
			//program that the user entered.  added stdio option with inherit
			//so that any console logs or within this child program
			//will pass to the watchit console to be visible.  Assign the
			//child process object to proc variable
			proc = spawn('node', [ name ], { stdio: 'inherit' });
			//added 100ms as second argument to debounce to tell debounce
			//that I want 100ms to pass, without the add event being
			//triggered before the start function should actually be
			//invoked
		}, 100);
		//using the syntax outlined in chokidar documentation,
		//tell chokidar to watch the current directory and add
		//an event listener for three different events that will
		//result in stopping the existing program and restarting it
		chokidar
			.watch('.')
			//this function will occur both when a file is added, but
			//also the first time our program is opened each time
			//and chokidar sees all the files that are in it
			//.on('add', () => console.log('FILE ADDED'))
			//replaced callback from above function with the start
			//function passed in as the second argument
			.on('add', start)
			.on('change', start)
			//this is called when a file is deleted
			.on('unlink', start);
	});
//to get the above program to work, we need to add the following
//line, per caporal documentation
program.parse(process.argv);
