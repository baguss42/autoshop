var H = H || {};
H.trace_function = true;
window.unescape = window.unescape || window.decodeURI;
// upload count
H.upload_count = 0;
// execute obj.function_name if it's a function
H.ExecIfMethod = function (obj, function_name, params) {
	//H.Trace(arguments);
	if (!obj) return params;
	var func = obj[function_name];
	if (!func) return params;
	if ('function' != typeof func) {
		console.log('error:', obj, function_name, params);
		throw 'cannot execute non-method'
	}
	func = func.bind(obj); // ensure correct context
	return func(params); // execute
};
H.ExecIfFunction = function (func, params) {
	//H.Trace(arguments);
	if (!func || 'function' != typeof func) return params;
	//console.log('warning:','cannon execute non-function', func, params);
	return func(params);
};
// convert json string to object, useful for getting JSON AJAX response
H.StrToObject = function (str) {
	//H.Trace(arguments);
	if ('object' == typeof str) return str;
	if ('string' != typeof str) {
		console.log(str);
		throw('cannot parse non-json-string')
	}
	if (str == '') return str;
	return eval('(' + str + ')'); // JSON.parse
};
// convert Js map's inner text to object (not always json)
// TODO: deprecate this function
H.TextToObject = function (str) {
	//H.Trace(arguments);
	if ('object' == typeof str) return str;
	if ('string' != typeof str) {
		console.log(str);
		throw('cannot parse non-js-text')
	}
	return eval('({' + str + '})')
};
// stack trace
H.Trace = function () {
	if (!H.trace_function) return;
	var stack = _.filter((new Error()).stack.split("\n"), function (txt) {
		return txt.indexOf('jquery') === -1
	});
	stack.shift();
	stack.shift();
	var str = '';
	var len = stack.length - 1;
	for (var z = 0; z < len; ++z) str += ' '
	console.log('FUNCTION TRACE:', len, str, stack[0], arguments[0])
};
// ajax post, fill values._url if the target url differ from current url
H.Post = function (values, success_callback, error_callback) {
	H.Trace(arguments);
	var url = '';
	if (values._url != null) {
		url = values._url;
		delete values._url
	}
	try {
		$.post(url, values, function (res) {
			H.Trace(arguments);
			H.ExecIfFunction(success_callback, res)
		}).fail(function (xhr, textStatus, errorThrown) {
			H.Trace(arguments);
			xhr.textStatus = textStatus;
			xhr.errorThrown = errorThrown;
			H.ExecIfFunction(error_callback, xhr);
			if (!errorThrown) errorThrown = 'unable to load resource, network connection or server is down?';
			H.GrowlError(textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText);
		});
	} catch (e) {
		console.log(e);
		H.GrowlError(e);
	}
};
// growl
toastr.options = {
	"closeButton": true,
	"debug": false,
	"positionClass": "toast-top-right",
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
H.GrowlError = function (msg) {
	toastr.error(msg, "Error")
};
H.GrowlInfo = function (msg) {
	toastr.info(msg, "Info")
};
// open new tab, should start with slash
H.OpenNewTab = function (url) {
	if (url && url[0] == '/') window.open(url, url);
	else H.GrowlError(url);
};
// statusbar
H.StatusBar = function (sel, options) {
	var self = this;
	var elem = null;
	// options
	this.prependMultiline = true;
	this.showCloseButton = false;
	this.afterTimeoutText = '';
	this.cssClass = "statusbar";
	this.highlightClass = "btn btn-primary";
	this.errorClass = "btn btn-warning";
	this.closeButtonClass = "statusbarclose";
	this.additive = false;
	$.extend(this, options);
	if (sel) elem = $(sel);
	// create statusbar object manually
	if (!elem) {
		elem = $("<div id='_statusbar' class='" + self.cssClass + "'>" +
			"<div class='" + self.closeButtonClass + "'>" +
			(self.showCloseButton ? " X </div></div>" : ""))
			.appendTo(document.body)
			.show();
	}
	if (self.showCloseButton)
		$("." + self.cssClass).click(function () {
			$(elem).hide();
		});
	this.show = function (message, timeout, isError) {
		if (self.additive) {
			var html = "<div style='margin-bottom: 2px;' >" + message + "</div>";
			if (self.prependMultiline)
				elem.prepend(html);
			else
				elem.append(html);
		}
		else {
			if (!self.showCloseButton)
				elem.text(message);
			else {
				var t = elem.find("div.statusbarclose");
				elem.text(message).prepend(t);
			}
		}
		elem.show();
		if (timeout) {
			if (isError)
				elem.addClass(self.errorClass);
			else
				elem.addClass(self.highlightClass);
			setTimeout(
				function () {
					elem.removeClass(self.highlightClass);
					self.show(self.afterTimeoutText);
				},
				timeout);
		}
	};
	this.release = function () {
		if (_statusbar) $(_statusbar).remove();
	}
};
var _statusbar = null;
H.SetStatus = function (message, timeout, additive, isError) {
	if (!_statusbar) _statusbar = new H.StatusBar();
	if (!timeout) timeout = 30;
	timeout *= 1000;
	_statusbar.show(message, timeout, additive, isError);
};
BootstrapDialog.error = function (message, callback) {
	new BootstrapDialog({
		title: 'Error',
		type: BootstrapDialog.TYPE_WARNING,
		message: message,
		closable: true,
		draggable: true,
		animate: false,
		buttons: [{
			label: 'OK', action: function (dialog) {
				dialog.close();
			}
		}],
		onhide: function () {
			H.ExecIfFunction(callback);
			//$( 'body' ).css( 'overflow', 'scroll' );
		}
	}).open();
};
// highlight json
H.HighlightJson = function (json, full) {
	if (typeof json != 'string') json = JSON.stringify(json, null, 2);
	json = json.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // replace(/&/g, '&amp;')
	var pattern = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
	var html = json.replace(pattern, function (match) {
		var cls = 'number';
		var suffix = '';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
				match = match.slice(0, -1);
				suffix = ':'
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>' + suffix;
	});
	return PREjson(html, !!full);
};
H.dmp = new diff_match_patch();
// diff and highlight
H.HighlightDiff = function (text1, text2) {
	var d = H.dmp.diff_main('' + text1, '' + text2, null, 0);
	return H.dmp.diff_prettyHtml(d)
};
// horizontal loading
H.HorizontalLoading = function (id) {
	H.Trace(arguments);
	var str = '<img src="/img/horizontal-loading.gif" title="please wait.." />';
	if(!id) return str;
	var el = H.JQuerify(id);
	el.show();
	el.html(str);
	return el;
};
H.ClearContent = function (id) {
	return H.JQuerify(id).text('')
};

H.Base64 = function (str) {
	return window.btoa(window.unescape(window.encodeURIComponent(str)))
};

// generate function that returns label from key
H.DefaultLabeler = function (key, hash, idx, def_label) {
	if (!idx) idx = 0;
	if (!def_label) def_label = '-';
	if ('object' != typeof hash) throw('hash must not be empty, for: ' + key);
	return function (row) {
		var label = hash[row[key]];
		if (typeof label == 'object') label = label[idx];
		if (!label) label = def_label;
		return label;
	}
};
// generate functon that returns link label from key
H.LinkLabeler = function (key) {
	return function (row) {
		if (!row[key]) return '';
		var url = row[key] + '';
		return A(url, url.split('/').join(' / '), url);
	}
};
// clone an object, non-recursive copy
H.Clone = function (obj) {
	//return Object.create(obj);
	//return JSON.parse(JSON.stringify(obj));
	if (_.isArray(obj)) return obj.slice(0);
	var target = {};
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			target[i] = obj[i];
		}
	}
	return target;
};
// deep/recursive cloning
H.DeepClone = function (obj) {
	return $.extend(true, {}, obj);
};
// log in string
H.Log = function () {
	var stack = _.filter((new Error()).stack.split("\n"), function (txt) {
		return txt.indexOf('jquery') === -1
	});
	stack.shift();
	stack.shift();
	var args = Array.prototype.slice.call(arguments);
	for (var z in args) args[z] = JSON.stringify(arguments[z], null, 2);
	console.log(stack.join('\n'), args.join('\n'));
};
// split string to array
H.Split = function (str, substr) {
	return (str || '').split(substr);
};
// trim string, old browser (IE<9, GC<10, FF<3.5, Saf<5, Op<10.5)
H.Trim = function (str) {
	if (str && 'function' == typeof str.trim) return str.trim();
	return ('' + str).replace(/^\s+|\s+$/gm, '');
};
// remove common invalid characters
H.Nullify = function (str) {
	str = H.Trim(str);
	if (str == '0' || str == '1' || str == '-' || str == '--' || str == 'undefined' || str == 'null' || str == ' ' || str == '  ' || str == '' || str == '.' || str == 'o') return null;
	return str;
};
// strip punctuations
H.StripPunct = function (str) {
	return str.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s{2,}/g, ' ');
};
// strip punctuations, remove spaces
H.StripTrim = function (str) {
	return (str + '').replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\s]/g, '').toLowerCase();
};
// binary search insertion (integer only)
H.BinarySearchInsertion = function (arr, val) {
	var min = 0;
	var max = arr.length - 1;
	while (min <= max) {
		var idx = Math.floor((min + max) / 2);
		var cur = arr[idx];
		if (cur < val) {
			min = idx + 1;
		} else if (cur > val) {
			max = idx - 1;
		} else return arr; // nothing to insert
	}
	arr.splice(idx, 0, val);
	return arr;
};
// binary search deletion (integer only)
H.BinarySearchDeletion = function (arr, val) {
	var min = 0;
	var max = arr.length - 1;
	while (min <= max) {
		var idx = (min + max) / 2 | 0;
		var cur = arr[idx];
		if (cur < val) {
			min = idx + 1;
		} else if (cur > val) {
			max = idx - 1;
		} else {
			if (val == cur) arr.splice(idx, 1);
			break;
		}
	}
	return arr;
};
// convert to titlecase
H.TitleCase = function (str, glue) {
	if (!str) return str;
	glue = (glue) ? glue : ['of', 'for', 'and'];
	return str.replace(/(\w)(\w*)/g, function (_, i, r) {
		var j = i.toUpperCase() + (r != null ? r : "");
		return (glue.indexOf(j.toLowerCase()) < 0) ? j : j.toLowerCase();
	});
};
// generate event trigger
H.triggerCompleteChangeAttr = function (handler) {
	if (!handler) return '';
	var prop = '';
	prop += ' onblur="' + handler + '(event,this)" onkeyup="' + handler + '(event,this)" onkeydown="' + handler + '(event,this)" onchange="' + handler + '(event,this)" ';
	return prop;
};
// convert map {title:'bla',placeholder:'123'} to attributes 'title="bla" placeholder="123"'
H.MapToAttr = function (map) {
	if (!map) return '';
	if ('string' == typeof map) return map;
	var str = ' ';
	for (var z in map) {
		var v = map[z];
		if (v === null || v === undefined) continue;
		if (z == 'trigger') {
			if (!map.disabled) str += H.triggerCompleteChangeAttr(map.trigger);
			continue;
		}
		str += z + '=' + '"' + v + '" ';
	}
	return str;
};

// generate bigram
H.NgramArray = function (str, len) {
	str = ('' + str).toLowerCase();
	var big = [];
	for (var z = 0; z <= str.length - len; ++z) big.push(str.substr(z, len));
	return big;
};

H.SimilarTo = function (needle, hay) {
	var len = 3;
	var pair1 = H.NgramArray(needle, len);
	var pair2 = H.NgramArray(hay, len);
	var intersection = 0;
	for (var z = 0; z < pair1.length; ++z) {
		for (var y = 0; y < pair2.length; ++y) {
			if (pair1[z] == pair2[y]) {
				intersection += 1;
				//console.log( pair2[ y ] );
				pair2.splice(y, 1);
				break;
			}
		}
	}
	return intersection / pair1.length;
};
H.loadScript = function (src, callback) {
	H.Trace(arguments);
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	script.addEventListener('load', function (e) {
		H.ExecIfFunction(callback, e);
	}, false);
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
};
// sources is array, the load process is serial
H.loadScripts = function (sources, callback) {
	H.Trace(arguments);
	var len = sources.length;
	var now = 0;
	var loadOne = function () {
		if (now < len) return H.loadScript(sources[now++], loadOne);
		if (now >= len) H.ExecIfFunction(callback);
	};
	loadOne();
};
// get greatest value on array
H.LargestVal = function (arr) {
	var max = null;
	for (var z in arr) if (max == null || arr[z] > max) max = arr[z];
	return max;
};
// max of anything
H.Max = function (a, b) {
	if (a == null || b > a) return b;
	if (b == null || a > b) return a;
	return a;
};
// total SUM
H.SumArray = function (arr) {
	var total = 0;
	for (var z in arr) total += arr[z] | 0;
	return total;
};
// set zero then add
// for example: row.sum = H.Add(row.sum, other.sum);
H.Add = function (val1, val2) {
	val1 = +val1;
	val2 = +val2;
	if (!val1) val1 = 0;
	if (!val2) val2 = 0;
	return val1 + val2;
};
// set zero then increment
// for example: row[key] = H.Inc(row[key]);
H.Inc = function (val1) {
	val1 = +val1;
	if (!val1) return 1;
	return val1 + 1;
};
// create counter
H.CreateIndex = function () {
	var counter = 0;
	var hash = {};
	var fun = function (key) {
		if (hash[key]) return hash[key];
		hash[key] = ++counter;
		return counter;
	};
	fun.debug = function () {
		console.log('CreateIndex', counter, hash);
	};
	return fun;
};
// return first element of array or return string if is a string
H.FirstField = function (obj) {
	if ('object' != typeof obj) return obj;
	for (var z in obj) return obj[z];
};
H.First2Field = function (obj, separator) {
	if (obj === null) return '';
	if ('object' != typeof obj) return obj;
	if (obj[1]) return obj[0] + separator + obj[1];
	return obj[0];
};
// check if string start with digit
H.IsNumeric = function (str) {
	if (!str) return false;
	return parseInt(str) > 0;
};
// find best of an object {A:1,B:4,C:3} // returns B
H.KeyWithLargestVal = function (obj) {
	var best;
	for (var z in obj) {
		best = z;
		break;
	}
	for (z in obj) if (obj[best] < obj[z]) best = z;
	return best;
};
// count substring occurence
H.CountSubstr = function (str, substr, allowOverlapping) {
	str += '';
	substr += '';
	if (substr.length <= 0) return str.length + 1;
	var n = 0, pos = 0;
	var step = (allowOverlapping) ? (1) : (substr.length);
	while (true) {
		pos = str.indexOf(substr, pos);
		if (pos < 0) break;
		++n;
		pos += step;
	}
	return (n);
};
// incremenet object key, set with zero if not exists
H.IncObjKey = function (obj, key, val) {
	if (!obj[key]) obj[key] = 0;
	if (val == null) val = 1;
	obj[key] += +val;
	return obj;
};
// append object key (array), set as empty array if not exists
H.PushObjKey = function (obj, key, val) {
	if (!obj[key]) obj[key] = [];
	obj[key].push(val);
	return obj;
};
// count object key as array, return zero if not array
H.CountObjKey = function (obj, key) {
	return (obj[key] || []).length || 0
};
// set kv (object), set as empty object if not exists
H.HashObjKey = function (obj, key, val) {
	if (!obj[key]) obj[key] = {};
	obj[key][val] = val;
	return obj;
};
// incremenet object key, set with zero if not exists
H.UpcaseArrayObjKey = function (obj, key) {
	for (var z in obj) { // uppercase lecturers
		var lec = obj[z];
		lec[key] = (lec[key] || '').toUpperCase();
	}
};
// load script with progress bar
H.loadScriptProgress = function (src, complete, progress) {
	var req = new XMLHttpRequest();
	req.addEventListener('progress', function (event) {
		if (event.lengthComputable) {
			var p = event.loaded / event.total * 10000 | 0 / 100.0;
			H.ExecIfFunction(progress, [event, p]);
		}
	}, false);
	req.addEventListener('load', function (event) {
		var e = event.target;
		var s = $('<script>');
		s.text(e.responseText);
		$(document.body).append(s);
		H.ExecIfFunction(complete, e);
	}, false);
	req.open('GET', src);
	req.send();
};

// convert id string to element (GetElementById)
H.JQuerify = function (id) {
	if ('string' == typeof id && id[0] != '#') id = '#' + id;
	return $(id);
};
// get selected label
H.SelectedLabel = function (id) {
	return H.JQuerify(id).children("option").is('selected').text();
};
// convert any select to select2, order: -1 descending, +1 ascending
H.Select2ify = function (id, datasource, val, order) {
	order = order || 1;
	var el = H.JQuerify(id);
	if (el.data('select2')) el.select2('destroy');
	if ('string' == typeof datasource) el.html(datasource);
	else if (datasource) el.html(OPTIONs(datasource));
	el.parents('.modal').removeAttr('tabindex');
	var selectList = el.find('option');
	var orderFunc = function sort(a, b) {
		a = a.text.toLowerCase();
		b = b.text.toLowerCase();
		if (!a || a[0] == '(' || !b || b[0] == '(') return -1;
		if (a > b) return order;
		if (a < b) return -order;
		return 0;
	};
	if ('function' == typeof(order)) orderFunc = order;
	selectList.sort(orderFunc);
	el.html(selectList);
	if (val) el.val(val);
	else if (!el.prop('multiple')) { // select first option
		el.find('option:selected').prop('selected', false);
		el.find('option:first').prop('selected', 'selected');
	}
	return el.select2(SELECT2_OPT);
};

// convert any select to select2, doesn't recreate
H.Select2ifyLazy = function (id, datasource, val) {
	var el = H.JQuerify(id);
	el.parents('.modal').removeAttr('tabindex');
	if (el.data('select2')) return el.val(val).trigger('change');
	if ('string' == typeof datasource) el.html(datasource);
	else el.html(OPTIONs(datasource));
	if (val) el.val(val);
	return el.select2(SELECT2_OPT);
};

// convert any array or value to datasource label
H.ValToFields = function (datasource, sel, sep) {
	console.log(sel);
	if ('object' != typeof sel) return datasource[sel];
	var labels = [];
	for (var z in sel) labels.push(H.ValToFields(datasource, sel[z], sep));
	console.log(labels);
	return labels.join(sep ? sep : ' + ');
};

// return empty string
H.Empty = function () {
	return '';
};

// arr to object, convert values as keys boolean
H.ArrToMap = function (arr) {
	var res = {};
	if ('object' != typeof arr) {
		res[arr] = true;
		return res;
	}
	if (!arr || !arr.length) return {};
	for (var z = 0; z < arr.length; ++z) res[arr[z]] = true;
	return res;
};
// arr to object, convert values the same as key
H.ArrToKV = function (arr) {
	var res = {};
	if ('object' != typeof arr) {
		res[arr] = arr;
		return res;
	}
	if (!arr || !arr.length) return {};
	for (var z = 0; z < arr.length; ++z) res[arr[z]] = arr[z];
	return res;
};
// convert anything to array, except when it's already an array
H.AnyToArr = function (arr) {
	if ('object' == typeof arr) return arr;
	var res = [];
	if (arr) res.push(arr);
	return res;
};
// object is equal
H.Equal = function (obj1, obj2) {
	console.log(JSON.stringify(obj1));
	console.log(JSON.stringify(obj2));
	return JSON.stringify(obj1) == JSON.stringify(obj2);
};
// key is enter
H.IsEnterKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 13 || e.which == 13 || e.keyIdentifier == 'Enter';
};

// key is escape
H.isEscKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 27 || e.which == 27 || e.keyIdentifier == 'Escape';
};

// key is down
H.isDownKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 40 || e.which == 40 || e.keyIdentifier == 'Down';
};

// key is up
H.isUpKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 38 || e.which == 38 || e.keyIdentifier == 'Up';
};

// key is left
H.isLeftKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 37 || e.which == 37 || e.keyIdentifier == 'Left';
};

// key is right
H.isRightKey = function (e) {
	if (!e) throw('parameter should be an event: ' + e);
	return e.keyCode == 39 || e.which == 39 || e.keyIdentifier == 'Right';
};

// Uppercase the first character of each word in a string
H.Ucwords = function ucwords(str) {
	var string = str.toLowerCase();
	return (string + '')
		.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
			return $1.toUpperCase();
		});
};

// Checks if a value exists in an object/array
H.Contains = function ( needle, haystack) {
	for (var key in haystack) if (haystack[key] == needle) return true;
	return false;
};
// find first index/key of needle in haystack
H.IndexOf = function(needle, haystack) {
	for (var key in haystack) if (haystack[key] == needle) return key;
	return null;
};

// return the string if it's not a number
H.NotNumStr = function (str) {
	if (str | 0) return '';
	return str;
};

// convert to integer
H.ToI = function (any) {
	var res = parseInt(any);
	if (isNaN(res)) return 0;
	return res;
};

// shift start date to [w]th-week + [wd]th day
H.WeekOfSemester = function (start_date, week, weekday) {
	var start_day = moment(start_date);
	if (start_day.weekday() > weekday) ++week; // if the semester start not in monday
	return start_day.startOf('week').add(weekday + (week * 7), 'days').format(Const_YMD);
};

// get string before certain substring
H.StringBefore = function (str, sep) {
	var idx = str.indexOf(sep);
	if (idx < 0) return str;
	return str.substring(0, idx);
};
// download text
H.DownloadText = function (filename, str) {
	if (window.navigator.msSaveOrOpenBlob) {
		var fileData = [str];
		var blobObject = new Blob(fileData);
		$(anchorSelector).click(function () {
			window.navigator.msSaveOrOpenBlob(blobObject, filename);
		});
	} else {
		var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
		$(anchorSelector).attr("download", filename);
		$(anchorSelector).attr("href", url);
	}
};
// first element of, equal to _.find(arr, function(obj){ return obj.id == id } )
H.FirstElemOf = function(arr, prop, needle) {
	for(var z in arr) {
		var hash = arr[z];
		if(hash[prop] == needle) return arr[z];
	}
	return {};
};