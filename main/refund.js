'use strict';


/**
  * The functions below accept general and/or specific parameters:
  * - hiring:      the hiring itself.
  * - otherFields: the fields from the hiring.
  *
  * One of the two must be provided. The specific parameters will override
  * the hiring properties.
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



function getHiringGeneralRefundValue(hiring, candidateRefund) {
	if(hiring) {
		var candidate = getCorrespondentFromCandidates(hiring.candidates);
		candidateRefund = candidateRefund || (candidate && candidate.refund);
	}

	return candidateRefund.value;
}

function getHiringCopyRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments) {
	if(hiring) {
		jobName = jobName || (hiring.job && hiring.job.name);
		jobRefund = jobRefund || (hiring.job && hiring.job.refund);

		var candidate = getCorrespondentFromCandidates(hiring.candidates);
		candidateRefund = candidateRefund || (candidate && candidate.refund);
		candidateAttachments = candidateAttachments || (candidate && candidate.attachments);
	}

	// copy refund value (in case of copy services).
	var copyRefundValue = 0;
	if(jobName === 'Cópia' && jobRefund.pay_sheets) {
		var pageCount = 0;
		if(candidateRefund.pageCount !== undefined) {
			pageCount = candidateRefund.pageCount;
		} else {
			pageCount = countAttachmentsPages(candidateAttachments);
		}

		copyRefundValue = (candidateRefund.value_per_sheets || 0.2) * pageCount;
	}

	return copyRefundValue;
}

function getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringGeneralRefundValue(hiring, candidateRefund) +
		getHiringCopyRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments);
}



function getHiringTotalValue(hiring, hiringValue, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringValue(hiring, hiringValue) +
		getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments);
}

function getHiringTotalValueWithTax(hiring, hiringValue, hiringTaxValue, jobName, jobRefund, candidateRefund, candidateAttachments) {
	return getHiringValueWithTax(hiring, hiringValue, hiringTaxValue) +
		getHiringRefundValue(hiring, jobName, jobRefund, candidateRefund, candidateAttachments);
}



// Useful functions.

function getCorrespondentFromCandidates(candidates) {
	if(!Array.isArray(candidates)) {
		return candidates;
	}

	return candidates.filter(function(candidate) {
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

	getHiringGeneralRefundValue: getHiringGeneralRefundValue,
	getHiringCopyRefundValue:    getHiringCopyRefundValue,
	getHiringRefundValue:        getHiringRefundValue,

	getHiringTotalValue:        getHiringTotalValue,
	getHiringTotalValueWithTax: getHiringTotalValueWithTax,

	countAttachmentsPages: countAttachmentsPages
};
