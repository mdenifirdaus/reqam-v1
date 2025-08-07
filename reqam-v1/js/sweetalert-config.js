// SweetAlert2 Configuration and Helper Functions
class SweetAlertHelper {
    constructor() {
        this.defaultConfig = {
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            buttonsStyling: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        };
    }

    // Success Alert
    success(title, text = '', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            timer: options.timer || 3000,
            timerProgressBar: true,
            ...options
        });
    }

    // Error Alert
    error(title, text = '', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            ...options
        });
    }

    // Warning Alert
    warning(title, text = '', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            ...options
        });
    }

    // Info Alert
    info(title, text = '', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            icon: 'info',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            ...options
        });
    }

    // Confirmation Dialog
    confirm(title, text = '', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            icon: 'question',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'Ya, Lanjutkan',
            cancelButtonText: options.cancelText || 'Batal',
            reverseButtons: true,
            ...options
        });
    }

    // Loading Alert
    loading(title = 'Memproses...', text = 'Mohon tunggu sebentar') {
        return Swal.fire({
            ...this.defaultConfig,
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    // Toast Notification
    toast(type, message, options = {}) {
        const Toast = Swal.mixin({
            toast: true,
            position: options.position || 'top-end',
            showConfirmButton: false,
            timer: options.timer || 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            customClass: {
                popup: 'swal-toast-popup',
                title: 'swal-toast-title'
            }
        });

        return Toast.fire({
            icon: type,
            title: message,
            ...options
        });
    }

    // Input Dialog
    input(title, inputType = 'text', options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            title: title,
            input: inputType,
            inputPlaceholder: options.placeholder || '',
            inputValue: options.value || '',
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'OK',
            cancelButtonText: options.cancelText || 'Batal',
            inputValidator: options.validator || null,
            ...options
        });
    }

    // Custom HTML Alert
    html(title, html, options = {}) {
        return Swal.fire({
            ...this.defaultConfig,
            title: title,
            html: html,
            confirmButtonText: 'OK',
            ...options
        });
    }

    // Progress Alert
    progress(title, text = '') {
        return Swal.fire({
            ...this.defaultConfig,
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            html: `
                <div class="progress-container">
                    <div class="progress-bar-custom">
                        <div class="progress-fill" id="swal-progress-fill"></div>
                    </div>
                    <div class="progress-text" id="swal-progress-text">0%</div>
                </div>
            `,
            didOpen: () => {
                this.progressElement = document.getElementById('swal-progress-fill');
                this.progressText = document.getElementById('swal-progress-text');
            }
        });
    }

    // Update Progress
    updateProgress(percentage) {
        if (this.progressElement && this.progressText) {
            this.progressElement.style.width = percentage + '%';
            this.progressText.textContent = percentage + '%';
        }
    }

    // Close any open alert
    close() {
        Swal.close();
    }
}

// Initialize global SweetAlert helper
window.SwalHelper = new SweetAlertHelper();

// Convenience functions for quick access
window.showSuccess = (title, text, options) => SwalHelper.success(title, text, options);
window.showError = (title, text, options) => SwalHelper.error(title, text, options);
window.showWarning = (title, text, options) => SwalHelper.warning(title, text, options);
window.showInfo = (title, text, options) => SwalHelper.info(title, text, options);
window.showConfirm = (title, text, options) => SwalHelper.confirm(title, text, options);
window.showLoading = (title, text) => SwalHelper.loading(title, text);
window.showToast = (type, message, options) => SwalHelper.toast(type, message, options);

// Example usage functions for demonstration
function demonstrateSweetAlert() {
    // Success example
    showSuccess('Berhasil!', 'Data telah disimpan dengan sukses');
}

function demonstrateConfirm() {
    showConfirm(
        'Konfirmasi Hapus',
        'Apakah Anda yakin ingin menghapus data ini?',
        {
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        }
    ).then((result) => {
        if (result.isConfirmed) {
            showSuccess('Terhapus!', 'Data telah berhasil dihapus');
        }
    });
}

function demonstrateToast() {
    showToast('success', 'Notifikasi berhasil ditampilkan!');
}

function demonstrateLoading() {
    showLoading('Menyimpan Data', 'Mohon tunggu sebentar...');
    
    // Simulate async operation
    setTimeout(() => {
        SwalHelper.close();
        showSuccess('Selesai!', 'Proses telah selesai');
    }, 3000);
}

// Integration with existing form submissions
function enhanceFormSubmissions() {
    // Enhance pengajuan form
    const pengajuanForm = document.getElementById('pengajuanForm');
    if (pengajuanForm) {
        pengajuanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            showConfirm(
                'Konfirmasi Pengajuan',
                'Apakah Anda yakin ingin mengajukan dana ini?',
                {
                    confirmText: 'Ya, Ajukan',
                    cancelText: 'Batal'
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    showLoading('Memproses Pengajuan', 'Mohon tunggu sebentar...');
                    
                    // Simulate form submission
                    setTimeout(() => {
                        SwalHelper.close();
                        showSuccess(
                            'Pengajuan Berhasil!',
                            'Pengajuan dana Anda telah berhasil disubmit dan akan diproses',
                            { timer: 4000 }
                        );
                        
                        // Reset form
                        pengajuanForm.reset();
                        
                        // Show toast notification
                        setTimeout(() => {
                            showToast('info', 'Anda akan menerima notifikasi update status');
                        }, 1000);
                    }, 2000);
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceFormSubmissions();
});