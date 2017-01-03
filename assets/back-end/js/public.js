/* Toastr configurations */
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "6000",
    "hideDuration": "2000",
    "timeOut": "6000",
    "extendedTimeOut": "2000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// Helper function
var H = H || {};
H.stringToJSON = function(str) {
    var res = typeof str == 'string' ? JSON.parse(str) : str;
    return res;
};

/**
 * Growl handler
 */
H.growl = function(type, message) {
	switch (type) {
		case 'success' :
			toastr.success(message, 'Sukses' );
			break;
		case 'info' :
			toastr.info(message, 'Info' );
			break;
		case 'warning' :
			toastr.warning(message, 'Peringatan' );
			break;
		case 'error' :
			toastr.error(message, 'Terjadi Kesalahan' );
			break;
		default :
			toastr.error(message, 'Terjadi Kesalahan');
	}
};

// Save Subscribers
function subscribers() {
	$.post(_BASE_URL + '/subscribers/save', {'email':$('#email').val()}, function(response) {
		var res = H.stringToJSON(response);
		H.growl(res.type, res.message);
		$('#email').val('');
	});
}

// Save Pollings
function polling() {
	var answer_id = $('input[name=answer_id]:checked').val();
	if (answer_id) {
		$.post(_BASE_URL + '/pollings/save', {'answer_id':answer_id}, function(response) {
			var res = H.stringToJSON(response);
			H.growl(res.type, res.message);
		});
	} else {
		toastr.info('Anda belum memilih jawaban.', 'Info' );
	}
}

// Save Contact Us
function contact_us() {
	var values = {
		full_name: $('#full_name').val(),
		email: $('#email').val(),
		url: $('#url').val(),
		message: $('#message').val(),
		captcha: $('#captcha').val()
	};
	$.post(_BASE_URL + '/hubungi-kami/save', values, function(response) {
		var res = H.stringToJSON(response);
		H.growl(res.type, res.message);
		if (res.type !== 'validation_errors') {
			$('input[type="text"], textarea').val('');
		}
	});
}

// Post Comment
function post_comment() {
	var values = {
		full_name: $('#full_name').val(),
		email: $('#email').val(),
		url: $('#url').val(),
		message: $('#message').val(),
		comment_post_id: $('#comment_post_id').val(),
		captcha: $('#captcha').val()
	};
	$.post(_BASE_URL + '/home/post_comment', values, function(response) {
		var res = H.stringToJSON(response);
		H.growl(res.type, res.message);
		if (res.type !== 'validation_errors') {
			$('input[type="text"], textarea').val('');
		}
	});
}