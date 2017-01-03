// convert to money format
// example : 1250 -> 1.250
Number.prototype.to_money = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

// Helper function
var H = H || {};

/* Split an array pathname */
H.pathname = location.pathname.split('/');

/* Base URL */
H.base_url = _BASE_URL;

/* Current URL */
H.current_url = _CURRENT_URL;

/**
 * Growl handler
 */
H.growl = function(type, message) {
    switch (type) {
        case 'success' :
            toastr.success(message, 'Success !' );
            break;
        case 'info' :
            toastr.info(message, 'Info !' );
            break;
        case 'warning' :
            toastr.warning(message, 'Warning !' );
            break;
        case 'error' :
            toastr.error(message, 'Error !' );
            break;
        default :
            toastr.error('Not initialize growl type.');
    }
};

H.FormatBytes = function(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
};

/**
 * Handler alert status
 * @param  string
 */
H.message = function(message) {
    var msg = '';
    switch (message) {
        case 'created':
            msg = 'Data Anda telah disimpan !';
            break;
        case 'not_created':
            msg = 'Terjadi kesalahan dalam menyimpan data Anda !';
            break;
        case 'updated':
            msg = 'Data Anda telah diperbaharui !';
            break;
        case 'not_updated':
            msg = 'Data Anda tidak dapat diperbaharui !';
            break;        
        case '404':
            msg = 'Halaman tidak ditemukan !';
            break;
        case 'deleted':
            msg = 'Data Anda telah dihapus !';
            break;
        case 'not_deleted':
            msg = 'Terjadi kesalahan dalam menghapus data Anda !';
            break;
        case 'restored':
            msg = 'Data Anda telah dikembalikan !';
            break;
        case 'not_restored':
            msg = 'Terjadi kesalahan dalam mengembalikan data Anda !';
            break;
        case 'not_selected':
            msg = 'Tidak ada item terpilih !';
            break;
        case 'existed':
            msg = 'Data sudah tersedia !';
            break;
        case 'empty':
            msg = 'Data tidak tersedia !';
            break;
        case 'required':
            msg = 'Field harus diisi !';
            break;
        case 'not_numeric':
            msg = 'ID bukan tipe angka';
            break;
        case 'keyword_empty':
            msg = 'Kata kunci pencarian tidak boleh kosong, dan minimal 3 karakter !';
            break;
        case 'no_changed':
            msg = 'Tidak ada data yang berubah !';
            break;
        case 'logged_in':
            msg = 'Log In berhasil. Halaman akan dialihkan dalam 2 detik.';
            break;
        case 'not_logged_in':
            msg = 'Log In gagal. Nama akun dan/atau kata sandi yang Anda masukan salah.';
            break;
        case 'forbidden':
            msg = 'Akses ditolak!';
            break;    
        default :
            msg = message;
    }

    return msg;
};

H.stringToJSON = function(str) {
    var res = typeof str == 'string' ? JSON.parse(str) : str;
    return res;
};

// object of month
H.month = function(str) {
    var month = {
        '01':'Januari',
        '02':'Februari',
        '03':'Maret',
        '04':'April',
        '05':'Mei',
        '06':'Juni',
        '07':'Juli',
        '08':'Agustus',
        '09':'September',
        '10':'Oktober',
        '11':'Nopember',
        '12':'Desember'
    };

    return (typeof str === 'undefined') ? month : month[str];
};

// indonesian date formated
H.indo_date = function (str) {
    if (typeof str === 'undefined') return;
    var explode = str.split('-'),
        year  = explode[0],
        month = explode[1],
        day   = explode[2],
        bulan = H.month(month);     
     return day + ' ' + bulan + ' ' + year;
};

// Uppercase first letter of variable
String.prototype.ucwords = function() {
  str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    function(s){
      return s.toUpperCase();
    });
};

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

/* Image preview before uploaded */
H.preview = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

/* Image preview before uploaded */
H.previewImage = function(id, filename) {
    var reader = new FileReader();
    reader.onload = function (e) {
        $('#preview_' + id).attr('src', e.target.result);
    };
    reader.readAsDataURL(filename);
};

/* Date time for footer */
H.RealtimeDate = function() {
    var a = new Date;
    var b = [];
        b[0]="Januari";
        b[1]="Februari";
        b[2]="Maret";
        b[3]="April";
        b[4]="Mei";
        b[5]="Juni";
        b[6]="Juli";
        b[7]="Agustus";
        b[8]="September";
        b[9]="Oktober";
        b[10]="Nopember";
        b[11]="Desember";
    var currentMonth = b[a.getMonth()];
    var currentYear  = a.getFullYear();
    var currentDate  = a.getDate();
    var c = [];
        c[0]="Minggu";
        c[1]="Senin";
        c[2]="Selasa";
        c[3]="Rabu";
        c[4]="Kamis";
        c[5]="Jum'at";
        c[6]="Sabtu";
    var currentDay = c[a.getDay()];
    var d = a.getHours();
    var e = a.getMinutes();
    var f = a.getSeconds();
        d = (d < 10 ? "0" : "") + d;
        e = (e < 10 ? "0" : "") + e;
        f = (f < 10 ? "0" : "") + f;
    var h = "<i class='fa fa-calendar'></i> " + currentDay + " " + currentDate + " " + currentMonth + " " + currentYear + " &sdot; <span class='time'><i class='fa fa-clock-o'></i> " + d + ":" + e + ":" + f + "</span>";
    $("span.current-date").html(h);
};