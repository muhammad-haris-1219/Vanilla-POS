let signupFields = document.querySelectorAll('main input');
let signButton = document.querySelector('#signup');
let loginButton = document.querySelector('#login');
let registerLogoutButton = document.querySelector('#register')
let headerTag = document.querySelector('header');
let addItem = document.querySelector('#add-item');
let searchBar = document.querySelector('search input');
let loginEmail, loginPassword, loginAdmin, fieldExisting = true;

class userData {
    constructor(named, email, phone, address, password) {
        this.named = named;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.password = password;
    };
    // set password(value) {
    //     if (value.length < 6) throw new Error("Password must be at least 8 characters long");
    //     console.log(value);
    //     this._password = value;
    // }

    // get password() {
    //     return this._password;
    // }
};

class adminData extends userData {
    constructor(named, email, phone, address, password, adminKey) {
        super(...Array.from(signupFields).map(field => field.value));
        this.adminKey = adminKey;

    };
};

let createElement = () => {
    loginEmail = Object.assign(document.createElement('input'), {
        type: 'email', name: 'email', placeholder: 'Enter Your Registered Email', className: "form-control form-control-lg"
    });
    loginPassword = Object.assign(document.createElement('input'), {
        type: 'password', name: 'Password', placeholder: 'Enter Your Password', className: "form-control form-control-lg"
    });
    loginAdmin = Object.assign(document.createElement('input'), {
        type: 'password', name: 'Password', placeholder: 'For Only Admin', className: "form-control form-control-lg"
    });
    document.querySelector('#container header h2').innerText = "Login Account";
    document.querySelector('#container').firstElementChild.after(loginEmail, loginPassword, loginAdmin);
};

let randomItems = () => {
    document.querySelector('main').style.setProperty('display', 'none', 'important')
    fetch('https://api.escuelajs.co/api/v1/products')
        .then(response => response.json())
        .then(elements => {
            for (let item in elements) {
                let cleanImage = (elements[item].images && elements[item].images[0] ? elements[item].images[0] : 'https://placehold.co').replace(/^\["?|"?\]$/g, '');
                document.querySelector('#table-grid').insertAdjacentHTML('afterbegin', ` 
            <figure class="bg-white p-4 rounded-4 shadow-lg mb-0 position-relative" style="flex: 1 1 calc(33.333% - 1.5rem); min-width: 280px;" data-qty="0">
                <table class="table table-hover align-middle mb-0" style="table-layout: fixed; width: 100%;">
                    <tbody>
                        <tr>
                            <td colspan="2" class="p-0 text-center position-relative" style="overflow: hidden; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                                <img src="${cleanImage}" alt="image" class="img-fluid w-100" style="height: 200px; object-fit: cover; display: block;">
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-muted small pt-3 pb-1 text-center" style="word-wrap: break-word; white-space: normal;">
                               ${elements[item].description || 'No Details available'} 
                            </td>
                        </tr>
                        <tr class="small text-uppercase fw-bold text-secondary border-top text-center">
                            <td class="py-2 pt-2" style="width: 50%;">Item</td>
                            <td class="py-2 pt-2" style="width: 50%;">Price</td>
                        </tr>
                        <tr class="text-center">
                            <td class="text-muted" style="word-wrap: break-word; white-space: normal;">${elements[item].title || 'Unnamed Item'}</td>
                            <td class="fw-semibold text-dark">Rs. ${elements[item].price * Math.round(Math.random() * 10) || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </figure>`);
            };
        });
};

let gettingData = localStorage.getItem('data');
let dataStorage = gettingData ? JSON.parse(gettingData) : [];

signButton.addEventListener('click', (e) => {
    e.preventDefault();
    let recievingUserData = new userData(...[...signupFields].map(field => field.value));
    let recievingAdminData = new adminData(...[...signupFields].map(field => field.value), signupFields.length - 1);
    let recievingData = Object.values(recievingUserData).every(val => val && val.trim() !== "");
    if (recievingData) {
        dataStorage.push(signupFields[signupFields.length - 1]?.value.trim() ? recievingAdminData : recievingUserData);
        localStorage.setItem('data', JSON.stringify(dataStorage));
        Array.from(signupFields).forEach(field => { field.style.display = 'none'; field.value = '' });
        fieldExisting = false;
        createElement();
    } else { window.location.reload(true); };
});

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (fieldExisting) return Array.from(signupFields).forEach(val => val.style.display = 'none'), createElement(), fieldExisting = false;

    let userMatched = dataStorage.find(elementVal => elementVal.email == loginEmail.value && elementVal.password == loginPassword.value);
    if (userMatched) {
        registerLogoutButton.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
        let isAdmin = userMatched.adminKey == loginAdmin.value;
        addItem.disabled = !isAdmin;
        localStorage.setItem(isAdmin ? 'adminToken' : 'userToken', Math.round(Math.random() * 10000) + (isAdmin ? 'Admin' : 'User'));
        headerTag.style.pointerEvents = 'auto';
        document.querySelector('main').style.setProperty('display', 'none', 'important');

        renderCards();
    } else {
        document.querySelector('#container').insertAdjacentHTML('beforeend', `
                <dialog id="loginPopup" class="rounded-4 shadow-lg border-0" style="max-width: 400px; width: 90%; font-family: 'Poppins', sans-serif; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0; padding: 0;">
                    <article class="p-4 p-md-5 text-center bg-white rounded-4">
                        <header class="mb-3">
                            <h3 class="fw-bold" style="color: #483d8b;">Login Failed</h3>
                        </header>
                        <p class="text-secondary fs-6 mb-4">Invalid email or password. Please try again.</p>
                        <footer>
                            <button onclick="const d=document.getElementById('loginPopup'); d.close(); d.remove();" class="btn btn-lg w-100 fw-semibold custom-btn">Close</button>
                        </footer>
                    </article>
                </dialog>
            `);
        document.getElementById('loginPopup').showModal();


    };
    loginPassword.value = loginEmail.value = loginAdmin.value = '';
});

registerLogoutButton.addEventListener('click', () => {
    registerLogoutButton.innerHTML = '<i class="fa-solid fa-registered"></i>';
    document.querySelectorAll('main, #container').forEach(el => el.style.display = 'flex');
    headerTag.style.pointerEvents = 'none';
    registerLogoutButton.disabled = addItem.disabled = false;
    ['userToken', 'adminToken'].forEach(token => localStorage.removeItem(token));
    document.querySelector('#table-grid').innerHTML = '';
});

let itemList = { brandName: '', connect: '', item: '', price: '', image: '' };

addItem.addEventListener('click', (e) => {

    document.querySelector('header').insertAdjacentHTML('beforeend', `<dialog class="modal d-block border-0 bg-transparent" id="entryModal" aria-labelledby="entryModalLabel">
        <div class="modal-dialog modal-sm modal-dialog-centered">
        <article class="modal-content shadow-lg border-0 rounded-3">
        <header class="modal-header border-bottom-0 pt-3 px-3 pb-1">
                <h1 class="modal-title fw-bold fs-6 text-dark" id="entryModalLabel" style="font-family: 'Poppins', sans-serif;">Item Details</h1>
                </header>
                <section class="modal-body px-3 py-2" style="font-family: 'Poppins', sans-serif;">
                <div class="mb-2">
                <label for="brandName" class="form-label fw-semibold text-secondary x-small" style="font-size: 0.75rem;">Brand Name</label>
                <input type="text" class="form-control form-control-sm rounded-2 border-secondary-subtle" id="brandName" placeholder="Enter brand name" style="padding: 0.4rem 0.75rem;">
                </div>
                <div class="mb-2">
                <label for="connect" class="form-label fw-semibold text-secondary x-small" style="font-size: 0.75rem;">Connection</label>
                <input type="text" class="form-control form-control-sm rounded-2 border-secondary-subtle" id="connect" placeholder="Enter location/contact" style="padding: 0.4rem 0.75rem;">
                </div>
                <div class="mb-2">
                <label for="itemName" class="form-label fw-semibold text-secondary x-small" style="font-size: 0.75rem;">Item Name</label>
                <input type="text" class="form-control form-control-sm rounded-2 border-secondary-subtle" id="itemName" placeholder="Enter item name" style="padding: 0.4rem 0.75rem;">
                </div>
                <div class="mb-2">
                <label for="itemCost" class="form-label fw-semibold text-secondary x-small" style="font-size: 0.75rem;">Item Cost / Price</label>
                <input type="number" class="form-control form-control-sm rounded-2 border-secondary-subtle" id="itemCost" placeholder="Enter price" style="padding: 0.4rem 0.75rem;">
                </div>
                <div class="mb-2">
                <label for="itemImage" class="form-label fw-semibold text-secondary x-small" style="font-size: 0.75rem;">Item Image</label>
                <input type="file" class="form-control form-control-sm rounded-2 border-secondary-subtle" id="itemImage" accept="image/*" style="padding: 0.35rem 0.75rem;">
                </div>
                </section>
                <footer class="modal-footer border-top-0 pb-3 px-3 pt-1 gap-2">
                <button type="button" id ="close" class="btn btn-sm border-2 fw-semibold rounded-2 text-secondary border-secondary-subtle" style="height: 2.2rem; min-width: 4.5rem; background: transparent; transition: all 0.3s ease; font-size: 0.85rem;">Close</button>
                    <button type="button" id="item" class="btn btn-sm fw-semibold rounded-2 custom-btn" style="height: 2.2rem; min-width: 4.5rem; font-size: 0.85rem;">Entry</button>
                    </footer>
                    </article>
                    </div>
</dialog>`);

    document.querySelector('#itemImage').addEventListener('change', () => {
        let fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
            itemList[Object.keys(itemList)[4]] = fileReader.result;
        });
        fileReader.readAsDataURL(document.querySelector('#itemImage').files[0]);
    });

    document.querySelector('#item').addEventListener('click', () => {
        let entryFields = document.querySelectorAll('section input');
        entryFields.forEach((item, idx) => (idx < 4 && (itemList[Object.keys(itemList)[idx]] = item.value), item.value = ''));
        itemStorage.push(itemList);
        localStorage.setItem('items', JSON.stringify(itemStorage));
        itemList = { brandName: '', connect: '', item: '', price: '', image: 'image' };
    });

    document.querySelector('#close').addEventListener('click', () => {
        document.querySelector('#table-grid').innerHTML = '';
        itemStorage.forEach((list, index) => {
            document.querySelector('#table-grid').insertAdjacentHTML('beforeend', `
    <figure class="bg-white p-4 rounded-4 shadow-lg mb-0 position-relative" style="flex: 1 1 calc(33.333% - 1.5rem); min-width: 280px;">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr class="small text-uppercase fw-bold text-secondary">
                    <th scope="col" class="py-2">${list.brandName || 'Brand Name'}</th>
                    <th scope="col" class="py-2 text-end" style="padding-right: 1rem;">${list.connect || 'Connection'}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2" class="p-0 text-center position-relative">
                        <button type="button" class="btn position-absolute d-inline-flex align-items-center justify-content-center shadow-none" data-index="${index}"
                            style="top: -2.55rem; right: 0; z-index: 10; width: 0.8rem; height: 0.8rem; padding: 0; border: 1px solid transparent; border-radius: 2px; background: linear-gradient(135deg, #6a5acd, #483d8b); color: white; transition: all 0.3s ease;"
                            onmouseover="this.style.background='transparent'; this.style.color='#483d8b'; this.style.borderColor='#483d8b';"
                            onmouseout="this.style.background='linear-gradient(135deg, #6a5acd, #483d8b)'; this.style.color='white'; this.style.borderColor='transparent';">
                            <i class="fa-solid fa-xmark" style="font-size: 0.45rem;"></i>
                        </button>
                        <img src="${list.image == 'image' ? 'https://avatars.githubusercontent.com/u/96953467?v=4' : list.image}" alt="Restaurant Food Pic" class="img-fluid rounded-3"
                            style="height: 220px; object-fit: contain; width: 100%; background-color: #f8f9fa;">
                    </td>
                </tr>
                <tr class="small text-uppercase fw-bold text-secondary border-top text-center">
                    <td class="py-2 pt-3">Item</td>
                    <td class="py-2 pt-3">Price</td>
                </tr>
                <tr class="text-center">
                    <td class="text-muted">${list.item || 'Unnamed Item'}</td>
                    <td class="fw-semibold text-dark">Rs. ${list.price || '0'}</td>
                </tr>
            </tbody>
        </table>
    </figure>
`);
        });
        document.querySelector('#table-grid').addEventListener('click', (e) => e.target.closest('button[data-index]')?.closest('figure').remove());
        document.querySelector('#entryModal').remove();
    });
});

searchBar.addEventListener('input', () => document.querySelectorAll('#table-grid figure').forEach(card => card.style.display = card.textContent.toLowerCase().includes(searchBar.value.toLowerCase()) ? 'grid' : 'none'));

let itemStorage = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

let renderCards = () => {
    let grid = document.querySelector('#table-grid');
    grid.innerHTML = '';

    if (!document.querySelector('aside.container-fluid') && localStorage.getItem('userToken')) {
        grid.insertAdjacentHTML('beforeend', `
        <aside class="container-fluid px-0 px-md-4 main-layout-clearance">
            <div class="d-flex flex-nowrap align-items-stretch gap-2 gap-md-4 w-100">
                <figure class="mb-0" id="catalog-container-wrapper">
                    <div id="catalog-container" class="d-flex flex-wrap align-items-stretch gap-2 gap-md-4 row-gap-2 row-gap-md-4 w-100"></div>
                </figure>
                <div id="calculation-box-wrapper" class="align-self-stretch">
                    <fieldset id="calculation-box" class="card p-2 p-md-3 rounded-4 shadow-lg border-0 sticky-top bg-white">
                        <header class="border-bottom pb-2 mb-2 mb-md-3">
                            <h1 class="fw-bold text-dark mb-0 d-flex align-items-center" style="font-size: 0.75rem; max-width: 100%;">
                                <i class="fa-solid fa-calculator me-1 me-md-2 text-primary" style="color: #6a5acd !important;"></i>
                                <span class="d-none d-sm-inline">Calculation Box</span>
                                <span class="d-inline d-sm-none">Calc</span>
                            </h1>
                        </header>
                        <ul id="calc-items-list" class="list-unstyled mb-2 mb-md-3" style="max-height: 180px; overflow-y: auto;">
                            <li class="text-center py-3 text-muted calc-empty-msg">
                                <i class="fa-solid fa-basket-shopping fs-5 mb-1 opacity-50"></i>
                                <p class="small mb-0" style="font-size: 0.65rem;">No items selected yet.</p>
                            </li>
                        </ul>
                        <footer class="bg-light p-2 rounded-3 border">
                            <figure class="mb-0">
                                <div class="d-flex justify-content-between align-items-center text-secondary mb-1" style="font-size: 0.65rem;">
                                    <span class="fw-medium">Subtotal</span>
                                    <output id="calc-subtotal" class="fw-semibold text-dark" data-value="0">Rs. 0</output>
                                </div>
                                <div class="d-flex justify-content-between align-items-center text-secondary mb-2" style="font-size: 0.65rem;">
                                    <span class="fw-medium">Tax (5%)</span>
                                    <output id="calc-tax" class="fw-semibold text-dark" data-value="0">Rs. 0</output>
                                </div>
                            </figure>
                            <hr class="my-1 text-muted opacity-25">
                            <div class="d-flex justify-content-between align-items-center fw-bold text-dark pt-1" style="font-size: 0.7rem;">
                                <span>Total Amount</span>
                                <output id="calc-total" class="text-primary" style="color: #483d8b !important;" data-value="0">Rs. 0</output>
                            </div>
                        </footer>
                    </fieldset>
                </div>
            </div>
        </aside>`);
    }

    if (!document.getElementById('card-custom-styles')) {
        document.head.insertAdjacentHTML('beforeend', `
            <style id="card-custom-styles">
                .btn-purple-gradient { 
                    background: linear-gradient(135deg, #6a5acd, #483d8b); 
                    color: white; 
                    border: 1px solid transparent; 
                    transition: all 0.3s ease; }
                .btn-purple-gradient:hover { 
                    background: transparent !important; 
                    color: #483d8b !important; 
                    border-color: #483d8b !important;  }

                .main-layout-clearance {
                    margin-top: 2.5rem !important;
                }
                #catalog-container-wrapper {
                    width:66% !important;
                    flex: 0 0 66% !important;
                    max-width: 66% !important;
                }
                #calculation-box-wrapper {
                    width: 30% !important;
                    flex: 0 0 34% !important;
                    max-width: 34% !important;
                }
                #calculation-box.sticky-top {
                    position: -webkit-sticky !important;
                    position: sticky !important;
                    top: 125px !important;
                    z-index: 5;
                }
                
                .catalog-card {
                    flex: 1 1 100% !important;
                    max-width: 100% !important;
                }

                @media (max-width: 576px) {
                    .catalog-card {
                        padding: rem !important;
                    }
                    .catalog-card th, .catalog-card td {
                        font-size: 0.55rem !important;
                    }
                    .catalog-card .btn-sm {
                        font-size: 0.55rem !important;
                        padding: 0.25rem 0.3rem !important;
                    }
                }

                @media (min-width: 768px) {
                    .main-layout-clearance {
                        margin-top: -1rem !important;
                    }
                    #catalog-container-wrapper {
                        width: 75% !important;
                        flex: 0 0 75% !important;
                        max-width: 75% !important;
                    }
                    #calculation-box-wrapper {
                        width: 25% !important;
                        flex: 0 0 25% !important;
                        max-width: 25% !important;
                    }
                    #calculation-box.sticky-top {
                        top: 85px !important;
                    }
                    .catalog-card {
                        flex: 1 1 calc(50% - 1rem) !important;
                        max-width: calc(50% - 0.5rem) !important;
                    }
                }

                @media (min-width: 992px) {
                    .catalog-card {
                        flex: 1 1 calc(33.333% - 1.75rem) !important; 
                        max-width: calc(33.333% - 1rem) !important;
                    }
                    #table-grid:not(:has(#catalog-container)) .catalog-card {
                        flex: 1 1 calc(33.333% - 2rem) !important;
                        max-width: calc(33.333% - 1.5rem) !important;
                    }
                }
            </style> `);
    }

    let cardsContainer = document.querySelector('#catalog-container') || grid;

    itemStorage.forEach((list, index) => {
        let actionButtonsRow = localStorage.getItem('userToken') ? `
            <tr class="border-top">
                <td colspan="2" class="pt-2 pb-0">
                    <div class="d-flex gap-1 gap-md-2">
                        <button type="button" class="btn btn-sm flex-fill d-inline-flex align-items-center justify-content-center fw-bold text-uppercase btn-purple-gradient" style="font-size: 0.7rem; padding: 0.4rem 0.5rem; border-radius: 6px;" data-add-index="${index}">
                            <i class="fa-solid fa-basket-shopping me-1" style="font-size: 0.75rem;"></i> Add
                        </button>
                        <button type="button"  class="btn btn-sm btn-outline-danger flex-fill d-inline-flex align-items-center justify-content-center fw-bold text-uppercase" style="font-size: 0.7rem; padding: 0.4rem 0.5rem; border-radius: 6px; transition: all 0.3s ease;" data-remove-index="${index}">
                            <i class="fa-solid fa-trash-can me-1" style="font-size: 0.75rem;"></i> Remove
                        </button>
                    </div>
                </td>
            </tr>` : '';


        let deleteButtonHtml = localStorage.getItem('adminToken') ? `
            <button type="button" class="btn position-absolute d-inline-flex align-items-center justify-content-center shadow-none" data-index="${index}"
                style="top: -2.55rem; right: 0; z-index: 10; width: 0.8rem; height: 0.8rem; padding: 0; border: 1px solid transparent; border-radius: 2px; background: linear-gradient(135deg, #6a5acd, #483d8b); color: white; transition: all 0.3s ease;"
                onmouseover="this.style.background='transparent'; this.style.color='#483d8b'; this.style.borderColor='#483d8b';"
                onmouseout="this.style.background='linear-gradient(135deg, #6a5acd, #483d8b)'; this.style.color='white'; this.style.borderColor='transparent';">
                <i class="fa-solid fa-xmark" style="font-size: 0.45rem;"></i>
            </button>` : '';

        cardsContainer.insertAdjacentHTML('beforeend', `
        <figure class="bg-white p-4 rounded-4 shadow-lg mb-0 position-relative" style="flex: 1 1 calc(33.333% - 1.5rem); min-width: 280px;" data-qty="0">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr class="small text-uppercase fw-bold text-secondary">
                        <th scope="col" class="py-2">${list.brandName || 'Brand Name'}</th>
                        <th scope="col" class="py-2 text-end" style="padding-right: 1rem;">${list.connect || 'Location'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="2" class="p-0 text-center position-relative">
                            ${deleteButtonHtml}
                            <img src="${list.image == 'image' ? 'https://avatars.githubusercontent.com/u/96953467?v=4' : list.image}" alt="Restaurant Food Pic" class="img-fluid rounded-3"
                                style="height: 220px; object-fit: contain; width: 100%; background-color: #f8f9fa;">
                        </td>
                    </tr>
                    <tr class="small text-uppercase fw-bold text-secondary border-top text-center">
                        <td class="py-2 pt-3">Item</td>
                        <td class="py-2 pt-3">Price</td>
                    </tr>
                    <tr class="text-center">
                        <td class="text-muted">${list.item || 'Unnamed Item'}</td>
                        <td class="fw-semibold text-dark">Rs. ${list.price || '0'}</td>
                    </tr>
                    ${actionButtonsRow}
                </tbody>
            </table>
        </figure>`);
    });

};

if (localStorage.getItem('adminToken') || localStorage.getItem('userToken')) {
    registerLogoutButton.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    headerTag.style.pointerEvents = 'auto';
    document.querySelector('main').style.setProperty('display', 'none', 'important');
    addItem.disabled = !localStorage.getItem('adminToken');
    renderCards();
};

document.querySelector('#table-grid').addEventListener('click', (e) => {
    let btn = e.target.closest('[data-index], [data-add-index], [data-remove-index]');
    if (!btn) return;

    if (btn.dataset.index !== undefined) {
        itemStorage.splice(btn.dataset.index, 1);
        localStorage.setItem('items', JSON.stringify(itemStorage));
        return renderCards();
    }


    let card = btn.closest('figure');
    let name = card.querySelector('.text-muted').textContent.trim();
    let price = parseFloat(card.querySelector('.fw-semibold.text-dark').textContent.replace('Rs.', ''));

    let calcList = document.querySelector('#calc-items-list');
    let itemEl = calcList.querySelector(`#calc-item-${btn.dataset.addIndex || btn.dataset.removeIndex}`);
    let qtyEl = itemEl?.querySelector('.item-qty');


    if (btn.dataset.addIndex !== undefined) {
        calcList.querySelector('.calc-empty-msg')?.remove();
        if (itemEl) {
            qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
        } else {
            calcList.insertAdjacentHTML('beforeend', `
                <li id="calc-item-${btn.dataset.addIndex}" class="d-flex justify-content-between align-items-center small mb-1 border-bottom pb-1" data-item-price="${price}">
                    <span class="text-dark fw-medium">${name} <span class="text-muted small">x<span class="item-qty">1</span></span></span>
                    <span class="text-secondary fw-semibold">Rs. ${price}</span>
                </li>`);
        }
    } else if (itemEl) {
        let currentQty = parseInt(qtyEl.textContent);
        if (currentQty > 1) {
            qtyEl.textContent = currentQty - 1;
        } else {
            itemEl.remove();
            if (!calcList.querySelector('li')) {
                calcList.innerHTML = `<li class="text-center py-3 text-muted calc-empty-msg"><i class="fa-solid fa-basket-shopping fs-5 mb-1 opacity-50"></i><p class="small mb-0" style="font-size: 0.65rem;">No items selected yet.</p></li>`;
            }
        }
    };

    let subtotal = 0;
    calcList.querySelectorAll('li[data-item-price]').forEach(li => {
        subtotal += parseFloat(li.dataset.itemPrice) * parseInt(li.querySelector('.item-qty').textContent);
    });

    document.querySelector('#calc-subtotal').textContent = `Rs. ${subtotal}`;
    document.querySelector('#calc-tax').textContent = `Rs. ${(subtotal * 0.05).toFixed(2)}`;
    document.querySelector('#calc-total').textContent = `Rs. ${(subtotal * 1.05).toFixed(2)}`;
});

if (document.querySelector('main').display == 'none' || !localStorage.getItem('userAdmin') || !localStorage.getItem('userToken')) randomItems();
