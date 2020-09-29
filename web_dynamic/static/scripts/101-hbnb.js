const $ = window.$;
$(document).ready(function () {
  let dictiAmenities = {};
  let dictiLocations = {};
  $(':button').click(function () {
    const idsAmenities = [];
    const idsLocations = [];
    for (const id in dictiAmenities) {
      idsAmenities.push(`"${id}"`);
    }
    for (const idLoc in dictiLocations) {
      idsLocations.push(`"${idLoc}"`);
    }

    $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
      type: 'POST',
      contentType: 'application/json',
      data: `{"amenities": [${idsAmenities}], "cities":[${idsLocations}], "states":[${idsLocations}]}`,
      dataType: 'json'
    }).done(function (data) {
      $('.places ').text('');
      arr(data);
    });
  });

  $('.amenities').on('change', "input[type='checkbox']", function () {
    dictiAmenities = myList(this, '.amenities', dictiAmenities);
  });

  $('.locations').on('change', "input[type='checkbox']", function () {
    dictiLocations = myList(this, '.locations', dictiLocations);
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
    arr(newData);
  });
});

function myList (elem, myClass, dicti) {
  if (elem.checked === true) {
    dicti[$(elem).data('id')] = $(elem).data('name');
  } else {
    delete dicti[$(elem).data('id')];
  }
  const lista = [];
  for (const item in dicti) {
    lista.push(dicti[item]);
  }
  if (lista.length > 0) {
    $('div' + myClass)
      .find('h4')
      .text(lista.join(', '));
  } else {
    $('div' + myClass)
      .find('h4')
      .html('&nbsp;');
  }
  return dicti;
}

function arr (newData) {
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
    const text = `
      <article id='${place.id}'>
        <div class='title_box'>
          <h2>${place.name}</h2>
          <div class='price_by_night'>${place.price_by_night}</div>
        </div>
        <div class='information'>
          <div class='max_guest'>
            ${place.max_guest} ${letra2}
          </div>
          <div class='number_rooms'>
            ${place.number_rooms} ${letra3}
          </div>
          <div class='number_bathrooms'>
            ${place.number_bathrooms} ${letra}
          </div>
        </div>
        <div class='description'> ${place.description}</div>
        <br>
        <b>Reviews</b>
        <span onclick='stateId("${place.id}")' class='show' id='review'>
          Show
        </span>
        <div>
          <ul class='reviews'></ul>
        </div>
      </article>`;

    $('.places').append(text);
  }
}

function stateId (id) {
  if ($(`#${id} #review`).hasClass('show')) {
    $(`#${id} #review`).removeClass('show');
    $(`#${id} #review`).addClass('hide');
    $(`#${id} #review`).text('hide');

    $.ajax(`http://0.0.0.0:5001/api/v1/places/${id}/reviews`, {
      type: 'GET'
    }).done(function (data) {
      let text = '';
      $.each(data, function (index, value) {
        const date = new Date(value.created_at);
        $.get(`http://0.0.0.0:5001/api/v1/users/${value.user_id}`, function (
          data
        ) {
          text += `
          <li>
            <b>${data.first_name}</b>
            <p>${value.text}</p>
            <p>${date}</p>
          </li>
        `;
          $(`#${id} ul.reviews`).html(text);
        });
      });
    });
  } else {
    $(`#${id} #review`).removeClass('hide');
    $(`#${id} #review`).addClass('show');
    $(`#${id} #review`).text('show');

    $(`#${id} ul.reviews`).html('');
  }
}
