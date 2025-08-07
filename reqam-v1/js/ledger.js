// General Ledger JavaScript
class LedgerManager {
    constructor() {
        this.ledgerData = this.generateMockLedgerData();
        this.filteredData = [...this.ledgerData];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.init();
    }

    init() {
        this.updateLedgerData();
        this.renderTable();
        this.renderPagination();
        this.updateSummary();
    }

    generateMockLedgerData() {
        const wilayahData = ['Jakarta', 'Bandung', 'Surabaya', 'Jawa Barat 10', 'Jawa Barat 7'];
        const branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };

        const transactionTypes = [
            { desc: 'Penerimaan Dana Pusat', type: 'income' },
            { desc: 'Donasi Anggota', type: 'income' },
            { desc: 'Penjualan Aset', type: 'income' },
            { desc: 'Bunga Bank', type: 'income' },
            { desc: 'Operasional Kantor', type: 'expense' },
            { desc: 'Program Kerja', type: 'expense' },
            { desc: 'Maintenance Gedung', type: 'expense' },
            { desc: 'Gaji Karyawan', type: 'expense' },
            { desc: 'Utilities (Listrik, Air)', type: 'expense' },
            { desc: 'Transport & Komunikasi', type: 'expense' },
            { desc: 'Supplies Kantor', type: 'expense' },
            { desc: 'Pelatihan & Development', type: 'expense' }
        ];

        const managementTypes = ['MARKAZ', 'AMILA', 'KHUDAM', 'LAJNAH', 'ANSHAR', 'AMSA'];

        const ledgerData = [];
        let runningBalance = 50000000; // Starting balance

        // Generate data for the last 6 months
        for (let month = 0; month < 6; month++) {
            const date = new Date();
            date.setMonth(date.getMonth() - month);
            
            // Generate 15-25 transactions per month
            const transactionsPerMonth = Math.floor(Math.random() * 10) + 15;
            
            for (let i = 0; i < transactionsPerMonth; i++) {
                const transactionDate = new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1);
                const wilayah = wilayahData[Math.floor(Math.random() * wilayahData.length)];
                const branch = branchData[wilayah][Math.floor(Math.random() * branchData[wilayah].length)];
                const transaction = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
                const managementType = managementTypes[Math.floor(Math.random() * managementTypes.length)];
                
                let amount = 0;
                if (transaction.type === 'income') {
                    amount = Math.floor(Math.random() * 5000000) + 500000; // 500k - 5.5M
                    runningBalance += amount;
                } else {
                    amount = Math.floor(Math.random() * 3000000) + 200000; // 200k - 3.2M
                    runningBalance -= amount;
                }

                ledgerData.push({
                    id: `TXN-${Date.now()}-${i}`,
                    tanggal: transactionDate,
                    deskripsi: transaction.desc,
                    wilayah: wilayah,
                    branch: branch,
                    managementType: managementType,
                    pemasukan: transaction.type === 'income' ? amount : 0,
                    pengeluaran: transaction.type === 'expense' ? amount : 0,
                    saldo: runningBalance,
                    type: transaction.type
                });
            }
        }

        return ledgerData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }

    updateLedgerData() {
        const selectedMonth = document.getElementById('ledgerMonth')?.value || '';
        const selectedYear = document.getElementById('ledgerYear')?.value || '';
        const selectedWilayah = document.getElementById('ledgerWilayah')?.value || '';
        const selectedBranch = document.getElementById('ledgerBranch')?.value || '';
        const selectedManagementType = document.getElementById('ledgerManagementType')?.value || '';

        // Filter data
        this.filteredData = this.ledgerData.filter(item => {
            const itemDate = new Date(item.tanggal);
            const itemMonth = itemDate.getMonth() + 1;
            const itemYear = itemDate.getFullYear();
            
            const monthMatch = !selectedMonth || itemMonth === parseInt(selectedMonth);
            const yearMatch = !selectedYear || itemYear === parseInt(selectedYear);
            const wilayahMatch = !selectedWilayah || item.wilayah === selectedWilayah;
            const branchMatch = !selectedBranch || item.branch === selectedBranch;
            const managementTypeMatch = !selectedManagementType || item.managementType === selectedManagementType;
            
            return monthMatch && yearMatch && wilayahMatch && branchMatch && managementTypeMatch;
        });

        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
        this.updateSummary();
        this.updateFilterInfo();
    }

    updateFilterInfo() {
        const selectedMonth = document.getElementById('ledgerMonth')?.value || '';
        const selectedYear = document.getElementById('ledgerYear')?.value || '';
        const selectedWilayah = document.getElementById('ledgerWilayah')?.value || '';
        const selectedBranch = document.getElementById('ledgerBranch')?.value || '';
        const selectedManagementType = document.getElementById('ledgerManagementType')?.value || '';
        
        let filterText = 'Menampilkan data untuk: ';
        let filters = [];
        
        if (selectedMonth) {
            const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                              'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            filters.push(`Bulan ${monthNames[parseInt(selectedMonth)]}`);
        }
        if (selectedYear) filters.push(`Tahun ${selectedYear}`);
        if (selectedWilayah) filters.push(`Wilayah ${selectedWilayah}`);
        if (selectedBranch) filters.push(`Branch ${selectedBranch}`);
        if (selectedManagementType) filters.push(`Management Type ${selectedManagementType}`);
        
        if (filters.length === 0) {
            filterText = 'Menampilkan semua data transaksi';
        } else {
            filterText += filters.join(', ');
        }
        
        // Show filter info if any filter is applied
        const filterInfoElement = document.getElementById('filterInfo');
        if (filterInfoElement) {
            if (filters.length > 0) {
                filterInfoElement.style.display = 'block';
                filterInfoElement.querySelector('#filterInfoText').textContent = filterText;
            } else {
                filterInfoElement.style.display = 'none';
            }
        }
    }

    updateLedgerBranches() {
        const selectedWilayah = document.getElementById('ledgerWilayah')?.value || '';
        const branchSelect = document.getElementById('ledgerBranch');
        
        if (!branchSelect) return;

        branchSelect.innerHTML = '<option value="">Semua Branch</option>';
        
        if (selectedWilayah) {
            const branches = [...new Set(
                this.ledgerData
                    .filter(item => item.wilayah === selectedWilayah)
                    .map(item => item.branch)
            )];
            
            branches.forEach(branch => {
                branchSelect.innerHTML += `<option value="${branch}">${branch}</option>`;
            });
        }
    }

    renderTable() {
        const tbody = document.getElementById('ledgerTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            html += `
                <tr>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>${item.deskripsi}</td>
                    <td><span class="badge bg-secondary">${item.wilayah}</span></td>
                    <td><span class="badge bg-info">${item.branch}</span></td>
                    <td><span class="badge bg-primary">${item.managementType}</span></td>
                    <td class="text-success">
                        ${item.pemasukan > 0 ? this.formatCurrency(item.pemasukan) : '-'}
                    </td>
                    <td class="text-danger">
                        ${item.pengeluaran > 0 ? this.formatCurrency(item.pengeluaran) : '-'}
                    </td>
                    <td><strong>${this.formatCurrency(item.saldo)}</strong></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        this.updatePaginationInfo();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('ledgerPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeLedgerPage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="changeLedgerPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeLedgerPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('ledgerShowingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('ledgerShowingEnd').textContent = endIndex;
        document.getElementById('ledgerShowingTotal').textContent = this.filteredData.length;
    }

    updateSummary() {
        const totalIncome = this.filteredData.reduce((sum, item) => sum + item.pemasukan, 0);
        const totalExpense = this.filteredData.reduce((sum, item) => sum + item.pengeluaran, 0);
        const finalBalance = totalIncome - totalExpense;
        const totalTransactions = this.filteredData.length;

        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpense').textContent = this.formatCurrency(totalExpense);
        document.getElementById('finalBalance').textContent = this.formatCurrency(finalBalance);
        document.getElementById('totalTransactions').textContent = totalTransactions;

        // Update final balance color
        const finalBalanceElement = document.getElementById('finalBalance');
        if (finalBalance > 0) {
            finalBalanceElement.className = 'text-success';
        } else if (finalBalance < 0) {
            finalBalanceElement.className = 'text-danger';
        } else {
            finalBalanceElement.className = 'text-muted';
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

    resetFilter() {
        document.getElementById('ledgerMonth').value = '';
        document.getElementById('ledgerYear').value = '';
        document.getElementById('ledgerWilayah').value = '';
        document.getElementById('ledgerBranch').value = '';
        document.getElementById('ledgerManagementType').value = '';
        
        this.updateLedgerData();
        
        if (window.showToast) {
            showToast('info', 'Filter telah direset');
        }
    }

    exportSummary() {
        if (window.showLoading) {
            showLoading('Mengexport Summary', 'Mohon tunggu sebentar...');
        }

        setTimeout(() => {
            const totalIncome = this.filteredData.reduce((sum, item) => sum + item.pemasukan, 0);
            const totalExpense = this.filteredData.reduce((sum, item) => sum + item.pengeluaran, 0);
            const finalBalance = totalIncome - totalExpense;

            // Create CSV content
            const headers = ['Tanggal', 'Deskripsi', 'Wilayah', 'Branch', 'Management Type', 'Pemasukan', 'Pengeluaran', 'Saldo'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(item => [
                    this.formatDate(item.tanggal),
                    `"${item.deskripsi}"`,
                    item.wilayah,
                    item.branch,
                    item.managementType,
                    item.pemasukan,
                    item.pengeluaran,
                    item.saldo
                ].join(',')),
                '',
                'SUMMARY',
                `Total Pemasukan,${totalIncome}`,
                `Total Pengeluaran,${totalExpense}`,
                `Saldo Akhir,${finalBalance}`,
                `Total Transaksi,${this.filteredData.length}`
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `general-ledger-summary-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Summary General Ledger telah berhasil diexport');
            }
        }, 1500);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ledgerTable')) {
        window.ledgerManager = new LedgerManager();
    }
});

// Global functions
function updateLedgerData() {
    if (window.ledgerManager) {
        window.ledgerManager.updateLedgerData();
    }
}

function updateLedgerBranches() {
    if (window.ledgerManager) {
        window.ledgerManager.updateLedgerBranches();
    }
}

function changeLedgerPage(page) {
    if (window.ledgerManager) {
        window.ledgerManager.changePage(page);
    }
}

function resetLedgerFilter() {
    if (window.ledgerManager) {
        window.ledgerManager.resetFilter();
    }
}

function exportLedgerSummary() {
    if (window.ledgerManager) {
        window.ledgerManager.exportSummary();
    }
}