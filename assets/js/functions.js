$(document).ready(function() {

  //change event to body change
  var tr = $('#main-table tbody tr').eq(1).html();
  var td_header = '<td><label contenteditable="true"></td>';
  var td_body = '<td><input type="text" class="ip"><a href="#" class="table-button delete-row btn btn-block btn-danger" title="Delete Row">-</a></td>';
  var rowCount = $('#main-table tbody tr').length;
  var colCount = $('#main-table tbody tr:first td').length - 1;
  var index = 0;

  $("#main-table tbody tr").each(function() {
    $(this).attr("id", "row-id-"+ ++index);
  });

  $(".table-button.add-column").parent().attr("rowspan", rowCount);

  $(".add-column").click(function(e) {
    e.preventDefault();
    $(".table-button.delete-row").remove();

    $("#main-table thead tr").find("td:last").prev().after(td_header);
    $("#main-table tbody tr").find("td:last").prev().after(td_body);
    colCount++;
    tr = $('#main-table tbody tr').eq(1).html();
  });

  $(".add-row").click(function(e) {
    e.preventDefault();
    $('#main-table tbody tr:last').after("<tr>" + tr + "</tr>");
    rowCount++;
    $(".table-button").parent().attr("rowspan", rowCount);
  });

});
