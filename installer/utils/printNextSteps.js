const logSymbols = require('log-symbols');
const {green, yellow, cyan, dim} = require('chalk');

module.exports = () => {
	console.log(logSymbols.success, green('ALL DONE! Use your code for good.'));
	console.log(dim('WPGulp files are downloaded to the current directory.'));
	console.log(dim('Inside this directory, you can run the following command'));

	// Scripts.
	console.log();
	console.log(logSymbols.info, green('npm start'));
	console.log(dim('Use during development'));
	console.log(dim('It watches for any changes in your files'));

	console.log();
	console.log(logSymbols.info, 'For more commands, read the docs at:');
	console.log(green('https://github.com/ahmadawais/WPGulp'));

	// Support.
	console.log();
	console.log(logSymbols.warning, yellow('SUPPORT'), 'WPGulp:');
	console.log();
	console.log('Learn to build Automation CLI Command Line Tools:');
	console.log(yellow('https://NodeCLI.com'));
	console.log();
	console.log('Become a VSCode Power User to save hours every week:');
	console.log(yellow('https://VSCode.pro'));
	console.log();
	console.log('Follow the author of WPGulp:');
	console.log(yellow('https://twitter.com/MrAhmadAwais'));

	// Get started.
	console.log();
	console.log(logSymbols.info, green('Get Started'));
	console.log(dim('I suggest that you begin by:'));
	console.log(`1. Editing the ${cyan('wpgulp.config.js')} file`);
	console.log(`2. And then running ${green('npm start')}`);
	console.log();
};
