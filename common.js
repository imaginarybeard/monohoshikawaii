var aiueo = [
"あ","い","う","え","お",
"か","き","く","け","こ",
"さ","し","す","せ","そ",
"た","ち","つ","て","と",
"な","に","ぬ","ね","の",
"は","ひ","ふ","へ","ほ",
"ま","み","む","め","も",
"や","ゆ","よ",
"ら","り","る","れ","ろ",
"わ","ん"
]

var enemy_params = [
  ["プラチナーガ", "左+3右+2", "3:2"],
  ["ハイアシンス", "+4", "4"],
  ["ゴシェナイト", "+2", "2"],
  ["トルマリン", "+1", "1"],
  ["クバルフ", "奇数ターン+12偶数ターン+24", "12:24"],
  ["ルーレットゥポーン", "-9", "-9"],
  ["マガツカ", "+9", "9"],
  ["エヴァ１３号機", "+8", "8"],
]

var diff_numbers = []
var column_root_chars = []

var root_middle_row_element = $('<div class="middle_row"><button class="btn btn-danger diff_button delete_row"><div class="delete_mark">x</div> <div class="value">1</div></button></div>')
var user_middle_row_element = $('<div class="middle_row"><div></div></div>')
var user_column = $('<div class="user_column"><div class="first_row"><button class="btn btn-danger round_button delete_button delete_column"><div class="round_mark">x</div></button></div><div class="second_row"><div></div></div></div>')

var change_enemy = (enemy_diffs)=>{
  delete_diff_numbers()
  if(enemy_diffs != ""){
    var diffs_list = enemy_diffs.split(":")
    for(var i in diffs_list){
      add_diff_number(Number(diffs_list[i]))
    }
  }
  update_diff_numbers()
  update_diff_chars_columns()
}

var generate_select_options = ()=>{
  var generate_select_option = (option_params)=>{
    var option = $('<option/>')
    option.attr({ 'value': option_params[2] }).text(option_params[0] + "： " + option_params[1])
    $("#enemy_select").append(option)
  }

  for(var i in enemy_params){
    generate_select_option(enemy_params[i])
  }
}

var check_diff_number = ()=>{
  var number = $("#diff_number_input").val()
  $("#diff_number_input").val("")
  if(isNaN(number)){
    return null
  }else{
    return Number(number)
  }
}

var add_diff_number = (number)=>{
  var new_root_middle_row_element = root_middle_row_element.clone()
  new_root_middle_row_element.find(".value").text(number)
  $("#root_last_row").before(new_root_middle_row_element)
}

var update_diff_numbers = ()=>{
  diff_numbers = []
  var elements = $("#root_column").find(".middle_row")
  for(var i=0; i<elements.length; i++){
    diff_numbers.push(Number($(elements[i]).find(".value").text()))
  }

  save_cookie()
}

var update_diff_chars_columns = ()=>{
  var user_columns = $("#user_columns").find(".user_column")
  for(var i=0; i<user_columns.length; i++){
    update_diff_chars(user_columns[i])
  }
}

var update_diff_chars = (target)=>{
  var base_char = $(target).find(".second_row div").text()
  var update_chars = []
  for(var i=0; i<diff_numbers.length; i++){
    update_chars.push(calc_diff(base_char, diff_numbers[i]))
  }
  $(target).find(".middle_row").remove()
  for(var i=0; i<update_chars.length; i++){
    var new_element = user_middle_row_element.clone()
    new_element.find("div").text(update_chars[i])
    $(target).append(new_element)
  }
}

var update_column_root_chars = ()=>{
  column_root_chars = []
  var user_columns = $("#user_columns").find(".user_column")
  for(var i=0; i<user_columns.length; i++){
    column_root_chars.push($(user_columns[i]).find(".second_row div").text())
  }

  save_cookie()
}

var calc_diff = (base, diff)=>{
  diff %= aiueo.length
  var index = aiueo.indexOf(base)
  var next = index + diff
  if(next < 0){
    next += aiueo.length
  }else if(next >= aiueo.length){
    next -= aiueo.length
  }
  return aiueo[next]
}

var add_user_column = (base_char)=>{
  var new_column = user_column.clone()
  new_column.find(".second_row div").text(base_char)
  $("#user_columns").append(new_column)
}


var push_add_diff_number_button = ()=>{
  var number = check_diff_number()
  if(number != null && number != 0){
    add_diff_number(number)
    update_diff_numbers()
    update_diff_chars_columns()
  }
}

var push_add_column_button = ()=>{
  add_user_column($("#addition_char_select").val())
  update_diff_chars_columns()
  update_column_root_chars()
}

var save_cookie = ()=>{
  document.cookie = "max-age=31536000"
  document.cookie = "diffnumbers" + '=' + encodeURIComponent(diff_numbers);
  document.cookie = "columnrootchars" + '=' + encodeURIComponent(column_root_chars)

  console.log(document.cookie)
}

var load_cookie = ()=>{
  var result = {};
  var cookies = document.cookie;

  if(cookies != ''){
   var cookieArray = cookies.split(';');
   for(var i = 0; i < cookieArray.length; i++){
    var cookie = cookieArray[i].split('=');
    result[cookie[0].trim()] = decodeURIComponent(cookie[1]);
   }
  }

  if(result["diffnumbers"]){
    diff_numbers = result["diffnumbers"].split(",")
  }

  if(result["columnrootchars"]){
    column_root_chars = result["columnrootchars"].split(",")
  }

  console.log(result)

  console.log(diff_numbers)
  console.log(column_root_chars)

  set_cookie_value()
  update_diff_chars_columns()
}

var delete_cookie = ()=>{
  document.cookie = "diffnumbers" + '='
  document.cookie = "columnrootchars" + '='
}

var delete_diff_numbers = ()=>{
  diff_numbers = []
  var diff_number_eles = $("#root_column").find(".middle_row")
  diff_number_eles.remove()
}

var delete_user_columns = ()=>{
  column_root_chars = []
  var user_columns = $("#user_columns").find(".user_column")
  user_columns.remove()
}

var delete_value = ()=>{
  delete_diff_numbers()
  delete_user_columns()
}

var set_cookie_value = ()=>{
  for(var i=0; i<diff_numbers.length; i++){
    add_diff_number(diff_numbers[i])
  }
  for(var i=0; i<column_root_chars.length; i++){
    add_user_column(column_root_chars[i])
  }
}

$(document).ready(function(){
  load_cookie()
  generate_select_options()

  $('#add_row').on('click', function(){
    push_add_diff_number_button()
  })

  $("#diff_number_input").keypress(function(e){
    if(e.which == 13) {
      push_add_diff_number_button()
      return false;
    }
  });

  $("#root_column").on("click", ".delete_row", function(){
    $(this).parent().remove()
    update_diff_numbers()
    update_diff_chars_columns()
  })

  $('#add_column').on('click', function(){
    push_add_column_button()
  })

  $("#addition_char_select").keypress(function(e){
    if(e.which == 13) {
      push_add_column_button()
      return false;
    }
  });

  $("#addition_char_select").change(function() {
    push_add_column_button()
  });

  $("#enemy_select").change(function() {
    change_enemy($(this).val())
  });

  $('#user_columns').on('click', ".delete_column", function(){
    $(this).parent().parent().remove()
    update_column_root_chars()
  })

  $("body").on("click", "#reset_button", function(){
    delete_cookie()
    delete_value()
  })
})