/* ============================================================
   HopeFund – Donate Page Logic
   Requires: storage.js, app.js loaded before this file
   ============================================================ */

const donateForm = $('#donateForm');
const amountQuick = $('#amountQuick');

amountQuick.addEventListener('click', e => {
  const chip = e.target.closest('.amount-chip');
  if (!chip) return;
  $$('.amount-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  $('#dAmount').value = chip.dataset.amt;
  updateSummary();
});

$$('#payMethods .pay-option').forEach(opt => {
  opt.addEventListener('click', () => {
    $$('.pay-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input').checked = true;
    updateSummary();
  });
});

['dCampaign', 'dAmount'].forEach(id => $('#' + id).addEventListener('input', updateSummary));

function updateSummary() {
  $('#sumCampaign').textContent = $('#dCampaign').value || '—';
  const amt = Number($('#dAmount').value) || 0;
  $('#sumAmount').textContent = formatMoney(amt);
  $('#sumTotal').textContent = formatMoney(amt);
  const pay = document.querySelector('input[name="pay"]:checked');
  $('#sumPay').textContent = pay ? pay.value : '—';
}

function setError(id, on) {
  $('#' + id).parentElement.classList.toggle('invalid', on);
}

donateForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#dName').value.trim();
  const email = $('#dEmail').value.trim();
  const phone = $('#dPhone').value.trim();
  const campaign = $('#dCampaign').value;
  const amount = Number($('#dAmount').value);
  const pay = document.querySelector('input[name="pay"]:checked');

  let valid = true;
  setError('dName', !name); if (!name) valid = false;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setError('dEmail', !emailOk); if (!emailOk) valid = false;
  const phoneOk = /^[+\d][\d\s-]{7,}$/.test(phone);
  setError('dPhone', !phoneOk); if (!phoneOk) valid = false;
  setError('dCampaign', !campaign); if (!campaign) valid = false;
  const amountOk = amount >= 50;
  setError('dAmount', !amountOk); if (!amountOk) valid = false;
  const payWrap = $('#payMethods').parentElement;
  payWrap.classList.toggle('invalid', !pay);
  if (!pay) valid = false;

  if (!valid) { showToast('Please fix the errors in the form', true); return; }

  // Save donation
  const donation = Storage.add({
    name, email, phone, campaign, amount, payment: pay.value
  });

  // Reset UI
  donateForm.reset();
  $$('.amount-chip').forEach(c => c.classList.remove('active'));
  $$('.pay-option').forEach(o => o.classList.remove('selected'));
  updateSummary();

  // Show success
  $('#modalTitle').textContent = 'Thank You, ' + donation.name.split(' ')[0] + '!';
  $('#modalMsg').innerHTML = `Your donation of <strong>${formatMoney(donation.amount)}</strong> to <strong>${donation.campaign}</strong> was received successfully. A receipt has been sent to <strong>${donation.email}</strong>.`;
  $('#modal').classList.add('show');
});

/* ---------- Pre-fill campaign from ?campaign=... query param ---------- */
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get('campaign');
  if (campaign) {
    $('#dCampaign').value = campaign;
    updateSummary();
  }
});
