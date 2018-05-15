$(document).ready(function() {
  $('#submit').click(function() {
    let data = {};
    data.name = $('#inputName')[0].value;
    data.email = $('#inputEmail')[0].value;
    data.password = $('#inputPassword')[0].value;
    data.type = $("input[name='custtype']:checked").val();
    
    $.post('/api/register', {data: data}).done(function(response) {
      if (response.msg == 0) {
        $('#succ').html('');
        $('#err').hide();
        $('#succ').show();
        $('#succ').append('<p>Profile was created succesfully. You will be redirected to login</p>');

        setTimeout(function() {
          window.location.href = '/login';
        },3000);
      } else {
        $('#err').html('');
        $('#err').show();
        $('#succ').hide();
        $('#err').append(response.err);
      }
    });
  })
})
