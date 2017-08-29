'use strict';


module.exports = describe('getHiringGeneralRefundValue', function() {

	it('should get the hiring general refund value', function(done) {
		var result = hiringLib.refund.getHiringGeneralRefundValue(null, { value: 10 });
		expect(result).to.eql(10);

		var candidates = [{
			stage:  'waitingPayment',
			refund: {
				value: 11
			}
		}, {
			stage:  'cancelled',
			refund: {
				value: 12
			}
		}];
		result = hiringLib.refund.getHiringGeneralRefundValue({ candidates: candidates });
		expect(result).to.eql(11);

		candidates = [ candidates[1], candidates[0] ];
		result = hiringLib.refund.getHiringGeneralRefundValue({ candidates: candidates });
		expect(result).to.eql(11);

		result = hiringLib.refund.getHiringGeneralRefundValue({ candidates: candidates }, { value: 13 });
		expect(result).to.eql(13);

		done();
	});

});
