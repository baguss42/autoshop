// HTML Helper
function TRid(id, is_deleted, str) {
    if (is_deleted == 'true') {
        return '<tr id="tr_' + id + '" class="delete highlight">' + str + '</tr>';
    }
    return '<tr id="tr_' + id + '">' + str + '</tr>';
}

function TR(str) {
    return '<tr>' + str + '</tr>';
}

function TD(str) {
    return '<td>' + str + '</td>';
}

// TD style text-align:center
function TDc(str) {
    return '<td style="text-align:center;">' + str + '</td>';
}

// TD number
function TDnum(str) {
    return '<td style="text-align:right;">' + str + '</td>';
}

function TH(str, width) {
    var width = (typeof width != 'undefined' ? ('width="'+width+'"') : '');
    return '<th ' + width + '>' + str + '</th>';
}

// TH style text-align:center
function THc(str, width) {
    var width = (typeof width != 'undefined' ? ('width="'+width+'"') : '');
    return '<th ' + width + ' style="text-align:center;">' + str + '</th>';
}

// Anchor
function A(onclick, title, icon) {
    var title = title || '';
    var icon = icon || '<i class="fa fa-edit"></i>';
    return '<a href="javascript:void(0)" onclick="' + onclick + '" title="' + title + '">' + icon + '</a>';
}

// Anchor
function Ahref(url, title, icon, target) {
    var title = title || '';
    var icon = icon || '<i class="fa fa-edit"></i>';
    var target = target || '_self';
    return '<a href="' + url + '" title="' + title + '" target="' + target + '">' + icon + '</a>';
}

function CHECKBOX(id, name) {
    if (typeof id == 'undefined') throw('ID is not initialize');
    if (typeof name == 'undefined') throw('Name is not initialize');
    return '<input type="checkbox" id="checkbox_' + id + '" class="checkbox" name="' + name + '[]" value="' + id + '">';
}

function CHECKALL() {
    return '<input type="checkbox" class="check-all">';
}

// upload button
function UPLOAD(onclick, type, title) {
    if (type !== 'image' && type !== 'file') throw('Not initialize type or type must image or file');
    var icon = type == 'image' ? 'fa-file-image-o' : 'fa-upload';
    var title = title || '';
    return '<a href="javascript:void(0)" onclick="' + onclick + '" title="' + title +'"><i class="fa ' + icon + '"></i></a>';
}

function ATTR( key, val ) { // attribute
    return ' ' + key + '=' + Z( val ) + ' ';
}

function Z( txt ) {
    if( !txt ) return '""';
    txt = '' + txt;
    return '"' + txt.replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ) + '"';
}