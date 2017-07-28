var tableSource,
    outSource,
    tableTemplate,
    outTemplate,
    impex_data;

$(document).ready(function() {
  tableSource =  $("#impex-table").html();
  outSource =    $("#impex-out").html();
  tableTemplate  = Handlebars.compile(tableSource);
  outTemplate    = Handlebars.compile(outSource);
  impex_data = [['','','',''],['','','',''],['','','','']];
  printTable(impex_data);
  printImpexOutput(impex_data);

  placeAddCol();

  $(document).on('input','input',function() {
    var e = $.Event("impex-updated");
    e.row = $(this).data('row');
    e.col = $(this).data('col');
    e.val = $(this).val();
    $(document).trigger(e);
  });

  $(document).on('click','.removeRow',function() {
    var row = $(this).data('row');
    impex_data.splice(row,1);
    $(document).trigger('content-refresh');
    placeAddCol();
  });

  $(document).on('click','.removeColumn',function() {
    var col = $(this).data('col');
    for(var row of impex_data){
      row.splice(col,1);
    }
    $(document).trigger('content-refresh');
  });

  $('.addColumn').on('click',function() {
    for(var row of impex_data){
      row.push('');
    }
    $(document).trigger('content-refresh');
  });

  $('.addRow').on('click',function() {
    var count = $(this).data('count');
    if(impex_data.length > 0) {
      for(var i=0;i<count;i++) {
        var row = []
        for(var j = 0; j <impex_data[0].length;j++) {
          row.push('');
        }
        impex_data.push(row);
      }
      $(document).trigger('content-refresh');
    }
    placeAddCol();
  });
});


$(document).on('impex-updated',function(e) {
    impex_data[e.row][e.col] = e.val;
    printImpexOutput(impex_data);
});

$(document).on('content-refresh',function() {
  if(impex_data.length === 0 || impex_data[0].length ===0) {
      impex_data = [['']];
  }
  printTable(impex_data);
  printImpexOutput(impex_data);
});

function printImpexOutput(impex_data) {
  $('.impex-output').html(outTemplate({rows:impex_data}));
}

function printTable(impex_data) {
  var html = tableTemplate({rows: impex_data});
  $('table').html(html);
}
function placeAddCol() {
  $(".add-row-container").css("height", $("#main-table tbody").css("height"));
}
