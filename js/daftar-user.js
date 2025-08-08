// Daftar User JavaScript
class UserManager {
    constructor() {
        this.branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };
        this.userData = this.generateMockUserData();
        this.filteredData = [...this.userData];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadUserData();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    generateMockUserData() {
        const statusList = ['active', 'inactive'];
        
        const userData = [];
        
        // Add current user first
        const currentUser = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        if (currentUser.nama) {
            userData.push({
                id: 'USR-001',
                aims: currentUser.aims || 'AIMS001',
                nama: currentUser.nama,
                email: currentUser.email || 'john@example.com',
                telepon: '081234567890',
                status: 'active',
                tanggalDibuat: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                lastLogin: new Date()
            });
        }
        
        // Generate additional mock users
        for (let i = 2; i <= 25; i++) {
            const status = Math.random() > 0.2 ? 'active' : 'inactive'; // 80% active
            
            userData.push({
                id: `USR-${String(i).padStart(3, '0')}`,
                aims: `AIMS${String(i).padStart(3, '0')}`,
                nama: this.generateRandomName(),
                email: `user${i}@example.com`,
                telepon: `0812345678${String(i).padStart(2, '0')}`,
                typeBadan: this.generateRandomTypeBadan(),
                status: status,
                tanggalDibuat: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                lastLogin: status === 'active' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null
            });
        }
        
        return userData.sort((a, b) => new Date(b.tanggalDibuat) - new Date(a.tanggalDibuat));
    }

    generateRandomName() {
        const firstNames = ['Ahmad', 'Muhammad', 'Abdul', 'Rizki', 'Dedi', 'Budi', 'Andi', 'Fajar', 'Hendra', 'Indra', 'Joko', 'Kurnia', 'Lukman', 'Maman', 'Nanda'];
        const lastNames = ['Pratama', 'Wijaya', 'Santoso', 'Permana', 'Hidayat', 'Setiawan', 'Rahman', 'Kurniawan', 'Saputra', 'Nugroho', 'Firmansyah', 'Gunawan', 'Hakim', 'Irawan', 'Junaedi'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${firstName} ${lastName}`;
    }

    generateRandomTypeBadan() {
        const typeBadanList = ['Khuddam', 'Lajnah Imaillah', 'Anshar', 'Athfal'];
        return typeBadanList[Math.floor(Math.random() * typeBadanList.length)];
    }

    loadUserData() {
        this.filteredData = [...this.userData];
        this.currentPage = 1;
    }

    updateStatistics() {
        const total = this.filteredData.length;
        const active = this.filteredData.filter(user => user.status === 'active').length;
        const inactive = this.filteredData.filter(user => user.status === 'inactive').length;
        
        // Users created in last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const newUsers = this.filteredData.filter(user => new Date(user.tanggalDibuat) > thirtyDaysAgo).length;

        document.getElementById('statTotalUsers').textContent = total;
        document.getElementById('statActiveUsers').textContent = active;
        document.getElementById('statInactiveUsers').textContent = inactive;
        document.getElementById('statNewUsers').textContent = newUsers;
        document.getElementById('totalUserCount').textContent = total;
    }

    renderTable() {
        const tbody = document.getElementById('userTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(user => {
            const statusClass = user.status === 'active' ? 'status-approved' : 'status-rejected';
            const statusText = user.status === 'active' ? 'Aktif' : 'Tidak Aktif';
            
            html += `
                <tr>
                    <td><strong>${user.aims}</strong></td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-mini">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details-mini">
                                <strong>${user.nama}</strong>
                                <small class="text-muted d-block">${user.id}</small>
                            </div>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>${user.telepon}</td>
                    <td><span class="badge bg-primary">${user.typeBadan}</span></td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${this.formatDate(user.tanggalDibuat)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="editUser('${user.id}')" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info btn-action" onclick="viewUserDetail('${user.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-${user.status === 'active' ? 'warning' : 'success'} btn-action" onclick="toggleUserStatus('${user.id}')" title="${user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}">
                            <i class="fas fa-${user.status === 'active' ? 'user-times' : 'user-check'}"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        this.updatePaginationInfo();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('userPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeUserPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="changeUserPage(1)">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeUserPage(${i})">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="#" onclick="changeUserPage(${totalPages})">${totalPages}</a></li>`;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeUserPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('userShowingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('userShowingEnd').textContent = endIndex;
        document.getElementById('userShowingTotal').textContent = this.filteredData.length;
    }

    filterData() {
        const status = document.getElementById('filterStatus').value;
        const search = document.getElementById('searchUser').value.toLowerCase();

        this.filteredData = this.userData.filter(user => {
            const statusMatch = !status || user.status === status;
            const searchMatch = !search || 
                               user.nama.toLowerCase().includes(search) ||
                               user.aims.toLowerCase().includes(search) ||
                               user.email.toLowerCase().includes(search);

            return statusMatch && searchMatch;
        });

        this.currentPage = 1;
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    resetFilter() {
        document.getElementById('filterStatus').value = '';
        document.getElementById('searchUser').value = '';
        
        this.loadUserData();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
        
        if (window.showToast) {
            showToast('info', 'Filter telah direset');
        }
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    editUser(userId) {
        const user = this.userData.find(u => u.id === userId);
        if (!user) return;

        // Populate edit form
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editAims').value = user.aims;
        document.getElementById('editNama').value = user.nama;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editTelepon').value = user.telepon;
        document.getElementById('editTypeBadan').value = user.typeBadan;
        document.getElementById('editStatus').value = user.status;


        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    }

    saveUserChanges() {
        const userId = document.getElementById('editUserId').value;
        const userIndex = this.userData.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return;

        // Get form data
        const updatedUser = {
            ...this.userData[userIndex],
            aims: document.getElementById('editAims').value,
            nama: document.getElementById('editNama').value,
            email: document.getElementById('editEmail').value,
            telepon: document.getElementById('editTelepon').value,
            typeBadan: document.getElementById('editTypeBadan').value,
            status: document.getElementById('editStatus').value
        };

        // Validate form
        if (!this.validateUserForm(updatedUser)) {
            return;
        }

        // Show loading
        if (window.showLoading) {
            showLoading('Menyimpan Perubahan', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Update user data
            this.userData[userIndex] = updatedUser;
            
            // Update filtered data if needed
            const filteredIndex = this.filteredData.findIndex(u => u.id === userId);
            if (filteredIndex !== -1) {
                this.filteredData[filteredIndex] = updatedUser;
            }

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();

            // Refresh display
            this.updateStatistics();
            this.renderTable();

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Berhasil!', 'Data user telah berhasil diperbarui');
            }
        }, 1500);
    }

    toggleUserStatus(userId) {
        const user = this.userData.find(u => u.id === userId);
        if (!user) return;

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';

        if (window.showConfirm) {
            showConfirm(
                'Konfirmasi Perubahan Status',
                `Apakah Anda yakin ingin ${actionText} user ${user.nama}?`,
                {
                    confirmText: 'Ya, Lanjutkan',
                    cancelText: 'Batal'
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    // Show loading
                    showLoading('Memproses', 'Mengubah status user...');

                    setTimeout(() => {
                        // Update status
                        user.status = newStatus;
                        
                        // Update in filtered data
                        const filteredUser = this.filteredData.find(u => u.id === userId);
                        if (filteredUser) {
                            filteredUser.status = newStatus;
                        }

                        // Refresh display
                        this.updateStatistics();
                        this.renderTable();

                        // Show success
                        SwalHelper.close();
                        showSuccess('Berhasil!', `User ${user.nama} telah ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`);
                    }, 1000);
                }
            });
        }
    }

    showAddUserModal() {
        // Reset form
        document.getElementById('addUserForm').reset();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
        modal.show();
    }

    addNewUser() {
        // Get form data
        const newUser = {
            id: `USR-${String(this.userData.length + 1).padStart(3, '0')}`,
            aims: document.getElementById('addAims').value,
            nama: document.getElementById('addNama').value,
            email: document.getElementById('addEmail').value,
            telepon: document.getElementById('addTelepon').value,
            typeBadan: document.getElementById('addTypeBadan').value,
            status: 'active',
            tanggalDibuat: new Date(),
            lastLogin: null
        };

        // Validate form
        if (!this.validateUserForm(newUser, true)) {
            return;
        }

        // Check if AIMS or email already exists
        const existingAims = this.userData.find(u => u.aims === newUser.aims);
        const existingEmail = this.userData.find(u => u.email === newUser.email);

        if (existingAims) {
            showError('AIMS Sudah Terdaftar', 'AIMS yang Anda masukkan sudah digunakan oleh user lain');
            return;
        }

        if (existingEmail) {
            showError('Email Sudah Terdaftar', 'Email yang Anda masukkan sudah digunakan oleh user lain');
            return;
        }

        // Show loading
        if (window.showLoading) {
            showLoading('Menambah User', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Add user to data
            this.userData.unshift(newUser);
            this.filteredData.unshift(newUser);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();

            // Refresh display
            this.updateStatistics();
            this.renderTable();
            this.renderPagination();

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Berhasil!', `User ${newUser.nama} telah berhasil ditambahkan`);
            }
        }, 1500);
    }

    validateUserForm(user, isNew = false) {
        const requiredFields = ['aims', 'nama', 'email', 'telepon', 'typeBadan'];
        const missingFields = requiredFields.filter(field => !user[field]);

        if (missingFields.length > 0) {
            if (window.showError) {
                showError('Form Tidak Lengkap', 'Mohon lengkapi semua field yang diperlukan');
            }
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            if (window.showError) {
                showError('Email Tidak Valid', 'Format email tidak sesuai');
            }
            return false;
        }

        return true;
    }

    exportData() {
        if (window.showLoading) {
            showLoading('Mengexport Data', 'Mohon tunggu sebentar...');
        }

        setTimeout(() => {
            // Create CSV content
            const headers = ['AIMS', 'Nama', 'Email', 'Telepon', 'Type Badan', 'Status', 'Tanggal Dibuat'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(user => [
                    user.aims,
                    `"${user.nama}"`,
                    user.email,
                    user.telepon,
                    user.typeBadan,
                    user.status === 'active' ? 'Aktif' : 'Tidak Aktif',
                    this.formatDate(user.tanggalDibuat)
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daftar-user-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Data user telah berhasil diexport ke file CSV');
            }
        }, 1500);
    }

    viewUserDetail(userId) {
        const user = this.userData.find(u => u.id === userId);
        if (!user) return;

        const detailHtml = `
            <div class="user-detail-card">
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-user"></i> Informasi Pribadi</h6>
                        <div class="detail-item">
                            <span class="label">AIMS:</span>
                            <span class="value">${user.aims}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Nama:</span>
                            <span class="value">${user.nama}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Email:</span>
                            <span class="value">${user.email}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Telepon:</span>
                            <span class="value">${user.telepon}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Type Badan:</span>
                            <span class="value">
                                <span class="badge bg-primary">${user.typeBadan}</span>
                            </span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-info-circle"></i> Informasi Status</h6>
                        <div class="detail-item">
                            <span class="label">Status:</span>
                            <span class="value">
                                <span class="status-badge ${user.status === 'active' ? 'status-approved' : 'status-rejected'}">
                                    ${user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Tanggal Dibuat:</span>
                            <span class="value">${this.formatDate(user.tanggalDibuat)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Login Terakhir:</span>
                            <span class="value">${user.lastLogin ? this.formatDate(user.lastLogin) : 'Belum pernah login'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.SwalHelper) {
            SwalHelper.html(`Detail User - ${user.nama}`, detailHtml, {
                width: '600px',
                confirmButtonText: 'Tutup'
            });
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('userTable')) {
        window.userManager = new UserManager();
    }
});

// Global functions
function filterUserData() {
    if (window.userManager) {
        window.userManager.filterData();
    }
}

function resetUserFilter() {
    if (window.userManager) {
        window.userManager.resetFilter();
    }
}

function changeUserPage(page) {
    if (window.userManager) {
        window.userManager.changePage(page);
    }
}

function exportUserData() {
    if (window.userManager) {
        window.userManager.exportData();
    }
}

function editUser(userId) {
    if (window.userManager) {
        window.userManager.editUser(userId);
    }
}

function saveUserChanges() {
    if (window.userManager) {
        window.userManager.saveUserChanges();
    }
}

function toggleUserStatus(userId) {
    if (window.userManager) {
        window.userManager.toggleUserStatus(userId);
    }
}

function showAddUserModal() {
    if (window.userManager) {
        window.userManager.showAddUserModal();
    }
}

function addNewUser() {
    if (window.userManager) {
        window.userManager.addNewUser();
    }
}

function viewUserDetail(userId) {
    if (window.userManager) {
        window.userManager.viewUserDetail(userId);
    }
}