'use strict';


module.exports = describe('getHiringTaxValue', function() {

	it('should get the hiring tax value', function(done) {
		var result = hiringLib.refund.getHiringTaxValue(null, 10);
		expect(result).to.eql(10);

		result = hiringLib.refund.getHiringTaxValue({ tax_value: 11 });
		expect(result).to.eql(11);

		result = hiringLib.refund.getHiringTaxValue({ tax_value: 10 }, 12);
		expect(result).to.eql(12);

		done();
	});

});
