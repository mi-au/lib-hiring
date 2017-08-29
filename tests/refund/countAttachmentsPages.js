'use strict';


module.exports = describe('countAttachmentsPages', function() {

	it('should get the hiring value', function(done) {
		var attachments = [{
			pageCount: 2
		}, {
			pageCount: 3
		}];

		var result = hiringLib.refund.countAttachmentsPages(attachments);
		expect(result).to.eql(5);

		attachments[0].refundable = false;
		result = hiringLib.refund.countAttachmentsPages(attachments);
		expect(result).to.eql(3);

		done();
	});

});
