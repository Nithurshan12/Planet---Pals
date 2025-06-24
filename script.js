// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function () {
  // Utility to create a modal dialog
  function showModal(title, content) {
    let modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="custom-modal-content">
        <span class="custom-modal-close">&times;</span>
        <h2>${title}</h2>
        <div>${content}</div>
      </div>
      <style>
        .custom-modal { position:fixed; z-index:9999; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;}
        .custom-modal-content { background:#fff; padding:2rem; border-radius:12px; max-width:90vw; max-height:80vh; overflow:auto; box-shadow:0 2px 24px #0002;}
        .custom-modal-close { position:absolute; right:24px; top:16px; font-size:1.5rem; cursor:pointer;}
      </style>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.custom-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  // Button selectors
  const btns = Array.from(document.querySelectorAll('.bottom-nav .nav-btn'));
  const [settingsBtn, tipsBtn, pointsBtn, merchBtn, recycleBtn] = btns;

  // Settings Button
  settingsBtn.addEventListener('click', function () {
    showModal('Settings', `
      <form id="settings-form">
        <label>Theme:
          <select id="theme-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <br><br>
        <button type="submit">Save Settings</button>
      </form>
      <script>
        document.getElementById('settings-form').onsubmit = function(e){
          e.preventDefault();
          const theme = document.getElementById('theme-select').value;
          document.body.style.background = theme === 'dark' ? '#212121' : '';
          alert('Theme set to ' + theme);
          document.querySelector('.custom-modal').remove();
        };
      </script>
    `);
  });

  // Tips Button
  tipsBtn.addEventListener('click', function () {
    const tips = [
      "Recycle your plastic bottles and cans.",
      "Turn off lights when not in use.",
      "Use reusable bags for shopping.",
      "Compost food scraps.",
      "Use public transport or bike more often."
    ];
    showModal('Eco Tips', `<ul>${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`);
  });

  // Points Button (with localStorage)
  pointsBtn.addEventListener('click', function () {
    let points = Number(localStorage.getItem('planetpals_points') || 0);
    function addPoints(n) {
      points += n;
      localStorage.setItem('planetpals_points', points);
      document.getElementById('points-value').textContent = points;
    }
    showModal('Your Points', `
      <p>You have <strong id="points-value">${points}</strong> points.</p>
      <button id="add-points-btn">Add 10 points (demo)</button>
      <script>
        document.getElementById('add-points-btn').onclick = function(){
          let val = parseInt(document.getElementById('points-value').textContent,10);
          val += 10;
          localStorage.setItem('planetpals_points', val);
          document.getElementById('points-value').textContent = val;
        }
      </script>
    `);
  });

  // Merchandise Button
  merchBtn.addEventListener('click', function () {
    showModal('Merchandise', `
      <ul>
        <li>Planet Pals T-shirt - 100 points</li>
        <li>Reusable Water Bottle - 80 points</li>
        <li>Eco Tote Bag - 60 points</li>
      </ul>
      <p>Earn more points to unlock these eco-friendly rewards!</p>
    `);
  });

  // Recycling Centers Button (uses Geolocation + fetches data from OpenStreetMap Nominatim API)
  recycleBtn.addEventListener('click', function () {
    if (!navigator.geolocation) {
      showModal('Recycling Centers', 'Geolocation is not supported by your browser.');
      return;
    }
    showModal('Recycling Centers', '<div id="recycling-centers-status">Fetching your location...</div>');
    navigator.geolocation.getCurrentPosition(function (pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=recycling+center&limit=5&addressdetails=1&extratags=1&viewbox=${lon-0.05},${lat+0.05},${lon+0.05},${lat-0.05}`)
        .then(res => res.json())
        .then(data => {
          if (data.length === 0) {
            document.getElementById('recycling-centers-status').innerHTML = 'No recycling centers found nearby.';
            return;
          }
          document.getElementById('recycling-centers-status').innerHTML = `
            <ul>
              ${data.map(center => `<li>
                <strong>${center.display_name.split(',')[0]}</strong><br>
                <span>${center.display_name}</span>
                <br><a href="https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lon}#map=18/${center.lat}/${center.lon}" target="_blank">View on Map</a>
              </li>`).join('')}
            </ul>
          `;
        })
        .catch(() => {
          document.getElementById('recycling-centers-status').innerHTML = 'Failed to fetch center data. Try again later.';
        });
    }, function (err) {
      document.getElementById('recycling-centers-status').textContent = 'Failed to get your location: ' + err.message;
    });
  });
});
