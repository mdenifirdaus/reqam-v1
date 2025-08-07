// Rekening Bank JavaScript
class RekeningBankManager {
    constructor() {
        this.branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };
        this.rekeningData = this.generateMockRekeningData();
        this.filteredData = [...this.rekeningData];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadRekeningData();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    generateMockRekeningData() {
        const bankList = ['Bank Mandiri', 'Bank BCA', 'Bank BRI', 'Bank BNI', 'Bank CIMB Niaga', 'Bank Danamon'];
        const wilayahList = ['Jakarta', 'Bandung', 'Surabaya', 'Jawa Barat 10', 'Jawa Barat 7'];
        const typeManagementList = ['MARKAZ', 'AMILA', 'KHUDAM', 'LAJNAH', 'ANSHAR', 'AMSA'];
        const typeBadanList = ['Khuddam', 'Lajnah Imaillah', 'Anshar', 'Athfal'];
        const namaPemilikList = ['Ahmad Pratama', 'Budi Santoso', 'Citra Dewi', 'Dedi Kurniawan', 'Eka Sari', 'Fajar Hidayat'];
        
        const rekeningData = [];
        
        for (let i = 1; i <= 20; i++) {
            const wilayah = wilayahList[Math.floor(Math.random() * wilayahList.length)];
            const branches = this.branchData[wilayah];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const bank = bankList[Math.floor(Math.random() * bankList.length)];
            const typeManagement = typeManagementList[Math.floor(Math.random() * typeManagementList.length)];
            const typeBadan = typeBadanList[Math.floor(Math.random() * typeBadanList.length)];
            const namaPemilik = namaPemilikList[Math.floor(Math.random() * namaPemilikList.length)];
            
            rekeningData.push({
                id: `REK-${String(i).padStart(3, '0')}`,
                namaBank: bank,
                nomorRekening: this.generateNomorRekening(bank),
                namaPemilik: namaPemilik,
                wilayah: wilayah,
                branch: branch,
                typeManagement: typeManagement,
                typeBadan: typeBadan,
                saldo: Math.floor(Math.random() * 50000000) + 5000000, // 5M - 55M
                tanggalDibuat: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                createdAt: new Date().toISOString()
            });
        }
        
        return rekeningData.sort((a, b) => new Date(b.tanggalDibuat) - new Date(a.tanggalDibuat));
    }

    generateNomorRekening(bank) {
        const bankCodes = {
            'Bank Mandiri': '1380',
            'Bank BCA': '0141',
            'Bank BRI': '0026',
            'Bank BNI': '0009',
            'Bank CIMB Niaga': '0022',
            'Bank Danamon': '0011'
        };
        
        const code = bankCodes[bank] || '0000';
        const randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        return code + randomNumber;
    }

    loadRekeningData() {
        this.filteredData = [...this.rekeningData];
        this.currentPage = 1;
    }

    updateStatistics() {
        const totalRekening = this.filteredData.length;
        const totalSaldo = this.filteredData.reduce((sum, item) => sum + item.saldo, 0);
        const uniqueBranch = [...new Set(this.filteredData.map(item => item.branch))].length;
        const uniqueWilayah = [...new Set(this.filteredData.map(item => item.wilayah))].length;

        document.getElementById('statTotalRekening').textContent = totalRekening;
        document.getElementById('statTotalSaldo').textContent = this.formatCurrency(totalSaldo);
        document.getElementById('statTotalBranch').textContent = uniqueBranch;
        document.getElementById('statTotalWilayah').textContent = uniqueWilayah;
        document.getElementById('totalRekeningCount').textContent = totalRekening;
    }

    renderTable() {
        const tbody = document.getElementById('rekeningTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="fas fa-university text-primary me-2"></i>
                            <strong>${item.namaBank}</strong>
                        </div>
                    </td>
                    <td><code>${item.nomorRekening}</code></td>
                    <td>${item.namaPemilik}</td>
                    <td><span class="badge bg-secondary">${item.wilayah}</span></td>
                    <td><span class="badge bg-info">${item.branch}</span></td>
                    <td><span class="badge bg-primary">${item.typeManagement}</span></td>
                    <td><span class="badge bg-success">${item.typeBadan}</span></td>
                    <td><strong class="text-success">${this.formatCurrency(item.saldo)}</strong></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="editRekening('${item.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info btn-action" onclick="viewRekeningDetail('${item.id}')" title="Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteRekening('${item.id}')" title="Hapus">
                            <i class="fas fa-trash"></i>
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
        const paginationContainer = document.getElementById('rekeningPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeRekeningPage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="changeRekeningPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeRekeningPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('rekeningShowingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('rekeningShowingEnd').textContent = endIndex;
        document.getElementById('rekeningShowingTotal').textContent = this.filteredData.length;
    }

    filterData() {
        const wilayah = document.getElementById('filterWilayah').value;
        const branch = document.getElementById('filterBranch').value;
        const typeManagement = document.getElementById('filterTypeManagement').value;
        const typeBadan = document.getElementById('filterTypeBadan').value;
        const search = document.getElementById('searchRekening').value.toLowerCase();

        this.filteredData = this.rekeningData.filter(item => {
            const wilayahMatch = !wilayah || item.wilayah === wilayah;
            const branchMatch = !branch || item.branch === branch;
            const typeManagementMatch = !typeManagement || item.typeManagement === typeManagement;
            const typeBadanMatch = !typeBadan || item.typeBadan === typeBadan;
            const searchMatch = !search || 
                               item.namaBank.toLowerCase().includes(search) ||
                               item.nomorRekening.toLowerCase().includes(search) ||
                               item.namaPemilik.toLowerCase().includes(search);

            return wilayahMatch && branchMatch && typeManagementMatch && typeBadanMatch && searchMatch;
        });

        this.currentPage = 1;
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    updateFilterBranches() {
        const selectedWilayah = document.getElementById('filterWilayah').value;
        const branchSelect = document.getElementById('filterBranch');
        
        branchSelect.innerHTML = '<option value="">Semua Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    updateAddBranches() {
        const selectedWilayah = document.getElementById('addWilayah').value;
        const branchSelect = document.getElementById('addBranch');
        
        branchSelect.innerHTML = '<option value="">Pilih Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    updateEditBranches() {
        const selectedWilayah = document.getElementById('editWilayah').value;
        const branchSelect = document.getElementById('editBranch');
        
        branchSelect.innerHTML = '<option value="">Pilih Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    resetFilter() {
        document.getElementById('filterWilayah').value = '';
        document.getElementById('filterBranch').value = '';
        document.getElementById('filterTypeManagement').value = '';
        document.getElementById('filterTypeBadan').value = '';
        document.getElementById('searchRekening').value = '';
        
        this.loadRekeningData();
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

    showAddRekeningModal() {
        // Reset form
        document.getElementById('addRekeningForm').reset();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addRekeningModal'));
        modal.show();
    }

    addNewRekening() {
        // Get form data
        const newRekening = {
            id: `REK-${String(this.rekeningData.length + 1).padStart(3, '0')}`,
            namaBank: document.getElementById('addNamaBank').value,
            nomorRekening: document.getElementById('addNomorRekening').value,
            namaPemilik: document.getElementById('addNamaPemilik').value,
            saldo: parseInt(document.getElementById('addSaldo').value),
            wilayah: document.getElementById('addWilayah').value,
            branch: document.getElementById('addBranch').value,
            typeManagement: document.getElementById('addTypeManagement').value,
            typeBadan: document.getElementById('addTypeBadan').value,
            tanggalDibuat: new Date(),
            createdAt: new Date().toISOString()
        };

        // Validate form
        if (!this.validateRekeningForm(newRekening)) {
            return;
        }

        // Check if nomor rekening already exists
        const existingRekening = this.rekeningData.find(r => r.nomorRekening === newRekening.nomorRekening);
        if (existingRekening) {
            showError('Nomor Rekening Sudah Ada', 'Nomor rekening yang Anda masukkan sudah terdaftar');
            return;
        }

        // Show loading
        if (window.showLoading) {
            showLoading('Menambah Rekening', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Add rekening to data
            this.rekeningData.unshift(newRekening);
            this.filteredData.unshift(newRekening);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addRekeningModal'));
            modal.hide();

            // Refresh display
            this.updateStatistics();
            this.renderTable();
            this.renderPagination();

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Berhasil!', `Rekening ${newRekening.namaBank} telah berhasil ditambahkan`);
            }
        }, 1500);
    }

    editRekening(rekeningId) {
        const rekening = this.rekeningData.find(r => r.id === rekeningId);
        if (!rekening) return;

        // Populate edit form
        document.getElementById('editRekeningId').value = rekening.id;
        document.getElementById('editNamaBank').value = rekening.namaBank;
        document.getElementById('editNomorRekening').value = rekening.nomorRekening;
        document.getElementById('editNamaPemilik').value = rekening.namaPemilik;
        document.getElementById('editSaldo').value = rekening.saldo;
        document.getElementById('editWilayah').value = rekening.wilayah;
        
        // Update branches and set branch
        this.updateEditBranches();
        setTimeout(() => {
            document.getElementById('editBranch').value = rekening.branch;
        }, 100);
        
        document.getElementById('editTypeManagement').value = rekening.typeManagement;
        document.getElementById('editTypeBadan').value = rekening.typeBadan;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editRekeningModal'));
        modal.show();
    }

    saveRekeningChanges() {
        const rekeningId = document.getElementById('editRekeningId').value;
        const rekeningIndex = this.rekeningData.findIndex(r => r.id === rekeningId);
        
        if (rekeningIndex === -1) return;

        // Get form data
        const updatedRekening = {
            ...this.rekeningData[rekeningIndex],
            namaBank: document.getElementById('editNamaBank').value,
            nomorRekening: document.getElementById('editNomorRekening').value,
            namaPemilik: document.getElementById('editNamaPemilik').value,
            saldo: parseInt(document.getElementById('editSaldo').value),
            wilayah: document.getElementById('editWilayah').value,
            branch: document.getElementById('editBranch').value,
            typeManagement: document.getElementById('editTypeManagement').value,
            typeBadan: document.getElementById('editTypeBadan').value
        };

        // Validate form
        if (!this.validateRekeningForm(updatedRekening)) {
            return;
        }

        // Show loading
        if (window.showLoading) {
            showLoading('Menyimpan Perubahan', 'Mohon tunggu sebentar...');
        }

        // Simulate API call
        setTimeout(() => {
            // Update rekening data
            this.rekeningData[rekeningIndex] = updatedRekening;
            
            // Update filtered data if needed
            const filteredIndex = this.filteredData.findIndex(r => r.id === rekeningId);
            if (filteredIndex !== -1) {
                this.filteredData[filteredIndex] = updatedRekening;
            }

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editRekeningModal'));
            modal.hide();

            // Refresh display
            this.updateStatistics();
            this.renderTable();

            // Close loading and show success
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Berhasil!', 'Data rekening telah berhasil diperbarui');
            }
        }, 1500);
    }

    deleteRekening(rekeningId) {
        const rekening = this.rekeningData.find(r => r.id === rekeningId);
        if (!rekening) return;

        if (window.showConfirm) {
            showConfirm(
                'Konfirmasi Hapus',
                `Apakah Anda yakin ingin menghapus rekening ${rekening.namaBank} - ${rekening.nomorRekening}?`,
                {
                    confirmText: 'Ya, Hapus',
                    cancelText: 'Batal'
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    // Show loading
                    showLoading('Menghapus Rekening', 'Mohon tunggu sebentar...');

                    setTimeout(() => {
                        // Remove from data
                        this.rekeningData = this.rekeningData.filter(r => r.id !== rekeningId);
                        this.filteredData = this.filteredData.filter(r => r.id !== rekeningId);

                        // Refresh display
                        this.updateStatistics();
                        this.renderTable();
                        this.renderPagination();

                        // Show success
                        SwalHelper.close();
                        showSuccess('Berhasil!', 'Rekening telah berhasil dihapus');
                    }, 1000);
                }
            });
        }
    }

    viewRekeningDetail(rekeningId) {
        const rekening = this.rekeningData.find(r => r.id === rekeningId);
        if (!rekening) return;

        const detailHtml = `
            <div class="rekening-detail-card">
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-university"></i> Informasi Bank</h6>
                        <div class="detail-item">
                            <span class="label">Nama Bank:</span>
                            <span class="value">${rekening.namaBank}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Nomor Rekening:</span>
                            <span class="value"><code>${rekening.nomorRekening}</code></span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Nama Pemilik:</span>
                            <span class="value">${rekening.namaPemilik}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Saldo:</span>
                            <span class="value"><strong class="text-success">${this.formatCurrency(rekening.saldo)}</strong></span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-info-circle"></i> Informasi Organisasi</h6>
                        <div class="detail-item">
                            <span class="label">Wilayah:</span>
                            <span class="value">
                                <span class="badge bg-secondary">${rekening.wilayah}</span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Branch:</span>
                            <span class="value">
                                <span class="badge bg-info">${rekening.branch}</span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Type Management:</span>
                            <span class="value">
                                <span class="badge bg-primary">${rekening.typeManagement}</span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Type Badan:</span>
                            <span class="value">
                                <span class="badge bg-success">${rekening.typeBadan}</span>
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Tanggal Dibuat:</span>
                            <span class="value">${this.formatDate(rekening.tanggalDibuat)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.SwalHelper) {
            SwalHelper.html(`Detail Rekening - ${rekening.namaBank}`, detailHtml, {
                width: '600px',
                confirmButtonText: 'Tutup'
            });
        }
    }

    validateRekeningForm(rekening) {
        const requiredFields = ['namaBank', 'nomorRekening', 'namaPemilik', 'saldo', 'wilayah', 'branch', 'typeManagement', 'typeBadan'];
        const missingFields = requiredFields.filter(field => !rekening[field] && rekening[field] !== 0);

        if (missingFields.length > 0) {
            if (window.showError) {
                showError('Form Tidak Lengkap', 'Mohon lengkapi semua field yang diperlukan');
            }
            return false;
        }

        if (rekening.saldo < 0) {
            if (window.showError) {
                showError('Saldo Tidak Valid', 'Saldo tidak boleh negatif');
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
            const headers = ['Nama Bank', 'Nomor Rekening', 'Nama Pemilik', 'Wilayah', 'Branch', 'Type Management', 'Type Badan', 'Saldo', 'Tanggal Dibuat'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(rekening => [
                    `"${rekening.namaBank}"`,
                    rekening.nomorRekening,
                    `"${rekening.namaPemilik}"`,
                    rekening.wilayah,
                    rekening.branch,
                    rekening.typeManagement,
                    rekening.typeBadan,
                    rekening.saldo,
                    this.formatDate(rekening.tanggalDibuat)
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rekening-bank-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Data rekening bank telah berhasil diexport ke file CSV');
            }
        }, 1500);
    }

    // Get total saldo by filters (for integration with Saldo Balance)
    getTotalSaldoByFilter(filters = {}) {
        let filteredRekening = this.rekeningData;
        
        if (filters.wilayah) {
            filteredRekening = filteredRekening.filter(r => r.wilayah === filters.wilayah);
        }
        if (filters.branch) {
            filteredRekening = filteredRekening.filter(r => r.branch === filters.branch);
        }
        if (filters.typeManagement) {
            filteredRekening = filteredRekening.filter(r => r.typeManagement === filters.typeManagement);
        }
        if (filters.typeBadan) {
            filteredRekening = filteredRekening.filter(r => r.typeBadan === filters.typeBadan);
        }
        
        return filteredRekening.reduce((sum, item) => sum + item.saldo, 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
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
    if (document.getElementById('rekeningTable')) {
        window.rekeningBankManager = new RekeningBankManager();
    }
});

// Global functions
function filterRekeningData() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.filterData();
    }
}

function updateFilterBranches() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.updateFilterBranches();
    }
}

function updateAddBranches() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.updateAddBranches();
    }
}

function updateEditBranches() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.updateEditBranches();
    }
}

function resetRekeningFilter() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.resetFilter();
    }
}

function changeRekeningPage(page) {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.changePage(page);
    }
}

function showAddRekeningModal() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.showAddRekeningModal();
    }
}

function addNewRekening() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.addNewRekening();
    }
}

function editRekening(rekeningId) {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.editRekening(rekeningId);
    }
}

function saveRekeningChanges() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.saveRekeningChanges();
    }
}

function deleteRekening(rekeningId) {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.deleteRekening(rekeningId);
    }
}

function viewRekeningDetail(rekeningId) {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.viewRekeningDetail(rekeningId);
    }
}

function exportRekeningData() {
    if (window.rekeningBankManager) {
        window.rekeningBankManager.exportData();
    }
}