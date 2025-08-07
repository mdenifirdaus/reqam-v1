// Pengajuan Dana JavaScript
class PengajuanManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.setupFormValidation();
        this.setupEventListeners();
    }

    loadUserInfo() {
        // Load user data from localStorage
        const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        
        // Display user info
        document.getElementById('displayNama').textContent = userData.nama || 'John Doe';
        document.getElementById('displayAims').textContent = userData.aims || 'AIMS001';
        document.getElementById('displayJabatan').textContent = userData.jabatan || 'Nazim Maal';
        document.getElementById('displayWilayah').textContent = userData.wilayah || 'Jakarta';
        document.getElementById('displayBranch').textContent = userData.branch || 'Jakarta Utara';
        document.getElementById('displayTypeBadan').textContent = userData.typeBadan || 'Khuddam';
        document.getElementById('displayManagementType').textContent = userData.managementType || 'MARKAZ';
        
        // Display in header badges
        document.getElementById('userNameDisplay').textContent = userData.nama || 'John Doe';
        document.getElementById('userLocationDisplay').textContent = userData.wilayah || 'Jakarta';
    }

    setupFormValidation() {
        const amountInput = document.getElementById('pengajuanAmount');
        if (amountInput) {
            amountInput.addEventListener('input', () => this.validateAmount());
        }

        // Set minimum date to today
        const deadlineInput = document.getElementById('pengajuanDeadline');
        if (deadlineInput) {
            const today = new Date().toISOString().split('T')[0];
            deadlineInput.min = today;
        }
    }

    setupEventListeners() {
        const form = document.getElementById('pengajuanForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            form.addEventListener('reset', () => this.handleFormReset());
        }
    }

    validateAmount() {
        const amountInput = document.getElementById('pengajuanAmount');
        const validationDiv = document.getElementById('amountValidation');
        const amount = parseInt(amountInput.value) || 0;
        
        // Get user balance
        const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        const balanceData = {
            'Jakarta': 15500000,
            'Bandung': 12500000,
            'Surabaya': 9800000,
            'Jawa Barat 10': 15200000,
            'Jawa Barat 7': 8900000
        };
        const availableBalance = balanceData[userData.wilayah] || balanceData['Jakarta'];

        if (amount <= 0) {
            validationDiv.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i> Jumlah harus lebih dari 0';
            validationDiv.className = 'form-text text-warning';
        } else if (amount > availableBalance) {
            validationDiv.innerHTML = '<i class="fas fa-times-circle text-danger"></i> Jumlah melebihi saldo tersedia';
            validationDiv.className = 'form-text text-danger';
        } else if (amount > availableBalance * 0.8) {
            validationDiv.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i> Jumlah mendekati batas saldo';
            validationDiv.className = 'form-text text-warning';
        } else {
            validationDiv.innerHTML = '<i class="fas fa-check-circle text-success"></i> Jumlah valid';
            validationDiv.className = 'form-text text-success';
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            kategori: document.getElementById('pengajuanKategori').value,
            prioritas: document.getElementById('pengajuanPrioritas').value,
            amount: document.getElementById('pengajuanAmount').value,
            deadline: document.getElementById('pengajuanDeadline').value,
            keterangan: document.getElementById('pengajuanKeterangan').value
        };

        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Show confirmation dialog
        if (window.showConfirm) {
            showConfirm(
                'Konfirmasi Pengajuan',
                `Apakah Anda yakin ingin mengajukan dana sebesar ${this.formatCurrency(parseInt(formData.amount))}?`,
                {
                    confirmText: 'Ya, Ajukan',
                    cancelText: 'Batal'
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    this.submitPengajuan(formData);
                }
            });
        } else {
            this.submitPengajuan(formData);
        }
    }

    validateForm(formData) {
        const requiredFields = ['kategori', 'prioritas', 'amount', 'deadline', 'keterangan'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            if (window.showError) {
                showError('Form Tidak Lengkap', 'Mohon lengkapi semua field yang diperlukan');
            } else {
                alert('Mohon lengkapi semua field yang diperlukan');
            }
            return false;
        }

        // Validate amount
        const amount = parseInt(formData.amount);
        if (amount <= 0) {
            if (window.showError) {
                showError('Jumlah Tidak Valid', 'Jumlah dana harus lebih dari 0');
            } else {
                alert('Jumlah dana harus lebih dari 0');
            }
            return false;
        }

        return true;
    }

    submitPengajuan(formData) {
        // Show loading
        if (window.showLoading) {
            showLoading('Memproses Pengajuan', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Generate pengajuan ID
            const pengajuanId = 'REQ-' + Date.now().toString().slice(-6);
            
            // Get user data
            const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
            
            // Create pengajuan object
            const pengajuan = {
                id: pengajuanId,
                pemohon: userData.nama || 'John Doe',
                wilayah: userData.wilayah || 'Jakarta',
                branch: userData.branch || 'Jakarta Utara',
                kategori: formData.kategori,
                prioritas: formData.prioritas,
                jumlah: parseInt(formData.amount),
                deadline: formData.deadline,
                keterangan: formData.keterangan,
                status: 'pending',
                tanggal: new Date().toISOString().split('T')[0],
                progress: 25,
                createdAt: new Date().toISOString()
            };

            // Save to localStorage (in real app, this would be sent to API)
            const existingPengajuan = JSON.parse(localStorage.getItem('pengajuanData') || '[]');
            existingPengajuan.push(pengajuan);
            localStorage.setItem('pengajuanData', JSON.stringify(existingPengajuan));

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess(
                    'Pengajuan Berhasil!',
                    `Pengajuan dana dengan ID ${pengajuanId} telah berhasil disubmit dan akan diproses`,
                    { timer: 4000 }
                );
            }

            // Reset form
            document.getElementById('pengajuanForm').reset();
            document.getElementById('amountValidation').innerHTML = '';

            // Show toast notification
            setTimeout(() => {
                if (window.showToast) {
                    showToast('info', 'Anda akan menerima notifikasi update status via email');
                }
            }, 1000);

        }, 2000);
    }

    handleFormReset() {
        document.getElementById('amountValidation').innerHTML = '';
        
        if (window.showToast) {
            showToast('info', 'Form telah direset');
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    showSaldoPopup() {
        // Get user data
        const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        
        // Get balance data
        const balanceData = {
            'Jakarta': 15500000,
            'Bandung': 12500000,
            'Surabaya': 9800000,
            'Jawa Barat 10': 15200000,
            'Jawa Barat 7': 8900000
        };
        const availableBalance = balanceData[userData.wilayah] || balanceData['Jakarta'];
        
        // Get bank accounts data (mock data or from localStorage)
        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts') || '[]');
        
        // Filter bank accounts based on user data
        const filteredAccounts = bankAccounts.filter(account => 
            account.wilayah === userData.wilayah &&
            account.branch === userData.branch &&
            account.typeManagement === userData.managementType &&
            account.typeBadan === userData.typeBadan
        );
        
        // If no accounts found, use mock data
        const displayAccounts = filteredAccounts.length > 0 ? filteredAccounts : [
            {
                bankName: 'Bank Mandiri',
                accountNumber: '1234567890',
                accountHolder: userData.nama || 'John Doe',
                balance: availableBalance * 0.6,
                wilayah: userData.wilayah || 'Jakarta',
                branch: userData.branch || 'Jakarta Utara',
                typeManagement: userData.managementType || 'MARKAZ',
                typeBadan: userData.typeBadan || 'Khuddam'
            },
            {
                bankName: 'Bank BCA',
                accountNumber: '0987654321',
                accountHolder: userData.nama || 'John Doe',
                balance: availableBalance * 0.4,
                wilayah: userData.wilayah || 'Jakarta',
                branch: userData.branch || 'Jakarta Utara',
                typeManagement: userData.managementType || 'MARKAZ',
                typeBadan: userData.typeBadan || 'Khuddam'
            }
        ];
        
        // Build modal content
        const modalContent = document.getElementById('saldoModalContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="saldo-summary-card">
                            <div class="d-flex align-items-center mb-3">
                                <i class="fas fa-wallet text-success me-2"></i>
                                <h6 class="mb-0">Total Saldo Tersedia</h6>
                            </div>
                            <div class="saldo-amount mb-3">
                                ${this.formatCurrency(availableBalance)}
                            </div>
                            <div class="saldo-details">
                                <div class="detail-item">
                                    <i class="fas fa-map-marker-alt text-muted me-2"></i>
                                    <span>${userData.wilayah || 'Jakarta'} - ${userData.branch || 'Jakarta Utara'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="badge bg-primary me-2">${userData.typeBadan || 'Khuddam'}</span>
                                    <span class="badge bg-success">${userData.managementType || 'MARKAZ'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="bank-accounts-section">
                            <div class="d-flex align-items-center mb-3">
                                <i class="fas fa-university text-primary me-2"></i>
                                <h6 class="mb-0">Rekening Bank Terdaftar</h6>
                            </div>
                            ${displayAccounts.map(account => `
                                <div class="bank-account-item">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div class="bank-name">${account.bankName}</div>
                                            <div class="account-number">${account.accountNumber}</div>
                                            <div class="account-holder">${account.accountHolder}</div>
                                        </div>
                                        <div class="account-balance">
                                            ${this.formatCurrency(account.balance)}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="alert alert-info mt-3">
                    <i class="fas fa-info-circle me-2"></i>
                    Saldo ditampilkan berdasarkan rekening bank yang telah ditambahkan. 
                    <a href="saldo-balance.html" class="alert-link">Lihat detail saldo</a> atau 
                    <a href="rekening-bank.html" class="alert-link">kelola rekening bank</a>.
                </div>
            `;
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('saldoModal'));
        modal.show();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pengajuanForm')) {
        window.pengajuanManager = new PengajuanManager();
    }
});

// Global function for validation
function validateAmount() {
    if (window.pengajuanManager) {
        window.pengajuanManager.validateAmount();
    }
}
// Global function for saldo popup
function showSaldoPopup() {
    if (window.pengajuanManager) {
        window.pengajuanManager.showSaldoPopup();
    }
}