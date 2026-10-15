// Sticky Header
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-area");
    if (header) {
        header.classList.toggle("shadow", window.scrollY > 50);
    }
});

/*=================================
Counter Animation
=================================*/
const counters = document.querySelectorAll(".counter");
const animateCounter = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const speed = target / 150;
        if (count < target) {
            counter.innerText = Math.ceil(count + speed);
            setTimeout(animateCounter, 20);
        } else {
            counter.innerText = target;
        }
    });
};
window.addEventListener("load", animateCounter);

// Back To Top Button
const topBtn = document.getElementById("topBtn");
if (topBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    });

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/*=================================
Hero Swiper Slider Initialization
=================================*/
document.addEventListener("DOMContentLoaded", function () {
    if (typeof Swiper !== 'undefined' && document.querySelector('.heroSwiper')) {
        new Swiper(".heroSwiper", {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: ".hero-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".hero-next",
                prevEl: ".hero-prev",
            },
        });
    }

    // Testimonial Swiper Slider Initialization
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonialSwiper')) {
        new Swiper(".testimonialSwiper", {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".testimonial-pagination",
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Hero Interactive SIP Estimator Slider
    const sipRange = document.getElementById("heroSipRange");
    const sipTenure = document.getElementById("heroSipTenure");
    const valLabel = document.getElementById("sliderValLabel");
    const tenureLabel = document.getElementById("sliderTenureLabel");
    const resultLabel = document.getElementById("heroSipResult");
    const durationResultLabel = document.getElementById("durationResultLabel");

    if (sipRange && sipTenure && valLabel && tenureLabel && resultLabel && durationResultLabel) {
        function updateSip() {
            const P = parseFloat(sipRange.value);
            const n = parseInt(sipTenure.value);
            
            // Format investment amount label
            valLabel.innerText = `₹${P.toLocaleString("en-IN")}`;
            
            // Format tenure label (e.g. "12 Mon" or "2 Yrs")
            let tenureText = `${n} Mon`;
            if (n >= 12 && n % 12 === 0) {
                const yrs = n / 12;
                tenureText = `${yrs} Yr${yrs > 1 ? 's' : ''}`;
            }
            tenureLabel.innerText = tenureText;
            
            // Update the output card labels
            durationResultLabel.innerText = `Estimated Value (${tenureText})`;

            // Calculate returns at 16% per annum compounding monthly
            const i = 0.16 / 12;
            let FV = 0;
            if (n === 1) {
                FV = Math.round(P + (P * 0.16 / 12));
            } else {
                FV = Math.round(P * (((Math.pow(1 + i, n)) - 1) / i) * (1 + i));
            }
            
            resultLabel.innerText = `₹${FV.toLocaleString("en-IN")}`;
        }

        sipRange.addEventListener("input", updateSip);
        sipRange.addEventListener("change", updateSip);
        sipTenure.addEventListener("input", updateSip);
        sipTenure.addEventListener("change", updateSip);
        
        // Run once initially to set starting state
        updateSip();
    }
});
