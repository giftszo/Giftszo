/* =========================================================
   GIFTSZO ECOMMERCE - COMPLETE FIXED JAVASCRIPT
   =========================================================
   Features:
   - Admin login
   - Product manager
   - Multiple product images (up to 5)
   - 5 MB maximum per image
   - Product image gallery
   - Category manager
   - Stock management
   - Search
   - Sorting
   - Shopping cart
   - Add to cart / Buy Now currently disabled
   - LocalStorage persistence
   ========================================================= */


/* =========================================================
   01. DEFAULT PRODUCTS
   ========================================================= */

function makePlaceholderImage(title, number) {

    const safeTitle = String(title || "GIFTSZO")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="900"
             height="675"
             viewBox="0 0 900 675">

            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#160820"/>
                    <stop offset="55%" stop-color="#4b1d72"/>
                    <stop offset="100%" stop-color="#10051c"/>
                </linearGradient>

                <radialGradient id="glow">
                    <stop offset="0%" stop-color="#d6a64a"
                          stop-opacity=".35"/>
                    <stop offset="100%" stop-color="#d6a64a"
                          stop-opacity="0"/>
                </radialGradient>
            </defs>

            <rect width="900"
                  height="675"
                  fill="url(#bg)"/>

            <circle cx="450"
                    cy="300"
                    r="250"
                    fill="url(#glow)"/>

            <circle cx="450"
                    cy="300"
                    r="150"
                    fill="none"
                    stroke="#d6a64a"
                    stroke-width="3"/>

            <circle cx="450"
                    cy="300"
                    r="125"
                    fill="none"
                    stroke="#f2d083"
                    stroke-opacity=".35"
                    stroke-width="1"/>

            <text x="450"
                  y="280"
                  text-anchor="middle"
                  fill="#f2d083"
                  font-family="Georgia,serif"
                  font-size="55"
                  font-weight="bold">
                GZ
            </text>

            <text x="450"
                  y="345"
                  text-anchor="middle"
                  fill="#ffffff"
                  font-family="Arial,sans-serif"
                  font-size="22">
                ${safeTitle}
            </text>

            <text x="450"
                  y="390"
                  text-anchor="middle"
                  fill="#d6a64a"
                  font-family="Arial,sans-serif"
                  font-size="14"
                  letter-spacing="4">
                GIFTSZO
            </text>
        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


const DEFAULT_PRODUCTS = [

    {
        id: "gz-001",
        name: "Royal Celebration Hamper",
        price: 1499,
        category: "Celebration",
        stock: 10,
        description:
            "A beautifully curated premium hamper for birthdays and celebrations.",
        image: makePlaceholderImage(
            "Royal Celebration Hamper",
            1
        )
    },

    {
        id: "gz-002",
        name: "Elegant Wedding Gift",
        price: 1999,
        category: "Wedding",
        stock: 8,
        description:
            "An elegant gift collection designed for weddings and special occasions.",
        image: makePlaceholderImage(
            "Elegant Wedding Gift",
            2
        )
    },

    {
        id: "gz-003",
        name: "Executive Gift Box",
        price: 2499,
        category: "Corporate",
        stock: 5,
        description:
            "Premium corporate gifting solution for clients and business partners.",
        image: makePlaceholderImage(
            "Executive Gift Box",
            3
        )
    },

    {
        id: "gz-004",
        name: "Premium Birthday Box",
        price: 1299,
        category: "Celebration",
        stock: 12,
        description:
            "A stylish birthday gift box prepared with premium presentation.",
        image: makePlaceholderImage(
            "Premium Birthday Box",
            4
        )
    },

    {
        id: "gz-005",
        name: "Royal Wedding Hamper",
        price: 2999,
        category: "Wedding",
        stock: 6,
        description:
            "A luxurious hamper for wedding celebrations and festive gifting.",
        image: makePlaceholderImage(
            "Royal Wedding Hamper",
            5
        )
    },

    {
        id: "gz-006",
        name: "Corporate Luxury Hamper",
        price: 3499,
        category: "Corporate",
        stock: 4,
        description:
            "A sophisticated corporate hamper for premium business gifting.",
        image: makePlaceholderImage(
            "Corporate Luxury Hamper",
            6
        )
    }

];


/* =========================================================
   02. ADMIN CREDENTIALS
   ========================================================= */

const ADMIN_EMAIL = "madhu0099@gmail.com";
const ADMIN_PASSWORD = "admin123";


/* =========================================================
   03. DOM HELPERS
   ========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector =>
    Array.from(document.querySelectorAll(selector));


function money(value) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);
}


/* =========================================================
   04. PRODUCT NORMALIZATION
   ========================================================= */

function normalizeProduct(product) {

    const fallbackImage = product?.image || "";

    let images = [];

    if (Array.isArray(product?.images)) {

        images = product.images.filter(Boolean);

    } else if (fallbackImage) {

        images = [fallbackImage];

    }

    if (!images.length) {

        images = [
            makePlaceholderImage(
                product?.name || "GIFTSZO",
                0
            )
        ];
    }

    return {

        ...product,

        id: product?.id ||
            "gz-" + Date.now() + "-" + Math.random()
                .toString(36)
                .slice(2, 8),

        name: product?.name || "GIFTSZO Product",

        price: Number(product?.price) || 0,

        category: product?.category || "General",

        stock: Math.max(
            0,
            Number(product?.stock) || 0
        ),

        description: product?.description || "",

        images: images,

        image: images[0]

    };
}


/* =========================================================
   05. PRODUCT STORAGE
   ========================================================= */

function loadProducts() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "giftszoProducts"
                ) || "null"
            );

        if (Array.isArray(saved)) {

            return saved.map(normalizeProduct);
        }

    } catch (error) {

        console.error(
            "Unable to load products:",
            error
        );
    }

    return DEFAULT_PRODUCTS.map(normalizeProduct);
}


function saveProducts() {
    console.warn("Manual catalog is read-only. Edit products.json and redeploy.");
    return false;
}


/* =========================================================
   06. CATEGORY STORAGE
   ========================================================= */

const DEFAULT_CATEGORIES = [
    "Celebration",
    "Wedding",
    "Corporate"
];


function loadCategories() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "giftszoCategories"
                ) || "null"
            );

        if (
            Array.isArray(saved) &&
            saved.length
        ) {

            return saved
                .map(String)
                .map(value => value.trim())
                .filter(Boolean);

        }

    } catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );
    }

    return [...DEFAULT_CATEGORIES];
}


function saveCategories() {

    try {

        localStorage.setItem(
            "giftszoCategories",
            JSON.stringify(
                managedCategories
            )
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save categories:",
            error
        );

        showToast(
            "Unable to save categories."
        );

        return false;
    }
}


/* =========================================================
   07. APPLICATION STATE
   ========================================================= */

let products = DEFAULT_PRODUCTS.map(normalizeProduct);

let managedCategories =
    [...DEFAULT_CATEGORIES];

let activeCategory = "All";

let cart = [];

let currentUser = null;

try {

    cart = JSON.parse(
        localStorage.getItem(
            "giftszoCart"
        ) || "[]"
    );

    if (!Array.isArray(cart)) {
        cart = [];
    }

} catch {

    cart = [];
}


try {

    currentUser = JSON.parse(
        localStorage.getItem(
            "giftszoUser"
        ) || "null"
    );

} catch {

    currentUser = null;
}


/* =========================================================
   08. CART STORAGE
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "giftszoCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Unable to save cart:",
            error
        );
    }
}


function getProduct(productId) {

    return products.find(
        product => product.id === productId
    );
}


/* =========================================================
   09. MOBILE NAVIGATION
   ========================================================= */

function initMobileMenu() {

    const menu = $("#menu");
    const nav = $("#nav");

    if (!menu || !nav) return;

    menu.addEventListener(
        "click",
        () => {

            nav.classList.toggle("open");

        }
    );

    $$("#nav a").forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove(
                    "open"
                );

            }
        );

    });
}


/* =========================================================
   10. REVEAL ANIMATION
   ========================================================= */

function initRevealAnimation() {

    const elements =
        $$(".reveal");

    if (!elements.length) {
        return;
    }

    /*
       IMPORTANT:
       We first make everything visible.
       Therefore homepage text cannot disappear
       if JavaScript animation fails.
    */

    elements.forEach(
        element => {

            element.classList.remove(
                "animate"
            );

            element.classList.add(
                "visible"
            );

        }
    );

    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    elements.forEach(
        element => {

            element.classList.add(
                "animate"
            );

            element.classList.remove(
                "visible"
            );

        }
    );

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.08
            }
        );

    elements.forEach(
        element =>
            observer.observe(element)
    );
}


/* =========================================================
   11. FOOTER YEAR
   ========================================================= */

function updateYear() {

    const year = $("#year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }
}


/* =========================================================
   12. CATEGORY DATA
   ========================================================= */

function getAllCategories() {

    const categories = [
        ...managedCategories
    ];

    products.forEach(product => {

        if (
            product.category &&
            !categories.includes(
                product.category
            )
        ) {

            categories.push(
                product.category
            );

        }

    });

    return categories;
}


/* =========================================================
   13. ADMIN CATEGORY LIST
   ========================================================= */

function renderAdminCategories() {

    const container =
        $("#adminCategoryList");

    if (!container) return;

    const categories =
        getAllCategories();

    if (!categories.length) {

        container.innerHTML =
            `<p class="seller-note">
                No categories available.
            </p>`;

        return;
    }

    container.innerHTML =
        categories.map(
            category => {

                const used =
                    products.some(
                        product =>
                            product.category ===
                            category
                    );

                return `
                    <div class="admin-category-item">

                        <span>
                            ${escapeHtml(category)}
                        </span>

                        <button
                            type="button"
                            class="category-delete-btn"
                            data-delete-category="${escapeHtml(category)}"
                            ${used ? "disabled" : ""}
                            title="${used ? "Products are assigned to this category" : "Delete category"}"
                        >
                            DELETE
                        </button>

                    </div>
                `;

            }
        ).join("");
}


/* =========================================================
   14. CATEGORY SELECT
   ========================================================= */

function renderCategorySelect() {

    const select =
        $("#productCategory");

    if (!select) return;

    const categories =
        getAllCategories();

    const currentValue =
        select.value;

    select.innerHTML =
        categories.map(
            category => `
                <option value="${escapeHtml(category)}">
                    ${escapeHtml(category)}
                </option>
            `
        ).join("");

    if (
        currentValue &&
        categories.includes(
            currentValue
        )
    ) {

        select.value =
            currentValue;

    }
}


/* =========================================================
   15. CATEGORY CHIPS
   ========================================================= */

function renderCategories() {

    const container =
        $("#categoryChips");

    if (!container) return;

    const categories = [
        "All",
        ...getAllCategories()
    ];

    container.innerHTML =
        categories.map(
            category => `
                <button
                    type="button"
                    class="category-chip ${
                        activeCategory === category
                            ? "active"
                            : ""
                    }"
                    data-category="${escapeHtml(category)}"
                >
                    ${escapeHtml(category)}
                </button>
            `
        ).join("");

    $$(".category-chip").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        button.dataset.category ||
                        "All";

                    renderCategories();
                    renderProducts();

                }
            );

        }
    );

    renderCategorySelect();
    renderAdminCategories();
}


/* =========================================================
   16. FILTER AND SORT
   ========================================================= */

function getVisibleProducts() {

    let result = [
        ...products
    ];

    if (
        activeCategory !== "All"
    ) {

        result =
            result.filter(
                product =>
                    product.category ===
                    activeCategory
            );

    }

    const sortValue =
        $("#sortProducts")?.value ||
        "featured";

    if (
        sortValue === "price-low"
    ) {

        result.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    } else if (
        sortValue === "price-high"
    ) {

        result.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    } else if (
        sortValue === "name"
    ) {

        result.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );
    }

    return result;
}


/* =========================================================
   17. PRODUCT CARD
   ========================================================= */

function productCard(product) {

    const normalized =
        normalizeProduct(product);

    const images =
        normalized.images;

    const firstImage =
        images[0];

    const outOfStock =
        Number(normalized.stock) <= 0;

    const galleryControls =
        images.length > 1
            ? `
                <button
                    type="button"
                    class="gallery-arrow gallery-prev"
                    data-gallery-prev="${escapeHtml(normalized.id)}"
                    aria-label="Previous image"
                >
                    ‹
                </button>

                <button
                    type="button"
                    class="gallery-arrow gallery-next"
                    data-gallery-next="${escapeHtml(normalized.id)}"
                    aria-label="Next image"
                >
                    ›
                </button>

                <span
                    class="gallery-indicator"
                    data-gallery-indicator="${escapeHtml(normalized.id)}"
                >
                    1 / ${images.length}
                </span>
            `
            : "";

    /*
       ADD TO CART and BUY NOW are intentionally disabled.
       Change PRODUCT_PURCHASING_ENABLED to true near the
       bottom of this file when you want to enable them.
    */

    const purchasingDisabled =
        !PRODUCT_PURCHASING_ENABLED ||
        outOfStock;

    return `

        <article
            class="product-card"
            data-product-id="${escapeHtml(normalized.id)}"
        >

            <div class="product-image-wrap">

                <img
                    class="product-image"
                    data-product-image="${escapeHtml(normalized.id)}"
                    src="${firstImage}"
                    alt="${escapeHtml(normalized.name)}"
                    loading="eager"
                    decoding="async"
                >

                ${galleryControls}

                ${
                    outOfStock
                        ? `
                            <div class="out-of-stock-badge">
                                OUT OF STOCK
                            </div>
                        `
                        : ""
                }

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${escapeHtml(
                        normalized.category
                    )}
                </div>

                <h3>
                    ${escapeHtml(
                        normalized.name
                    )}
                </h3>

                <p class="product-description">
                    ${escapeHtml(
                        normalized.description
                    )}
                </p>


                <div class="product-bottom">

                    <strong>
                        ${money(
                            normalized.price
                        )}
                    </strong>

                    <span class="${
                        outOfStock
                            ? "out-of-stock-text"
                            : ""
                    }">

                        ${
                            outOfStock
                                ? "OUT OF STOCK"
                                : `${normalized.stock} in stock`
                        }

                    </span>

                </div>


                <div class="product-actions">

                    <button
                        type="button"
                        class="royal-btn add-cart-btn"
                        data-add-cart="${escapeHtml(normalized.id)}"
                        ${purchasingDisabled ? "disabled" : ""}
                    >
                        ADD TO CART
                    </button>

                    <button
                        type="button"
                        class="icon-action buy-now-btn"
                        data-buy-now="${escapeHtml(normalized.id)}"
                        ${purchasingDisabled ? "disabled" : ""}
                        title="Buy Now"
                    >
                        BUY NOW
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   18. RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        $("#productGrid");

    if (!grid) return;

    const visible =
        getVisibleProducts();

    if (!visible.length) {

        grid.innerHTML = `
            <div class="empty-state">
                No products found in this category.
            </div>
        `;

        return;
    }

    grid.innerHTML =
        visible.map(
            product =>
                productCard(product)
        ).join("");

    bindProductActions();
}


/* =========================================================
   19. PRODUCT GALLERY
   ========================================================= */

function changeProductImage(
    productId,
    direction
) {

    const product =
        getProduct(productId);

    if (!product) return;

    const normalized =
        normalizeProduct(product);

    const images =
        normalized.images;

    if (images.length <= 1) {
        return;
    }

    const imageElement =
        document.querySelector(
            `[data-product-image="${cssEscape(productId)}"]`
        );

    const indicator =
        document.querySelector(
            `[data-gallery-indicator="${cssEscape(productId)}"]`
        );

    if (!imageElement) {
        return;
    }

    let currentIndex =
        Number(
            imageElement.dataset.imageIndex || 0
        );

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex =
            images.length - 1;
    }

    if (
        currentIndex >=
        images.length
    ) {
        currentIndex = 0;
    }

    imageElement.src =
        images[currentIndex];

    imageElement.dataset.imageIndex =
        String(currentIndex);

    if (indicator) {

        indicator.textContent =
            `${currentIndex + 1} / ${images.length}`;

    }
}


/* =========================================================
   20. PRODUCT ACTIONS
   ========================================================= */

function bindProductActions() {

    $$("[data-gallery-prev]").forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    changeProductImage(
                        button.dataset.galleryPrev,
                        -1
                    );

                }
            );

        }
    );


    $$("[data-gallery-next]").forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    changeProductImage(
                        button.dataset.galleryNext,
                        1
                    );

                }
            );

        }
    );


    $$("[data-add-cart]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    /*
                       Purchasing is currently disabled.
                    */

                    if (
                        !PRODUCT_PURCHASING_ENABLED
                    ) {

                        showToast(
                            "Shopping is currently disabled."
                        );

                        return;
                    }

                    addToCart(
                        button.dataset.addCart
                    );

                }
            );

        }
    );


    $$("[data-buy-now]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    /*
                       Purchasing is currently disabled.
                    */

                    if (
                        !PRODUCT_PURCHASING_ENABLED
                    ) {

                        showToast(
                            "Buying is currently disabled."
                        );

                        return;
                    }

                    buyNow(
                        button.dataset.buyNow
                    );

                }
            );

        }
    );
}


/* =========================================================
   21. SORT PRODUCTS
   ========================================================= */

function initSorting() {

    const select =
        $("#sortProducts");

    if (!select) return;

    select.addEventListener(
        "change",
        renderProducts
    );
}


/* =========================================================
   22. ADD TO CART
   ========================================================= */

function addToCart(productId) {

    const product =
        getProduct(productId);

    if (!product) return;

    if (
        Number(product.stock) <= 0
    ) {

        showToast(
            "This product is out of stock."
        );

        return;
    }

    const existing =
        cart.find(
            item =>
                item.productId === productId
        );

    if (existing) {

        if (
            existing.quantity >=
            Number(product.stock)
        ) {

            showToast(
                "Maximum available stock reached."
            );

            return;
        }

        existing.quantity += 1;

    } else {

        cart.push({
            productId: productId,
            quantity: 1
        });

    }

    saveCart();
    renderCart();

    showToast(
        "Product added to cart."
    );
}


/* =========================================================
   23. BUY NOW
   ========================================================= */

function buyNow(productId) {

    if (
        !PRODUCT_PURCHASING_ENABLED
    ) {

        showToast(
            "Buying is currently disabled."
        );

        return;
    }

    addToCart(productId);
    openCart();
}


/* =========================================================
   24. CART RENDER
   ========================================================= */

function renderCart() {

    const container =
        $("#cartItems");

    const totalElement =
        $("#cartTotal");

    if (!container) return;

    cart =
        cart.filter(
            item =>
                getProduct(
                    item.productId
                )
        );

    if (!cart.length) {

        container.innerHTML = `
            <div class="empty-cart">

                <span>♢</span>

                <p>
                    Your cart is empty.
                </p>

            </div>
        `;

        if (totalElement) {
            totalElement.textContent =
                money(0);
        }

        return;
    }

    let total = 0;

    container.innerHTML =
        cart.map(item => {

            const product =
                normalizeProduct(
                    getProduct(
                        item.productId
                    )
                );

            const quantity =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );

            total +=
                product.price *
                quantity;

            return `
                <div
                    class="cart-item"
                    data-cart-product="${escapeHtml(product.id)}"
                >

                    <img
                        src="${product.images[0]}"
                        alt="${escapeHtml(product.name)}"
                        loading="lazy"
                        decoding="async"
                    >

                    <div>

                        <h4>
                            ${escapeHtml(product.name)}
                        </h4>

                        <p>
                            ${money(product.price)}
                        </p>

                        <div class="qty-control">

                            <button
                                type="button"
                                data-cart-minus="${escapeHtml(product.id)}"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-plus="${escapeHtml(product.id)}"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        type="button"
                        class="remove-cart"
                        data-cart-remove="${escapeHtml(product.id)}"
                        aria-label="Remove item"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");

    if (totalElement) {

        totalElement.textContent =
            money(total);

    }

    bindCartActions();
}


/* =========================================================
   25. CART ACTIONS
   ========================================================= */

function bindCartActions() {

    $$("[data-cart-minus]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    changeCartQuantity(
                        button.dataset.cartMinus,
                        -1
                    );

                }
            );

        }
    );


    $$("[data-cart-plus]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    changeCartQuantity(
                        button.dataset.cartPlus,
                        1
                    );

                }
            );

        }
    );


    $$("[data-cart-remove]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        button.dataset.cartRemove
                    );

                }
            );

        }
    );
}


/* =========================================================
   26. CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            entry =>
                entry.productId === productId
        );

    const product =
        getProduct(productId);

    if (!item || !product) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                entry =>
                    entry.productId !==
                    productId
            );

    } else if (
        item.quantity >
        Number(product.stock)
    ) {

        item.quantity =
            Number(product.stock);

        showToast(
            "Maximum available stock reached."
        );
    }

    saveCart();
    renderCart();
}


/* =========================================================
   27. REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.productId !== productId
        );

    saveCart();
    renderCart();

    showToast(
        "Product removed from cart."
    );
}


/* =========================================================
   28. CART OPEN / CLOSE
   ========================================================= */

function openCart() {

    const drawer =
        $("#cartDrawer");

    const backdrop =
        $("#cartBackdrop");

    if (drawer) {

        drawer.classList.add(
            "open"
        );

        drawer.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    if (backdrop) {

        backdrop.classList.add(
            "active"
        );
    }
}


function closeCart() {

    const drawer =
        $("#cartDrawer");

    const backdrop =
        $("#cartBackdrop");

    if (drawer) {

        drawer.classList.remove(
            "open"
        );

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (backdrop) {

        backdrop.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   29. CART INITIALIZATION
   ========================================================= */

function initCart() {

    const closeButton =
        $("#closeCart");

    const backdrop =
        $("#cartBackdrop");

    const checkout =
        $("#checkoutBtn");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCart
        );
    }

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeCart
        );
    }

    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                if (!cart.length) {

                    showToast(
                        "Your cart is empty."
                    );

                    return;
                }

                showToast(
                    "Checkout is disabled in this local demo."
                );

            }
        );
    }
}


/* =========================================================
   30. SEARCH POPUP
   ========================================================= */

function openSearchPopup() {

    const popup =
        $("#searchPopup");

    if (!popup) return;

    popup.classList.add(
        "active"
    );

    const input =
        $("#websiteSearch");

    if (input) {

        setTimeout(
            () => input.focus(),
            100
        );
    }
}


function closePopup(id) {

    const popup =
        document.getElementById(id);

    if (!popup) return;

    popup.classList.remove(
        "active"
    );
}


/* =========================================================
   31. SEARCH
   ========================================================= */

function searchProducts(query) {

    const text =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!text) {

        return products;
    }

    return products.filter(
        product => {

            const searchable = [

                product.name,

                product.category,

                product.description

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(
                text
            );
        }
    );
}


function renderSearchResults(
    query
) {

    const container =
        $("#searchResults");

    if (!container) return;

    const results =
        searchProducts(query);

    if (!query.trim()) {

        container.innerHTML =
            `<p class="search-message">
                Search for a gift, hamper,
                wedding gift or corporate gift.
            </p>`;

        return;
    }

    if (!results.length) {

        container.innerHTML =
            `<p class="search-message">
                No products found.
            </p>`;

        return;
    }

    container.innerHTML =
        results.map(
            product => `

                <button
                    type="button"
                    class="product-search-result category-chip"
                    data-search-product="${escapeHtml(product.id)}"
                >

                    ${escapeHtml(product.name)}

                    <small>
                        ${money(product.price)}
                    </small>

                </button>

            `
        ).join("");


    $$("[data-search-product]")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.searchProduct;

                        closePopup(
                            "searchPopup"
                        );

                        const card =
                            document.querySelector(
                                `[data-product-id="${cssEscape(id)}"]`
                            );

                        if (card) {

                            card.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                            card.classList.add(
                                "product-highlight"
                            );

                            setTimeout(
                                () =>
                                    card.classList.remove(
                                        "product-highlight"
                                    ),
                                1600
                            );

                        } else {

                            activeCategory =
                                "All";

                            renderCategories();
                            renderProducts();

                            setTimeout(
                                () => {

                                    const newCard =
                                        document.querySelector(
                                            `[data-product-id="${cssEscape(id)}"]`
                                        );

                                    if (newCard) {

                                        newCard.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center"
                                        });

                                    }

                                },
                                100
                            );
                        }

                    }
                );

            }
        );
}


/* =========================================================
   32. SEARCH INITIALIZATION
   ========================================================= */

function initSearch() {

    const searchButton =
        $("#searchBtn");

    const searchInput =
        $("#websiteSearch");

    const searchSubmit =
        $("#websiteSearchBtn");

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            openSearchPopup
        );
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () =>
                renderSearchResults(
                    searchInput.value
                )
        );

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    renderSearchResults(
                        searchInput.value
                    );

                }

            }
        );
    }

    if (searchSubmit) {

        searchSubmit.addEventListener(
            "click",
            () =>
                renderSearchResults(
                    searchInput?.value || ""
                )
        );
    }

    $$("[data-close]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    closePopup(
                        button.dataset.close
                    );

                }
            );

        }
    );

    $$(".popup-overlay").forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        overlay.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );
}


/* =========================================================
   33. ADMIN LOGIN
   ========================================================= */

function isAdminLoggedIn() {

    return Boolean(
        currentUser &&
        currentUser.role === "admin"
    );
}


function openAdminLogin() {

    const popup =
        $("#loginPopup");

    if (!popup) return;

    popup.classList.add(
        "active"
    );

    setTimeout(
        () =>
            $("#loginEmail")?.focus(),
        100
    );
}


function adminLogout() {

    currentUser = null;

    localStorage.removeItem(
        "giftszoUser"
    );

    updateAdminUI();

    showToast(
        "Admin logged out."
    );
}


/* =========================================================
   34. ADMIN LOGIN INITIALIZATION
   ========================================================= */

function initAdminLogin() {

    const button =
        $("#adminLoginBtn");

    const form =
        $("#loginForm");

    if (button) {

        button.addEventListener(
            "click",
            () => {

                if (isAdminLoggedIn()) {

                    adminLogout();

                } else {

                    openAdminLogin();

                }

            }
        );
    }


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const email =
                    $("#loginEmail")?.value
                        .trim()
                        .toLowerCase();

                const password =
                    $("#loginPassword")?.value;

                if (
                    email ===
                    ADMIN_EMAIL &&
                    password ===
                    ADMIN_PASSWORD
                ) {

                    currentUser = {
                        role: "admin",
                        email: ADMIN_EMAIL
                    };

                    localStorage.setItem(
                        "giftszoUser",
                        JSON.stringify(
                            currentUser
                        )
                    );

                    closePopup(
                        "loginPopup"
                    );

                    form.reset();

                    updateAdminUI();

                    showToast(
                        "Admin login successful."
                    );

                } else {

                    showToast(
                        "Invalid admin email or password."
                    );
                }

            }
        );
    }


    $$(".show-password").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        document.getElementById(
                            button.dataset.password
                        );

                    if (!target) return;

                    if (
                        target.type ===
                        "password"
                    ) {

                        target.type =
                            "text";

                        button.textContent =
                            "HIDE";

                    } else {

                        target.type =
                            "password";

                        button.textContent =
                            "SHOW";
                    }

                }
            );

        }
    );
}


/* =========================================================
   35. ADMIN UI
   ========================================================= */

function updateAdminUI() {

    const panel =
        $("#adminPanel");

    const loginButton =
        $("#adminLoginBtn");

    if (isAdminLoggedIn()) {

        if (panel) {

            panel.hidden = false;

        }

        if (loginButton) {

            loginButton.textContent =
                "ADMIN LOGOUT";

        }

        renderAdminProducts();
        renderAdminCategories();

    } else {

        if (panel) {

            panel.hidden = true;

        }

        if (loginButton) {

            loginButton.textContent =
                "ADMIN LOGIN";

        }
    }
}


/* =========================================================
   36. ADMIN PRODUCT LIST
   ========================================================= */

function renderAdminProducts() {

    const container =
        $("#adminProductList");

    if (!container) return;

    if (!isAdminLoggedIn()) {

        container.innerHTML = "";

        return;
    }

    if (!products.length) {

        container.innerHTML = `
            <div class="admin-inventory">
                <p class="seller-note">
                    No products available.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = `

        <div class="admin-inventory">

            <div class="admin-inventory-head">

                <div>
                    <p class="eyebrow">
                        ADMIN INVENTORY
                    </p>

                    <h3>
                        Manage products
                    </h3>
                </div>

            </div>


            ${products.map(
                product => {

                    const normalized =
                        normalizeProduct(
                            product
                        );

                    return `

                        <div
                            class="admin-product-row"
                            data-admin-product="${escapeHtml(normalized.id)}"
                        >

                            <div class="admin-product-main">

                                <img
                                    src="${normalized.images[0]}"
                                    alt="${escapeHtml(normalized.name)}"
                                    loading="lazy"
                                    decoding="async"
                                >

                                <div>

                                    <strong>
                                        ${escapeHtml(normalized.name)}
                                    </strong>

                                    <small>
                                        ${escapeHtml(normalized.category)}
                                    </small>

                                    <small>
                                        ${normalized.images.length}
                                        image${normalized.images.length > 1 ? "s" : ""}
                                    </small>

                                </div>

                            </div>


                            <div>
                                <strong>
                                    ${money(normalized.price)}
                                </strong>
                            </div>


                            <div>

                                <label
                                    class="admin-stock-label"
                                >
                                    STOCK

                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="${Number(normalized.stock)}"
                                        data-stock-input="${escapeHtml(normalized.id)}"
                                    >

                                </label>

                            </div>


                            <div>

                                <button
                                    type="button"
                                    class="admin-delete-btn"
                                    data-delete-product="${escapeHtml(normalized.id)}"
                                >
                                    DELETE
                                </button>

                            </div>

                        </div>

                    `;
                }
            ).join("")}

        </div>
    `;

    bindAdminProductActions();
}


/* =========================================================
   37. ADMIN PRODUCT ACTIONS
   ========================================================= */

function bindAdminProductActions() {

    $$("[data-stock-input]").forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    const product =
                        getProduct(
                            input.dataset.stockInput
                        );

                    if (!product) return;

                    const value =
                        Math.max(
                            0,
                            Number(
                                input.value
                            ) || 0
                        );

                    product.stock =
                        value;

                    saveProducts();

                    renderProducts();
                    renderAdminProducts();

                    showToast(
                        "Stock updated."
                    );
                }
            );

        }
    );


    $$("[data-delete-product]")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.deleteProduct;

                        const product =
                            getProduct(id);

                        if (!product) {
                            return;
                        }

                        const confirmed =
                            confirm(
                                `Delete "${product.name}"?`
                            );

                        if (!confirmed) {
                            return;
                        }

                        products =
                            products.filter(
                                item =>
                                    item.id !== id
                            );

                        cart =
                            cart.filter(
                                item =>
                                    item.productId !== id
                            );

                        saveProducts();
                        saveCart();

                        renderCategories();
                        renderProducts();
                        renderAdminProducts();
                        renderCart();

                        showToast(
                            "Product deleted."
                        );

                    }
                );

            }
        );
}


/* =========================================================
   38. ADD CATEGORY
   ========================================================= */

function initCategoryManager() {

    const button =
        $("#addCategoryBtn");

    const input =
        $("#newCategoryName");

    if (button) {

        button.addEventListener(
            "click",
            addCategory
        );
    }

    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();
                    addCategory();

                }

            }
        );
    }

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-delete-category]"
                );

            if (!button) return;

            deleteCategory(
                button.dataset.deleteCategory
            );

        }
    );
}


function addCategory() {

    if (!isAdminLoggedIn()) {

        showToast(
            "Admin login required."
        );

        return;
    }

    const input =
        $("#newCategoryName");

    if (!input) return;

    const name =
        input.value.trim();

    if (!name) {

        showToast(
            "Enter a category name."
        );

        return;
    }

    if (
        name.length > 40
    ) {

        showToast(
            "Category name is too long."
        );

        return;
    }

    const exists =
        getAllCategories().some(
            category =>
                category.toLowerCase() ===
                name.toLowerCase()
        );

    if (exists) {

        showToast(
            "This category already exists."
        );

        return;
    }

    managedCategories.push(
        name
    );

    saveCategories();

    input.value = "";

    renderCategories();

    showToast(
        "Category added."
    );
}


/* =========================================================
   39. DELETE CATEGORY
   ========================================================= */

function deleteCategory(
    category
) {

    if (!isAdminLoggedIn()) {

        showToast(
            "Admin login required."
        );

        return;
    }

    const used =
        products.some(
            product =>
                product.category ===
                category
        );

    if (used) {

        showToast(
            "This category has products assigned to it."
        );

        return;
    }

    managedCategories =
        managedCategories.filter(
            item =>
                item !== category
        );

    saveCategories();

    if (
        activeCategory === category
    ) {

        activeCategory = "All";

    }

    renderCategories();

    showToast(
        "Category deleted."
    );
}


/* =========================================================
   40. COLLECTION CATEGORY LINKS
   ========================================================= */

function initCollectionLinks() {

    $$("[data-category-link]")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        const category =
                            link.dataset.categoryLink;

                        if (
                            getAllCategories()
                                .includes(category)
                        ) {

                            activeCategory =
                                category;

                            renderCategories();
                            renderProducts();

                        } else {

                            activeCategory =
                                "All";

                            renderCategories();
                            renderProducts();

                        }

                    }
                );

            }
        );
}


/* =========================================================
   41. MULTIPLE IMAGE PREVIEW
   ========================================================= */

function initImageUpload() {

    const input =
        $("#productImage");

    if (!input) return;

    input.addEventListener(
        "change",
        async () => {

            const files =
                Array.from(
                    input.files || []
                );

            const preview =
                $("#uploadPreview");

            if (!preview) return;


            if (!files.length) {

                preview.innerHTML =
                    "Your uploaded product preview will appear here.";

                return;
            }


            /* Maximum 5 images */

            if (
                files.length > 5
            ) {

                input.value = "";

                preview.innerHTML = `
                    <p style="
                        color:#d40000;
                        font-weight:700;
                        text-align:center;
                    ">
                        Please select a maximum of 5 images.
                    </p>
                `;

                showToast(
                    "Maximum 5 images allowed."
                );

                return;
            }


            /* Check every image */

            for (
                const file of files
            ) {

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    input.value = "";

                    preview.innerHTML = `
                        <p style="
                            color:#d40000;
                            font-weight:700;
                            text-align:center;
                        ">
                            ${escapeHtml(file.name)}
                            is larger than 5 MB.
                        </p>
                    `;

                    showToast(
                        `${file.name} is larger than 5 MB.`
                    );

                    return;
                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    input.value = "";

                    showToast(
                        "Only image files are allowed."
                    );

                    return;
                }
            }


            /* Preview layout */

            preview.innerHTML = `

                <div class="upload-preview-grid"></div>

                <div class="upload-preview-count">
                    ${files.length}
                    image${files.length > 1 ? "s" : ""}
                    selected
                </div>

            `;


            const grid =
                preview.querySelector(
                    ".upload-preview-grid"
                );


            /* Display every selected image */

            for (
                const file of files
            ) {

                try {

                    const data =
                        await fileToDataUrl(
                            file
                        );

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "upload-preview-item";

                    item.innerHTML = `

                        <img
                            src="${data}"
                            alt="${escapeHtml(file.name)}"
                        >

                        <p>
                            ${escapeHtml(file.name)}
                        </p>

                    `;

                    grid.appendChild(
                        item
                    );

                } catch (error) {

                    console.error(
                        "Preview error:",
                        error
                    );

                }
            }

        }
    );
}


/* =========================================================
   42. ADD PRODUCT
   ========================================================= */

function initProductUpload() {

    const form =
        $("#productUploadForm");

    if (!form) return;

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!isAdminLoggedIn()) {

                showToast(
                    "Admin login required."
                );

                return;
            }


            const name =
                $("#productName")?.value
                    .trim();

            const price =
                Number(
                    $("#productPrice")?.value
                );

            const category =
                $("#productCategory")?.value
                    .trim();

            const stock =
                Number(
                    $("#productStock")?.value
                );

            const description =
                $("#productDescription")?.value
                    .trim();

            const input =
                $("#productImage");

            const files =
                Array.from(
                    input?.files || []
                );


            /* Validate product */

            if (!name) {

                showToast(
                    "Enter a product name."
                );

                return;
            }

            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                showToast(
                    "Enter a valid price."
                );

                return;
            }

            if (!category) {

                showToast(
                    "Select a category."
                );

                return;
            }

            if (
                !Number.isFinite(stock) ||
                stock < 0
            ) {

                showToast(
                    "Enter a valid stock quantity."
                );

                return;
            }


            /* Validate images */

            if (!files.length) {

                showToast(
                    "Please select at least one image."
                );

                return;
            }

            if (
                files.length > 5
            ) {

                showToast(
                    "Maximum 5 images allowed."
                );

                return;
            }


            for (
                const file of files
            ) {

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    showToast(
                        `${file.name} is larger than 5 MB.`
                    );

                    return;
                }

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showToast(
                        "Only image files are allowed."
                    );

                    return;
                }
            }


            /* Convert ALL images */

            let images;

            try {

                images =
                    await Promise.all(
                        files.map(
                            file =>
                                fileToDataUrl(
                                    file
                                )
                        )
                    );

            } catch (error) {

                console.error(
                    "Image conversion error:",
                    error
                );

                showToast(
                    "Unable to process the images."
                );

                return;
            }


            /* Create product */

            const newProduct =
                normalizeProduct({

                    id:
                        "gz-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .slice(2, 7),

                    name: name,

                    price: price,

                    category: category,

                    stock: stock,

                    description: description,

                    images: images,

                    image: images[0]

                });


            products.push(
                newProduct
            );


            /* Save */

            if (!saveProducts()) {

                /*
                   If localStorage is full,
                   remove the product again.
                */

                products =
                    products.filter(
                        product =>
                            product.id !==
                            newProduct.id
                    );

                return;
            }


            /* Reset form */

            form.reset();


            const preview =
                $("#uploadPreview");

            if (preview) {

                preview.innerHTML =
                    "Your uploaded product preview will appear here.";

            }


            /* Refresh UI */

            renderCategories();
            renderProducts();
            renderAdminProducts();


            showToast(
                `${name} added with ${images.length} image${images.length > 1 ? "s" : ""}.`
            );

        }
    );
}


/* =========================================================
   43. RESET DEMO PRODUCTS
   ========================================================= */

function initResetProducts() {

    const button =
        $("#resetProducts");

    if (!button) return;

    button.addEventListener(
        "click",
        () => {

            if (!isAdminLoggedIn()) {

                showToast(
                    "Admin login required."
                );

                return;
            }

            const confirmed =
                confirm(
                    "Reset all products to the default demo products?"
                );

            if (!confirmed) {
                return;
            }

            products =
                DEFAULT_PRODUCTS.map(
                    normalizeProduct
                );

            cart = [];

            saveProducts();
            saveCart();

            managedCategories =
                [...DEFAULT_CATEGORIES];

            saveCategories();

            activeCategory =
                "All";

            renderCategories();
            renderProducts();
            renderAdminProducts();
            renderCart();

            showToast(
                "Demo products restored."
            );
        }
    );
}


/* =========================================================
   44. FILE TO DATA URL
   ========================================================= */

function fileToDataUrl(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload =
                () => resolve(
                    reader.result
                );

            reader.onerror =
                () => reject(
                    reader.error
                );

            reader.readAsDataURL(
                file
            );

        }
    );
}


/* =========================================================
   45. CONTACT FORM
   ========================================================= */

function initContactForm() {

    const form =
        $("#form");

    const note =
        $("#note");

    if (!form) return;

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (note) {

                note.textContent =
                    "Thank you. Your enquiry has been received in this local demo.";

            }

            form.reset();

            showToast(
                "Enquiry submitted."
            );
        }
    );
}


/* =========================================================
   46. TOAST
   ========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        $("#toast");

    if (!toast) return;

    toast.textContent =
        String(message);

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   47. ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   48. CSS ESCAPE FALLBACK
   ========================================================= */

function cssEscape(value) {

    if (
        window.CSS &&
        typeof window.CSS.escape ===
            "function"
    ) {

        return window.CSS.escape(
            String(value)
        );
    }

    return String(value)
        .replace(
            /([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,
            "\\$1"
        );
}


/* =========================================================
   49. ADMIN PRODUCT SECTION VISIBILITY
   ========================================================= */

function initAdminNavigation() {

    const adminButton =
        $("#adminLoginBtn");

    if (!adminButton) return;

    /*
       The admin panel is hidden until
       the administrator logs in.
    */

    adminButton.addEventListener(
        "dblclick",
        () => {

            if (
                isAdminLoggedIn()
            ) {

                const panel =
                    $("#adminPanel");

                if (panel) {

                    panel.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        }
    );
}


/* =========================================================
   50. PRODUCT IMAGE DATA INDEX
   ========================================================= */

function initializeGalleryIndexes() {

    $$(".product-image").forEach(
        image => {

            image.dataset.imageIndex =
                "0";

        }
    );
}


/* =========================================================
   51. DISABLE / ENABLE SHOPPING
   ========================================================= */

/*
   CURRENT SETTING:

   false = ADD TO CART and BUY NOW disabled
   true  = ADD TO CART and BUY NOW enabled

   You asked to disable these buttons,
   so it is currently FALSE.
*/

const PRODUCT_PURCHASING_ENABLED = false;


/* =========================================================
   52. GLOBAL ESC KEY
   ========================================================= */

function initEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            closePopup(
                "searchPopup"
            );

            closePopup(
                "loginPopup"
            );

            closeCart();

        }
    );
}


/* =========================================================
   53. CLEAN OLD INVALID PRODUCTS
   ========================================================= */

function normalizeAllProducts() {

    products =
        products.map(
            normalizeProduct
        );

    try {

        localStorage.setItem(
            "giftszoProducts",
            JSON.stringify(products)
        );

    } catch (error) {

        console.warn(
            "Could not normalize products in storage.",
            error
        );
    }
}


/* =========================================================
   MANUAL CATALOG: products.json is the source of truth
   ========================================================= */
async function loadManualCatalog() {
    try {
        const response = await fetch("products.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load products.json");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("products.json must contain an array");
        products = data.map(item => normalizeProduct({
            ...item,
            stock: item.stock ?? item.stockQuantity ?? 0,
            images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : [])
        }));
        managedCategories = [...new Set(products.map(p => String(p.category || "General").trim()).filter(Boolean))];
    } catch (error) {
        console.error("Manual product catalog error:", error);
        products = [];
        managedCategories = [];
        const grid = document.querySelector("#productGrid");
        if (grid) grid.innerHTML = '<p class="empty-products">Products could not be loaded. Check products.json and run the site through a web server.</p>';
    }
}

function disableAdminFeatures() {
    ["#adminLoginBtn", "#seller-upload", "#loginPopup"].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => { el.style.display = "none"; });
    });
}

/* =========================================================
   54. INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadManualCatalog();
        disableAdminFeatures();


        /*
           Core UI
        */

        initMobileMenu();

        initRevealAnimation();

        updateYear();


        /*
           Categories
        */

        renderCategories();

        // Category management is manual: edit products.json.

        initCollectionLinks();


        /*
           Products
        */

        renderProducts();

        initSorting();


        /*
           Cart
        */

        renderCart();

        initCart();


        /*
           Search
        */

        initSearch();


        /*
           Admin
        */

        // Admin panel and login are intentionally disabled.


        /*
           Product upload
        */

        // Product upload/admin functions are intentionally disabled.


        /*
           Contact
        */

        initContactForm();


        /*
           Keyboard
        */

        initEscapeKey();


        /*
           Gallery
        */

        initializeGalleryIndexes();


        /*
           Final category refresh
        */

        renderCategories();

    }
);


/* =========================================================
   55. DEBUG INFORMATION
   ========================================================= */

console.log(
    "GIFTSZO script_6.js loaded successfully."
);

console.log(
    "Products:",
    products.length
);

console.log(
    "Admin:",
    isAdminLoggedIn()
);

console.log(
    "Multiple image upload: ENABLED"
);

console.log(
    "Maximum images per product: 5"
);

console.log(
    "Maximum image size: 5 MB each"
);

console.log(
    "Add to Cart / Buy Now:",
    PRODUCT_PURCHASING_ENABLED
        ? "ENABLED"
        : "DISABLED"
);
