/**
 * @codename    Javascript Form Builder
 * @author      Anton Sofyan | https://facebook.com/antonsofyan
 * @copyright   (c) 2015-2016
 */

if (typeof jQuery === 'undefined') {
	throw new Error('GridBuilder requires jQuery')
}

"use strict";

/*
 * FORM BUILDER CLASS DEFINITION 
 */
function FormBuilder(name, options) {
	var self = this;
	window[ name ] = self;
	if (!options.controller) throw new Error('FormBuilder requires "controller" object key on the 2nd parameter');
	if (!options.fields) throw new Error('FormBuilder requires "fields" object on the 2nd parameter');
	self.options = {
		id:0,
		name: name,
		controller: null,
		save_action: H.base_url + options.controller + '/save',
		form_action: H.base_url + options.controller + '/find_id',
		upload_action: 'upload',
		fields: []
	};
	$.extend( self.options, options );
}

(function() {

	/**
	 * On Edit
	 */
	this.OnEdit = function(id) {
		var self = this, 
			opt = self.options;
		opt.id = id || 0;
		self.RenderForm();
		$('.modal-form').modal({
			show:true,
			backdrop:'static'
		});
		$('#form-loading').show();
		$.post(opt.form_action, {id:opt.id}, function(response) {
			var res = H.stringToJSON(response);
			for( var z in opt.fields) {
				var field = opt.fields[ z ];
				// Clear
				$('#' + field.name).val('');
				if (field.type !== 'password') {
					// Set Value
					if (field.type === 'number' || field.type === 'float') {
						$('#' + field.name).val(res[field.name] || 0);    
					} else if (field.type === 'select') {
						$('#' + field.name).val(res[field.name]).trigger( 'change' );
					} else {
						$('#' + field.name).val(res[field.name]);
					}
				}
			}
			$('#form-loading').hide();
		}).fail( function( xhr, textStatus, errorThrown ) {
			xhr.textStatus = textStatus;
			xhr.errorThrown = errorThrown;
			if ( !errorThrown ) errorThrown = 'Unable to load resource, network connection or server is down?';
			H.growl('error', textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText );
		});        
		$('.modal-dialog').addClass('modal-lg');
		$('.reset').hide();
		$('.submit').show().html('<i class="fa fa-save"></i> UPDATE');
		$('.submit').attr('onclick', opt.name + '.Submit(event)');
		$('.form-horizontal').removeAttr('id enctype');
	};

	/**
	 * Submit function
	 */
	this.Submit = function(event) {
		event.preventDefault();
		$('#form-loading').show();
		var self = this,
			opt = self.options,
			serialize = $(':input').serializeArray(),
			post_data = {};

		// assign post data
		post_data['id'] = opt.id;
		for (var z in serialize) {
			post_data[serialize[ z ].name] = serialize[ z ].value;
		}

		// find input type checkbox
		var checkbox = $('.form-fields').find('input[type="checkbox"]');
		if (checkbox.length) {
			checkbox.each(function(){
				post_data[ this.name ] = this.checked.toString(); // string value is "true" or "false"
			});
		}

		// Post Data
		$.post(opt.save_action, post_data, function( response ) {
			var res = H.stringToJSON(response);
			H.growl(res.type, H.message(res.message));
			if (res.type == 'success') {
				var _grid = opt.name.split("_FORM");
				window[ _grid[0] ].Reload();
				$('.modal-form').modal('hide');
			}
			$('#form-loading').hide();
		}).fail( function( xhr, textStatus, errorThrown ) {
			xhr.textStatus = textStatus;
			xhr.errorThrown = errorThrown;
			if( !errorThrown ) errorThrown = 'Unable to load resource, network connection or server is down?';
			H.growl('error', textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText );
		});
	};

	/**
	 * On Show / Add New
	 */
	this.OnShow = function() {
		$('#form-loading').show();
		var self = this,
			opt = self.options;
		opt.id = 0; // Reset id to 0
		
		// Generate Form
		self.RenderForm();

		// Show Modal
		$('.modal-form').modal({
			show:true,
			backdrop:'static'
		});

		// Set Devault value
		for ( var z in opt.fields) {
			var field = opt.fields[ z ];
			if (field.type === 'number' || field.type === 'float') {
				$('#' + field.name).val(0);    
			}
		}
		$('.modal-dialog').addClass('modal-lg');
		$('.reset').show();
		$('.submit').show().html('<i class="fa fa-save"></i> SAVE');
		$('.submit').attr('onclick', opt.name + '.Submit(event)');
		$('.form-horizontal').removeAttr('id enctype');
		$('#form-loading').hide();
	};

	/**
	 * On Upload
	 */
	this.OnUpload = function(id) {
		var self = this,
			opt = self.options;
		opt.id = id || 0; 
		if (id > 0) {
			opt.is_upload = true;
			self.RenderFormUpload();
			$('.reset').hide();
			$('.modal-dialog').removeClass('modal-lg');
			$('.form-horizontal').removeAttr('id').attr('id','upload');
			$('.reset').hide();
			$('.submit').show().html('<i class="fa fa-upload"></i> UPLOAD');
			$('.submit').attr('onclick', opt.name + '.Upload(event)');
			$('.form-horizontal').attr('enctype','multipart/form-data');
			$('.modal-form').modal({
				show:true,
				backdrop:'static'
			});
		}
	};

	/**
	 * handler Upload File 
	 */
	this.Upload = function(event) {
		event.preventDefault();
		var self = this,
			opt = self.options,
			form_data = new FormData( $("#upload")[0] );
		form_data.append('id', opt.id);
		$.ajax({
			url: H.base_url + '/' + opt.controller + '/' + opt.upload_action,
			type: 'POST',
			data: form_data,
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			success : function( response ) {
				var res = H.stringToJSON(response);
				res.action == 'error' ? 
					H.growl(res.type, res.message) : 
					H.growl(res.type, H.message(res.message));
				var _grid = opt.name.split("_FORM");
				window[ _grid[0] ].Reload();
				$('.modal-form').modal('hide');
			}
		});
	}

	/**
	 * Render Form Function
	 */
	this.RenderForm = function() {
		var self = this;
		var opt = self.options;
		var field = '';
		for (var z in opt.fields) {
			field += self.RenderField(opt.fields[ z ]);
		}

		// Remove and rerendered form
		$('.form-fields').empty().html(field);

		// datepicker
		$('.date').datepicker({
			format: 'yyyy-mm-dd',
			todayBtn: 'linked',
			minDate: '0001-01-01',
			setDate: new Date(),
			todayHighlight: true,
			autoclose: true
		});

		// Date Time
		$(".datetime").inputmask({
			mask: "y-m-d h:s:s",
			separator: "-",
			alias: "datetime",
			hourFormat: "24",
			placeholder:"YYYY-MM-DD HH:MM:SS"
		});

		// Select2
		$('.select2').select2();

		// multidate
		$('.multidate').datepicker({
			format: 'yyyy-mm-dd',
			minDate: '0001-01-01',
			multidate: true,
			multidateSeparator: ', ',
			setDate: new Date(),
			todayHighlight: true
		});

		// Input type time
		$(".time").inputmask({
			mask:'h:s:s', 
			placeholder: "HH:MM:SS"
		});

		// Input type timepicker
		$('.timepicker').clockpicker({
			placement: 'bottom',
			align: 'left',
			autoclose: true,
			default: 'now'
		});

		// Input type number
		$('.number').number( true, 0 );

		// Input type float
		$( '.float' ).number( true, 2 );

		// Input type color picker
		$('.colorpicker').colorpicker();
	};

	/**
	 * Render Form Upload Function
	 */
	this.RenderFormUpload = function() {
		var self = this,
			opt = self.options;
			var field = self.RenderField({'name':'file','type':'file', 'label':''});
		$('.form-fields').empty().html(field);
	};

	/**
	 * RenderField Function
	 */
	this.RenderField = function(obj) {
		var self = this,
			opt = self.options;
		var field = '<div class="form-group">';
			field +='<label class="col-sm-3 control-label" for="' + obj.name + '">' + obj.label + '</label>';
			field += '<div class="col-sm-9">';
		switch(obj.type) {
			case 'number':
				field +='<input type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm number" style="text-align:right;" id="' + obj.name + '" name="' + obj.name + '">';
			break;
			case 'float':
				field +='<input type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm float" style="text-align:right;" id="' + obj.name + '" name="' + obj.name + '">';
			break;
			case 'email':
				field += '<div class="input-group">';
				field += '<input type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-envelope-o"></i></div>';
				field += '</div>';
			break;
			case 'textarea':
				field += '<textarea rows="5" class="form-control" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '"></textarea>';
			break;
			case 'select':
				field += '<select style="width:100%" class="form-control select2" '+ (obj.required ? 'required':'') +' id="' + obj.name + '" name="' + obj.name + '">';
				if (Object.keys(obj.datasource).length) {
					for (var z in obj.datasource) {
						field += '<option value="' + z + '">' + obj.datasource[ z ] + '</option>';
					}
				}
				field += '</select>';
			break;           
			case 'password':
				field += '<div class="input-group">';
				field += '<input autocomplete="off" type="password" '+ (obj.required ? 'required':'') +' class="form-control input-sm" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-key"></i></div>';
				field += '</div>';
			break;
			case 'file':
				field += '<input id="file" type="file" name="file" style="margin-top:8px;">';
			break;
			case 'image':
				field +='<input onchange="H.preview(this)" type="file" '+ (obj.required ? 'required':'') +' id="' + obj.name + '" name="' + obj.name + '" style="margin-top:8px;">';
				field +='<img id="preview" style="margin:10px 0; max-width:450px;">';
			break;
			case 'checkbox':
				field +='<input type="checkbox" '+ (obj.required ? 'required':'') +' id="' + obj.name + '" name="' + obj.name + '" style="margin-top:8px;width:20px;height:20px;">';
			break;
			case 'date':
				field += '<div class="input-group date">';
				field += '<input readonly="readonly" type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-calendar"></i></div>';
				field += '</div>';
			break;
			case 'colorpicker':
				field += '<div class="input-group colorpicker">';
				field += '<input readonly="readonly" type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm colorpicker" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-paint-brush"></i></div>';
				field += '</div>';
			break;
			case 'multidate':
				field += '<div class="input-group">';
				field += '<input readonly="readonly" type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm multidate" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-calendar"></i></div>';
				field += '</div>';
			break;
			case 'time': // time
				field += '<div class="input-group">';
				field += '<input type="text" class="form-control time input-sm" data-inputmask="alias:HH:MM:SS" data-mask id="' + obj.name + '" name="'+obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-clock-o"></i></div>';
				field += '</div>';
			break;
			case 'timepicker': // clock picker
				field += '<div class="input-group timepicker">';
				field += '<input readonly="readonly" type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-clock-o"></i></div>';
				field += '</div>';
			break;
			case 'datetime':
				field += '<div class="input-group">';
				field += '<input type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm datetime" id="' + obj.name + '" name="' + obj.name + '" placeholder="' + (obj.placeholder ? obj.placeholder : '') + '">';
				field += '<div class="input-group-addon input-sm"><i class="fa fa-calendar"></i></div>';
				field += '</div>';
			break;
			default :
				field +='<input type="text" '+ (obj.required ? 'required':'') +' class="form-control input-sm" id="' + obj.name + '" name="' + obj.name + '" placeholder="'+ (obj.placeholder ? obj.placeholder : '') +'">';
			break;
		}
		field +='</div></div>';
	  return field;
	};

}).call(FormBuilder.prototype);