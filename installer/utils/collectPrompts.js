/**
 * Interactive prompts for WPGulpPro installation
 * Collects project metadata and configuration preferences
 */
'use strict';

const prompts = require('prompts');
const path = require('path');

/**
 * Convert string to kebab-case for npm package name
 * @param {string} str - Input string
 * @returns {string} - Kebab-case string
 */
const toKebabCase = (str) => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
};

/**
 * Validate project name (npm package naming rules)
 * @param {string} value - Project name
 * @returns {boolean|string} - true if valid, error message if invalid
 */
const validateProjectName = (value) => {
	if (!value || value.length === 0) {
		return 'Project name is required';
	}
	if (value.length > 214) {
		return 'Project name must be less than 214 characters';
	}
	if (!/^[a-z0-9-]+$/.test(value)) {
		return 'Project name can only contain lowercase letters, numbers, and hyphens';
	}
	if (value.startsWith('-') || value.endsWith('-')) {
		return 'Project name cannot start or end with a hyphen';
	}
	return true;
};

/**
 * Main prompts function
 * @param {string} defaultDirName - Current directory name as default
 * @returns {Promise<Object>} - User responses
 */
const collectPrompts = async (defaultDirName) => {
	// Phase 1: Project Metadata
	const { projectName, description, author } = await prompts([
		{
			type: 'text',
			name: 'projectName',
			message: 'What is your project name?',
			initial: toKebabCase(defaultDirName),
			format: (val) => toKebabCase(val),
			validate: validateProjectName
		},
		{
			type: 'text',
			name: 'description',
			message: 'Project description?',
			initial: 'A WordPress project built with WPGulpPro'
		},
		{
			type: 'text',
			name: 'author',
			message: 'Author name?',
			initial: ''
		}
	]);

	// Phase 2: Configuration
	const config = await prompts([
		{
			type: 'text',
			name: 'jsDir',
			message: 'JavaScript source directory?',
			initial: 'assets/js',
			validate: (val) => val && val.length > 0 ? true : 'JS directory is required'
		},
		{
			type: 'text',
			name: 'cssDir',
			message: 'CSS output directory?',
			initial: 'assets/css',
			validate: (val) => val && val.length > 0 ? true : 'CSS directory is required'
		},
		{
			type: 'toggle',
			name: 'sourceMaps',
			message: 'Enable CSS sourcemaps in production?',
			initial: true,
			active: 'yes',
			inactive: 'no'
		},
		{
			type: 'toggle',
			name: 'rtl',
			message: 'Enable RTL stylesheet generation?',
			initial: false,
			active: 'yes',
			inactive: 'no'
		}
	]);

	// Phase 3: Telemetry (optional)
	const telemetry = await prompts([
		{
			type: 'confirm',
			name: 'telemetry',
			message: 'Share anonymous usage data to improve WPGulpPro?',
			hint: 'y/n',
			initial: false
		}
	], { onCancel: () => {} }); // Skip is OK for telemetry

	return {
		projectName,
		description,
		author,
		jsDir: config.jsDir,
		cssDir: config.cssDir,
		sourceMaps: config.sourceMaps,
		rtl: config.rtl,
		telemetry: telemetry.telemetry || false
	};
};

/**
 * Generate wpgulp.config.js content based on user input
 * @param {Object} config - User configuration
 * @returns {string} - Config file content
 */
const generateConfigContent = (config) => {
	const { jsDir, cssDir, sourceMaps, rtl } = config;

	return `/**
 * WPGulpPro Configuration File
 *
 * 1. Edit the variables as per your project requirements.
 * 2. In paths you can add <<glob or array of globs>>.
 *
 * @package WPGulpPro
 * @author Faisal Ahammad <https://twitter.com/faisalahammadwp/>
 * @credit Originally based on WPGulp by Ahmad Awais
 */

// Project options.

// Local project URL of your already running WordPress site.
// > Could be something like "wpgulppro.local" or "localhost"
// > depending upon your local WordPress setup.
const projectURL = 'wpgulppro.local';

// Theme/Plugin URL. Leave it like it is; since our gulpfile.js lives in the root folder.
const productURL = './';
const browserAutoOpen = false;
const injectChanges = true;

// >>>>> Style options.
// Path to main .scss file.
const styleSRC = './${cssDir}/style.scss';

// Path to place the compiled CSS file. Default set to root folder.
const styleDestination = './';

// Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
const outputStyle = 'compact';
const errLogToConsole = true;
const precision = 10;

// JS Vendor options.

// Path to JS vendor folder.
const jsVendorSRC = './${jsDir}/vendor/*.js';

// Path to place the compiled JS vendors file.
const jsVendorDestination = './${jsDir}/';

// Compiled JS vendors file name. Default set to vendors i.e. vendors.js.
const jsVendorFile = 'vendors';

// JS Custom options.

// Path to JS custom scripts folder.
const jsCustomSRC = './${jsDir}/custom/*.js';

// Path to place the compiled JS custom scripts file.
const jsCustomDestination = './${jsDir}/';

// Compiled JS custom file name. Default set to custom i.e. custom.js.
const jsCustomFile = 'custom';

// Images options.

// Source folder of images which should be optimized and watched.
// > You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
const imgSRC = './assets/img/raw/**/*';

// Destination folder of optimized images.
// > Must be different from the imagesSRC folder.
const imgDST = './assets/img/';

// >>>>> Watch files paths.
// Path to all *.scss files inside css folder and inside them.
const watchStyles = './${cssDir}/**/*.scss';

// Path to all vendor JS files.
const watchJsVendor = './${jsDir}/vendor/*.js';

// Path to all custom JS files.
const watchJsCustom = './${jsDir}/custom/*.js';

// Path to all PHP files.
const watchPhp = './**/*.php';

// >>>>> Zip file config.
// Must have.zip at the end.
const zipName = 'file.zip';

// Must be a folder outside of the zip folder.
const zipDestination = './../'; // Default: Parent folder.
const zipIncludeGlob = ['./**/*']; // Default: Include all files/folders in current directory.

// Default ignored files and folders for the zip file.
const zipIgnoreGlob = [
	'!./{node_modules,node_modules/**/*}',
	'!./.git',
	'!./.svn',
	'!./gulpfile.babel.js',
	'!./wpgulp.config.js',
	'!./.eslintrc.js',
	'!./.eslintignore',
	'!./.editorconfig',
	'!./phpcs.xml.dist',
	'!./vscode',
	'!./package.json',
	'!./package-lock.json',
	'!./${cssDir}/**/*',
	'!./${cssDir}',
	'!./assets/img/raw/**/*',
	'!./assets/img/raw',
	\`!${'{imgSRC}'}\`,
	\`!${'{styleSRC}'}\`,
	\`!${'{jsCustomSRC}'}\`,
	\`!${'{jsVendorSRC}'}\`
];

// >>>>> Translation options.
// Your text domain here.
const textDomain = 'WPGULPPRO';

// Name of the translation file.
const translationFile = 'WPGULPPRO.pot';

// Where to save the translation files.
const translationDestination = './languages';

// Package name.
const packageName = 'WPGULPPRO';

// Where can users report bugs.
const bugReport = 'https://github.com/faisalahammad/WPGulpPro/issues';

// Last translator Email ID.
const lastTranslator = 'Your Name <your_email@email.com>';

// Team's Email ID.
const team = 'Your Name <your_email@email.com>';

// Browsers you care about for auto-prefixing. Browserlist https://github.com/ai/browserslist
// The following list is set as per WordPress requirements. Though; Feel free to change.
const BROWSERS_LIST = ['last 2 version', '> 1%'];

// Export.
module.exports = {
	projectURL,
	productURL,
	browserAutoOpen,
	injectChanges,
	styleSRC,
	styleDestination,
	outputStyle,
	errLogToConsole,
	precision,
	jsVendorSRC,
	jsVendorDestination,
	jsVendorFile,
	jsCustomSRC,
	jsCustomDestination,
	jsCustomFile,
	imgSRC,
	imgDST,
	watchStyles,
	watchJsVendor,
	watchJsCustom,
	watchPhp,
	zipName,
	zipDestination,
	zipIncludeGlob,
	zipIgnoreGlob,
	textDomain,
	translationFile,
	translationDestination,
	packageName,
	bugReport,
	lastTranslator,
	team,
	BROWSERS_LIST
};
`;
};

/**
 * Generate package.json content based on user input
 * @param {Object} config - User configuration
 * @returns {string} - package.json content
 */
const generatePackageJson = (config) => {
	const { projectName, description, author } = config;

	const packageJson = {
		name: projectName,
		description: description || 'A WordPress project built with WPGulpPro',
		version: '1.0.0',
		author: author || 'Your Name',
		license: 'MIT',
		devDependencies: {
			'@babel/core': '^7.26.9',
			'@babel/preset-env': '^7.26.9',
			'@babel/register': '^7.25.9',
			'beepbeep': '^1.3.0',
			'browser-sync': '^2.29.3',
			'eslint': '^8.57.0',
			'eslint-config-wordpress': '^2.0.0',
			'gulp': '^4.0.2',
			'gulp-autoprefixer': '^8.0.0',
			'gulp-babel': '^8.0.0',
			'gulp-cache': '^1.1.3',
			'gulp-concat': '^2.6.1',
			'gulp-filter': '^7.0.0',
			'gulp-imagemin': '^7.1.0',
			'gulp-line-ending-corrector': '^1.0.3',
			'gulp-merge-media-queries': '^0.2.1',
			'gulp-notify': '^4.0.0',
			'gulp-plumber': '^1.2.1',
			'gulp-remember': '^1.0.1',
			'gulp-rename': '^2.0.0',
			'gulp-rtlcss': '^2.0.0',
			'gulp-sass': '^5.1.0',
			'gulp-sort': '^2.0.0',
			'gulp-sourcemaps': '^3.0.0',
			'gulp-uglify': '^3.0.2',
			'gulp-uglifycss': '^1.1.0',
			'gulp-wp-pot': '^2.5.0',
			'gulp-zip': '^5.1.0',
			'sass': '^1.85.0'
		},
		scripts: {
			'start': 'gulp',
			'zip': 'gulp zip',
			'styles': 'gulp styles',
			'images': 'gulp images',
			'js-custom': 'gulp customJS',
			'js-vendors': 'gulp vendorsJS',
			'translate': 'gulp translate',
			'styles-rtl': 'gulp stylesRTL',
			'cache-clear': 'gulp clearCache'
		},
		engines: {
			node: '>=20.0.0'
		}
	};

	return JSON.stringify(packageJson, null, '\t');
};

module.exports = {
	collectPrompts,
	generateConfigContent,
	generatePackageJson,
	toKebabCase,
	validateProjectName
};
