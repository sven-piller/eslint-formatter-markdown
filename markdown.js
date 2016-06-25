/**
 * @fileoverview Markdown reporter (based on HTML reporter by Julian Laval)
 * @author Sven Piller
 */
'use strict';

var lodash = require('lodash');
var fs = require('fs');
var path = require('path');


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var pageTemplate = lodash.template(fs.readFileSync(path.join(__dirname, 'templates/md-template-page.md'), 'utf-8'));
var resultTemplate = lodash.template(fs.readFileSync(path.join(__dirname, 'templates/md-template-result.md'), 'utf-8'));
var tableHeaderTemplate = lodash.template(fs.readFileSync(path.join(__dirname, 'templates/md-template-message.table-header.md'), 'utf-8'));
var tableRowTemplate = lodash.template(fs.readFileSync(path.join(__dirname, 'templates/md-template-message.table-row.md'), 'utf-8'));

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
  return (count === 1 ? word : word + 's');
}

/**
 * Renders text along the template of x problems (x errors, x warnings)
 * @param {string} totalErrors Total errors
 * @param {string} totalWarnings Total warnings
 * @returns {string} The formatted string, pluralized where necessary
 */
function renderSummary(totalErrors, totalWarnings) {
  var totalProblems = totalErrors + totalWarnings;
  var renderedText = totalProblems + ' ' + pluralize('problem', totalProblems);

  if (totalProblems !== 0) {
    renderedText += ' (' + totalErrors + ' ' + pluralize('error', totalErrors) + ', ' + totalWarnings + ' ' + pluralize('warning', totalWarnings) + ')';
  }
  return renderedText;
}

/**
 * Get the color based on whether there are errors/warnings...
 * @param {string} totalErrors Total errors
 * @param {string} totalWarnings Total warnings
 * @returns {string} The color code (0 = green, 1 = yellow, 2 = red)
 */
function renderColor(totalErrors, totalWarnings) {
  if (totalErrors !== 0) {
    return 2;
  } else if (totalWarnings !== 0) {
    return 1;
  }
  return 0;
}


var SEVERTITY_NAME = ['OK', 'Warning', 'Error'];

/**
 * Get the color based on whether there are errors/warnings...
 * @param {string} totalErrors Total errors
 * @param {string} totalWarnings Total warnings
 * @returns {string} The color code ('' = green, 'Warning' = yellow, 'Error' = red)
 */
function renderSummaryColor(totalErrors, totalWarnings) {
  return SEVERTITY_NAME[renderColor(totalErrors, totalWarnings)];
}

/**
 * Get table header for the message table.
 * @param {Array} messages Messages.
 * @returns {string} markdown (table header)
 */
function renderHeaders(messages) {
  return (messages.length) ? tableHeaderTemplate() : '';
}


/**
 * Get MARKDOWN (table rows) describing the messages.
 * @param {Array} messages Messages.
 * @param {int} parentIndex Index of the parent MARKDOWN row.
 * @returns {string} MARKDOWN (table rows) describing the messages.
 */
function renderMessages(messages, parentIndex) {

  /**
   * Get MARKDOWN (table row) describing a message.
   * @param {Object} message Message.
   * @returns {string} MARKDOWN (table row) describing a message.
   */
  return lodash.map(messages, function (message) {
    var lineNumber,
      columnNumber;

    lineNumber = message.line || 0;
    columnNumber = message.column || 0;

    return tableRowTemplate({
      parentIndex: parentIndex,
      lineNumber: lineNumber,
      columnNumber: columnNumber,
      severityNumber: message.severity,
      severityName: message.severity === 1 ? 'Warning' : 'Error',
      message: message.message,
      ruleId: message.ruleId
    });
  }).join('\n');
}

/**
 * @param {Array} results Test results.
 * @returns {string} MARKDOWN string describing the results.
 */
function renderResults(results) {
  return lodash.map(results, function (result, index) {
    return resultTemplate({
      index: index,
      color: renderColor(result.errorCount, result.warningCount),
      filePath: result.filePath,
      summary: renderSummary(result.errorCount, result.warningCount)

    }) + renderHeaders(result.messages) + renderMessages(result.messages, index);
  }).join('\n');
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {
  var totalErrors,
    totalWarnings;

  totalErrors = 0;
  totalWarnings = 0;

  // Iterate over results to get totals
  results.forEach(function (result) {
    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
  });

  return pageTemplate({
    date: new Date(),
    reportColor: renderSummaryColor(totalErrors, totalWarnings),
    reportSummary: renderSummary(totalErrors, totalWarnings),
    results: renderResults(results)
  });
};
