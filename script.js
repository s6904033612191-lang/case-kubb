const APPS_SCRIPT_URL = 'https://docs.google.com/spreadsheets/d/1sLs3mvkFQeEmIr76YuLx0m4gpx8PEFnUCv__isasA4k/edit?usp=sharing';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1sLs3mvkFQeEmIr76YuLx0m4gpx8PEFnUCv__isasA4k/edit?usp=sharing';

document.addEventListener('DOMContentLoaded', () => {
  // 1. หน้า product.html
  if (document.getElementById('product-list')) {
    const urlParams = new URLSearchParams(window.location.search);
    const filterMood = urlParams.get('mood');

    fetch('products.json')
      .then(res => res.json())
      .then(products => {
        let displayProducts = products;
        if (filterMood) {
          displayProducts = products.filter(p => p.mood === filterMood);
        }
        renderProducts(displayProducts);
      });
  }

  // 2. หน้า order.html
  if (document.getElementById('orderForm')) {
    const urlParams = new URLSearchParams(window.location.search);
    const item = urlParams.get('item');
    const price = urlParams.get('price');

    if (item) document.getElementById('items').value = item;
    if (price) document.getElementById('total').value = price;

    document.getElementById('orderForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const payload = {
        customerName: document.getElementById('customerName').value,
        contact: document.getElementById('contact').value,
        items: document.getElementById('items').value,
        total: document.getElementById('total').value,
        note: document.getElementById('note').value
      };

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then(() => { window.location.href = 'thankyou.html'; })
      .catch(err => {
        console.error(err);
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      });
    });
  }

  // 3. หน้า admin.html
  if (document.getElementById('ordersTable')) {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        const rows = csvText.split('\n').map(row => row.split(','));
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';
        
        // ข้าม Header row แรก
        for (let i = rows.length - 1; i >= 1; i--) {
          if (rows[i].length >= 5) {
            const tr = document.createElement('tr');
            rows[i].forEach(cell => {
              const td = document.createElement('td');
              td.textContent = cell.replace(/^"|"$/g, '');
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          }
        }
      });
  }
});

function renderProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price} บาท</div>
      <a href="order.html?item=${encodeURIComponent(p.name)}&price=${p.price}" class="btn">สั่งซื้อ</a>
    </div>
  `).join('');
}