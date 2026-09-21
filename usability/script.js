const catalog = {
    clothing: [
        ['Wishbone Hoodie', 1499, 'wishbone / navy issue', 'images/wishbone hoodie.webp', 'Wishbone hoodie'],
        ['Wishbone Tour Tee', 999, 'wishbone / white issue', 'images/wishbone tshirt.webp', 'Wishbone t-shirt'],
        ['Wishbone Classic Tee', 899, 'wishbone / everyday', 'images/wishbone white tshirt.jpg', 'White Wishbone t-shirt'],
        ['Kid Krow Tour Tee', 999, 'kid krow / merch issue', 'images/kidkrow tshirt.webp', 'Kid Krow t-shirt']
    ],
    jewelry: [
        ['Wishbone Necklace', 2299, 'wishbone / keepsake', 'images/wishbone-necklace.webp', 'Silver wishbone necklace'],
        ['Found Heaven Necklace', 2299, 'found heaven / keepsake', 'images/found-heaven-necklace.webp', 'Delicate silver necklace'],
        ['Wishbone Ring', 1799, 'wishbone / keepsake', 'images/wishbone ring.webp', 'Wishbone ring']
    ],
    objects: [
        ['Conan Gray Dice', 599, 'conan gray / game night', 'images/conangray dice.webp', 'Conan Gray dice set'],
        ['Wishbone Deluxe Vinyl', 2999, 'wishbone / deluxe edition', 'images/wishbone deluxe vinyl.jpg', 'Wishbone deluxe vinyl record'],
        ['Wishbone Sticker Pack', 399, 'wishbone / little things', 'images/wishbone stickers.jpg', 'Wishbone sticker pack'],
        ['Wishbone Keychain', 699, 'wishbone / little things', 'images/wishbone keychain.webp', 'Wishbone keychain'],
        ['Sailor Hat', 899, 'sailor supply / headwear', 'images/sailor hat.webp', 'Sailor hat'],
        ['Sailor Pin', 499, 'sailor supply / little things', 'images/sailor pin.webp', 'Sailor pin']
    ],
    gifts: [
        ['Wishbone', 2499, 'album / volume 01', 'images/wishbone-album.png', 'Wishbone album artwork'],
        ['Superache', 2499, 'album / red issue', 'images/superache-album.jpg', 'Superache album artwork'],
        ['Kid Krow', 2499, 'album / black issue', 'images/kid-krow.jpg', 'Kid Krow album artwork'],
        ['Found Heaven', 2499, 'album / final issue', 'images/found-heaven-album.jpg', 'Found Heaven album artwork']
    ]
};

const bag = JSON.parse(localStorage.getItem('wishbone-bag') || '[]');
const homeMain = document.querySelector('.home-main');
const homeProductGrid = document.querySelector('#products .products');
const featuredMarkup = homeProductGrid.innerHTML;
const catalogPage = document.querySelector('.catalog-page');
const catalogGrid = document.querySelector('.catalog-grid');
const catalogHeading = document.querySelector('.catalog-heading');
const musicPage = document.querySelector('.music-page');
const bagDrawer = document.querySelector('.bag-drawer');
const bagScrim = document.querySelector('.bag-scrim');
const bagItems = document.querySelector('.bag-items');
const cartCount = document.querySelector('.cart-count');
const subtotal = document.querySelector('.subtotal strong');
const checkoutButton = document.querySelector('.checkout');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('.search-form input');
const searchResults = document.querySelector('.search-results');
const allProducts = Object.values(catalog).flat();
const bannerLines = [
    'WISHBONES BREAK,<br>BUT WE STILL SAIL.',
    'KEEP YOUR HEART<br>WHERE THE TIDE CAN FIND IT.',
    'SOMEWHERE BETWEEN<br>GOODBYE AND HOME.',
    'CARRY THE NIGHT,<br>WEAR THE MORNING.'
];
const songCatalog = [
    { album: 'Wishbone', year: '2025', art: 'images/wishbone-album.png', songs: ['Wishbone', 'The Exit', 'Little Red'] },
    { album: 'Superache', year: '2022', art: 'images/superache-album.jpg', songs: ['Movies', 'Jigsaw', 'Memories'] },
    { album: 'Kid Krow', year: '2020', art: 'images/kid-krow.jpg', songs: ['Heather', 'Maniac', 'Wish You Were Sober'] },
    { album: 'Found Heaven', year: '2024', art: 'images/found-heaven-album.jpg', songs: ['Never Ending Song', 'Lonely Dancers', 'Alley Rose'] }
];
const songList = document.querySelector('#song-list');
const musicToggle = document.querySelector('.music-toggle');
let audioContext;
let activeOscillators = [];
let activeSong;

function money(value) {
    return `₱${value.toLocaleString('en-PH')}`;
}

function saveBag() {
    localStorage.setItem('wishbone-bag', JSON.stringify(bag));
    renderBag();
}

function addToBag(name, price) {
    const existing = bag.find((item) => item.name === name);
    if (existing) existing.quantity += 1;
    else bag.push({ name, price, quantity: 1 });
    saveBag();
    openBag();
}

function renderBag() {
    const itemCount = bag.reduce((total, item) => total + item.quantity, 0);
    const total = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = itemCount;
    subtotal.textContent = money(total);
    checkoutButton.disabled = bag.length === 0;
    bagItems.innerHTML = bag.length ? bag.map((item) => `
        <div class="bag-item" data-name="${item.name}">
            <div><h3>${item.name}</h3><p>${money(item.price)} each</p><button class="remove-item" type="button">Remove</button></div>
            <div><strong>${money(item.price * item.quantity)}</strong><div class="quantity-controls"><button class="decrease" type="button" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button class="increase" type="button" aria-label="Increase quantity">+</button></div></div>
        </div>`).join('') : '<p class="empty-bag">Your bag is waiting for something good.</p>';
}

function openBag() {
    bagDrawer.classList.add('is-open');
    bagScrim.classList.add('is-visible');
    bagDrawer.setAttribute('aria-hidden', 'false');
}

function closeBag() {
    bagDrawer.classList.remove('is-open');
    bagScrim.classList.remove('is-visible');
    bagDrawer.setAttribute('aria-hidden', 'true');
}

function productCard(product, index) {
    const [name, price, tag, image, alt] = product;
    return `<article class="product-card" data-product="${name}" data-price="${price}">
        <img src="${image}" alt="${alt}">
        <div class="product-info"><div class="tag">0${index + 1} / ${tag}</div><h3>${name}</h3><div class="price-row"><span class="price">${money(price)}</span><button class="product-btn" type="button">Add to bag +</button></div></div>
    </article>`;
}

function showCategory(category) {
    const name = `${category[0].toUpperCase()}${category.slice(1)}`;
    window.history.pushState({}, '', `#category-${category}`);
    catalogHeading.innerHTML = `<h1>${name}</h1><p>${catalog[category].length} pieces in this collection</p>`;
    catalogGrid.innerHTML = catalog[category].map(productCard).join('');
    homeMain.hidden = true;
    catalogPage.hidden = false;
    musicPage.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showFeatured() {
    window.history.pushState({}, '', '#products');
    homeMain.hidden = false;
    catalogPage.hidden = true;
    musicPage.hidden = true;
    homeProductGrid.innerHTML = featuredMarkup;
}

function showAllProducts() {
    window.history.pushState({}, '', '#all-products');
    catalogHeading.innerHTML = '<h1>All products</h1><p>Everything currently aboard</p>';
    catalogGrid.innerHTML = allProducts.map(productCard).join('');
    homeMain.hidden = true;
    catalogPage.hidden = false;
    musicPage.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMusic() {
    window.history.pushState({}, '', '#songs');
    homeMain.hidden = true;
    catalogPage.hidden = true;
    musicPage.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSearch() {
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    searchInput.focus();
}

function closeSearch() {
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden', 'true');
}

function renderSongLibrary() {
    songList.innerHTML = songCatalog.map((album, albumIndex) => `
        <section class="album-group">
            <div class="album-heading"><img src="${album.art}" alt="${album.album} album cover"><div><span class="tag">0${albumIndex + 1} / album</span><h2>${album.album}</h2><small>${album.year} / ${album.songs.length} tracks</small></div></div>
            <div class="album-tracks">${album.songs.map((song, songIndex) => `<button class="song-card" type="button" data-song="${song}" data-album="${album.album}" data-index="${albumIndex + songIndex}"><span class="song-number">${String(songIndex + 1).padStart(2, '0')}</span><span><strong>${song}</strong><small>${album.album}</small></span><span class="song-play">Play preview &#9654;</span></button>`).join('')}</div>
        </section>`).join('');
}

function stopPreview() {
    activeOscillators.forEach((oscillator) => oscillator.stop());
    activeOscillators = [];
}

function playPreview(songCard) {
    audioContext = audioContext || new AudioContext();
    audioContext.resume();
    stopPreview();
    const baseNotes = [196, 220, 246.94, 261.63, 293.66, 329.63];
    const note = baseNotes[Number(songCard.dataset.index) % baseNotes.length];
    [note, note * 1.25, note * 1.5].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index === 1 ? 'triangle' : 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.045 : 0.025;
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        activeOscillators.push(oscillator);
    });
    activeSong = songCard.dataset.song;
    document.querySelectorAll('.song-card').forEach((card) => {
        card.classList.remove('is-playing');
        card.querySelector('.song-play').textContent = 'Play preview ▶';
    });
    songCard.classList.add('is-playing');
    songCard.querySelector('.song-play').textContent = `Playing ${activeSong} ▮▮`;
    musicToggle.classList.add('is-playing');
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.innerHTML = `<span class="music-icon">Ⅱ</span> Pause ${activeSong}`;
    document.querySelector('.music-status').textContent = `${songCard.dataset.album} / original preview`;
}

function pausePreview() {
    stopPreview();
    activeSong = null;
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.innerHTML = '<span class="music-icon">▶</span> Play original preview';
    document.querySelector('.music-status').textContent = 'Choose a song to begin';
}

let currentShowcaseProduct = null;
let showcaseOptions = { size: null, color: null, quantity: 1 };
const showcase = document.querySelector('.product-showcase');
const showcaseScrim = document.querySelector('.showcase-scrim');

function openShowcase(product) {
    const [name, price, tag, image, alt] = product;
    currentShowcaseProduct = { name, price, tag, image, alt };
    showcaseOptions = { size: null, color: null, quantity: 1 };
    
    document.getElementById('showcase-img').src = image;
    document.getElementById('showcase-img').alt = alt;
    document.getElementById('showcase-tag').textContent = tag;
    document.getElementById('showcase-title').textContent = name;
    document.getElementById('showcase-price').textContent = money(price);
    document.getElementById('showcase-qty').value = 1;
    
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    
    showcase.classList.add('is-open');
    showcaseScrim.classList.add('is-visible');
    showcase.setAttribute('aria-hidden', 'false');
}

function closeShowcase() {
    showcase.classList.remove('is-open');
    showcaseScrim.classList.remove('is-visible');
    showcase.setAttribute('aria-hidden', 'true');
    currentShowcaseProduct = null;
}

// Checkout & Orders system
const orders = JSON.parse(localStorage.getItem('wishbone-orders') || '[]');
const checkoutPage = document.querySelector('#checkout-page');
const ordersPage = document.querySelector('#orders-page');

function generateReceiptNumber() {
    return `WB${Date.now().toString().slice(-8)}`;
}

function generateCardNumber() {
    const parts = [];
    for (let i = 0; i < 4; i++) {
        parts.push(String(Math.floor(Math.random() * 10000)).padStart(4, '0'));
    }
    return parts.join(' ');
}

function generateCVV() {
    return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

function openCheckout() {
    closeBag();
    const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 50;
    const total = subtotal + shipping;
    
    // Fill in order summary
    const itemsHtml = bag.map(item => 
        `<div class="checkout-item">
            <span class="checkout-item-name">${item.name} x${item.quantity}</span>
            <span>${money(item.price * item.quantity)}</span>
        </div>`
    ).join('');
    
    document.getElementById('checkout-items').innerHTML = itemsHtml;
    document.getElementById('checkout-subtotal').textContent = money(subtotal);
    document.getElementById('checkout-total').textContent = money(total);
    
    homeMain.hidden = true;
    checkoutPage.hidden = false;
    ordersPage.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCheckout() {
    checkoutPage.hidden = true;
    homeMain.hidden = false;
}

function generateReceipt(orderData) {
    const { name, address, phone, payment, subtotal, shipping, total, items, receiptNumber, date, cardInfo } = orderData;
    
    let receipt = `
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-title">SAILOR'S SUPPLY</div>
                <div class="receipt-subtitle">WISHBONE COLLECTION</div>
            </div>
            
            <div class="receipt-section">
                <div class="receipt-section-title">Receipt #</div>
                <div class="receipt-line">
                    <span class="receipt-line-label">${receiptNumber}</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <div class="receipt-section-title">Customer Info</div>
                <div class="receipt-line">
                    <span class="receipt-line-label">Name:</span>
                    <span class="receipt-line-value">${name}</span>
                </div>
                <div class="receipt-line">
                    <span class="receipt-line-label">Phone:</span>
                    <span class="receipt-line-value">${phone}</span>
                </div>
                <div class="receipt-line">
                    <span class="receipt-line-label">Address:</span>
                </div>
                <div class="receipt-line" style="font-size: 10px;">
                    <span class="receipt-line-label">${address}</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <div class="receipt-section-title">Items</div>
                <div class="receipt-items">
                    ${items.map(item => `<div class="receipt-item">${item.name} x${item.qty} = ${money(item.subtotal)}</div>`).join('')}
                </div>
            </div>
            
            <div class="receipt-section">
                <div class="receipt-line">
                    <span class="receipt-line-label">Subtotal:</span>
                    <span class="receipt-line-value">${money(subtotal)}</span>
                </div>
                <div class="receipt-line">
                    <span class="receipt-line-label">Shipping:</span>
                    <span class="receipt-line-value">${money(shipping)}</span>
                </div>
                <div class="receipt-line" style="border-top: 1px solid; padding-top: 8px; margin-top: 8px; font-weight: 600;">
                    <span class="receipt-line-label">Total:</span>
                    <span class="receipt-line-value">${money(total)}</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <div class="receipt-section-title">Payment Method</div>
                <div class="receipt-line">
                    <span class="receipt-line-label">${payment.toUpperCase()}</span>
                </div>
                ${payment === 'card' ? `
                    <div class="receipt-line">
                        <span class="receipt-line-label">Card:</span>
                        <span class="receipt-line-value">${cardInfo.number}</span>
                    </div>
                    <div class="receipt-line">
                        <span class="receipt-line-label">Expires:</span>
                        <span class="receipt-line-value">${cardInfo.expires}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="receipt-section">
                <div class="receipt-section-title">Order Date</div>
                <div class="receipt-line">
                    <span class="receipt-line-label">${new Date(date).toLocaleString('en-PH')}</span>
                </div>
            </div>
            
            <div class="receipt-footer">
                <div class="receipt-footer-text">
                    Thank you for sailing with us.<br>
                    Made for the long way home.<br><br>
                    Status: TO DELIVER
                </div>
            </div>
        </div>
    `;
    
    return receipt;
}

function completeOrder() {
    const name = document.getElementById('full-name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    if (!name || !address || !phone) {
        alert('Please fill in all delivery information');
        return;
    }
    
    if (bag.length === 0) {
        alert('Your bag is empty');
        return;
    }
    
    const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 50;
    const total = subtotal + shipping;
    const receiptNumber = generateReceiptNumber();
    const date = new Date();
    
    const cardInfo = payment === 'card' ? {
        number: generateCardNumber(),
        expires: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 30) + 25).toString().slice(-2)}`,
        cvv: generateCVV()
    } : null;
    
    const orderItems = bag.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
    }));
    
    const order = {
        id: receiptNumber,
        name,
        address,
        phone,
        payment,
        subtotal,
        shipping,
        total,
        items: orderItems,
        receiptNumber,
        date: date.toISOString(),
        status: 'to-deliver',
        cardInfo
    };
    
    orders.unshift(order);
    localStorage.setItem('wishbone-orders', JSON.stringify(orders));
    
    // Show receipt
    const receiptHtml = generateReceipt(order);
    const printArea = document.getElementById('receipt-print-area');
    printArea.innerHTML = receiptHtml;
    
    // Reset form and show success
    document.getElementById('full-name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    
    alert(`Order placed! Receipt #${receiptNumber}`);
    
    // Clear bag and show orders
    bag.length = 0;
    saveBag();
    showOrders();
}

function showOrders() {
    homeMain.hidden = true;
    checkoutPage.hidden = true;
    ordersPage.hidden = false;
    renderOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 50px 0;">No orders yet. Start shopping!</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map((order, idx) => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-number">Order #${order.id}</div>
                    <div class="order-date">${new Date(order.date).toLocaleString('en-PH')}</div>
                </div>
                <div class="order-status ${order.status}">${order.status === 'to-deliver' ? 'TO DELIVER' : 'DELIVERED'}</div>
            </div>
            <div>
                <strong>${order.name}</strong><br>
                <span style="font-size: 11px; color: var(--muted);">${order.address}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.qty}</span>
                        <span>${money(item.subtotal)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span>Total Amount</span>
                <span>${money(order.total)}</span>
            </div>
            <div class="order-actions">
                <button class="order-btn print-receipt" data-order-id="${idx}">Print Receipt</button>
                <button class="order-btn toggle-status" data-order-id="${idx}">${order.status === 'to-deliver' ? 'Mark Delivered' : 'Mark Pending'}</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('click', (event) => {
    const categoryLink = event.target.closest('[data-category-link]');
    const productCard = event.target.closest('.product-card');
    const productButton = event.target.closest('.product-btn');
    const shopLink = event.target.closest('a[href="#products"]');
    const viewLink = event.target.closest('[data-view]');
    const songCard = event.target.closest('.song-card');
    const sizeBtn = event.target.closest('.size-btn');
    const colorBtn = event.target.closest('.color-btn');
    const showcaseAddBtn = event.target.closest('#showcase-add-to-bag');
    
    if (sizeBtn && showcase.classList.contains('is-open')) {
        event.preventDefault();
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        sizeBtn.classList.add('active');
        showcaseOptions.size = sizeBtn.dataset.size;
        return;
    }
    
    if (colorBtn && showcase.classList.contains('is-open')) {
        event.preventDefault();
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        colorBtn.classList.add('active');
        showcaseOptions.color = colorBtn.dataset.color;
        return;
    }
    
    if (showcaseAddBtn) {
        event.preventDefault();
        const quantity = Number(document.getElementById('showcase-qty').value);
        for (let i = 0; i < quantity; i++) {
            addToBag(currentShowcaseProduct.name, currentShowcaseProduct.price);
        }
        closeShowcase();
        return;
    }
    
    if (productCard && productButton === null) {
        event.preventDefault();
        const productName = productCard.dataset.product;
        const productPrice = Number(productCard.dataset.price);
        // Find the product in the catalog
        let foundProduct = null;
        for (const category in catalog) {
            foundProduct = catalog[category].find(p => p[0] === productName && p[1] === productPrice);
            if (foundProduct) {
                openShowcase(foundProduct);
                break;
            }
        }
        return;
    }
    
    if (categoryLink) {
        event.preventDefault();
        showCategory(categoryLink.dataset.categoryLink);
    }
    if (shopLink && !productButton && !viewLink) showFeatured();
    if (viewLink) {
        event.preventDefault();
        if (viewLink.dataset.view === 'songs') showMusic();
        else if (viewLink.dataset.view === 'all') showAllProducts();
        else showFeatured();
    }
    if (productButton) {
        const card = productButton.closest('.product-card');
        addToBag(card.dataset.product, Number(card.dataset.price));
        productButton.textContent = 'Added ✓';
        window.setTimeout(() => { productButton.textContent = 'Add to bag +'; }, 1600);
    }
    if (songCard) playPreview(songCard);
});

document.querySelector('.bag-trigger').addEventListener('click', openBag);
document.querySelector('.close-bag').addEventListener('click', closeBag);
bagScrim.addEventListener('click', closeBag);
document.querySelector('.search-trigger').addEventListener('click', openSearch);
document.querySelector('.close-search').addEventListener('click', closeSearch);
document.querySelector('.close-showcase').addEventListener('click', closeShowcase);
showcaseScrim.addEventListener('click', closeShowcase);
document.querySelector('#qty-decrease').addEventListener('click', () => {
    const input = document.getElementById('showcase-qty');
    if (input.value > 1) input.value = Number(input.value) - 1;
});
document.querySelector('#qty-increase').addEventListener('click', () => {
    const input = document.getElementById('showcase-qty');
    if (input.value < 99) input.value = Number(input.value) + 1;
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeBag(); closeSearch(); closeShowcase(); } });

bagItems.addEventListener('click', (event) => {
    const row = event.target.closest('.bag-item');
    if (!row) return;
    const item = bag.find((entry) => entry.name === row.dataset.name);
    if (event.target.closest('.increase')) item.quantity += 1;
    if (event.target.closest('.decrease')) item.quantity -= 1;
    if (event.target.closest('.remove-item') || item.quantity < 1) bag.splice(bag.indexOf(item), 1);
    saveBag();
});

checkoutButton.addEventListener('click', () => {
    if (bag.length > 0) {
        openCheckout();
    }
});

document.querySelector('.back-checkout').addEventListener('click', () => {
    closeCheckout();
});

document.querySelector('#complete-checkout').addEventListener('click', () => {
    completeOrder();
});

document.addEventListener('click', (event) => {
    const printBtn = event.target.closest('.print-receipt');
    const toggleBtn = event.target.closest('.toggle-status');
    
    if (printBtn) {
        const orderId = Number(printBtn.dataset.orderId);
        const order = orders[orderId];
        if (order) {
            const receiptHtml = generateReceipt(order);
            const printArea = document.getElementById('receipt-print-area');
            printArea.innerHTML = receiptHtml;
            window.print();
        }
    }
    
    if (toggleBtn) {
        const orderId = Number(toggleBtn.dataset.orderId);
        const order = orders[orderId];
        if (order) {
            order.status = order.status === 'to-deliver' ? 'delivered' : 'to-deliver';
            localStorage.setItem('wishbone-orders', JSON.stringify(orders));
            renderOrders();
        }
    }
});

document.querySelector('.search-form').addEventListener('submit', (event) => event.preventDefault());
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const matches = allProducts.filter(([name, , tag]) => `${name} ${tag}`.toLowerCase().includes(query));
    searchResults.textContent = query ? `${matches.length} result${matches.length === 1 ? '' : 's'} found` : 'Try “pendant”, “jacket”, or “gift”.';
    if (query && matches.length) searchResults.textContent += `: ${matches.map(([name]) => name).join(', ')}`;
});

document.querySelector('.signup').addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = event.currentTarget.querySelector('button');
    submitButton.textContent = 'YOU ARE ON THE LIST ✓';
    event.currentTarget.querySelector('input').value = '';
});

musicToggle.addEventListener('click', () => {
    if (activeSong) pausePreview();
    else playPreview(document.querySelector('.song-card'));
});

renderBag();
renderSongLibrary();
document.querySelector('.random-banner-line').innerHTML = bannerLines[Math.floor(Math.random() * bannerLines.length)];

const initialCategory = window.location.hash.replace('#category-', '');
if (catalog[initialCategory]) showCategory(initialCategory);
if (window.location.hash === '#all-products') showAllProducts();
if (window.location.hash === '#songs') showMusic();
window.addEventListener('popstate', () => {
    const route = window.location.hash.replace('#category-', '');
    if (catalog[route]) showCategory(route);
    else if (window.location.hash === '#all-products') showAllProducts();
    else if (window.location.hash === '#songs') showMusic();
    else showFeatured();
});
