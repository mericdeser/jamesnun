(function () {
  var PHONE = '1234567890';
  var EMAIL = 'info@jpexecutive.com';
  var state = { occ: 'airport', car: 'escalade' };
  var OCC = {
    airport: { label: 'Airport', from: 'Airport or your address', to: 'Where are we taking you?' },
    game: { label: 'Game day', from: 'Your address', to: 'Stadium or arena' },
    night: { label: 'Night out', from: 'Your address', to: 'Club, restaurant or venue' },
    event: { label: 'Event', from: 'Your address', to: 'Venue' },
    hourly: { label: 'By the hour', from: 'Where should we start?', to: '' }
  };
  var CARS = { escalade: 'Cadillac Escalade', esv: 'Cadillac Escalade ESV', vito: 'Mercedes-Benz Vito' };

  var form = document.getElementById('jp-form');
  var done = document.getElementById('jp-done');
  var err = document.getElementById('jp-err');
  var $ = function (id) { return document.getElementById(id); };

  function press(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute(attr) === value ? 'true' : 'false');
    });
  }

  function setOcc(id) {
    state.occ = id;
    press('.jp-chip', 'data-occ', id);
    var o = OCC[id];
    $('f-from').placeholder = o.from;
    $('f-to').placeholder = o.to;
    $('wrap-to').hidden = id === 'hourly';
    $('f-to').required = id !== 'hourly';
    $('wrap-hours').hidden = id !== 'hourly';
    $('wrap-flight').hidden = id !== 'airport';
    $('wrap-return').hidden = !(id === 'game' || id === 'night' || id === 'event');
  }

  function setCar(id) {
    state.car = id;
    press('.jp-car', 'data-car', id);
  }

  document.querySelectorAll('.jp-chip').forEach(function (b) {
    b.addEventListener('click', function () { setOcc(b.getAttribute('data-occ')); });
  });
  document.querySelectorAll('.jp-car').forEach(function (b) {
    b.addEventListener('click', function () { setCar(b.getAttribute('data-car')); });
  });
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () { setCar(a.getAttribute('data-pick')); });
  });

  function message() {
    var d = new FormData(form);
    var g = function (k) { return (d.get(k) || '').toString().trim(); };
    var lines = [
      'Hi J&P, I would like to book a ride.',
      'Occasion: ' + OCC[state.occ].label,
      'Pickup: ' + g('from'),
      state.occ === 'hourly' ? 'Duration: ' + g('hours') : 'Drop-off: ' + g('to'),
      state.occ === 'airport' && g('flight') ? 'Flight: ' + g('flight') : '',
      'Date: ' + g('date') + ', Time: ' + g('time'),
      'Guests: ' + g('pax'),
      'Vehicle: ' + CARS[state.car],
      !$('wrap-return').hidden && d.get('roundtrip') ? 'Return ride: yes' : '',
      'Name: ' + g('name'),
      'Mobile: ' + g('phone')
    ];
    return lines.filter(Boolean).join('\n');
  }

  function valid() {
    var ok = form.checkValidity();
    form.querySelectorAll('.jp-field').forEach(function (f) {
      f.classList.toggle('jp-invalid', !f.closest('[hidden]') && !f.checkValidity());
    });
    err.hidden = ok;
    if (!ok) {
      var first = form.querySelector('.jp-invalid');
      if (first) first.focus();
    }
    return ok;
  }

  function finish() {
    form.hidden = true;
    done.hidden = false;
    done.style.display = 'flex';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid()) return;
    window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message()), '_blank', 'noopener');
    finish();
  });

  $('jp-email').addEventListener('click', function () {
    if (!valid()) return;
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Ride request: ' + OCC[state.occ].label) + '&body=' + encodeURIComponent(message());
    finish();
  });

  $('jp-reset').addEventListener('click', function () {
    form.reset();
    setOcc(state.occ);
    done.hidden = true;
    done.style.display = 'none';
    form.hidden = false;
  });

  setOcc('airport');
  setCar('escalade');
  var y = document.getElementById('jp-year');
  if (y) y.textContent = new Date().getFullYear();
})();
