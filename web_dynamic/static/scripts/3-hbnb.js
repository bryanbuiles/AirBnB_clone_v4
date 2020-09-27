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
  $.ajax('http://0.0.0.0:5001/api/v1/status', {
    type: 'GET'
  }).done(function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json'
  }).done(function (newData) {
    let letra2, letra3, letra;
    for (const place of newData) {
      if (place.number_bathrooms === 1) {
        letra = ' Bathroom';
      } else {
        letra = ' Bathrooms';
      }
      if (place.max_guest === 1) {
        letra2 = ' Guest';
      } else {
        letra2 = ' Guests';
      }
      if (place.number_rooms === 1) {
        letra3 = ' Bedroom';
      } else {
        letra3 = ' Bedrooms';
      }
      $('.places ').append(
        '<article><div class="title_box"><h2>' +
          place.name +
          '</h2><div class="price_by_night">$' +
          place.price_by_night +
          '</div></div><div class="information"><div class="max_guest">' +
          place.max_guest +
          letra2 +
          '</div><div class="number_rooms">' +
          place.number_rooms +
          letra3 +
          '</div><div class="number_bathrooms">' +
          place.number_bathrooms +
          letra +
          '</div></div><div class="description">' +
          place.description +
          '</div></article>'
      );
    }
  });
});
