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

var diff_numbers = []
var chars = []

var root_middle_row_element = $('<div class="middle_row"><button class="btn btn-danger diff_button delete_row"><div class="delete_mark">x</div> <div class="value">1</div></button></div>')
var user_middle_row_element = $('<div class="middle_row"><div></div></div>')
var user_column = $('<div class="user_column"><div class="first_row"><button class="btn btn-danger round_button delete_button delete_column"><div class="round_mark">x</div></button></div><div class="second_row"><div></div></div></div>')

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
    // new_element.text("て")
    console.log(new_element)
    $(target).append(new_element)
  }
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

var add_user_column = ()=>{
  var base_char = $("#addition_char_select").val()
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
  add_user_column()
  update_diff_chars_columns()
}

$(document).ready(function(){
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

  $('#user_columns').on('click', ".delete_column", function(){
    $(this).parent().parent().remove()
  })
})