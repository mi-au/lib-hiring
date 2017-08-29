'use strict';


module.exports = describe('refund', function() {

	require('./getHiringValue');
	require('./getHiringTaxValue');
	require('./getHiringValueWithTax');

	require('./getHiringGeneralRefundValue');
	require('./getHiringCopyRefundValue');
	require('./getHiringRefundValue');

	require('./countAttachmentsPages');

});