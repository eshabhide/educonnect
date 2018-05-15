$(document).ready(function() {
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

  

  $('#submit').click(function() {
    let data = {};
    data.email = $('#inputEmail')[0].value;
    data.password = $('#inputPassword')[0].value;

    $.post('/api/login', {data: data}).done(function(response) {
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
  })
})