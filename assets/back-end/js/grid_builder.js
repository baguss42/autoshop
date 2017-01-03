/**
 * @codename    Javascript Grid Builder
 * @author      Anton Sofyan | https://facebook.com/antonsofyan
 * @copyright   (c) 2015-2016
 */

if (typeof jQuery === 'undefined') {
	throw new Error('GridBuilder requires jQuery')
}

"use strict";

/*
 * GRID BUILDER CLASS DEFINITION 
 */
function GridBuilder(name, options) {
	var self = this;
	window[ name ] = self;
	if (!options.controller) throw new Error('GridBuilder requires "controller" object key on the 2nd parameter');
	if (!options.fields) throw new Error('GridBuilder requires "fields" object on the 2nd parameter');
	self.options = {
		name: name,
		controller: null,
		pagination_action: 'pagination',
		per_page: 10,
		page_number: 0,
		total_page: 0,
		total_rows: 0,
		keyword:'',
		fields: [],
		can_reload: true,
		can_add: true,
		can_delete: true,
		can_restore: true,
		can_search: true,
		to_excel: false,
		to_pdf: false,
		form_url: false,
		reduce_column: 3,
		extra_buttons: ''
	};
	$.extend( self.options, options );
	self.Init();
	self.RenderTable();
};

(function() {

	/*
	 * initialize
	 */
	this.Init = function() {
		var self = this,
			opt = this.options;

		// Render header columns
		self.RenderHeader();

		// render buttons
		self.GridActions();

		// check all rows
		$('.check-all').click(function() {
			$('input:checkbox').not(this).prop('checked', this.checked);
		});

		// add atr on form search
		$('.keyword').attr('onkeypress', opt.name + '.Search(event)');

		// show grid-loading
		$('.overlay').show();

		// reduce column width (NO, Checkbox, and edit action)
		for (var i = 1; i <= opt.reduce_column; i++) {
			$('tr th:nth-child(' + i + ')').attr({
				'width':'30px'
			});
		}

		// autofocus keyword
		$('.keyword').focus();
	};
	 
	/*
	 * reload grid
	 */
	this.Reload = function() {
		$('.overlay').show();
		this.RenderTable();
	};

	/*
	 * Render grid action buttons
	 */
	this.GridActions = function() {
		var opt = this.options,
		button = '';
		if (opt.extra_buttons)
			button += opt.extra_buttons;
		if (opt.can_add)
			button += '<a href="javascript:void(0)" title="Add New" onclick="' + opt.name + '_FORM.OnShow()" class="btn btn-primary btn-sm add" data-toggle="tooltip" data-placement="top" title="Add"><i class="fa fa-plus"></i></a>';
		if (opt.form_url)
			button += '<a href="'+ opt.form_url +'" title="Add New" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Add"><i class="fa fa-plus"></i></a>';
		if (opt.can_delete)
			button += '<button title="Delete" onclick="' + opt.name + '.Delete()" class="btn btn-primary btn-sm delete" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>';
		if (opt.can_restore)
			button += '<button title="Restore" onclick="' + opt.name + '.Restore()" class="btn btn-primary btn-sm restore" data-toggle="tooltip" data-placement="top" title="Restore"><i class="fa fa-mail-reply-all"></i></button>';
		if (opt.to_excel)
			button += '<a title="Save as Excel" href="'+ H.base_url + opt.controller + '/excel_report' +'" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Save as Excel"><i class="fa fa-file-excel-o"></i></a>';
		if (!opt.can_search)
			$('input.keyword').hide();
		if (opt.to_pdf)
			button += '<a title="Save as PDF" href="'+ H.base_url + opt.controller + '/pdf_report' +'" class="btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top" title="Save as PDF"><i class="fa fa-file-pdf-o"></i></a>';
		if (opt.can_reload)
			button += '<button title="Reload" onclick="' + opt.name + '.OnReload()" class="btn btn-primary btn-sm reload" data-toggle="tooltip" data-placement="top" title="Reload"><i class="fa fa-refresh"></i></button>';
		$('.grid-button').html(button);
	};

	/*
	 * Set pagination button 
	 */
	this.PaginationButton = function(total_page) {
		var opt = this.options;
		$('.next').attr('onclick', opt.name + '.Next()');
		$('.previous').attr('onclick', opt.name + '.Prev()');
		$('.first').attr('onclick', opt.name + '.First()');
		$('.last').attr('onclick', opt.name + '.Last()');
		$('.per-page').attr('onchange', opt.name + '.SetPerPage()');
		$(".previous, .first").prop('disabled', opt.page_number == 0);
		$(".next, .last").prop('disabled', total_page == 0 || (opt.page_number == (total_page - 1)));
	};

	/*
	 * render Pagination Info
	 */
	this.PaginationInfo = function() {
		var opt = this.options;
		var page_info = 'Page ' + ((opt.total_rows == 0) ? 0 : (opt.page_number + 1));
		page_info += ' of ' + opt.total_page.to_money();
		page_info += ' &sdot; Total : ' + opt.total_rows.to_money() + ' Rows.'; 
		$('.page-info').html(page_info);
	};

	/*
	* render Search Info
	*/
	this.SearchInfo = function(total_rows) {
		var opt = this.options;
		var suffik = total_rows > 1 ? 's' : '';
		var search_info = ' Your search for <strong>"' + opt.keyword + '"</strong>';
		search_info += ' returned ' + total_rows.to_money() + ' result' + suffik;
		search_info += '. <b style="color:red;">Press escape to clear</b>';
		$('.search-info').html(search_info);
	};

	/*
	* render Table
	*/
	this.RenderTable = function() {
		var self = this;
		var opt = self.options;
		try {
			var send_data = {
				"page_number":opt.page_number, 
				"per_page":opt.per_page, 
				"keyword":opt.keyword
			};
			$.post( _BASE_URL + opt.controller + '/' + opt.pagination_action, send_data, function( response ) {
				var res = H.stringToJSON(response);
				opt.total_page = res.total_page;
				opt.total_rows = res.total_rows;
				self.PaginationInfo(opt.total_page, opt.total_rows);
				if ($('.keyword').val() !== '') self.SearchInfo(opt.total_rows);
				self.PaginationButton(opt.total_page);
				if (opt.total_rows > 0) {
					if (opt.total_rows <= opt.per_page) $(".next").prop('disabled', true); 
					var tbody = '';
					$.each(res.rows, function(key, value) {
						var no = (opt.page_number * opt.per_page) + (key + 1);
						var str = '';
						str += TD(no+'.');
						for (var z in opt.fields) {
							var transformCell = self.TransformCell(value, opt.fields[ z ]);
							str += TD(transformCell);
						}   
						tbody += TRid(value.id, value.is_deleted, str);
					});
					$('.tbody').html(tbody);
				} else {
					$('.tbody').empty();
					H.growl('info', H.message('empty'));
				}
				// hide loading
				$('.overlay').hide();
			}).fail( function( xhr, textStatus, errorThrown ) {
				xhr.textStatus = textStatus;
				xhr.errorThrown = errorThrown;
				if( !errorThrown ) errorThrown = 'Unable to load resource, network connection or server is down?';
					H.growl('error', textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText );
			} );
		} catch( e ) {
			H.growl('error', e );
		}
	};

	this.TransformCell = function(value, field) {
		var renderer = field.renderer,
		str = '';
		switch( typeof renderer ) {
			case 'string': // access directly
				str = value[ renderer ];
				break;
			case 'function':
				str = renderer( value ) || ' ';
				break;
			default: // not a string or function, print the renderer
				var err = 'invalid renderer, renderer must be a string or function';
				console.error( err, renderer );
		}
		return str;
	}

	/*
	* delete function
	*/
	this.Delete = function() {
		var self = this,
			opt = this.options,
			checked = 0,
			el = $("input.checkbox:checked"); 
		el.each(function() {
			checked++;
		});

		if (checked > 0) {
			eModal.confirm('Are you sure you want to delete ?', 'Confirmation').then(function() {
				var url = H.base_url + opt.controller + '/delete',
					id = [],
					i = 0,
					is_deleted = 0;
				el.each(function() {
					var value = $(this).val();
					if ( ! $('#tr_' + value).hasClass('delete')) {
						id[i] = value;
						i++;
						is_deleted++;
					}
				});

				if (is_deleted > 0) {
					var send_data = {};
					send_data["id"] = id.join(',');
					$.post(url, send_data, function(response) {
						var res = H.stringToJSON(response);
						H.growl(res.type, H.message(res.message));
						$(":checkbox").removeAttr('checked');
						if (res.action == 'delete_permanently') {
							self.Reload();
						} else {
							$.each(res.id, function(key, value) {
								if ( ! $('#tr_'+value).hasClass('delete')) {
									$('#tr_' + value).addClass('delete');    
								}
							});  
						}
					}).fail( function( xhr, textStatus, errorThrown ) {
						xhr.textStatus = textStatus;
						xhr.errorThrown = errorThrown;
						if( !errorThrown ) errorThrown = 'Unable to load resource, network connection or server is down?';
						H.growl('error', textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText );
					});
				} else {
					H.growl('warning', H.message('not_deleted'));  
				}
			});
		} else {
			H.growl('info', H.message('not_selected'));
		}
	};

	/*
	* Restore function
	*/
	this.Restore = function() {
		var opt = this.options,
			checked = 0,
			el = $("input.checkbox:checked"); 
		el.each(function() {
			checked++;
		});

		if (checked > 0) {
			eModal.confirm('Are you sure you want to restore ?', 'Confirmation').then(function() {
				var url = H.base_url + opt.controller + '/restore',
					id = [],
					i = 0,
					is_restored = 0;
				el.each(function() {
					var value = $(this).val();
					if ($('#tr_' + value).hasClass('delete')) {
						id[i] = value;
						i++;
						is_restored++;
					}
				});

				if (is_restored > 0) {
					var send_data = {};
					send_data["id"] = id.join(',');
					$.post(url, send_data, function(response) {
						var res = H.stringToJSON(response);
						H.growl(res.type, H.message(res.message));
						$(":checkbox").removeAttr('checked');
						$.each(res.id, function(key, value) {
							if ($('#tr_'+value).hasClass('delete')) {
								$('#tr_' + value).removeClass('delete');    
							}
						});
					}).fail( function( xhr, textStatus, errorThrown ) {
						xhr.textStatus = textStatus;
						xhr.errorThrown = errorThrown;
						if( !errorThrown ) errorThrown = 'Unable to load resource, network connection or server is down?';
							H.growl('error', textStatus + ' ' + errorThrown + '<br/>' + xhr.responseText );
						});
				} else {
					H.growl('warning', H.message('not_restored'));  
				}
			});
		} else {
			H.growl('info', H.message('not_selected'));
		}
	};

	/*
	 * Render grid header 
	 */
	this.RenderHeader = function() {
		var fields = this.options.fields;
		var thead = TH('NO');        
		if (fields.length) {
			for (var z in fields) {
				var header = fields[ z ].header;
				thead += TH(header);
			}
		}
		$('.thead').html(TR(thead));
	};

	/*
	 * button next
	 */
	this.Next = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		self.options.page_number++;
		self.Reload();
	};

	/*
	 * button previous
	 */
	this.Prev = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		self.options.page_number--;
		self.Reload();
	};

	/*
	 * button first
	 */
	this.First = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		self.options.page_number = 0;
		self.Reload();
	};

	/*
	 * button last
	 */
	this.Last = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		self.options.page_number = self.options.total_page - 1;
		self.Reload();
	};

	/*
	 * select per-page
	 */
	this.SetPerPage = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		self.options.page_number = 0;
		self.options.per_page = $('.per-page option:selected').val();
		self.Reload();
	};


	/*
	 * On Reload clicked
	 */
	this.OnReload = function() {
		$('.overlay').show();
		$('input.keyword').focus();
		var self = this;
		// set page number jadi 0 jika ingin hasil reload diset ke page 1 
		// self.options.page_number = 0;
		self.Reload();
	}

	/*
	 * Search
	 */
	this.Search = function(event) {
		$('.overlay').show();
		var self = this;
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode === 13) {
			self.options.keyword = $('.keyword').val();
			self.Reload();
		} else {
			$('.overlay').hide();
		}
	};

}).call(GridBuilder.prototype);