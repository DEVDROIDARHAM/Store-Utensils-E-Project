

// 1. NAVBAR COLOR CHANGE ON SCROLL
window.addEventListener('scroll', function() {

    var navbar = document.querySelector('header');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

});


// ── 2. SCROLL ANIMATION
function checkAnimations() {

    var animatedItems = document.querySelectorAll('.slide-left, .slide-right');
    var screenBottom  = window.innerHeight - 80;

    for (var i = 0; i < animatedItems.length; i++) {

        var itemTop = animatedItems[i].getBoundingClientRect().top;

        if (itemTop < screenBottom) {
            animatedItems[i].classList.add('visible');
        }

    }
}

window.addEventListener('scroll', checkAnimations);
window.addEventListener('load',   checkAnimations);


// ── 3. FILTER BY CATEGORY & SEARCH ─────────────────────────────
var currentCategory = 'all';

function filterByCategory(category, clickedBtn) {
    // remove active from all buttons
    var allButtons = document.querySelectorAll('.btn-filter');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('active');
    }
    // highlight the clicked button
    clickedBtn.classList.add('active');
    currentCategory = category;
    
    applyFilters();
}

function filterProducts() {
    applyFilters();
}

function applyFilters() {
    var searchText = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';
    var allCards   = document.querySelectorAll('.col-sm-6[data-category]');
    var count      = 0;

    for (var i = 0; i < allCards.length; i++) {
        var cardCategory = allCards[i].getAttribute('data-category');
        var cardKeywords = allCards[i].getAttribute('data-search').toLowerCase();

        var matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
        var matchesSearch   = (cardKeywords.includes(searchText));

        if (matchesCategory && matchesSearch) {
            allCards[i].style.setProperty('display', 'flex', 'important'); // Overrides Bootstrap d-flex
            count++;
        } else {
            allCards[i].style.setProperty('display', 'none', 'important');
        }
    }

    // update the product count text
    var countEl = document.getElementById('productCount');
    if (countEl) {
        countEl.textContent = 'Showing ' + count + ' products';
    }
}


// ── 5. OPEN PRODUCT MODAL ───────────────────────────────────
function openModal(productId) {

    // find the product from the products array
    var selectedProduct = null;

    for (var i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            selectedProduct = products[i];
            break;
        }
    }

    // if product not found, stop
    if (selectedProduct == null) return;

    // fill the modal with product info
    document.getElementById('modalName').textContent        = selectedProduct.name;
    document.getElementById('modalImage').src               = selectedProduct.image;
    document.getElementById('modalCategory').textContent    = selectedProduct.category;
    document.getElementById('modalDescription').textContent = selectedProduct.description;
    document.getElementById('modalPrice').textContent       = 'PKR ' + selectedProduct.price;
    document.getElementById('modalMaterial').textContent    = selectedProduct.material;
    document.getElementById('modalWeight').textContent      = selectedProduct.weight;
    document.getElementById('modalWarranty').textContent    = selectedProduct.warranty;
    document.getElementById('modalBestFor').textContent     = selectedProduct.bestFor;
    document.getElementById('modalRating').textContent      = selectedProduct.rating + ' / 5';

    // set badge color based on quality
    var badge = document.getElementById('modalBadge');
    badge.textContent = selectedProduct.quality;

    if (selectedProduct.quality == 'Premium') {
        badge.className = 'badge-premium';
    } else {
        badge.className = 'badge-standard';
    }

    // connect add to cart button
    document.getElementById('modalCartBtn').onclick = function() {
        addToCart(productId);
    };

    // show the modal
    var modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();

}


// ── 6. ADD TO CART ──────────────────────────────────────────
function addToCart(productId) {

    for (var i = 0; i < products.length; i++) {

        if (products[i].id == productId) {
            // Save to cart count in local storage
            let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
            cartCount++;
            localStorage.setItem('cartCount', cartCount);
            
            // Update UI immediately across the page
            updateCartCount();

            alert('Added to Cart!\n' + products[i].name + '\nPrice: PKR ' + products[i].price);
            break;
        }

    }

}

// ── 6.5 UPDATE CART COUNT UI ────────────────────────────────
function updateCartCount() {
    var cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        var count = parseInt(localStorage.getItem('cartCount')) || 0;
        cartBadge.textContent = count;
    }
}


// ── 7. TODAY'S OFFER — discounts page ───────────────────────
function displayTodayOffer() {

    var offerBox = document.getElementById('todayOffer');

    // only run on discounts page
    if (offerBox == null) return;

    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var offers   = [
        '2x Loyalty Points',
        '10% OFF All Products',
        '5% OFF Cookware',
        '15% OFF Selected Items',
        '10% OFF Premium Products',
        '20% OFF Sets & Knives',
        'Free Delivery Above PKR 3,000'
    ];

    var todayNumber = new Date().getDay();

    offerBox.textContent = dayNames[todayNumber] + ' Special: ' + offers[todayNumber];

}


// ── 8. FILL PRODUCT DROPDOWN — feedback page ────────────────
function populateProductDropdown() {

    var dropdown = document.getElementById('product');

    // only run on feedback page
    if (dropdown == null) return;

    for (var i = 0; i < products.length; i++) {
        var option         = document.createElement('option');
        option.value       = products[i].name;
        option.textContent = products[i].name;
        dropdown.appendChild(option);
    }

}


// ── 9. FEEDBACK FORM VALIDATION ─────────────────────────────
function submitFeedback(event) {

    event.preventDefault();

    var name     = document.getElementById('fullName').value.trim();
    var email    = document.getElementById('email').value.trim();
    var product  = document.getElementById('product').value;
    var feedback = document.getElementById('feedback').value.trim();
    var pRating  = document.querySelector('input[name="productRating"]:checked');
    var sRating  = document.querySelector('input[name="serviceRating"]:checked');

    if (name     == '')       return showError('Please enter your full name');
    if (email    == '')       return showError('Please enter your email');
    if (product  == '')       return showError('Please select a product');
    if (pRating  == null)     return showError('Please rate the product quality');
    if (sRating  == null)     return showError('Please rate the service quality');
    if (feedback.length < 20) return showError('Feedback must be at least 20 characters');

    // all good — show success
    document.getElementById('errorMessage').style.display   = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('feedbackForm').reset();

    // hide success message after 4 seconds
    setTimeout(function() {
        document.getElementById('successMessage').style.display = 'none';
    }, 4000);

}

function showError(message) {
    document.getElementById('errorText').textContent      = message;
    document.getElementById('errorMessage').style.display = 'block';
}


// ── 10. DYNAMIC DAILY DEAL TAGS ───────────────────────────────────
function applyDailyDealTags() {
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var offers   = [
        '2x Loyalty Points',
        '10% OFF All Products',
        '5% OFF Cookware',
        '15% OFF Selected Items',
        '10% OFF Premium Products',
        '20% OFF Sets & Knives',
        'Free Delivery Above PKR 3,000'
    ];
    
    var todayNumber = new Date().getDay();
    var todayName = dayNames[todayNumber];
    var todayOffer = offers[todayNumber];
    
    // Find all product image wrappers on the page (mostly products.html)
    var imgWrappers = document.querySelectorAll('.product-img-wrap');
    
    for (var i = 0; i < imgWrappers.length; i++) {
        // Create an absolute positioned badge
        var dealBadge = document.createElement('div');
        dealBadge.textContent = todayName + " Deal: " + todayOffer;
        
        // Styling the badge to sit over the top right corner of the image
        dealBadge.style.position = 'absolute';
        dealBadge.style.top = '10px';
        dealBadge.style.right = '10px';
        dealBadge.style.background = '#e74c3c'; // Red
        dealBadge.style.color = '#fff';
        dealBadge.style.padding = '4px 10px';
        dealBadge.style.fontSize = '0.75rem';
        dealBadge.style.fontWeight = 'bold';
        dealBadge.style.borderRadius = '20px';
        dealBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        dealBadge.style.zIndex = '10';
        
        // Make sure parent is relative so absolute positioning works
        imgWrappers[i].style.position = 'relative';
        imgWrappers[i].appendChild(dealBadge);
    }
}

// ── 11. DYNAMIC PRICING SYSTEM ────────────────────────────────────
function applyDynamicPrices() {
    var todayNumber = new Date().getDay();
    
    // Modify the products array if it exists (for modals and cart)
    if (typeof products !== 'undefined') {
        for (var i = 0; i < products.length; i++) {
            var p = products[i];
            var discountPct = 0;
            
            // 0: Sunday (points, no discount)
            // 1: Monday (10% OFF All Products)
            if (todayNumber === 1) discountPct = 0.10;
            // 2: Tuesday (5% OFF Cookware)
            else if (todayNumber === 2 && p.category === 'Cookware') discountPct = 0.05;
            // 3: Wednesday (15% OFF Selected Items - Let's apply to 'Serving')
            else if (todayNumber === 3 && p.category === 'Serving') discountPct = 0.15;
            // 4: Thursday (10% OFF Premium Products)
            else if (todayNumber === 4 && p.quality === 'Premium') discountPct = 0.10;
            // 5: Friday (20% OFF Sets & Knives)
            else if (todayNumber === 5 && (p.category === 'Sets' || p.category === 'Cutlery' || p.name.includes('Set'))) discountPct = 0.20;
            // 6: Saturday (Free Delivery, no price discount)
            
            if (discountPct > 0) {
                // p.price is usually a string like "2,500" or number
                var numericPrice = parseInt(p.price.toString().replace(/,/g, ''));
                var newPrice = Math.round(numericPrice * (1 - discountPct));
                
                // Store original and update to new price
                p.originalPrice = p.price;
                p.price = newPrice.toLocaleString();
            }
        }
    }
    
    // Now update the hardcoded HTML grid
    var allCards = document.querySelectorAll('.product-card');
    for (var i = 0; i < allCards.length; i++) {
        var card = allCards[i];
        var onClickAttr = card.getAttribute('onclick'); 
        
        if (onClickAttr) {
            var match = onClickAttr.match(/\d+/);
            if (match) {
                var id = parseInt(match[0]);
                
                // Find product by id
                var p = null;
                if (typeof products !== 'undefined') {
                    for (var j=0; j<products.length; j++) {
                        if (products[j].id == id) { p = products[j]; break; }
                    }
                }
                
                // If this product got a discount, update its price display on the card
                if (p && p.originalPrice) {
                    var priceSpan = card.querySelector('.price');
                    if (priceSpan) {
                        priceSpan.innerHTML = '<del style="color:#999; font-size:0.85em; margin-right:6px;">PKR ' + p.originalPrice + '</del>PKR ' + p.price;
                        priceSpan.style.color = '#e74c3c';
                        priceSpan.style.fontWeight = 'bold';
                    }
                }
            }
        }
    }
}

// ── 12. RUN WHEN PAGE LOADS ──────────────────────────────────────
window.onload = function() {
    displayTodayOffer();
    populateProductDropdown();
    updateCartCount(); // Initialize cart count on load
    applyDynamicPrices(); // Mutate prices before applying tags
    applyDailyDealTags(); // Add Day Deal tags to all products
};