/* ===== REVEAL ON SCROLL ===== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = parseInt(entry.target.dataset.delay || '0', 10);
                    if (delay > 0) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    });
})();
