'use strict';


module.exports = describe('getHiringCopyRefundValue', function() {

	it('should get the hiring copy refund value (copy service)', function(done) {
		var jobName   = 'Cópia',
			jobRefund = {
				pay_sheets: true
			};


		// no attachments, pageCount defined.
		var candidateRefund = {
			pageCount:        2,
			value_per_sheets: 0.3
		};
		var result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund);
		expect(result).to.eql(0.6);


		// no attachments, pageCount undefined.
		candidateRefund = {
			value_per_sheets: 0.3
		};
		result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund);
		expect(result).to.eql(0);


		// with attachments, pageCount defined.
		var candidateAttachments = [{
			pageCount: 3
		}, {
			pageCount: 8
		}];
		candidateRefund = {
			pageCount:        5,
			value_per_sheets: 0.3
		};
		result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund, candidateAttachments);
		expect(result).to.eql(1.5);


		// with attachments, pageCount undefined.
		candidateAttachments = [{
			pageCount: 3
		}, {
			pageCount: 8
		}];
		candidateRefund = {
			value_per_sheets: 0.3
		};
		result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund, candidateAttachments);
		expect(result).to.eql(3.3);


		// with not refundable attachments, pageCount undefined.
		candidateAttachments = [{
			pageCount:  3,
			refundable: false
		}, {
			pageCount:  4,
			refundable: true
		}];
		candidateRefund = {
			value_per_sheets: 0.3
		};
		result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund, candidateAttachments);
		expect(result).to.eql(1.2);


		// properties from the hiring
		result = hiringLib.refund.getHiringCopyRefundValue({
			job: {
				name:   jobName,
				refund: jobRefund
			},
			candidates: [{
				stage:       'waitingPayment',
				refund:      candidateRefund,
				attachments: candidateAttachments
			}]
		});
		expect(result).to.eql(1.2);


		// properties from the hiring (don't pay refund copy sheets)
		result = hiringLib.refund.getHiringCopyRefundValue({
			job: {
				name:   jobName,
				refund: {
					pay_sheets: false
				}
			},
			candidates: [{
				stage:       'waitingPayment',
				refund:      candidateRefund,
				attachments: candidateAttachments
			}]
		});
		expect(result).to.eql(0);

		done();
	});


	it('should get the hiring copy refund value (not copy service)', function(done) {
		var jobName   = 'Protocolo',
			jobRefund = {
				pay_sheets: true
			};


		// no attachments, pageCount defined.
		var candidateRefund = {
			pageCount:        2,
			value_per_sheets: 0.3
		};
		var result = hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund);
		expect(result).to.eql(0);

		done();
	});


	it('should apply tax on refund per sheet', function(done) {
		var jobName   = 'Cópia',
			jobRefund = {
				pay_sheets: true
			},
			candidateRefund = {
				value:            12,
				pageCount:        2,
				value_per_sheets: 0.4,
				suggested_tax: 0.1
			};

		expect(hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund)).to.be.eq(1);

		done();
	});


	it('should get value enabled pageCount', function(done) {
		var jobName   = 'Cópia',
			jobRefund = {
				pay_sheets: true
			},
			candidateRefund = {
				value:            	12,
				enablePageCount:  	1,
				value_per_sheets: 	0.4,
				suggested_tax: 		0.1
			};

		expect(hiringLib.refund.getHiringCopyRefundValue(null, jobName, jobRefund, candidateRefund)).to.be.eq(0.5);

		done();
	});

});
