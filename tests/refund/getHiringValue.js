'use strict';


module.exports = describe('getHiringValue', function() {

	it('should get the hiring value', function(done) {
		var result = hiringLib.refund.getHiringValue(null, 10);
		expect(result).to.eql(10);

		result = hiringLib.refund.getHiringValue({ value: 11 });
		expect(result).to.eql(11);

		result = hiringLib.refund.getHiringValue({ value: 10 }, 12);
		expect(result).to.eql(12);

		done();
	});

});
