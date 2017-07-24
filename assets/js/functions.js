$(document).ready(function(){

  //change event to body change
  var tr = '<tr><td><input type="text" class="ip"></td><td><a href="#" class="add-col">+</a></td></tr>'
  var td = '<td><input type="text" class="ip"></td>';
  var rowCount = $('#main-table tbody tr').length;
  var index = 0;

  $("#main-table tbody tr").each(function(){
    $(this).attr("id", "row-id-"+ ++index);
  });

  $(".add-col").parent().attr("rowspan", rowCount);

  $(".add-col").click(function(){
    //console.log($("#main-table tr").eq($(this).closest("tr")[0].rowIndex).html())
    $("#main-table tr").find("td:last").prev().after(td);
  });

  $("#add-row").click(function(){
    $('#main-table tr:last').prev().after(tr);
  });
})
