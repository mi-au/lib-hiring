'use strict';


/**
  * The functions below accept general and/or specific parameters:
  * - hiring:      the hiring itself.
  * - otherFields: the fields from the hiring.
  *
  * One of the two must be provided. The specific parameters will override
  * the hiring properties.
  *
  * See "lib-hiring refund" on google drive.
  */



// get hiring value
function getHiringValue(hiring, hiringValue) {
	if(hiring) {
		hiringValue = hiringValue || hiring.value || 0;
	}

	return hiringValue;
}

// get hiring tax value
function getHiringTaxValue(hiring, hiringTaxValue) {
	if(hiring) {
		hiringTaxValue = hiringTaxValue || hiring.tax_value || 0;
	}

	return hiringTaxValue;
}

// get hiring value with tax
function getHiringValueWithTax(hiring, hiringValue, hiringTaxValue) {
	return getHiringValue(hiring, hiringValue) + 
		getHiringTaxValue(hiring, hiringTaxValue);
}



// get paid value
function getHiringPaidValue(hiring, payments) {
	if(hiring) {
		var candidate = getCorrespondentFromHiring(hiring);
		payments = payments || (candidate && candidate.payments);
	}

	var paidValue = 0;
	if(Array.isArray(payments)) {
		payments.forEach(function(payment) {
			paidValue += payment.value || 0;
		});
	}

	return paidValue;
}



function getHiringGeneralRefundValue(hiring, candidateRefund) {
	if(hiring) {
		var candidate = getCorrespondentFromHiring(hiring);
		candidateRefund = candidateRefund || (candidate && candidate.refund);
	}

	return (candidateRefund && candidateRefund.value) || 0;
}

function getHiringCopyRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments) {
	if(hiring) {
		jobName = jobName || (hiring.job && hiring.job.name);
		jobRefund = jobRefund || (hiring.job && hiring.job.refund);

		var candidate = getCorrespondentFromHiring(hiring);
		candidateRefund = candidateRefund || (candidate && candidate.refund);
		candidateAttachments = candidateAttachments || (candidate && candidate.attachments);
	}

	// copy refund value (in case of copy services).
	var copyRefundValue = 0;
	if(jobName === 'Cópia' && jobRefund && jobRefund.pay_sheets) {
		var pageCount = 0;
		if(candidateRefund.pageCount !== undefined) {
			pageCount = candidateRefund.pageCount;
		} else if(candidateRefund.enablePageCount !== undefined) {
			pageCount = candidateRefund.enablePageCount;
		} else {
			pageCount = countAttachmentsPages(candidateAttachments);
		}

		copyRefundValue = (candidateRefund.value_per_sheets || 0) * pageCount;
	}

	return copyRefundValue;
}

function getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringGeneralRefundValue(hiring, candidateRefund) +
		getHiringCopyRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments);
}



function getHiringGeneralRefundTaxValue(hiring, candidateRefund) {
	// not implemented yet.
	return 0;
}

function getHiringCopyRefundTaxValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue) {
	if(hiring) {
		jobName = jobName || (hiring.job && hiring.job.name);
		jobRefund = jobRefund || (hiring.job && hiring.job.refund);

		var candidate = getCorrespondentFromHiring(hiring);
		candidateRefund = candidateRefund || (candidate && candidate.refund);
		candidateAttachments = candidateAttachments || (candidate && candidate.attachments);
	}

	// copy refund value (in case of copy services).
	var copyRefundValue = 0;
	if(jobName === 'Cópia' && !getHiringValue(hiring, hiringValue) && jobRefund && jobRefund.pay_sheets) {
		var pageCount = 0;
		if(candidateRefund.pageCount !== undefined) {
			pageCount = candidateRefund.pageCount;
		} else if(candidateRefund.enablePageCount !== undefined) {
			pageCount = candidateRefund.enablePageCount;
		} else {
			pageCount = countAttachmentsPages(candidateAttachments);
		}

		if(candidateRefund.suggested_tax !== undefined && candidateRefund.suggested_tax > 0) {
			var value_per_sheet = candidateRefund.suggested_tax;

			copyRefundValue = (value_per_sheet || 0.0) * pageCount;
		}
	}

	return copyRefundValue;
}

function getHiringRefundTaxValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue) {
	return getHiringGeneralRefundTaxValue(hiring, candidateRefund) +
		getHiringCopyRefundTaxValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue);
}



function getHiringRefundValueWithTax(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue) {
	return getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments) +
		getHiringRefundTaxValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue);
}



function getHiringTotalValue(hiring, hiringValue, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringValue(hiring, hiringValue) +
		getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments);
}

function getHiringTotalValueWithTax(hiring, hiringValue, hiringTaxValue, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringValueWithTax(hiring, hiringValue, hiringTaxValue) +
		getHiringRefundValueWithTax(hiring, jobName, jobRefund, candidateRefund, candidateAttachments, hiringValue);
}



// Useful functions.

function getCorrespondentFromHiring(hiring) {
	if(hiring._correspondent) {
		return hiring._correspondent;
	}
	if(!Array.isArray(hiring.candidates)) {
		return hiring.candidates;
	}

	return hiring.candidates.filter(function(candidate) {
		return [ 'cancelled', 'rejected', 'notSent' ].indexOf(candidate.stage) === -1;
	})[0];
}

function countAttachmentsPages(attachments) {
	return (attachments || []).reduce(function(prev, attachment) {
		return prev + (attachment.pageCount || 0) * (attachment.refundable !== false);
	}, 0);
}


module.exports = {
	getHiringValue:        getHiringValue,
	getHiringTaxValue:     getHiringTaxValue,
	getHiringValueWithTax: getHiringValueWithTax,

	getHiringPaidValue: getHiringPaidValue,

	getHiringGeneralRefundValue: getHiringGeneralRefundValue,
	getHiringCopyRefundValue:    getHiringCopyRefundValue,
	getHiringRefundValue:        getHiringRefundValue,

	getHiringGeneralRefundTaxValue: getHiringGeneralRefundTaxValue,
	getHiringCopyRefundTaxValue:    getHiringCopyRefundTaxValue,
	getHiringRefundTaxValue:        getHiringRefundTaxValue,

	getHiringTotalValue:        getHiringTotalValue,
	getHiringTotalValueWithTax: getHiringTotalValueWithTax,

	countAttachmentsPages: countAttachmentsPages
};
