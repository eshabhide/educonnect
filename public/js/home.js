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
          timePicked.push(index + 8);
        });
      }
    });
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

    $('#datepicker').datepicker({
      maxViewMode: 3,
      todayBtn: "linked",
      multidate: false,
      forceParse: false
    });
    
    $('#dropdown').html('');
    $('#dropdown').append(subjects);


    let table = '<table id="ownData" class="display" width="100%"><thead><tr>';
    table += '<th>Student Email</th><th>Date</th><th>Time</th><th>Subject</th>';
    table += '</tr><thead><tbody>'
    
    for (let x in inputData.selfdata) {
      let startTime = inputData.selfdata[x].time;
      let timeConvert = startTime.toString().padStart(2, "0") + ":00 to " + (startTime + 1).toString().padStart(2, "0") + ":00";
      table += '<tr><td>' + ((inputData.selfdata[x].studentemail == null) ? 'Unreserved' : inputData.selfdata[x].studentemail) + '</td><td>' + inputData.selfdata[x].date +
        '</td><td>' + timeConvert + '</td><td>' + inputData.selfdata[x].subjectName + '</td></tr>';
    }
    
    table += '</tbody></table>';
    $('#ownTable').html('');
    $('#ownTable').append(table);

    $('#ownData').DataTable()

    $('#username').append('<b>Tutor: </b>' + inputData.name)
  }
})