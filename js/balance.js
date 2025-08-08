// Simplified Balance Management JavaScript
class BalanceManager {
    constructor() {
        this.branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };
        this.usageData = this.generateMockUsageData();
        this.filteredData = [...this.usageData];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.init();
    }

    init() {
        this.updateCurrentBalance();
        this.updateBankAccountsList();
        this.filterUsageData();
    }

    generateMockUsageData() {
        const categories = ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'];
        const typeManagementList = ['MARKAZ', 'AMILA', 'KHUDAM', 'LAJNAH', 'ANSHAR', 'AMSA'];
        const typeBadanList = ['Khuddam', 'Lajnah Imaillah', 'Anshar', 'Athfal'];
        const descriptions = [
            'Biaya operasional kantor',
            'Program kerja bulanan',
            'Perbaikan darurat',
            'Pembelian peralatan',
            'Maintenance gedung',
            'Gaji karyawan',
            'Utilities kantor',
            'Transport dan komunikasi',
            'Supplies kantor',
            'Pelatihan karyawan'
        ];
        const statuses = ['Selesai', 'Proses', 'Pending'];
        const wilayahList = ['Jakarta', 'Bandung', 'Surabaya', 'Jawa Barat 10', 'Jawa Barat 7'];

        const usageData = [];

        // Generate data for the last 6 months
        for (let month = 0; month < 6; month++) {
            const date = new Date();
            date.setMonth(date.getMonth() - month);
            
            // Generate 20-30 transactions per month
            const transactionsPerMonth = Math.floor(Math.random() * 10) + 20;
            
            for (let i = 0; i < transactionsPerMonth; i++) {
                const transactionDate = new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1);
                const wilayah = wilayahList[Math.floor(Math.random() * wilayahList.length)];
                const branches = this.branchData[wilayah];
                const branch = branches[Math.floor(Math.random() * branches.length)];
                const kategori = categories[Math.floor(Math.random() * categories.length)];
                const typeManagement = typeManagementList[Math.floor(Math.random() * typeManagementList.length)];
                const typeBadan = typeBadanList[Math.floor(Math.random() * typeBadanList.length)];
                const deskripsi = descriptions[Math.floor(Math.random() * descriptions.length)];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const jumlah = Math.floor(Math.random() * 5000000) + 500000; // 500k - 5.5M

                usageData.push({
                    id: `USG-${Date.now()}-${i}`,
                    tanggal: transactionDate,
                    deskripsi: deskripsi,
                    wilayah: wilayah,
                    branch: branch,
                    kategori: kategori,
                    typeManagement: typeManagement,
                    typeBadan: typeBadan,
                    jumlah: jumlah,
                    status: status,
                    createdAt: transactionDate.toISOString()
                });
            }
        }

        return usageData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }

    updateCurrentBalance() {
        // Get filters for balance calculation
        const filters = {
            wilayah: document.getElementById('filterWilayah')?.value || '',
            branch: document.getElementById('filterBranch')?.value || '',
            typeManagement: document.getElementById('filterTypeManagement')?.value || '',
            typeBadan: document.getElementById('filterTypeBadan')?.value || ''
        };

        // Get total saldo from Rekening Bank based on filters
        let totalSaldo = 0;
        if (window.rekeningBankManager) {
            totalSaldo = window.rekeningBankManager.getTotalSaldoByFilter(filters);
        } else {
            // Fallback if rekening bank manager not available
            totalSaldo = 100000000; // 100M default
        }

        // Calculate usage based on filters
        let filteredUsage = this.usageData;
        if (filters.wilayah) filteredUsage = filteredUsage.filter(item => item.wilayah === filters.wilayah);
        if (filters.branch) filteredUsage = filteredUsage.filter(item => item.branch === filters.branch);
        if (filters.typeManagement) filteredUsage = filteredUsage.filter(item => item.typeManagement === filters.typeManagement);
        if (filters.typeBadan) filteredUsage = filteredUsage.filter(item => item.typeBadan === filters.typeBadan);

        const completedUsage = filteredUsage
            .filter(item => item.status === 'Selesai')
            .reduce((sum, item) => sum + item.jumlah, 0);
        const pendingUsage = filteredUsage
            .filter(item => item.status === 'Pending')
            .reduce((sum, item) => sum + item.jumlah, 0);

        const saldoTersedia = totalSaldo - completedUsage - pendingUsage;
        const saldoPending = pendingUsage;

        document.getElementById('totalSaldo').textContent = this.formatCurrency(totalSaldo);
        document.getElementById('saldoTersedia').textContent = this.formatCurrency(saldoTersedia);
        document.getElementById('saldoPending').textContent = this.formatCurrency(saldoPending);
    }

    filterUsageData() {
        const selectedWilayah = document.getElementById('filterWilayah')?.value || '';
        const selectedBranch = document.getElementById('filterBranch')?.value || '';
        const selectedTypeManagement = document.getElementById('filterTypeManagement')?.value || '';
        const selectedTypeBadan = document.getElementById('filterTypeBadan')?.value || '';
        const selectedBulan = document.getElementById('filterBulan')?.value || '';
        const selectedTahun = document.getElementById('filterTahun')?.value || '';

        // Filter data
        this.filteredData = this.usageData.filter(item => {
            const itemDate = new Date(item.tanggal);
            const itemMonth = itemDate.getMonth() + 1;
            const itemYear = itemDate.getFullYear();
            
            const wilayahMatch = !selectedWilayah || item.wilayah === selectedWilayah;
            const branchMatch = !selectedBranch || item.branch === selectedBranch;
            const typeManagementMatch = !selectedTypeManagement || item.typeManagement === selectedTypeManagement;
            const typeBadanMatch = !selectedTypeBadan || item.typeBadan === selectedTypeBadan;
            const bulanMatch = !selectedBulan || itemMonth === parseInt(selectedBulan);
            const tahunMatch = !selectedTahun || itemYear === parseInt(selectedTahun);
            
            return wilayahMatch && branchMatch && typeManagementMatch && typeBadanMatch && bulanMatch && tahunMatch;
        });

        this.currentPage = 1;
        this.updateCurrentBalance(); // Update balance when filters change
        this.updateBankAccountsList(); // Update bank accounts list when filters change
        this.renderTable();
        this.renderPagination();
        this.updatePaginationInfo();
    }

    updateBankAccountsList() {
        const bankAccountsContainer = document.getElementById('bankAccountsList');
        if (!bankAccountsContainer) return;

        // Get filters
        const filters = {
            wilayah: document.getElementById('filterWilayah')?.value || '',
            branch: document.getElementById('filterBranch')?.value || '',
            typeManagement: document.getElementById('filterTypeManagement')?.value || '',
            typeBadan: document.getElementById('filterTypeBadan')?.value || ''
        };

        // Get filtered bank accounts
        let bankAccounts = [];
        if (window.rekeningBankManager) {
            // Get all bank accounts and filter them
            const allAccounts = window.rekeningBankManager.rekeningData || [];
            bankAccounts = allAccounts.filter(account => {
                const wilayahMatch = !filters.wilayah || account.wilayah === filters.wilayah;
                const branchMatch = !filters.branch || account.branch === filters.branch;
                const typeManagementMatch = !filters.typeManagement || account.typeManagement === filters.typeManagement;
                const typeBadanMatch = !filters.typeBadan || account.typeBadan === filters.typeBadan;
                
                return wilayahMatch && branchMatch && typeManagementMatch && typeBadanMatch;
            });
        } else {
            // Fallback mock data if rekening bank manager not available
            bankAccounts = [
                {
                    namaBank: 'Bank Mandiri',
                    nomorRekening: '1380001234567',
                    namaPemilik: 'REQAM Jakarta',
                    wilayah: 'Jakarta',
                    branch: 'Jakarta Utara',
                    typeManagement: 'MARKAZ',
                    typeBadan: 'Khuddam',
                    saldo: 50000000
                },
                {
                    namaBank: 'Bank BCA',
                    nomorRekening: '0141987654321',
                    namaPemilik: 'REQAM Jakarta',
                    wilayah: 'Jakarta',
                    branch: 'Jakarta Pusat',
                    typeManagement: 'AMILA',
                    typeBadan: 'Lajnah Imaillah',
                    saldo: 30000000
                }
            ];
        }

        if (bankAccounts.length === 0) {
            bankAccountsContainer.innerHTML = `
                <div class="alert alert-warning">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <span>Tidak ada rekening bank yang sesuai dengan filter yang dipilih. Silakan tambahkan rekening bank terlebih dahulu di menu <a href="rekening-bank.html" class="alert-link">Rekening Bank</a>.</span>
                    </div>
                </div>
            `;
            return;
        }

        let html = '<div class="row">';
        bankAccounts.forEach((account, index) => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="balance-detail-card">
                        <div class="balance-detail-header">
                            <div class="balance-detail-title">
                                <i class="fas fa-university"></i>
                                ${account.namaBank}
                            </div>
                            <div class="balance-detail-amount">${this.formatCurrency(account.saldo)}</div>
                        </div>
                        <div class="balance-detail-info">
                            <div class="balance-info-item">
                                <span class="balance-info-label">No. Rekening:</span>
                                <span class="balance-info-value"><code>${account.nomorRekening}</code></span>
                            </div>
                            <div class="balance-info-item">
                                <span class="balance-info-label">Pemilik:</span>
                                <span class="balance-info-value">${account.namaPemilik}</span>
                            </div>
                            <div class="balance-info-item">
                                <span class="balance-info-label">Wilayah/Branch:</span>
                                <span class="balance-info-value">${account.wilayah} - ${account.branch}</span>
                            </div>
                            <div class="balance-info-item">
                                <span class="balance-info-label">Type:</span>
                                <span class="balance-info-value">
                                    <span class="badge bg-primary me-1">${account.typeManagement}</span>
                                    <span class="badge bg-success">${account.typeBadan}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Add summary if multiple accounts
        if (bankAccounts.length > 1) {
            const totalSaldo = bankAccounts.reduce((sum, account) => sum + account.saldo, 0);
            html += `
                <div class="mt-3">
                    <div class="alert alert-success">
                        <div class="d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-calculator me-2"></i><strong>Total dari ${bankAccounts.length} rekening:</strong></span>
                            <span class="fs-5 fw-bold">${this.formatCurrency(totalSaldo)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        bankAccountsContainer.innerHTML = html;
    }

    updateBranches() {
        const selectedWilayah = document.getElementById('filterWilayah')?.value || '';
        const branchSelect = document.getElementById('filterBranch');
        
        if (!branchSelect) return;

        branchSelect.innerHTML = '<option value="">Semua Branch</option>';
        
        if (selectedWilayah && this.branchData[selectedWilayah]) {
            this.branchData[selectedWilayah].forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    renderTable() {
        const tbody = document.getElementById('usageTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const statusClass = this.getStatusClass(item.status);
            
            html += `
                <tr>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>${item.deskripsi}</td>
                    <td><span class="badge bg-secondary">${item.wilayah}</span></td>
                    <td><span class="badge bg-info">${item.branch}</span></td>
                    <td><span class="badge bg-primary">${item.kategori}</span></td>
                    <td><span class="badge bg-success">${item.typeManagement}</span></td>
                    <td><span class="badge bg-warning">${item.typeBadan}</span></td>
                    <td><strong>${this.formatCurrency(item.jumlah)}</strong></td>
                    <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('paginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('showingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('showingEnd').textContent = endIndex;
        document.getElementById('showingTotal').textContent = this.filteredData.length;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    resetFilter() {
        document.getElementById('filterWilayah').value = '';
        document.getElementById('filterBranch').value = '';
        document.getElementById('filterTypeManagement').value = '';
        document.getElementById('filterTypeBadan').value = '';
        document.getElementById('filterBulan').value = '';
        document.getElementById('filterTahun').value = '';
        
        this.filterUsageData();
        this.updateBankAccountsList();
        
        if (window.showToast) {
            showToast('info', 'Filter telah direset');
        }
    }

    exportData() {
        if (window.showLoading) {
            showLoading('Mengexport Data', 'Mohon tunggu sebentar...');
        }

        setTimeout(() => {
            // Create CSV content
            const headers = ['Tanggal', 'Deskripsi', 'Wilayah', 'Branch', 'Kategori', 'Jumlah', 'Status'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(item => [
                    this.formatDate(item.tanggal),
                    `"${item.deskripsi}"`,
                    item.wilayah,
                    item.branch,
                    item.kategori,
                    item.jumlah,
                    item.status
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pemakaian-dana-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Data pemakaian dana telah berhasil diexport');
            }
        }, 1500);
    }

    getStatusClass(status) {
        const classes = {
            'Selesai': 'status-approved',
            'Proses': 'status-processing',
            'Pending': 'status-pending'
        };
        return classes[status] || 'status-pending';
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
    if (document.getElementById('usageTable')) {
        window.balanceManager = new BalanceManager();
    }
});

// Global functions
function filterUsageData() {
    if (window.balanceManager) {
        window.balanceManager.filterUsageData();
    }
}

function updateBranches() {
    if (window.balanceManager) {
        window.balanceManager.updateBranches();
    }
}

function changePage(page) {
    if (window.balanceManager) {
        window.balanceManager.changePage(page);
    }
}

function resetFilter() {
    if (window.balanceManager) {
        window.balanceManager.resetFilter();
    }
}

function exportUsageData() {
    if (window.balanceManager) {
        window.balanceManager.exportData();
    }
}