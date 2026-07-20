/* ============================================================
   HopeFund – Campaign Cards + Home Stats
   Requires: storage.js, app.js loaded before this file
   Used on: index.html (featured campaigns) and campaigns.html (all campaigns)
   ============================================================ */

function campaignCardHTML(c) {
  const raised = Storage.totalByCampaign(c.title);
  const percent = Math.min(100, Math.round((raised / c.goal) * 100));
  return `
    <div class="campaign-card reveal">
      <div class="campaign-img" style="background-image:url('${c.img}')">
        <span class="campaign-tag">${c.tag}</span>
      </div>
      <div class="campaign-body">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="progress-info">
          <span>Raised: <strong>${formatMoney(raised)}</strong></span>
          <span>${percent}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" data-percent="${percent}"></div></div>
        <div class="progress-meta">
          <span>Goal: ${formatMoney(c.goal)}</span>
          <span><i class="fa-solid fa-users"></i> ${Storage.getAll().filter(d => d.campaign === c.title).length} donors</span>
        </div>
        <button class="btn btn-primary" onclick="donateFor('${c.title}')">
          <i class="fa-solid fa-heart"></i> Donate Now
        </button>
      </div>
    </div>`;
}

function renderCampaigns() {
  const html = CAMPAIGNS.map(campaignCardHTML).join('');
  if ($('#featuredCampaigns')) $('#featuredCampaigns').innerHTML = html;
  if ($('#allCampaigns')) $('#allCampaigns').innerHTML = html;
  // Animate progress bars
  setTimeout(() => {
    $$('.progress-fill').forEach(bar => { bar.style.width = bar.dataset.percent + '%'; });
  }, 100);
  runRevealCheck();
}

function donateFor(campaign) {
  window.location.href = 'donate.html?campaign=' + encodeURIComponent(campaign);
}

/* ---------- HOME PAGE ONLY: counters + hero stats ---------- */
function animateCounters() {
  const raisedTarget = Storage.totalAmount();
  const donorsTarget = Storage.totalDonors();
  if (!$('#totalRaised')) return;
  $('#totalRaised').dataset.target = raisedTarget;
  $('#totalDonors').dataset.target = donorsTarget;

  $$('.count').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = cur.toLocaleString('en-IN');
    }, 25);
  });
}
function updateHeroStats() {
  if (!$('#heroDonors')) return;
  $('#heroDonors').textContent = Storage.totalDonors() + '+ Donors';
  $('#heroRaised').textContent = formatMoney(Storage.totalAmount()) + ' Raised';
}

/* ---------- INIT ---------- */
window.addEventListener('load', () => {
  renderCampaigns();
  updateHeroStats();
  setTimeout(() => { animateCounters(); }, 700);
});
