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
  operation = $('[name="operation"]').val() + " " + $("#structure-name").val() + ";";

  new Clipboard('.clipboard');

  $(".modal-content").slimScroll ({
    height: "90vh"
  });
  $("#impex-output-body").slimScroll ({
    height: "195px"
  });

  $("body").tooltip ({
    selector: '[data-toggle="tooltip"]'
  });

  $('[data-toggle="popover"]').popover ({
    trigger: "hover",
    title: $("#popoverTitle").html(),
    content: $("#popoverContent").html(),
    container: $('[data-toggle="popover"]'),
    html: true
  });

  printTable(impex_data,headers_data);
  firstColumnWidth();
  printImpexOutput(impex_data,headers_data);
  removeLastSemiColon();

  $("label.table-header").css("max-width", $("#main-table tbody tr td").css("width"));

  $('[name="operation"]').on('change',function() {
    operation = $(this).val() + " " + $("#structure-name").val() + ";";
    printImpexOutput(impex_data, headers_data);
  });
  $("#structure-name").on('input',function() {
    operation = $('[name="operation"]:checked').val() + " " + $(this).val() + ";";
    printImpexOutput(impex_data, headers_data);
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
  });

  $(document).on('click','.removeColumn',function() {
    var col = $(this).data('col');
    for(var row of impex_data) {
      row.splice(col,1);
    }
    headers_data.splice(col,1);
    updateHeaderIndices(headers_data);
    $(document).trigger('content-refresh');
  });

  $('.addColumn').on('click',function() {
    for(var row of impex_data) {
      row.push('');
    }
    // $('.main-table-container').scrollLeft($(".main-table-container").width());
    headers_data.push('Header - ' + (impex_data[0].length));
    $(document).trigger('content-refresh');
    removeLastSemiColon();
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
  });

  $(".collapse-output").on("click", function(e) {
    $(".impex-output-body").toggleClass("body-collapsed");
    $(".impex-output").toggleClass("output-collapsed");
    $(".collapse-output .glyphicon").toggleClass("glyphicon-minus glyphicon-unchecked");
  });

  $('#download-button').click(function() {
    if($("#file-name").val()) {
      var file_content = $(".impex-output-body").html().trim();
      file_content = file_content.replace(/(<([^>]+)>)/ig,"");
      file_content = file_content.replace("&amp;", "&");
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
  firstColumnWidth();
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

  $('label.table-header').each(function() {
    $(this).on('keyup',function() {
      headers_data[$(this).data('col')] = $(this).html();
      var e = $.Event("impex-updated");
      e.header_data_updated = true;
      $(document).trigger(e);
    });
  });

  $(".impex-header").focusin(function() {
    if($(this).html() === "Reference Header")
      $(this).html("");
    $(this).focusout(function() {
      if($(this).html().trim() == "") {
        $(this).html("Reference Header");
      }
    });
  });
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

function firstColumnWidth() {
  $("#main-table tbody tr").each(function() {
    $(this).find("td:first").addClass("row-number")
  });
  var labelWidth = $("#main-table label.table-header:last").outerWidth();
  var pseudoWidth = parseInt(window.getComputedStyle(document.querySelector(".row-number"), ':before').width);
  var firstColWidth = $("#main-table tbody tr:first td:first").outerWidth() + pseudoWidth + 10;

  $("#main-table thead td:first label.table-header, #main-table tfoot td:first .removeColumn").css({
    "float": "right",
    "width": labelWidth
  });
  if($("#main-table").width() >= ($(window).width() -30 )) {
    $("#main-table tbody tr").each(function() {
      $(this).find("td:first").css({
        "min-width": firstColWidth
      });
    });
  }
}

function removeLastSemiColon() {
  var content = $(".impex-output-header").text();
  var new_content = content.slice(0, -1);
  $(".impex-output-header").text(new_content);
}
