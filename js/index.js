const availableTags = [
  'New',
  'Hit of the day',
  'Special offer',
  'Last items in stock',
  'Damaged',
]

function addProduct() {
  var form = $('#form')
  var actionUrl = form.attr('action')
  $.ajax({
    type: 'POST',
    url: actionUrl,
    dataType: 'json',
    data: form.serialize(),
    success: function (data) {
      console.log(data)
      window.dialog.dialog('close')
    },
    error: function (xhr, resp, text) {
      console.log(xhr, resp, text)
      form.append(
        `<p class="form-error">An error occurred while adding a product. Please try again later.</p>`
      )
    },
    complete: function(xhr, state){
      console.log(xhr, state);
    }
  })
}

$(function () {
  window.dialog = $('#add-modal').dialog({
    autoOpen: false,
    height: 700,
    width: 800,
    modal: true,
    buttons: {
      'Add a new product': addProduct,
      Cancel: function () {
        window.dialog.dialog('close')
      },
    },
    close: function () {
      form[0].reset()
    },
  })

  form = window.dialog.find('form').on('submit', function (event) {
    event.preventDefault()
    addProduct()
  })

  $('#modal-open')
    .button()
    .on('click', function () {
      window.dialog.dialog('open')
    })

  function split(val) {
    return val.split(/,\s*/)
  }

  function extractLast(term) {
    return split(term).pop()
  }

  $('#tags').autocomplete({
    minLength: 0,
    source: function (request, response) {
      response(
        $.ui.autocomplete.filter(availableTags, extractLast(request.term))
      )
    },
    focus: function () {
      return false
    },
    select: function (event, ui) {
      var terms = split(this.value)
      // remove the current input
      terms.pop()
      // add the selected item
      terms.push(ui.item.value)
      // add placeholder to get the comma-and-space at the end
      terms.push('')
      this.value = terms.join(', ')
      return false
    },
  })
})
