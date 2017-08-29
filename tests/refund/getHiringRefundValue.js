'use strict';


module.exports = describe('getHiringRefundValue', function() {

	it('should get the hiring total refund value', function(done) {
		var jobName   = 'Cópia',
			jobRefund = {
				pay_sheets: true
			},
			candidateRefund = {
				value:            12,
				pageCount:        2,
				value_per_sheets: 0.4
			};

		var result = hiringLib.refund.getHiringRefundValue(null, jobName, jobRefund, candidateRefund);
		expect(result).to.eql(12.8);

		done();
	});


	it('should get the same result as in getHiringCopyRefundValue and getHiringGeneralRefundValue', function(done) {
		var jobName   = 'Cópia',
			jobRefund = {
				pay_sheets: true
			},
			candidateRefund = {
				value:            12,
				pageCount:        2,
				value_per_sheets: 0.4
			};

		var resultA = hiringLib.refund.getHiringRefundValue(null, jobName, jobRefund, candidateRefund),
			resultB = hiringLib.refund.getHiringGeneralRefundValue(null, candidateRefund) +
				hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund);

		expect(resultA).to.eql(resultB);

		done();
	});

});
