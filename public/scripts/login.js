
/* eslint-env jquery */

$(document).ready(function () {
  $('#form-login').submit(function (event) {
    event.preventDefault()

    const form = $(this)
    const action = form.attr('action')
    const method = form.attr('method')
    const disabled = form.find('input, button')
    const data = {}

    $(disabled).attr('disabled', true)
    form.find('[name]').each(function () {
      const name = $(this).attr('name')
      data[name] = $(this).val()
    })

    $.ajax(action, {
      method,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      cache: false,
      error: function (xhr, status, error) {
        const message = JSON.parse(xhr.responseText).message
        $(disabled).removeAttr('disabled')
        window.alert(message)
      },
      success: function (result, status, xhr) {
        window.location = '/'
      }
    })
  })
})
