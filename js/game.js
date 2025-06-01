(function($){
    var _action = false;
    var roles = {
        'c': 'К',
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
        function distributeRoles() {
            const rolesArray = ['m', 'm', 'd', 's'];  // 2 мафии, 1 дон, 1 шериф
            // Заполняем оставшиеся роли мирными жителями
            while (rolesArray.length < 10) {
                rolesArray.push('c');
            }

            // Перемешиваем роли случайным образом
            for (let i = rolesArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rolesArray[i], rolesArray[j]] = [rolesArray[j], rolesArray[i]];
            }

            // Присваиваем роли игрокам
            document.querySelectorAll('.role_field_all').forEach((input, index) => {
                input.value = rolesArray[index];
                document.getElementById(`role_view_${index}`).innerHTML = roles[rolesArray[index]];
            });

            saveData();  // Сохраняем данные после распределения ролей
        }
        // Function to shuffle nicknames in col2
        function shuffleNicknames() {
            const nicknames = document.querySelectorAll('.col2 .nick_acpl');
            const nicknameArray = Array.from(nicknames).map(nickname => nickname.value);

            for (let i = nicknameArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nicknameArray[i], nicknameArray[j]] = [nicknameArray[j], nicknameArray[i]];
            }

            nicknames.forEach((nickname, index) => {
                nickname.value = nicknameArray[index];
            });
        }

        document.getElementById('distributeButton').addEventListener('click', distributeRoles);
        document.getElementById('shuffleButton').addEventListener('click', shuffleNicknames);
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

    function set_winner_mafia() {
        for (var i = 0; i < 10; i++) {
            var points = 0;
            var add_points = parseFloat(document.getElementById(`add_points_${i}`).value) || 0; // Сохраняем текущие дополнительные очки

            // Начисляем 1 балл для мафии и дона
            switch ($('#role_field_' + i).attr('value')) {
                case 'm':
                case 'd':
                    points += 1;
                    break;
            }

            // Проверка на 4 фола и вычитание 0.5 балла
            if ($('#fall_field_' + i).val() == 4) {
                add_points -= 0.5;
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_' + i).attr('value', +points);
            $('#points_' + i).val(+points);
            $('#add_points_' + i).attr('value', +add_points);
            $('#add_points_' + i).val(+add_points);

            updateTotal(i);  // Обновляем итоговое значение
        }

        $('#winner_field').attr('value', 'm');
        $('#winner_field').val('m');
    }

    function set_winner_city() {
        for (var i = 0; i < 10; i++) {
            var points = 0;
            var add_points = parseFloat(document.getElementById(`add_points_${i}`).value) || 0; // Сохраняем текущие дополнительные очки

            // Начисляем 1 балл для мирных жителей и шерифа
            switch ($('#role_field_' + i).attr('value')) {
                case 'c':
                case 's':
                    points += 1;
                    break;
            }

            // Проверка на 4 фола и вычитание 0.5 балла
            if ($('#fall_field_' + i).val() == 4) {
                add_points -= 0.5;
            }

            points = points.toFixed(6);
            add_points = add_points.toFixed(6);

            $('#points_' + i).attr('value', +points);
            $('#points_' + i).val(+points);
            $('#add_points_' + i).attr('value', +add_points);
            $('#add_points_' + i).val(+add_points);

            updateTotal(i);  // Обновляем итоговое значение
        }

        $('#winner_field').attr('value', 'c');
        $('#winner_field').val('c');
    }

    function updateTotal(rowIndex) {
        const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
        const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
        const total = points + addPoints;
        document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
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
            $('#bp_'+delta).html('К');
            $('#bp_'+delta).removeClass('b_pl');

            var tar = (best_player[pos][1] == 0)?"#points_":"#add_points_";
            var points = +$(tar+delta).attr('value');
            points -= best_player[pos][0];
            $(tar+delta).attr('value', points);
            $(tar+delta).val(points);
        }
    }


    Drupal.behaviors.game_actions = {
        attach: function (context, settings) {

            check_all();


            $('#rate-table-type-node-form').on('submit', function(e){
                window.onbeforeunload = null;
            });

            $('.bp_select').click(function(){
                var delta = $(this).data('delta');
                if($(this).hasClass('b_pl')){
                    rem_bp(delta);
                } else {
                    set_bp(delta);
                }
            });

            $('#mafia').click(function(){
                if(checkValues() == 0){
                    set_winner_mafia();
                } else {
                    $(this).attr('checked', false);
                }
            });

            $('#citizens').click(function(){
                if(checkValues() == 0){
                    set_winner_city();
                } else {
                    $(this).attr('checked', false);
                }
            });

            $('#save_day').click(function(){
                save_day();
            });

            $('.vote_butt').click(function(){
                var line = $(this).data('line');
                var nd = $('#vt_'+line+' .vote_nd').length;
                var st = $('#vt_'+line+' .vote_st').length;

                if(nd){
                    if($(this).hasClass('vote_nd')){
                        $(this).removeClass('vote_nd');
                        if($(this).hasClass('vote_st')){
                            $(this).removeClass('vote_st');
                        }
                    } else {
                        $('#vt_'+line+' .vote_nd').each(function(){
                            $(this).removeClass('vote_nd');
                        });

                        $(this).addClass('vote_nd');
                    }
                } else {
                    if(st){
                        $(this).addClass('vote_nd');
                    } else {
                        $(this).addClass('vote_st');
                    }
                }
            });

            $('.to_vote').click(function(){
                var delta = $(this).data('delta');
                put_to_vote(delta);
            });

            $('.voute_p').click(function(){
                var delta = $(this).html();
                rem_from_vote(delta);
            });

            $(document).ready(function() {
                let isVisible = false;
                const button = $('#settingsToggle');

                button.click(function() {
                    isVisible = !isVisible;
                    $('.hs').css('display', isVisible ? 'table-cell' : 'none');
                    button.text(isVisible ? 'Скрыть роли и баллы' : 'Показать роли и баллы');
                });
            });

            $('.callc_pick').click(function(){
                var delta = parseInt($(this).data('delta'));
                var cur = parseInt($(this).data('current'));
                var dir = parseInt($(this).data('target'));
                points_callc(delta, cur, dir);
            });

            $('.all_hide').click(function(){
                var line = parseInt($(this).data('line'));
                hide_bm(line);
            });

            $('.all_show').click(function(){
                var line = parseInt($(this).data('line'));
                show_bm(line);
            });

            $('.fk_pick').click(function(){
                var delta = $(this).data('delta');
                if(!$(this).hasClass("fk_selected")){
                    set_fk(delta);
                }
            });

            $('body').on('click', '.miss-last', function(){
                if(_action){
                    _action = false;
                } else {
                    var pos = parseInt($(this).attr('data-misspos'));
                    var input = $('#FK_field_'+pos);
                    var val = parseInt($(input).val());

                    if(val == -1){
                        $(this).remove();
                        $('.allpos[data-misspos='+(pos-1)+']').addClass('miss-last');
                        $(input).attr('value', '');
                        $(input).val('');
                    } else {
                        var view = $('#fk_'+val);
                        $(view).html("");
                        $(view).removeClass('fk_selected');
                        $(view).removeClass('miss-last');
                        $('.allpos[data-misspos='+(pos-1)+']').addClass('miss-last');
                        $(input).attr('value', '');
                        $(input).val('');

                        if(pos == 0){
                            $('.nick_'+val).css("display", "table-cell");
                            $('.bm_line_'+val).css("display", "none");
                            $('.hide_'+val).css("display", "none");
                        }
                    }
                }
            });

            $('#miss-button').click(function(){
                set_fk(-1);

            });

            $('.role').click(function(){
                var delta = $(this).data('delta');
                var val = $('#role_field_'+delta).val();

                switch(val){
                    case 'c':
                        if($('.role_field_all[value="m"]').length<2){
                            setRole(delta, 'm');
                            break;
                        }
                    case 'm':
                        if($('.role_field_all[value="d"]').length<1){
                            setRole(delta, 'd');
                            break;
                        }
                    case 'd':
                        if($('.role_field_all[value="s"]').length<1){
                            setRole(delta, 's');
                            break;
                        }
                    case 's':
                        setRole(delta, 'c');
                        break;
                }
            });
            // Функция для обновления итоговой суммы
            function updateTotal(rowIndex) {
                const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
                const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
                const total = points + addPoints;
                document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
                // Обновляем ячейку с итогом
                document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
            }

// Добавить обработчики событий для всех строк
            for(let i = 0; i < 10; i++) {
                // Для основных баллов
                document.getElementById(`points_${i}`).addEventListener('input', function() {
                    updateTotal(i);
                });

                // Для дополнительных баллов
                document.getElementById(`add_points_${i}`).addEventListener('input', function() {
                    updateTotal(i);
                });
            }

        }
    }
    // Предотвращение случайного зума
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });

// Улучшение отзывчивости кнопок
    document.addEventListener('touchstart', function() {}, {passive: true});
})(jQuery);
$(document).ready(function() {
    $('#settingsToggle').click(function() {
        if($(this).is(':checked')) {
            $('.col5, .col6, .col7, .col8').css('display', 'table-cell');
        } else {
            $('.col5, .col6, .col7, .col8').css('display', 'none');
        }
    });
});
$('#settingsToggle').click(function() {
    $('.hs').toggle();
    $(this).text(function(i, text) {
        return text === "Скрыть роли и баллы" ? "Показать роли и баллы" : "Скрыть роли и баллы";
    });
});
document.getElementById('menuToggle').addEventListener('click', function() {
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    if (!e.target.matches('#menuToggle')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
});
const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
const openModalButton = document.querySelector('.burger-menu-button');
const closeModalButton = document.querySelector('.close-modal-button');

openModalButton.addEventListener('click', () => {
    modal.classList.add('show');
    modalBackground.classList.add('show');
});

closeModalButton.addEventListener('click', () => {
    modal.classList.remove('show');
    modalBackground.classList.remove('show');
});

modalBackground.addEventListener('click', () => {
    modal.classList.remove('show');
    modalBackground.classList.remove('show');
});
