/* ============================================================
   HopeFund – Contact Page Logic
   Requires: app.js loaded before this file
   ============================================================ */

function setContactError(id, on) {
  $('#' + id).parentElement.classList.toggle('invalid', on);
}

$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#cName').value.trim();
  const email = $('#cEmail').value.trim();
  const subject = $('#cSubject').value.trim();
  const message = $('#cMessage').value.trim();

  let valid = true;
  setContactError('cName', !name); if (!name) valid = false;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setContactError('cEmail', !emailOk); if (!emailOk) valid = false;
  setContactError('cSubject', !subject); if (!subject) valid = false;
  setContactError('cMessage', !message); if (!message) valid = false;

  if (!valid) { showToast('Please complete all fields', true); return; }

  $('#contactForm').reset();
  showToast('Message sent! We will reply within 24 hours.');
});
