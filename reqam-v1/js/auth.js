// Authentication JavaScript
$(document).ready(function() {
    // Check if user is already logged in
    if (localStorage.getItem('reqamUser')) {
        window.location.href = 'dashboard.html';
    }

    // Branch data mapping
    const branchData = {
        'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
        'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
        'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
        'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
        'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
    };

    // Login form submission
    $('#loginFormSubmit').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<span class="loading"></span> Memproses...');
        submitBtn.prop('disabled', true);
        
        // Simulate API call
        setTimeout(() => {
            // Mock authentication - in real app, this would be an API call
            if (username && password) {
                // Create mock user data
                const userData = {
                    id: 1,
                    username: username,
                    nama: 'John Doe',
                    email: 'john@example.com',
                    wilayah: 'Jakarta',
                    branch: 'Jakarta Utara',
                    jabatan: 'Nazim Maal',
                    loginTime: new Date().toISOString()
                };
                
                // Store user data
                localStorage.setItem('reqamUser', JSON.stringify(userData));
                
                // Show success message
                showAlert('success', 'Login berhasil! Mengalihkan ke dashboard...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert('danger', 'Username dan password harus diisi!');
                submitBtn.html(originalText);
                submitBtn.prop('disabled', false);
            }
        }, 1500);
    });

    // Register form submission
    $('#registerFormSubmit').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            aims: $('#aims').val(),
            nama: $('#nama').val(),
            email: $('#email').val(),
            telepon: $('#telepon').val(),
            wilayah: $('#wilayah').val(),
            branch: $('#branch').val(),
            jabatan: $('#jabatan').val()
        };
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<span class="loading"></span> Mendaftar...');
        submitBtn.prop('disabled', true);
        
        // Simulate API call
        setTimeout(() => {
            // Mock registration - in real app, this would be an API call
            if (Object.values(formData).every(val => val)) {
                showAlert('success', 'Registrasi berhasil! Silakan login dengan akun Anda.');
                
                // Reset form and switch to login
                $('#registerFormSubmit')[0].reset();
                setTimeout(() => {
                    showLogin();
                }, 2000);
            } else {
                showAlert('danger', 'Semua field harus diisi!');
            }
            
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);
        }, 2000);
    });
});

// Show register form
function showRegister() {
    $('#loginForm').hide();
    $('#registerForm').show();
}

// Show login form
function showLogin() {
    $('#registerForm').hide();
    $('#loginForm').show();
}

// Update branches based on selected wilayah
function updateBranches() {
    const wilayah = $('#wilayah').val();
    const branchSelect = $('#branch');
    
    branchSelect.empty().append('<option value="">Pilih Branch</option>');
    
    const branchData = {
        'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
        'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
        'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
        'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
        'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
    };
    
    if (wilayah && branchData[wilayah]) {
        branchData[wilayah].forEach(branch => {
            branchSelect.append(`<option value="${branch}">${branch}</option>`);
        });
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show alert messages
function showAlert(type, message) {
    // Remove existing alerts
    $('.alert').remove();
    
    const alertHtml = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    
    $('.auth-form:visible').prepend(alertHtml);
    
    // Auto remove alert after 5 seconds
    setTimeout(() => {
        $('.alert').fadeOut();
    }, 5000);
}