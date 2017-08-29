'use strict';


module.exports = describe('getHiringValueWithTax', function() {

	it('should get the hiring value with tax', function(done) {
		var result = hiringLib.refund.getHiringValueWithTax(null, 10, 1);
		expect(result).to.eql(11);

		result = hiringLib.refund.getHiringValueWithTax({ value: 10, tax_value: 2 });
		expect(result).to.eql(12);

		result = hiringLib.refund.getHiringValueWithTax({ value: 10, tax_value: 3 }, 20, 4);
		expect(result).to.eql(24);

		done();
	});

	it('should get the same result as in getHiringValue and getHiringTaxValue', function(done) {
		var hiringValue = 10,
			hiringTaxValue = 1;

		var resultA = hiringLib.refund.getHiringValueWithTax(null, hiringValue, hiringTaxValue),
			resultB = hiringLib.refund.getHiringValue(null, hiringValue) + hiringLib.refund.getHiringTaxValue(null, hiringTaxValue);

		expect(resultA).to.eql(resultB);

		done();
	});

});
