/* ===== CONTACT FORM ===== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contact-form');
        if (!form) return;

        var submitBtn = form.querySelector('button[type="submit"]');
        var formWrap = document.getElementById('contact-form-wrap');
        var successWrap = document.getElementById('contact-success');
        var errorBanner = document.getElementById('contact-error');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearErrors();

            // Honeypot
            if (form.querySelector('[name="website"]').value) return;

            var data = {
                name: form.querySelector('[name="name"]').value.trim(),
                company: form.querySelector('[name="company"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                phone: form.querySelector('[name="phone"]').value.trim(),
                message: form.querySelector('[name="message"]').value.trim()
            };

            // Validate
            var errors = {};
            var isAr = document.documentElement.lang === 'ar';

            if (!data.name) errors.name = isAr ? 'الاسم مطلوب' : 'Name is required';
            if (!data.email) errors.email = isAr ? 'البريد الإلكتروني مطلوب' : 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = isAr ? 'البريد الإلكتروني غير صالح' : 'Invalid email address';
            if (!data.phone) errors.phone = isAr ? 'رقم الهاتف مطلوب' : 'Phone number is required';
            if (!data.message) errors.message = isAr ? 'الرسالة مطلوبة' : 'Message is required';

            if (Object.keys(errors).length > 0) {
                showErrors(errors);
                return;
            }

            // Submit
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' + (isAr ? 'جاري الإرسال...' : 'Sending...');

            // Simulate submission (replace with real endpoint)
            setTimeout(function () {
                submitBtn.disabled = false;
                if (formWrap && successWrap) {
                    formWrap.style.display = 'none';
                    successWrap.style.display = 'flex';
                }
            }, 1500);
        });

        // Send another
        var sendAnother = document.getElementById('send-another');
        if (sendAnother) {
            sendAnother.addEventListener('click', function () {
                form.reset();
                if (formWrap && successWrap) {
                    formWrap.style.display = 'block';
                    successWrap.style.display = 'none';
                }
                submitBtn.disabled = false;
                var isAr = document.documentElement.lang === 'ar';
                submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>' + (isAr ? 'إرسال' : 'Send');
            });
        }

        function clearErrors() {
            form.querySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; el.style.display = 'none'; });
            if (errorBanner) { errorBanner.style.display = 'none'; }
        }

        function showErrors(errors) {
            Object.keys(errors).forEach(function (field) {
                var errEl = document.getElementById('error-' + field);
                if (errEl) {
                    errEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>' + errors[field];
                    errEl.style.display = 'flex';
                }
            });
        }
    });
})();
