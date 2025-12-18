// Enable strict mode for better error catching
'use strict';

// Mock Data for Listings
const listings = [
    {
        id: 1,
        title: "تويوتا كامري LE 2023 نظيفة جداً",
        price: 85000,
        make: "تويوتا",
        year: 2023,
        city: "الرياض",
        date: "منذ 3 ساعات",
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&w=800&q=80",
        description: "السيارة بحالة الوكالة، الممشى 15 ألف كيلو فقط. جميع الصيانات في الوكالة. بدي وكالة خالي من الرش.",
        seller: "أبو محمد"
    },
    {
        id: 2,
        title: "هيونداي سوناتا فل كامل بانوراما",
        price: 72000,
        make: "هيونداي",
        year: 2022,
        city: "جدة",
        date: "منذ 5 ساعات",
        image: "https://images.unsplash.com/photo-1596711683676-47b457056637?auto=format&fit=crop&w=800&q=80",
        description: "سوناتا 2022 سمارت بلس، الممشى 40 ألف. يوجد حكة بسيطة في الصدام الخلفي.",
        seller: "معرض القمة"
    },
    {
        id: 3,
        title: "فورد توروس تيتانيوم",
        price: 110000,
        make: "فورد",
        year: 2021,
        city: "الدمام",
        date: "منذ يوم",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
        description: "أعلى فئة، رادار، نقطة عمياء، تبريد مقاعد. استخدام حشمة.",
        seller: "فهد الدوسري"
    },
    {
        id: 4,
        title: "نيسان باترول بلاتينيوم 8 سلندر",
        price: 240000,
        make: "نيسان",
        year: 2022,
        city: "الرياض",
        date: "منذ يومين",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "الموتر شرط، محركات وبدي. عليه حماية وعازل حراري.",
        seller: "سعد"
    },
    {
        id: 5,
        title: "مرسيدس E200 AMG Kit",
        price: 195000,
        make: "مرسيدس",
        year: 2020,
        city: "جدة",
        date: "منذ 4 ساعات",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
        description: "وارد الجفالي، صيانات منتظمة. اللون الخارجي كحلي والداخلي جملي.",
        seller: "VIP Motors"
    },
    {
        id: 6,
        title: "تويوتا هايلكس دبل",
        price: 105000,
        make: "تويوتا",
        year: 2023,
        city: "أبها",
        date: "منذ 6 ساعات",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        description: "غمارتين دبل S-GLX ديزل. الممشى 5000 كيلو.",
        seller: "ناصر الجنوبي"
    }
];

// Car Models Mapping
const carModels = {
    'تويوتا': ['كامري', 'هايلكس', 'كورولا', 'لاندكروزر', 'يارس'],
    'هيونداي': ['سوناتا', 'النترا', 'توسان', 'اكسنت', 'ازيرا'],
    'فورد': ['توروس', 'اكسبلورر', 'موستنج', 'F-150', 'اكسبدشن'],
    'نيسان': ['باترول', 'التيما', 'مكسيما', 'صني', 'اكس تريل'],
    'مرسيدس': ['E200', 'S500', 'C200', 'G63', 'S-Class']
};

// DOM Elements
const grid = document.getElementById('listingsGrid');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const filterContainer = document.getElementById('filterContainer');
const subFilterContainer = document.getElementById('subFilterContainer');
const adForm = document.getElementById('adForm');
const loginForm = document.getElementById('loginForm');
const guestNav = document.getElementById('guestNav');
const userNav = document.getElementById('userNav');
const userNameDisplay = document.getElementById('userNameDisplay');
const userInitials = document.getElementById('userInitials');

// Auth State
let currentUser = null;

// Helper for Safe Storage (prevents 'Script error' if localStorage is blocked)
const storage = {
    get: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('LocalStorage access denied:', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage access denied:', e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage access denied:', e);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (grid) renderListings(listings);
    setupFilters();
    setupSearch();
});

// --- Auth Logic ---
function checkAuth() {
    const savedUser = storage.get('motors_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
        } catch (e) {
            console.error('Error parsing user data:', e);
            storage.remove('motors_user'); // Clear corrupted data
        }
    }
}

function updateAuthUI() {
    if (currentUser) {
        if (guestNav) guestNav.classList.add('hidden');
        if (userNav) {
            userNav.classList.remove('hidden');
            userNav.classList.add('flex');
        }
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
        if (userInitials) userInitials.textContent = currentUser.name.charAt(0);
    } else {
        if (guestNav) guestNav.classList.remove('hidden');
        if (userNav) {
            userNav.classList.add('hidden');
            userNav.classList.remove('flex');
        }
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : 'user@example.com';
        
        currentUser = {
            name: 'محمد عبد الله',
            email: email,
            id: Date.now()
        };
        
        storage.set('motors_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('loginModal');
    });
}

window.logout = function() {
    currentUser = null;
    storage.remove('motors_user');
    updateAuthUI();
}

window.handlePostAd = function() {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    openModal('addAdModal');
}

// --- Listing & Display Logic ---
function renderListings(data) {
    grid.innerHTML = '';
    if(data.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">لا توجد نتائج مطابقة</div>';
        return;
    }

    data.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer card-hover transition-all duration-300 group';
        card.onclick = () => openDetails(ad.id);
        
        card.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img src="${ad.image}" alt="${ad.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    ${ad.city}
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-gray-900 line-clamp-1">${ad.title}</h3>
                </div>
                <div class="flex items-center gap-2 mb-3 text-sm text-gray-500">
                    <span class="bg-gray-100 px-2 py-0.5 rounded">${ad.year}</span>
                    <span class="truncate">${ad.seller}</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-brand-600 font-bold text-xl">${ad.price.toLocaleString()} ريال</span>
                    <span class="text-xs text-gray-400">${ad.date}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupFilters() {
    if (!filterContainer) return;
    
    const btns = filterContainer.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btns.forEach(b => {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-600');
            });
            e.target.classList.remove('bg-gray-100', 'text-gray-600');
            e.target.classList.add('bg-brand-600', 'text-white');

            const category = e.target.dataset.category;
            handleMainFilter(category);
        });
    });
}

function handleMainFilter(category) {
    let filtered = listings;
    if (category !== 'all') {
        filtered = listings.filter(item => item.make === category);
    }
    renderListings(filtered);

    if (!subFilterContainer) return;

    subFilterContainer.innerHTML = '';
    if (category === 'all' || !carModels[category]) {
        subFilterContainer.classList.add('hidden');
        subFilterContainer.classList.remove('flex');
        return;
    }

    subFilterContainer.classList.remove('hidden');
    subFilterContainer.classList.add('flex');

    const allModelsBtn = createSubFilterBtn('الكل', true, () => {
        const brandAll = listings.filter(item => item.make === category);
        renderListings(brandAll);
        updateSubActiveState(allModelsBtn);
    });
    subFilterContainer.appendChild(allModelsBtn);

    carModels[category].forEach(model => {
        const modelBtn = createSubFilterBtn(model, false, () => {
            const brandModel = listings.filter(item => 
                item.make === category && item.title.includes(model)
            );
            renderListings(brandModel);
            updateSubActiveState(modelBtn);
        });
        subFilterContainer.appendChild(modelBtn);
    });
}

function createSubFilterBtn(text, isActive, onClick) {
    const btn = document.createElement('button');
    btn.className = `sub-filter-btn px-4 py-1.5 rounded-full text-sm border transition-colors duration-200 whitespace-nowrap ${isActive ? 'bg-brand-100 text-brand-900 border-brand-200 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`;
    btn.textContent = text;
    btn.onclick = onClick;
    return btn;
}

function updateSubActiveState(activeBtn) {
    if (!subFilterContainer) return;
    const allSub = subFilterContainer.querySelectorAll('button');
    allSub.forEach(b => {
        b.className = 'sub-filter-btn px-4 py-1.5 rounded-full text-sm border transition-colors duration-200 whitespace-nowrap bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
    });
    activeBtn.className = 'sub-filter-btn px-4 py-1.5 rounded-full text-sm border transition-colors duration-200 whitespace-nowrap bg-brand-100 text-brand-900 border-brand-200 font-bold';
}

function setupSearch() {
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = listings.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.city.toLowerCase().includes(term) ||
            item.make.toLowerCase().includes(term)
        );
        renderListings(filtered);
        
        if (term.length > 0 && subFilterContainer) {
           subFilterContainer.classList.add('hidden');
           subFilterContainer.classList.remove('flex');
        }
    };

    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearch);
}

// --- Modal Handling ---
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Safe replacement for window.onclick
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('fixed')) {
        event.target.classList.add('hidden');
        event.target.classList.remove('flex');
    }
});

function openDetails(id) {
    const ad = listings.find(item => item.id === id);
    if (!ad) return;

    const content = document.getElementById('detailsContent');
    if (!content) return;

    const commission = (ad.price * 0.01).toLocaleString();

    content.innerHTML = `
        <div class="h-64 sm:h-80 w-full bg-gray-200">
            <img src="${ad.image}" class="w-full h-full object-cover">
        </div>
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-1">${ad.title}</h2>
                    <p class="text-gray-500 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${ad.city} - ${ad.date}
                    </p>
                </div>
                <div class="text-left">
                    <div class="text-2xl font-bold text-brand-600">${ad.price.toLocaleString()} ريال</div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg text-sm">
                <div><span class="text-gray-500 block">الموديل:</span> <span class="font-semibold">${ad.year}</span></div>
                <div><span class="text-gray-500 block">الشركة:</span> <span class="font-semibold">${ad.make}</span></div>
                <div><span class="text-gray-500 block">البائع:</span> <span class="font-semibold">${ad.seller}</span></div>
                <div><span class="text-gray-500 block">رقم الإعلان:</span> <span class="font-semibold">#${85400 + ad.id}</span></div>
            </div>

            <div class="mb-8">
                <h3 class="font-bold text-lg mb-2">التفاصيل</h3>
                <p class="text-gray-600 leading-relaxed">
                    ${ad.description}
                </p>
            </div>

            <div class="border-t pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div class="flex gap-3 w-full sm:w-auto">
                    <button onclick="alert('سيتم الاتصال بالبائع: 05xxxxxxx')" class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        اتصال
                    </button>
                    <button class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    </button>
                </div>
                <div class="text-xs text-gray-400">
                    * عمولة الموقع على البائع (${commission} ريال)
                </div>
            </div>
        </div>
    `;
    openModal('detailsModal');
}

if (adForm) {
    adForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            closeModal('addAdModal');
            openModal('loginModal');
            return;
        }

        const btn = adForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'جاري النشر...';
        btn.disabled = true;

        setTimeout(() => {
            alert(`تم إضافة الإعلان بنجاح يا ${currentUser.name}!`);
            closeModal('addAdModal');
            btn.textContent = originalText;
            btn.disabled = false;
            adForm.reset();
        }, 1500);
    });
}