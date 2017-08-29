'use strict';

var chai = require('chai');

global.hiringLib = require('../index');
global.expect    = chai.expect;
global.should    = chai.should;


module.exports = describe('lib-hiring', function() {

	require('./refund');

});
