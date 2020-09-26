const $ = window.$;
$(document).ready(function () {
  const dicti = {};
  $(document).on('change', "input[type='checkbox']", function () {
    if (this.checked === true) {
      dicti[$(this).data('id')] = $(this).data('name');
    } else {
      delete dicti[$(this).data('id')];
    }
    const lista = [];
    for (const item in dicti) {
      lista.push(dicti[item]);
    }
    if (lista.length > 0) {
      $('div.amenities').find('h4').text(lista.join(', '));
    } else {
      $('div.amenities').find('h4').html('&nbsp;');
    }
  });
});
