// Assignment User JavaScript
class AssignmentManager {
    constructor() {
        this.branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };
        this.assignmentData = this.generateMockAssignmentData();
        this.filteredData = [...this.assignmentData];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.availableUsers = this.getAvailableUsers();
        this.init();
    }

    init() {
        this.loadAssignmentData();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
        this.populateUserDropdowns();
    }

    getAvailableUsers() {
        // Get users from localStorage (from daftar-user.js)
        const savedUsers = JSON.parse(localStorage.getItem('userData') || '[]');
        
        // Mock users if no saved data
        if (savedUsers.length === 0) {
            return [
                { id: 'USR-001', aims: 'AIMS001', nama: 'John Doe', email: 'john@example.com', telepon: '081234567890', status: 'active' },
                { id: 'USR-002', aims: 'AIMS002', nama: 'Ahmad Pratama', email: 'ahmad@example.com', telepon: '081234567891', status: 'active' },
                { id: 'USR-003', aims: 'AIMS003', nama: 'Budi Santoso', email: 'budi@example.com', telepon: '081234567892', status: 'active' },
                { id: 'USR-004', aims: 'AIMS004', nama: 'Citra Dewi', email: 'citra@example.com', telepon: '081234567893', status: 'active' },
                { id: 'USR-005', aims: 'AIMS005', nama: 'Dedi Kurniawan', email: 'dedi@example.com', telepon: '081234567894', status: 'active' }
            ];
        }
        
        return savedUsers.filter(user => user.status === 'active');
    }

    generateMockAssignmentData() {
        const wilayahList = ['Jakarta', 'Bandung', 'Surabaya', 'Jawa Barat 10', 'Jawa Barat 7'];
        const jabatanList = ['Qaid Wilayah', 'Qaid Majelis', 'Nazim Maal', 'Nazim Sehat Jasmani', 'Nazim Tarbiayat', 'Nazim Tabligh'];
        const managementTypeList = ['MARKAZ', 'AMILA', 'KHUDAM', 'LAJNAH', 'ANSHAR', 'AMSA'];
        
        const assignmentData = [];
        const users = this.getAvailableUsers();
        
        // Return empty array if no users available
        if (users.length === 0) {
            return [];
        }
        
        // Generate multiple assignments for users
        for (let i = 0; i < Math.min(users.length * 2, 25); i++) {
            const user = users[i % users.length];
            const wilayah = wilayahList[Math.floor(Math.random() * wilayahList.length)];
            const branches = this.branchData[wilayah];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const jabatan = jabatanList[Math.floor(Math.random() * jabatanList.length)];
            const managementType = managementTypeList[Math.floor(Math.random() * managementTypeList.length)];
            
            assignmentData.push({
                id: `ASG-${String(i + 1).padStart(3, '0')}`,
                userId: user.id,
                aims: user.aims,
                nama: user.nama,
                email: user.email,
                telepon: user.telepon,
                typeBadan: user.typeBadan || 'Khuddam',
                wilayah: wilayah,
                branch: branch,
                jabatan: jabatan,
                managementType: managementType,
                tanggalAssignment: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
                createdAt: new Date().toISOString()
            });
        }
        
        return assignmentData.sort((a, b) => new Date(b.tanggalAssignment) - new Date(a.tanggalAssignment));
    }

    populateUserDropdowns() {
        const addSelect = document.getElementById('addAssignmentAims');
        
        if (addSelect) {
            addSelect.innerHTML = '<option value="">Pilih User</option>';
            this.availableUsers.forEach(user => {
                addSelect.innerHTML += `<option value="${user.aims}" data-user='${JSON.stringify(user)}'>${user.aims} - ${user.nama}</option>`;
            });
        }
    }

    loadAssignmentData() {
        // Group assignments by user
        const groupedData = {};
        this.assignmentData.forEach(assignment => {
            if (!groupedData[assignment.aims]) {
                groupedData[assignment.aims] = {
                    aims: assignment.aims,
                    nama: assignment.nama,
                    email: assignment.email,
                    telepon: assignment.telepon,
                    typeBadan: assignment.typeBadan,
                    wilayah: assignment.wilayah,
                    branch: assignment.branch,
                    assignments: []
                };
            }
            groupedData[assignment.aims].assignments.push({
                id: assignment.id,
                jabatan: assignment.jabatan,
                managementType: assignment.managementType,
                wilayah: assignment.wilayah,
                branch: assignment.branch,
                tanggalAssignment: assignment.tanggalAssignment
            });
        });
        
        this.filteredData = Object.values(groupedData);
        this.currentPage = 1;
    }

    updateStatistics() {
        const totalUsers = this.filteredData.length;
        const totalAssignments = this.assignmentData.length;
        const uniqueWilayah = [...new Set(this.assignmentData.map(item => item.wilayah))].length;
        const uniqueBranch = [...new Set(this.assignmentData.map(item => item.branch))].length;

        document.getElementById('statTotalUsers').textContent = totalUsers;
        document.getElementById('statWilayah').textContent = uniqueWilayah;
        document.getElementById('statBranch').textContent = uniqueBranch;
        document.getElementById('statTotalAssignments').textContent = totalAssignments;
        document.getElementById('totalAssignmentCount').textContent = totalUsers;
    }

    renderTable() {
        const tbody = document.getElementById('assignmentTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            html += `
                <tr>
                    <td><strong>${item.aims}</strong></td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-mini">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details-mini">
                                <strong>${item.nama}</strong>
                                <small class="text-muted d-block">${item.aims}</small>
                            </div>
                        </div>
                    </td>
                    <td>${item.email}</td>
                    <td><span class="badge bg-primary">${item.typeBadan}</span></td>
                    <td><span class="badge bg-secondary">${item.wilayah}</span></td>
                    <td><span class="badge bg-info">${item.branch}</span></td>
                    <td><span class="badge bg-success">${item.assignments.length}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-info btn-action" onclick="viewUserAssignments('${item.aims}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                            View
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
        const paginationContainer = document.getElementById('assignmentPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeAssignmentPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeAssignmentPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeAssignmentPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('assignmentShowingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('assignmentShowingEnd').textContent = endIndex;
        document.getElementById('assignmentShowingTotal').textContent = this.filteredData.length;
    }

    filterData() {
        const wilayah = document.getElementById('filterWilayah').value;
        const search = document.getElementById('searchAssignment').value.toLowerCase();

        // Group assignments by user first
        const groupedData = {};
        this.assignmentData.forEach(assignment => {
            if (!groupedData[assignment.aims]) {
                groupedData[assignment.aims] = {
                    aims: assignment.aims,
                    nama: assignment.nama,
                    email: assignment.email,
                    telepon: assignment.telepon,
                    typeBadan: assignment.typeBadan,
                    wilayah: assignment.wilayah,
                    branch: assignment.branch,
                    assignments: []
                };
            }
            groupedData[assignment.aims].assignments.push({
                id: assignment.id,
                jabatan: assignment.jabatan,
                managementType: assignment.managementType,
                wilayah: assignment.wilayah,
                branch: assignment.branch,
                tanggalAssignment: assignment.tanggalAssignment
            });
        });
        
        this.filteredData = Object.values(groupedData).filter(item => {
            const wilayahMatch = !wilayah || item.wilayah === wilayah;
            const searchMatch = !search || 
                               item.nama.toLowerCase().includes(search) ||
                               item.aims.toLowerCase().includes(search) ||
                               item.email.toLowerCase().includes(search);

            return wilayahMatch && searchMatch;
        });

        this.currentPage = 1;
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    resetFilter() {
        document.getElementById('filterWilayah').value = '';
        document.getElementById('searchAssignment').value = '';
        
        this.loadAssignmentData();
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

    updateAddUserInfo() {
        const select = document.getElementById('addAssignmentAims');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.user) {
            const user = JSON.parse(selectedOption.dataset.user);
            document.getElementById('addAssignmentNama').value = user.nama;
            document.getElementById('addAssignmentEmail').value = user.email;
            document.getElementById('addAssignmentTelepon').value = user.telepon;
        } else {
            document.getElementById('addAssignmentNama').value = '';
            document.getElementById('addAssignmentEmail').value = '';
            document.getElementById('addAssignmentTelepon').value = '';
        }
    }

    updateEditUserInfo() {
        const select = document.getElementById('editAssignmentAims');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.user) {
            const user = JSON.parse(selectedOption.dataset.user);
            document.getElementById('editAssignmentNama').value = user.nama;
            document.getElementById('editAssignmentEmail').value = user.email;
            document.getElementById('editAssignmentTelepon').value = user.telepon;
        }
    }

    updateAddAssignmentBranches() {
        const selectedWilayah = document.getElementById('addAssignmentWilayah').value;
        const branchSelect = document.getElementById('addAssignmentBranch');
        
        branchSelect.innerHTML = '<option value="">Pilih Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    updateEditAssignmentBranches() {
        const selectedWilayah = document.getElementById('editAssignmentWilayah').value;
        const branchSelect = document.getElementById('editAssignmentBranch');
        
        branchSelect.innerHTML = '<option value="">Pilih Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    showAddAssignmentModal() {
        // Reset form
        document.getElementById('addAssignmentForm').reset();
        this.populateUserDropdowns();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addAssignmentModal'));
        modal.show();
    }

    addNewAssignment() {
        // Get form data
        const newAssignment = {
            id: `ASG-${String(this.assignmentData.length + 1).padStart(3, '0')}`,
            userId: `USR-${String(this.assignmentData.length + 1).padStart(3, '0')}`,
            aims: document.getElementById('addAssignmentAims').value,
            nama: document.getElementById('addAssignmentNama').value,
            email: document.getElementById('addAssignmentEmail').value,
            telepon: document.getElementById('addAssignmentTelepon').value,
            wilayah: document.getElementById('addAssignmentWilayah').value,
            branch: document.getElementById('addAssignmentBranch').value,
            jabatan: document.getElementById('addAssignmentJabatan').value,
            managementType: document.getElementById('addAssignmentManagementType').value,
            tanggalAssignment: new Date(),
            createdAt: new Date().toISOString()
        };

        // Validate form
        if (!this.validateAssignmentForm(newAssignment)) {
            return;
        }

        // Show loading
        if (window.showLoading) {
            showLoading('Menambah Assignment', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Add assignment to data
            this.assignmentData.unshift(newAssignment);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAssignmentModal'));
            modal.hide();

            // Refresh display
            this.loadAssignmentData();
            this.updateStatistics();
            this.renderTable();
            this.renderPagination();
            this.populateUserDropdowns();

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Berhasil!', `User ${newAssignment.nama} telah berhasil di-assign`);
            }
        }, 1500);
    }

    validateAssignmentForm(assignment) {
        const requiredFields = ['aims', 'wilayah', 'branch', 'jabatan', 'managementType'];
        const missingFields = requiredFields.filter(field => !assignment[field]);

        if (missingFields.length > 0) {
            if (window.showError) {
                showError('Form Tidak Lengkap', 'Mohon lengkapi semua field yang diperlukan');
            }
            return false;
        }

        return true;
    }

    viewUserAssignments(aims) {
        const userAssignments = this.assignmentData.filter(a => a.aims === aims);
        if (userAssignments.length === 0) return;
        
        const user = userAssignments[0]; // Get user info from first assignment

        const detailHtml = `
            <div class="user-assignment-detail">
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-user"></i> Informasi User</h6>
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
                        <h6><i class="fas fa-chart-bar"></i> Statistik Assignment</h6>
                        <div class="detail-item">
                            <span class="label">Total Assignments:</span>
                            <span class="value">
                                <span class="badge bg-success">${userAssignments.length}</span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Wilayah Aktif:</span>
                            <span class="value">${[...new Set(userAssignments.map(a => a.wilayah))].length}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Branch Aktif:</span>
                            <span class="value">${[...new Set(userAssignments.map(a => a.branch))].length}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Management Types:</span>
                            <span class="value">${[...new Set(userAssignments.map(a => a.managementType))].length}</span>
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <h6><i class="fas fa-list"></i> Daftar Assignments</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Wilayah</th>
                                <th>Branch</th>
                                <th>Jabatan</th>
                                <th>Management Type</th>
                                <th>Tanggal Assignment</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userAssignments.map(assignment => `
                                <tr>
                                    <td><span class="badge bg-secondary">${assignment.wilayah}</span></td>
                                    <td><span class="badge bg-info">${assignment.branch}</span></td>
                                    <td><span class="badge bg-primary">${assignment.jabatan}</span></td>
                                    <td><span class="badge bg-success">${assignment.managementType}</span></td>
                                    <td>${this.formatDate(assignment.tanggalAssignment)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('userAssignmentDetail').innerHTML = detailHtml;
        
        if (window.SwalHelper) {
            const modal = new bootstrap.Modal(document.getElementById('viewUserAssignmentModal'));
            modal.show();
        }
    }

    exportData() {
        if (window.showLoading) {
            showLoading('Mengexport Data', 'Mohon tunggu sebentar...');
        }

        setTimeout(() => {
            // Create CSV content
            const headers = ['AIMS', 'Nama', 'Email', 'Telepon', 'Type Badan', 'Wilayah', 'Branch', 'Jabatan', 'Management Type', 'Tanggal Assignment'];
            const csvContent = [
                headers.join(','),
                ...this.assignmentData.map(assignment => [
                    assignment.aims,
                    `"${assignment.nama}"`,
                    assignment.email,
                    assignment.telepon,
                    assignment.typeBadan,
                    assignment.wilayah,
                    assignment.branch,
                    assignment.jabatan,
                    assignment.managementType,
                    this.formatDate(assignment.tanggalAssignment)
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `assignment-user-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Data assignment user telah berhasil diexport ke file CSV');
            }
        }, 1500);
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
    if (document.getElementById('assignmentTable')) {
        window.assignmentManager = new AssignmentManager();
    }
});

// Global functions
function filterAssignmentData() {
    if (window.assignmentManager) {
        window.assignmentManager.filterData();
    }
}

function resetAssignmentFilter() {
    if (window.assignmentManager) {
        window.assignmentManager.resetFilter();
    }
}

function changeAssignmentPage(page) {
    if (window.assignmentManager) {
        window.assignmentManager.changePage(page);
    }
}

function exportAssignmentData() {
    if (window.assignmentManager) {
        window.assignmentManager.exportData();
    }
}

function showAddAssignmentModal() {
    if (window.assignmentManager) {
        window.assignmentManager.showAddAssignmentModal();
    }
}

function addNewAssignment() {
    if (window.assignmentManager) {
        window.assignmentManager.addNewAssignment();
    }
}

function viewUserAssignments(aims) {
    if (window.assignmentManager) {
        window.assignmentManager.viewUserAssignments(aims);
    }
}

function updateAddUserInfo() {
    if (window.assignmentManager) {
        window.assignmentManager.updateAddUserInfo();
    }
}

function updateAddAssignmentBranches() {
    if (window.assignmentManager) {
        window.assignmentManager.updateAddAssignmentBranches();
    }
}