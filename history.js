/* ============================================================
   HopeFund – Donation History Page Logic
   Requires: storage.js, app.js loaded before this file
   ============================================================ */

function renderHistory() {
  const search = $('#searchInput').value.trim().toLowerCase();
  const filter = $('#filterCampaign').value;
  let list = Storage.getAll();
  if (search) list = list.filter(d => d.name.toLowerCase().includes(search));
  if (filter) list = list.filter(d => d.campaign === filter);

  const body = $('#historyBody');
  const empty = $('#emptyState');
  if (list.length === 0) {
    body.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  body.innerHTML = list.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${d.name}</strong><br><small style="color:var(--gray-500)">${d.email}</small></td>
      <td><span class="badge">${d.campaign}</span></td>
      <td><strong style="color:var(--green-700)">${formatMoney(d.amount)}</strong></td>
      <td>${d.payment}</td>
      <td>${formatDate(d.date)}</td>
      <td style="text-align:right;">
        <button class="del-btn" onclick="deleteDonation(${d.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function deleteDonation(id) {
  if (!confirm('Are you sure you want to delete this donation record?')) return;
  Storage.remove(id);
  renderHistory();
  showToast('Donation record deleted');
}

$('#searchInput').addEventListener('input', renderHistory);
$('#filterCampaign').addEventListener('change', renderHistory);
$('#clearAllBtn').addEventListener('click', () => {
  if (!confirm('This will permanently delete ALL donation records. Continue?')) return;
  Storage.clear();
  renderHistory();
  showToast('All records cleared');
});

window.addEventListener('load', renderHistory);
