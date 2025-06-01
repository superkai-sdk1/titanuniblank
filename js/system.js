(function($){
    var _action = false;
var roles = {
    'c': '&nbsp;',
    'm': 'М',
    'd': 'Д',
    's': 'Ш'
}

function checkValues(){
    var m = $('.role_field_all[value="m"]').length;
    var d = $('.role_field_all[value="d"]').length;
    var s = $('.role_field_all[value="s"]').length;

    if((m != 2) | (d != 1) | (s != 1)){
        alert("Не правильно отмечены роли!");
        return -1;
    }

    return 0;
}
// Сохранение данных
function saveData() {
    // Сохраняем никнеймы
    const nicknames = [];
    document.querySelectorAll('.nick_acpl').forEach((input, index) => {
        nicknames[index] = input.value;
        localStorage.setItem('nicknames', JSON.stringify(nicknames));
    });

    // Сохраняем роли
    const roles = [];
    document.querySelectorAll('.role_field_all').forEach((input, index) => {
        roles[index] = input.value;
        localStorage.setItem('roles', JSON.stringify(roles));
    });

    // Сохраняем фолы
    const falls = [];
    document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
        falls[index] = input.value;
        localStorage.setItem('falls', JSON.stringify(falls));
    });

    // Сохраняем баллы
    const points = [];
    document.querySelectorAll('[id^=points_]').forEach((input, index) => {
        points[index] = input.value;
        localStorage.setItem('points', JSON.stringify(points));
    });
}

// Загрузка данных
function loadData() {
    // Загружаем никнеймы
    const nicknames = JSON.parse(localStorage.getItem('nicknames')) || [];
    document.querySelectorAll('.nick_acpl').forEach((input, index) => {
        if(nicknames[index]) input.value = nicknames[index];
    });

    // Загружаем роли
    const roles = JSON.parse(localStorage.getItem('roles')) || [];
    document.querySelectorAll('.role_field_all').forEach((input, index) => {
        if(roles[index]) {
            input.value = roles[index];
            document.getElementById(`role_view_${index}`).innerHTML = roles[index];
        }
    });

    // Загружаем фолы
    const falls = JSON.parse(localStorage.getItem('falls')) || [];
    document.querySelectorAll('[id^=fall_field_]').forEach((input, index) => {
        if(falls[index]) input.value = falls[index];
    });

    // Загружаем баллы
    const points = JSON.parse(localStorage.getItem('points')) || [];
    document.querySelectorAll('[id^=points_]').forEach((input, index) => {
        if(points[index]) input.value = points[index];
    });
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', loadData);
document.addEventListener('input', saveData);

function setFall(delta, value) {
    if((value >= 0) && (value <= 4)) {
        var input = $('#fall_field_'+delta);
        var view = $('#falls_view_'+delta);
        var addPoints = $('#add_points_'+delta);

        $(input).attr('value', value);
        $(input).val(value);
        $(view).attr('class', 'fall_'+value);

        // Добавляем штраф только при 4-м фоле
        if(value === 4) {
            var penalty = -0.5;
            var currentPoints = parseFloat(addPoints.val()) || 0;
            addPoints.attr('data-fall-penalty', penalty);
            addPoints.val((currentPoints + penalty).toFixed(2));
            addPoints.attr('value', (currentPoints + penalty).toFixed(2));
        }
    }
}


function setRole(delta, value){
    if(roles.hasOwnProperty(value)){
        var input = $('#role_field_'+delta);
        var view = $('#role_view_'+delta);
        $(input).attr('value', value);
        $(input).val(value);
        $(view).html(roles[value]);
    }
}

function check_all(){
    for(var i = 0; i < 10; i++){
        var val = parseInt($('#fall_field_'+i).val());
        var view = $('#falls_view_'+i);
        var bp = $('#BP_field_'+i).attr('value');

        var role = $('#role_field_'+i).attr('value');
        $('#role_view_'+i).html(roles[role]);

        if($(view).attr('class') != 'fall_'+val){
            $(view).attr('class', 'fall_'+val);
        }

        if(bp != ""){
            $('#bp_'+bp).html(i+1);
            $('#bp_'+bp).addClass('b_pl');
        }
    }

    clear_fk();
    for(var i = 0; i < 10; i++){
        if($('#FK_field_'+i).val() != ""){
            var val = parseInt($('#FK_field_'+i).val());
            $('#fk_'+val).addClass('fk_selected');
            $('#fk_'+val).html((i+1));

            if(i == 0){
                $('.show_'+val).css("display", "table-cell");
            }

            if(i==0){
                var bm = get_bm();
                process_bm(bm);
            }
        }
    }

    var m = $('#mafia');
    var c = $('#city');
    //alert($('#winner_field').attr());
    switch($('#winner_field').val() ){
        case 'c':
            $(c).addClass('win_team');
            $(m).removeClass('win_team');
            break;
        case 'm':
            $(m).addClass('win_team');
            $(c).removeClass('win_team');
            break;
    }
}

function process_bm(mass){
    var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
    for(var i = 0; i<3; i++){
        $(field[i]).attr('value', '');
        $(field[i]).val('');
    }

    var l = mass.length;
    var tmp;
    for(var j = 0; j<l-1; j++){
        for(i = 0; i<l-1; i++){
            if(mass[i]>mass[i+1]){
                tmp = mass[i];
                mass[i] = mass[i+1];
                mass[i+1] = tmp;
            }
        }
    }

    $('.bm_selected').each(function(){
        $(this).removeClass('bm_selected');
    });

    for(i = 0; i<l; i++){
        $(field[i]).attr('value', mass[i]);
        $(field[i]).val(mass[i]);
        $('.bm_pos_'+mass[i]).each(function(){
            $(this).addClass('bm_selected');
        });
    }
}

function in_bm(mass, elem){
    for(var i=0; i<mass.length; i++){
        if(mass[i] == elem){
            return i;
        }
    }

    return -1;
}

function get_bm(){
    var res = [];
    var field = [$('#BM_field_0'), $('#BM_field_1'), $('#BM_field_2')];
    for(var i = 0; i<3; i++){
        if($(field[i]).val() != ''){
            res.push(parseInt($(field[i]).val()));
        }
    }
    return res;
}

function set_bm(pos){
    var bm = get_bm();
    var ip = in_bm(bm, pos);
    var l = bm.length;
    if(ip<0){
        if(l < 3){
            bm.push(pos);
        }
    } else {
        var tmp = [];
        for(var i = 0; i<l; i++){
            if(ip != i){
                tmp.push(bm[i]);
            }
        }
        bm = tmp;
    }

    process_bm(bm);
}

function hide_bm(delta){
    $('.bm_line_'+delta).css("display", "none");
    $('.hide_'+delta).css("display", "none");
    $('.show_'+delta).css("display", "table-cell");
    $('.nick_'+delta).css("display", "table-cell");
}

function show_bm(delta){
    $('.nick_'+delta).css("display", "none");
    $('.bm_line_'+delta).css("display", "table-cell");
    $('.hide_'+delta).css("display", "table-cell");
    $('.show_'+delta).css("display", "none");
}

function points_callc(delta, cur, target){
    var tar = (target == 0)?"#points_":"#add_points_";
    tar += delta;
    var data = +$(tar).val();
    data += values[cur];
    data = data.toFixed(6);
    $(tar).attr('value', +data);
    $(tar).val(+data);
}

function put_to_vote(delta){
    var pos = $('.voute_line[data-act="1"]').length;
    if(pos == 0){
        $('.vote-table').css('display', 'table');
        $('.vote-table-mirror').css('display', 'table');
    }
    var line = $('#vt_'+pos);
    var view = $('#vv_'+pos);
    var dv = $('#dv_'+pos);
    var pl = $('#vpl_'+delta);
    var butt = $('#save_day');
    if($(pl).attr('data-invote') == 0){
        $(pl).attr('data-invote', '1');
        $(view).html(delta+1);
        $(line).attr('data-act', '1');
        $(line).css('display', 'table-row');
        $(dv).css('display', 'table-cell');
        $(dv).html(delta+1);
        if($(butt).css('display') == 'none'){
            $(butt).css('display', 'table-row');
        }
    }
}
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('show');
}

// Добавить обработчик клика вне меню
document.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-toggle')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
});
function rem_from_vote(delta){
    var pos = $('.voute_line[data-act="1"]').length - 1;
    if(pos == 0){
        $('.vote-table').css('display', 'none');
        $('.vote-table-mirror').css('display', 'none');
    }
    var view = $('#vv_'+pos);
    //alert($(view).html() + ' == ' + delta);
    if($(view).html() == delta){
        delta -= 1;
        var pl = $('#vpl_'+delta);
        var line = $('#vt_'+pos);
        var dv = $('#dv_'+pos);
        var butt = $('#save_day');
        $(pl).attr('data-invote', '0');
        $(view).html('');
        $(line).attr('data-act', '0');
        $(line).css('display', 'none');
        $(dv).css('display', 'none');
        $(dv).html("");
        $('#vt_'+pos+' .vote_st').each(function (){
            $(this).removeClass('vote_st');
        });
        $('#vt_'+pos+' .vote_nd').each(function (){
            $(this).removeClass('vote_nd');
        });

        if(pos == 0){
            $(butt).css('display', 'none');
        }
    }
}

function save_day(){
    var day = '';
    $('.voute_line[data-act="1"]').each(function (){
        var pos = $(this).data('line');
        var dv = $('#dv_'+pos);
        var line = $('#vt_'+pos);
        var view = $('#vv_'+pos);
        var st = $('#vt_'+pos+' .vote_st');
        var nd = $('#vt_'+pos+' .vote_nd');
        var pl = $(view).html();
        var tmp =0;
        var ppstr = pl;
        if($(st).length){
            tmp = ($(st).data('pos')+1);
            if(tmp == 6){ tmp += '+'; }
            str = pl + " - " + tmp + " голосов";
        } else {
            str = pl + " - " + tmp + " голосов";
        }

        if($(nd).length) {
            tmp = ($(nd).data('pos')+1);
            if(tmp == 6){ tmp += '+'; }
            str = str + " Голосв / После деления - " + tmp + " голосов";
        }

        $(line).css('display', 'none');
        $('#vpl_'+(pl-1)).attr('data-invote', '0');
        $(view).html('');
        $(line).attr('data-act', '0');
        $(dv).css('display', 'none');
        $(dv).html("");

        if(day != ''){
            day += '<br>';
        }

        day += str;
    });

    $('.vote_st').each(function (){
        $(this).removeClass('vote_st');
    });
    $('.vote_nd').each(function (){
        $(this).removeClass('vote_nd');
    });

    $('.vote-table').css('display', 'none');
    $('.vote-table-mirror').css('display', 'none');

    $('#save_day').css('display', 'none');

    var lp = parseInt($("#vote_res").attr("data-line"));
    var lpn = lp+1;
    $("#vote_res").attr("data-line", lpn);
    $("#vr_l"+lp).after('<div class="vote_day" id="vr_l'+lpn+'"><p>'+lpn+'</p><div data-day="'+lpn+'" class="helper">'+day+'</div></div>');
}

function get_cnt_bm(){
    var bm = get_bm();
    var bm_cnt = 0;
    var role = '';
    for(var j=0; j<3; j++){
        role = $('#role_field_'+bm[j]).attr('value');
        if((role == 'm') | (role == 'd')){
            bm_cnt++;
        }
    }

    return bm_cnt;
}

function set_winner_mafia(){

    for(var i=0; i<10; i++){

        var points = 0;
        var add_points = 0;

        switch($('#role_field_'+i).attr('value')){
            case 'm':
                //$('#points_'+i).attr('value', mafia[0]);
                points += mafia[0];
                break;
            case 'd':
                //$('#points_'+i).attr('value', don[0]);
                points += don[0];
                break;
            case 'c':
                //$('#points_'+i).attr('value', city[1]);
                points += city[1];
                break;
            case 's':
                //$('#points_'+i).attr('value', sheriff[1]);
                points += sheriff[1];
                break;
                $('#points_'+i).attr('value', +points);
                $('#points_'+i).val(+points);
                $('#add_points_'+i).attr('value', +add_points);
                updateTotal(i);
        }

        if($('#FK_field_0').attr('value') != ''){
            if($('#FK_field_0').attr('value') == i){
                var bmp = 0;
                switch($('#role_field_'+i).attr('value')){
                    case 'c':
                        bmp += first_killed[1];
                        switch(get_cnt_bm()){
                            case 0:
                                bmp += bm_03[1];
                                break;
                            case 1:
                                bmp += bm_13[1];
                                break;
                            case 2:
                                bmp += bm_23[1];
                                break;
                            case 3:
                                bmp += bm_33[1];
                                break;
                        }
                        break;
                    case 's':
                        bmp += first_killed[1];
                        switch(get_cnt_bm()){
                            case 0:
                                bmp += bms_03[1];
                                break;
                            case 1:
                                bmp += bms_13[1];
                                break;
                            case 2:
                                bmp += bms_23[1];
                                break;
                            case 3:
                                bmp += bms_33[1];
                                break;
                        }
                        break;
                }

                if(bmp_target[0] == 0){
                    points += bmp;
                } else {
                    add_points += bmp;
                }
            }
        }

        points = points.toFixed(6);
        add_points = add_points.toFixed(6);

        $('#points_'+i).attr('value', +points);
        $('#points_'+i).val(+points);
        $('#add_points_'+i).attr('value', +add_points);
        $('#add_points_'+i).val(+add_points);
    }

    $('#winner_field').attr('value', 'm');
    $('#winner_field').val('m');
}

function set_winner_city(){

    for(var i=0; i<10; i++){

        var points = 0;
        var add_points = 0;

        switch($('#role_field_'+i).attr('value')){
            case 'm':
                //$('#points_'+i).attr('value', mafia[1]);
                points =+ mafia[1];
                break;
            case 'd':
                //$('#points_'+i).attr('value', don[1]);
                points =+ don[1];
                break;
            case 'c':
                //$('#points_'+i).attr('value', city[0]);
                points =+ city[0];
                break;
            case 's':
                //$('#points_'+i).attr('value', sheriff[0]);
                points =+ sheriff[0];
                break;
                $('#points_'+i).attr('value', +points);
                $('#points_'+i).val(+points);
                $('#add_points_'+i).attr('value', +add_points);
                $('#add_points_'+i).val(+add_points);


                updateTotal(i);
        }

        if($('#FK_field_0').attr('value') != ''){
            if($('#FK_field_0').attr('value') == i){
                var bmp = 0;
                switch($('#role_field_'+i).attr('value')){
                    case 'c':
                        bmp += first_killed[0];
                        switch(get_cnt_bm()){
                            case 0:
                                bmp += bm_03[0];
                                break;
                            case 1:
                                bmp += bm_13[0];
                                break;
                            case 2:
                                bmp += bm_23[0];
                                break;
                            case 3:
                                bmp += bm_33[0];
                                break;
                        }
                        break;
                    case 's':
                        bmp += first_killed[0];
                        switch(get_cnt_bm()){
                            case 0:
                                bmp += bms_03[0];
                                break;
                            case 1:
                                bmp += bms_13[0];
                                break;
                            case 2:
                                bmp += bms_23[0];
                                break;
                            case 3:
                                bmp += bms_33[0];
                                break;
                        }
                        break;
                }

                if(bmp_target[0] == 0){
                    points += bmp;
                } else {
                    add_points += bmp;
                }
            }
        }

        points = points.toFixed(6);
        add_points = add_points.toFixed(6);

        $('#points_'+i).attr('value', +points);
        $('#points_'+i).val(+points);
        $('#add_points_'+i).attr('value', +add_points);
        $('#add_points_'+i).val(+add_points);
    }

    $('#winner_field').attr('value', 'c');
    $('#winner_field').val('c');
}

function clear_fk(){
    $('.fk_selected').each(function(){
        $(this).removeClass('fk_selected');
    });

    $('.all_bm_buttons').each(function(){
        $(this).css("display", "none");
    });

    $('.all_bm_actions').each(function(){
        $(this).css("display", "none");
    });

    $('.all_nicks').each(function(){
        $(this).css("display", "table-cell");
    });
}

function set_fk(delta){

    var pos = $('.fk_selected').length + $('.miss-select').length;
    if(pos<10){
        var input = $('#FK_field_'+pos);

        if(delta == -1){
            $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
            $('#miss-container').append('<td class="allpos miss-select miss-last" data-misspos="'+pos+'">'+(pos+1)+'</td>');
            $(input).attr('value', delta);
            $(input).val(delta);
        } else {
            var view = $('#fk_'+delta);
            $(view).html((pos+1)+'<i class="fa fa-crosshairs"></i>');
            $('.miss-last').each(function(){ $(this).removeClass('miss-last') });
            $(view).addClass('fk_selected');
            $(view).addClass('allpos');
            $(view).attr('data-misspos', pos);
            _action = true;
            $(view).addClass('miss-last');

            $(input).attr('value', delta);
            $(input).val(delta);

            if(pos == 0){
                $('.nick_'+delta).css("display", "none");
                $('.bm_line_'+delta).css("display", "table-cell");
                $('.hide_'+delta).css("display", "table-cell");
            }
            if(pos == 0) {
                $('#line_'+delta).addClass('kill');
            }
        }
    }
}

function rem_fk(delta){
    var pos = $('.miss-select').length + $('.fk_selected').length-1;
    var input = $('#FK_field_'+pos);

    if(delta == -1){

    }

    var view = $('#fk_'+delta);
    var val = parseInt($(input).val());
    if(pos == 0) {
        $('#line_'+delta).removeClass('kill');
    }
    if(val == delta){
        $(view).html("");
        $(view).removeClass('fk_selected');
        $(input).attr('value', '');
        $(input).val('');

        if(pos == 0){
            $('.nick_'+delta).css("display", "table-cell");
            $('.bm_line_'+delta).css("display", "none");
            $('.hide_'+delta).css("display", "none");
        }

    }
}

function set_bp(delta){
    var pos = $('.b_pl').length;
    if(pos < best_player.length){
        $('#BP_field_'+pos).attr('value', delta);
        $('#BP_field_'+pos).val(delta);
        $('#bp_'+delta).html((pos+1)+'<i class="fa fa-star"></i>');
        $('#bp_'+delta).addClass('b_pl');

        var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
        var points = +$(tar+delta).attr('value');
        points += best_player[pos][0];
        $(tar+delta).attr('value', points);
        $(tar+delta).val(points);
    }
}

function rem_bp(delta){
    var pos = $('.b_pl').length - 1;
    if($('#BP_field_'+pos).attr('value') == delta){
        $('#BP_field_'+pos).attr('value', '');
        $('#BP_field_'+pos).val('');
        $('#bp_'+delta).html('&nbsp;');
        $('#bp_'+delta).removeClass('b_pl');

        var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
        var points = +$(tar+delta).attr('value');
        points -= best_player[pos][0];
        $(tar+delta).attr('value', points);
        $(tar+delta).val(points);
    }
}

function setFall(delta, value) {
    if((value >= 0) && (value <= 4)) {
        var input = $('#fall_field_'+delta);
        var view = $('#falls_view_'+delta);
        $(input).attr('value', value);
        $(input).val(value);
        $(view).attr('class', 'fall_'+value);

        // При 4-м фоле добавляем штраф в поле "Доп"
        if(value === 4) {
            var addPoints = $('#add_points_'+delta);
            var currentPoints = parseFloat(addPoints.val()) || 0;
            var penalty = -0.5;

            // Сохраняем штраф в data-атрибуте
            addPoints.attr('data-fall-penalty', penalty);
            addPoints.val((currentPoints + penalty).toFixed(2));
            addPoints.attr('value', (currentPoints + penalty).toFixed(2));
        }
    }
}
