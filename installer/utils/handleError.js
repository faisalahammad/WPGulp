/**
 * Error handler
 */
'use strict';

const logSymbols = require('log-symbols');
const {red} = require('chalk');

module.exports = err => {
	if (err) {
		console.log(logSymbols.error, red('ERROR:'), err.message || err);
		process.exit(1);
	}
};
