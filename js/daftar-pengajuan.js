// Daftar Pengajuan JavaScript
class DaftarPengajuanManager {
    constructor() {
        this.pengajuanData = this.generateMockData();
        this.filteredData = [...this.pengajuanData];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadPengajuanData();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    generateMockData() {
        const categories = ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'];
        const priorities = ['Rendah', 'Normal', 'Tinggi', 'Urgent'];
        const statuses = ['pending', 'processing', 'approved', 'rejected'];
        const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        
        const mockData = [];
        
        // Add data from localStorage if exists
        const savedData = JSON.parse(localStorage.getItem('pengajuanData') || '[]');
        mockData.push(...savedData);
        
        // Generate additional mock data
        for (let i = 1; i <= 15; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            let progress = 25;
            if (status === 'processing') progress = 50;
            else if (status === 'approved') progress = 100;
            else if (status === 'rejected') progress = 75;
            
            mockData.push({
                id: `REQ-${String(i).padStart(3, '0')}`,
                pemohon: userData.nama || 'John Doe',
                wilayah: userData.wilayah || 'Jakarta',
                branch: userData.branch || 'Jakarta Utara',
                kategori: categories[Math.floor(Math.random() * categories.length)],
                prioritas: priorities[Math.floor(Math.random() * priorities.length)],
                jumlah: Math.floor(Math.random() * 10000000) + 1000000,
                deadline: new Date(date.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                keterangan: `Pengajuan dana untuk keperluan ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`,
                status: status,
                tanggal: date.toISOString().split('T')[0],
                progress: progress,
                createdAt: date.toISOString()
            });
        }
        
        return mockData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    loadPengajuanData() {
        // This would typically load from API
        this.filteredData = [...this.pengajuanData];
        this.currentPage = 1;
    }

    updateStatistics() {
        const total = this.filteredData.length;
        const approved = this.filteredData.filter(item => item.status === 'approved').length;
        const pending = this.filteredData.filter(item => item.status === 'pending' || item.status === 'processing').length;
        const totalAmount = this.filteredData.reduce((sum, item) => sum + item.jumlah, 0);

        document.getElementById('statTotal').textContent = total;
        document.getElementById('statApproved').textContent = approved;
        document.getElementById('statPending').textContent = pending;
        document.getElementById('statTotalAmount').textContent = this.formatCurrency(totalAmount);
        document.getElementById('totalPengajuanCount').textContent = total;
    }

    renderTable() {
        const tbody = document.getElementById('daftarPengajuanTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const statusClass = this.getStatusClass(item.status);
            const priorityClass = this.getPriorityClass(item.prioritas);
            
            html += `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td><span class="badge bg-secondary">${item.kategori}</span></td>
                    <td><strong>${this.formatCurrency(item.jumlah)}</strong></td>
                    <td><span class="priority-badge priority-${item.prioritas.toLowerCase()}">${item.prioritas}</span></td>
                    <td><span class="status-badge ${statusClass}">${this.getStatusText(item.status)}</span></td>
                    <td>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar ${this.getProgressBarClass(item.status)}" 
                                 style="width: ${item.progress}%" 
                                 title="${item.progress}%"></div>
                        </div>
                        <small class="text-muted">${item.progress}%</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="viewPengajuanDetail('${item.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info btn-action" onclick="trackPengajuan('${item.id}')" title="Track Status">
                            <i class="fas fa-route"></i>
                        </button>
                        ${item.status === 'pending' ? `
                            <button class="btn btn-sm btn-outline-warning btn-action" onclick="editPengajuan('${item.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        this.updatePaginationInfo();
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

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
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

    filterData() {
        const startDate = document.getElementById('filterTanggalMulai').value;
        const endDate = document.getElementById('filterTanggalAkhir').value;
        const status = document.getElementById('filterStatus').value;
        const kategori = document.getElementById('filterKategori').value;
        const search = document.getElementById('searchPengajuan').value.toLowerCase();

        this.filteredData = this.pengajuanData.filter(item => {
            const dateMatch = (!startDate || item.tanggal >= startDate) && 
                            (!endDate || item.tanggal <= endDate);
            const statusMatch = !status || item.status === status;
            const kategoriMatch = !kategori || item.kategori === kategori;
            const searchMatch = !search || 
                               item.id.toLowerCase().includes(search) ||
                               item.keterangan.toLowerCase().includes(search) ||
                               item.kategori.toLowerCase().includes(search);

            return dateMatch && statusMatch && kategoriMatch && searchMatch;
        });

        this.currentPage = 1;
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    resetFilter() {
        document.getElementById('filterTanggalMulai').value = '';
        document.getElementById('filterTanggalAkhir').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterKategori').value = '';
        document.getElementById('searchPengajuan').value = '';
        
        this.loadPengajuanData();
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

    exportData() {
        if (window.showLoading) {
            showLoading('Mengexport Data', 'Mohon tunggu sebentar...');
        }

        setTimeout(() => {
            // Create CSV content
            const headers = ['ID Pengajuan', 'Tanggal', 'Kategori', 'Jumlah', 'Prioritas', 'Status', 'Progress'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(item => [
                    item.id,
                    item.tanggal,
                    item.kategori,
                    item.jumlah,
                    item.prioritas,
                    this.getStatusText(item.status),
                    item.progress + '%'
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `daftar-pengajuan-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Data telah berhasil diexport ke file CSV');
            }
        }, 1500);
    }

    // Helper methods
    getStatusClass(status) {
        const classes = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'approved': 'status-approved',
            'rejected': 'status-rejected'
        };
        return classes[status] || 'status-pending';
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Menunggu',
            'processing': 'Diproses',
            'approved': 'Disetujui',
            'rejected': 'Ditolak'
        };
        return texts[status] || 'Menunggu';
    }

    getPriorityClass(priority) {
        return `priority-${priority.toLowerCase()}`;
    }

    getProgressBarClass(status) {
        const classes = {
            'pending': 'bg-warning',
            'processing': 'bg-info',
            'approved': 'bg-success',
            'rejected': 'bg-danger'
        };
        return classes[status] || 'bg-warning';
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
    if (document.getElementById('daftarPengajuanTable')) {
        window.daftarPengajuanManager = new DaftarPengajuanManager();
    }
});

// Global functions
function filterPengajuanData() {
    if (window.daftarPengajuanManager) {
        window.daftarPengajuanManager.filterData();
    }
}

function resetPengajuanFilter() {
    if (window.daftarPengajuanManager) {
        window.daftarPengajuanManager.resetFilter();
    }
}

function changePage(page) {
    if (window.daftarPengajuanManager) {
        window.daftarPengajuanManager.changePage(page);
    }
}

function exportPengajuanData() {
    if (window.daftarPengajuanManager) {
        window.daftarPengajuanManager.exportData();
    }
}

function viewPengajuanDetail(id) {
    if (window.showInfo) {
        showInfo('Detail Pengajuan', `Menampilkan detail untuk pengajuan ${id}`);
    }
}

function trackPengajuan(id) {
    // Redirect to tracking page with ID
    window.location.href = `tracking-approval.html?id=${id}`;
}

function editPengajuan(id) {
    if (window.showInfo) {
        showInfo('Edit Pengajuan', `Fitur edit untuk pengajuan ${id} akan segera tersedia`);
    }
}