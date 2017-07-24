$(document).ready(function() {

  //change event to body change
  var tr = $('#main-table tbody tr').eq(1).html();
  var td = '<td><input type="text" class="ip"></td>';
  var rowCount = $('#main-table tbody tr').length;
  var colCount = $('#main-table tbody tr:first td').length - 1;
  var index = 0;

  $("#main-table tbody tr").each(function() {
    $(this).attr("id", "row-id-"+ ++index);
  });

  $(".add-col").parent().attr("rowspan", rowCount);

  $(".add-col").click(function(e) {
    e.preventDefault();
    $("#main-table tr").find("td:last").prev().after(td);
    colCount++;
    tr = $('#main-table tbody tr').eq(1).html();
  });

  $(".add-row").click(function(e) {
    e.preventDefault();
    $('#main-table tbody tr:last').after("<tr>" + tr + "</tr>");
    rowCount++;
    $(".add-col").parent().attr("rowspan", rowCount);
  });

});
