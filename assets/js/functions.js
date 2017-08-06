var tableSource,
    outSource,
    tableTemplate,
    outTemplate,
    impex_data,
    headers_data,
    operation;

$(document).ready(function() {
  tableSource =  $("#impex-table").html();
  outSource =    $("#impex-out").html();
  tableTemplate  = Handlebars.compile(tableSource);
  outTemplate    = Handlebars.compile(outSource);
  impex_data = [['','','',''],['','','',''],['','','','']];
  headers_data = populateHeadersData(impex_data);
  operation = $('[name="operation"]').val();
  new Clipboard('.clipboard');

  printTable(impex_data,headers_data);
  printImpexOutput(impex_data,headers_data);

  $("label.table-header").css("max-width", $("#main-table tbody tr td").css("width"));

  placeAddCol();
  $('[name="operation"]').on('change',function(){
    operation = $(this).val();
    printImpexOutput(impex_data,headers_data);
  });
  $(document).on('input','input.impex-input',function() {
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
    for(var row of impex_data) {
      row.splice(col,1);
    }
    headers_data.splice(col,1);
    updateHeaderIndices(headers_data);
    $(document).trigger('content-refresh');
    placeAddCol();
  });

  $('.addColumn').on('click',function() {
    for(var row of impex_data) {
      row.push('');
    }
    headers_data.push('Header - ' + (impex_data[0].length));
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

  $(".collapse-output").click(function() {
    $(".impex-output-body").toggleClass("body-collapsed");
    $(".impex-output").toggleClass("output-collapsed");
    $(".collapse-output .glyphicon").toggleClass("glyphicon-minus glyphicon-unchecked");
  })

/*  $(".impex-header").focus(function() {
    setInterval(function () {
      $(".impex-output-header").text($(".impex-header").text());
    },300);
  });*/

  // $("#impex-output").resizable({
  //   handles:'n',
  //   ghost: true,
  //   maxHeight: 500,
  //   minHeight: 250
  // });
});


$(document).on('impex-updated',function(e) {
  if(!e.header_data_updated){
    impex_data[e.row][e.col] = e.val;
  }
    printImpexOutput(impex_data,headers_data);
});

$(document).on('content-refresh',function() {
  if(impex_data.length === 0 || impex_data[0].length ===0) {
      impex_data = [['']];
      headers_data = ["Header - 1"];
  }
  printTable(impex_data, headers_data);
  printImpexOutput(impex_data,headers_data);

});

function printImpexOutput(impex_data,headers_data) {
  $('#impex-output-body').html(outTemplate({rows:impex_data,
                                            headers:headers_data,
                                            operation: operation}));
}

function printTable(impex_data,headers_data) {
  var html = tableTemplate({  rows: impex_data,
                              headers: headers_data
                          });
  $('table').html(html);
  bindEvenets();
}

function placeAddCol() {
  $(".add-row-container").css({
    "height": $("#main-table tbody").css("height"),
    "margin-top": $("#main-table thead").css("height")
  });
}

function bindEvenets() {
  $("label.table-header").each(function() {
    $(this).focusin(function() {
      var val;
      val = $(this).html();
      if(val==="Header - "+($(this).data("col")+1))
        $(this).html("");
    });
    $(this).focusout(function() {
      if($(this).html().trim() == "") {
        $(this).html("Header - " + ($(this).data('col')+1));
      }
      headers_data[$(this).data('col')] = $(this).html();
    });
  });

  $('.table-header').each(function() {
    $(this).on('keyup',function() {
      headers_data[$(this).data('col')] = $(this).html();
      var e = $.Event("impex-updated");
      e.header_data_updated = true;
      $(document).trigger(e);
    });
  })
}

function populateHeadersData(rows) {
  var row = rows[0];
  var header_data = [];
  for(var i = 0; i < row.length; i++) {
    header_data.push('Header - ' + (i+1));
  }
  return header_data;
}

function updateHeaderIndices(data) {
  for(var i = 0 ; i < data.length; i++) {
    if(data[i].indexOf("Header - ") >= 0) {
      data[i] = "Header - " + (i+1);
    }
  }
}
$('#download-button').click(function() {
  if($("#file-name").val()) {
    var file_content = $(".impex-output-body").html().trim();
    var operation = $('.operation')
    file_content = file_content.replace(/(<([^>]+)>)/ig,"");
    var file_name = $("#file-name").val() + '.impex';
    var link = document.createElement('a');
    var mimeType = "text/plain";
    link.setAttribute('download', file_name);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(file_content));
    link.click();
  } else {
    alert("Please Enter File Name");
  }
});
