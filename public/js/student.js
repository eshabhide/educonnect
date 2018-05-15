$(document).ready(function() {
  let timePicked = [];

  // jquery extend function
  $.extend({
    redirectPost: function(location, args) {
      var form = $('<form></form>');
      form.attr("method", "post");
      form.attr("action", location);

      $.each( args, function( key, value ) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
      });
      $(form).appendTo('body').submit();
    }
  });

  $('#dropdown').change(function () {
    let subject = $('#dropdown option:selected').val();
    
    inputData.subject = subject;
    $.post('/api/listtutors', {data: inputData}).done(function(response) {
      console.log(response);
      if (response.msg == 0) {
        let table = '<table id="example" class="display" width="100%"><thead><tr>';
        table += '<th></th><th>Tutor Email</th><th>Date</th><th>Time</th>';
        table += '</tr><thead><tbody>'
        for (let x in response.subjects) {
          let startTime = response.subjects[x].time;
          let timeConvert = startTime.toString().padStart(2, "0") + ":00 to " + (startTime + 1).toString().padStart(2, "0") + ":00";

          table += '<tr><td></td><td>' + response.subjects[x].email + '</td><td>' + response.subjects[x].date +
            '</td><td>' + timeConvert + '</td></tr>';
        }
        table += '</tbody></table>';
        $('#allTutors').html('');
        $('#allTutors').append(table);

        $('#example').DataTable( {
          columnDefs: [ {
              orderable: false,
              className: 'select-checkbox',
              targets:   0
          } ],
          select: {
              style:    'os',
              selector: 'td:first-child'
          },
          order: [[ 1, 'asc' ]]
        });

        $('#example').on('click', 'input[type="checkbox"]', function() {
          console.log('best', 'click');
      }); 

        $('#reserve').show();

      } else {
        $('#err').html('');
        $('#err').show();
        $('#err').append(response.err);
      }
    });
  });

  $('#datepicker').on('changeDate', function() {
    $('#submitTime').hide();
    timePicked = [];
    let timeGrid;
    let x = 8;
    timeGrid = '<ol id = "selectable">';
    
    do {
      timeGrid += '<li class="ui-state-default">' + x + '</li>';
    } while(x++ < 19);

    timeGrid += '</ol>';
    $('#timeData').show();
    $('#timeGrid').html('');
    $('#timeGrid').append(timeGrid);
    $("#selectable").selectable({
      stop: function() {
        timePicked = [];
        $('#submitTime').show();
        $( ".ui-selected", this ).each(function() {
          var index = $( "#selectable li" ).index( this );
          timePicked.push(index);
        });
      }
    });
  });

  $('#reserve').click(function() {
    console.log('I AM HERE')
    let selectedRows = $('#example').DataTable().rows( { selected: true } )[0];
    let selectedData = $('#example').DataTable().rows().data();
    
    let dataToBeSent = [];

    for (let x in selectedRows) {
      let data = selectedData[selectedRows[x]];
      rowData = {};
      rowData.email = data[1];
      rowData.date = data[2];
      rowData.time = data[3];
      dataToBeSent.push(rowData);
    }

    let sentData = {};
    sentData.d = dataToBeSent;
    sentData.subject = $('#dropdown option:selected').val();

    $.post('/api/reservetime', {data: sentData}).done(function(response) {
      console.log(response);
      if (response.msg == 0) {
     
      } else {
        $('#err').html('');
        $('#err').show();
        $('#err').append(response.err);
      }
    })
  });



  $('#submitTime').click(function() {
    let inputData = {};
    let subject = $('#dropdown option:selected').val();
    
    inputData.subject = subject;
    inputData.datePicked = $('#datepicker').datepicker('getFormattedDate')
    inputData.timePicked = timePicked;
    $.post('/api/enterTime', {data: inputData}).done(function(response) {
      console.log(response);
      if (response.msg == 0) {
        $('#err').hide();
        // Store token in the local storage
        localStorage.setItem('token', response.token.token);
        $.redirectPost('/home', {token: response.token.token});
      } else {
        $('#err').html('');
        $('#err').show();
        $('#err').append(response.err);
      }
    });
  });

  if (inputData.msg != 0) {
    $.redirectPost('/', {});
  } else {
    let subjects = '<select class="custom-select">';
    subjects += '<option selected>Choose Subject</option>';
    console.log(inputData); 
    for (let x in inputData.subjects) {
      subjects += '<option value="' + inputData.subjects[x].subjectid + '">' + 
        inputData.subjects[x].subjectName +'</option>';
    }
    subjects += '</select>';

    $('#dropdown').html('');
    $('#dropdown').append(subjects);

    let table = '<table id="ownData" class="display" width="100%"><thead><tr>';
    table += '<th>Tutor Email</th><th>Date</th><th>Time</th><th>Subject</th>';
    table += '</tr><thead><tbody>'
    
    for (let x in inputData.selfdata) {
      let startTime = inputData.selfdata[x].time;
      let timeConvert = startTime.toString().padStart(2, "0") + ":00 to " + (startTime + 1).toString().padStart(2, "0") + ":00";
      table += '<tr><td>' + inputData.selfdata[x].tutoremail + '</td><td>' + inputData.selfdata[x].date +
        '</td><td>' + timeConvert + '</td><td>' + inputData.selfdata[x].subjectName + '</td></tr>';
    }
    
    table += '</tbody></table>';
    $('#ownTable').html('');
    $('#ownTable').append(table);

    $('#ownData').DataTable()

    $('#username').append('<b>Student: </b>' + inputData.name)
  }
})