// Tracking Approval JavaScript
class TrackingManager {
    constructor() {
        this.trackingData = this.generateMockTrackingData();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadTrackingData();
        this.renderTable();
        this.renderPagination();
        this.checkUrlParams();
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const pengajuanId = urlParams.get('id');
        if (pengajuanId) {
            setTimeout(() => {
                this.showTrackingDetail(pengajuanId);
            }, 500);
        }
    }

    generateMockTrackingData() {
        const userData = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        const savedData = JSON.parse(localStorage.getItem('pengajuanData') || '[]');
        
        const mockData = [
            {
                id: 'REQ-001',
                pemohon: userData.nama || 'John Doe',
                jumlah: 'Rp 5.000.000',
                tanggal: '2024-01-15',
                status: 'approved',
                progress: 100
            },
            {
                id: 'REQ-002',
                pemohon: userData.nama || 'John Doe',
                jumlah: 'Rp 3.500.000',
                tanggal: '2024-01-12',
                status: 'rejected',
                progress: 75
            },
            {
                id: 'REQ-003',
                pemohon: userData.nama || 'John Doe',
                jumlah: 'Rp 7.200.000',
                tanggal: '2024-01-18',
                status: 'processing',
                progress: 50
            }
        ];

        // Add saved data
        savedData.forEach(item => {
            mockData.push({
                id: item.id,
                pemohon: item.pemohon,
                jumlah: this.formatCurrency(item.jumlah),
                tanggal: item.tanggal,
                status: item.status,
                progress: item.progress
            });
        });

        return mockData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    }

    loadTrackingData() {
        // This would typically load from API
        // For now, we use the mock data
    }

    renderTable() {
        const tbody = document.getElementById('trackingTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.trackingData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const statusClass = this.getStatusClass(item.status);
            
            html += `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td>${item.pemohon}</td>
                    <td><strong>${item.jumlah}</strong></td>
                    <td>${this.formatDate(item.tanggal)}</td>
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
                        <button class="btn btn-sm btn-primary btn-action" onclick="showTrackingDetail('${item.id}')" title="Lihat Detail Timeline">
                            <i class="fas fa-route"></i>
                            Detail
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        this.updatePaginationInfo();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.trackingData.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('trackingPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeTrackingPage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="changeTrackingPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeTrackingPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.trackingData.length);
        
        document.getElementById('trackingShowingStart').textContent = this.trackingData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('trackingShowingEnd').textContent = endIndex;
        document.getElementById('trackingShowingTotal').textContent = this.trackingData.length;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.trackingData.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    showTrackingDetail(pengajuanId) {
        const pengajuan = this.trackingData.find(item => item.id === pengajuanId);
        if (!pengajuan) {
            if (window.showError) {
                showError('Data Tidak Ditemukan', 'Pengajuan dengan ID tersebut tidak ditemukan');
            }
            return;
        }

        let trackingHtml = '';
        
        if (pengajuan.id === 'REQ-001') {
            // Example with full approval
            trackingHtml = `
                <div class="detail-card">
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-hashtag"></i>
                            ID Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-user"></i>
                            Pemohon:
                        </span>
                        <span class="detail-value">${pengajuan.pemohon}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-money-bill-wave"></i>
                            Jumlah:
                        </span>
                        <span class="detail-value detail-amount">${pengajuan.jumlah}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-calendar-alt"></i>
                            Tanggal Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.tanggal}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-info-circle"></i>
                            Status:
                        </span>
                        <span class="detail-value">
                            <span class="status-badge status-approved">Disetujui</span>
                        </span>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Keterangan Pengajuan
                    </div>
                    <p class="keterangan-text">Dana untuk operasional bulanan branch Jakarta Utara termasuk biaya administrasi, supplies, dan maintenance rutin.</p>
                </div>
                
                <h6 class="mt-4 mb-3">
                    <i class="fas fa-route"></i>
                    Timeline Approval
                </h6>
                <div class="tracking-timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-content completed">
                            <div class="timeline-title">Nazim Maal Wilayah</div>
                            <div class="timeline-desc">Pengajuan telah disetujui oleh Nazim Maal Wilayah</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                15 Jan 2024, 09:30 WIB
                            </div>
                            <div class="status-indicator completed">
                                <i class="fas fa-check-circle"></i>
                                Disetujui
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item completed">
                        <div class="timeline-content completed">
                            <div class="timeline-title">Qaid Majelis</div>
                            <div class="timeline-desc">Pengajuan telah disetujui oleh Qaid Majelis</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                16 Jan 2024, 14:15 WIB
                            </div>
                            <div class="status-indicator completed">
                                <i class="fas fa-check-circle"></i>
                                Disetujui
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item completed">
                        <div class="timeline-content completed">
                            <div class="timeline-title">Qaid Wilayah</div>
                            <div class="timeline-desc">Pengajuan telah disetujui oleh Qaid Wilayah</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                17 Jan 2024, 10:45 WIB
                            </div>
                            <div class="status-indicator completed">
                                <i class="fas fa-check-circle"></i>
                                Disetujui
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (pengajuan.id === 'REQ-002') {
            // Example with rejection
            trackingHtml = `
                <div class="detail-card">
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-hashtag"></i>
                            ID Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-user"></i>
                            Pemohon:
                        </span>
                        <span class="detail-value">${pengajuan.pemohon}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-money-bill-wave"></i>
                            Jumlah:
                        </span>
                        <span class="detail-value detail-amount">${pengajuan.jumlah}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-calendar-alt"></i>
                            Tanggal Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.tanggal}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-info-circle"></i>
                            Status:
                        </span>
                        <span class="detail-value">
                            <span class="status-badge status-rejected">Ditolak</span>
                        </span>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Keterangan Pengajuan
                    </div>
                    <p class="keterangan-text">Dana untuk pembelian peralatan kantor dan supplies operasional branch Jakarta Utara untuk periode Q1 2024.</p>
                </div>
                
                <h6 class="mt-4 mb-3">
                    <i class="fas fa-route"></i>
                    Timeline Approval
                </h6>
                <div class="tracking-timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-content completed">
                            <div class="timeline-title">Nazim Maal Wilayah</div>
                            <div class="timeline-desc">Pengajuan telah disetujui oleh Nazim Maal Wilayah</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                12 Jan 2024, 11:20 WIB
                            </div>
                            <div class="status-indicator completed">
                                <i class="fas fa-check-circle"></i>
                                Disetujui
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item rejected">
                        <div class="timeline-content rejected">
                            <div class="timeline-title">Qaid Majelis</div>
                            <div class="timeline-desc">Pengajuan ditolak oleh Qaid Majelis dengan alasan: Budget untuk kategori ini sudah melebihi limit bulanan</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                13 Jan 2024, 16:30 WIB
                            </div>
                            <div class="status-indicator rejected">
                                <i class="fas fa-times-circle"></i>
                                Ditolak
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (pengajuan.id === 'REQ-003') {
            // Example with pending approval
            trackingHtml = `
                <div class="detail-card">
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-hashtag"></i>
                            ID Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-user"></i>
                            Pemohon:
                        </span>
                        <span class="detail-value">${pengajuan.pemohon}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-money-bill-wave"></i>
                            Jumlah:
                        </span>
                        <span class="detail-value detail-amount">${pengajuan.jumlah}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-calendar-alt"></i>
                            Tanggal Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.tanggal}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-info-circle"></i>
                            Status:
                        </span>
                        <span class="detail-value">
                            <span class="status-badge status-processing">Diproses</span>
                        </span>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Keterangan Pengajuan
                    </div>
                    <p class="keterangan-text">Dana darurat untuk perbaikan sistem IT dan infrastruktur jaringan yang mengalami gangguan.</p>
                </div>
                
                <h6 class="mt-4 mb-3">
                    <i class="fas fa-route"></i>
                    Timeline Approval
                </h6>
                <div class="tracking-timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-content completed">
                            <div class="timeline-title">Nazim Maal Wilayah</div>
                            <div class="timeline-desc">Pengajuan telah disetujui oleh Nazim Maal Wilayah</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                18 Jan 2024, 08:15 WIB
                            </div>
                            <div class="status-indicator completed">
                                <i class="fas fa-check-circle"></i>
                                Disetujui
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item pending">
                        <div class="timeline-content pending">
                            <div class="timeline-title">Qaid Majelis</div>
                            <div class="timeline-desc">Sedang dalam proses review oleh Qaid Majelis</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                Dalam proses...
                            </div>
                            <div class="status-indicator pending">
                                <i class="fas fa-clock"></i>
                                Sedang Diproses
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline-item waiting">
                        <div class="timeline-content">
                            <div class="timeline-title">Qaid Wilayah</div>
                            <div class="timeline-desc">Menunggu approval dari Qaid Majelis terlebih dahulu</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                Menunggu...
                            </div>
                            <div class="status-indicator waiting">
                                <i class="fas fa-hourglass-half"></i>
                                Menunggu
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default template for other pengajuan
            trackingHtml = `
                <div class="detail-card">
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-hashtag"></i>
                            ID Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-user"></i>
                            Pemohon:
                        </span>
                        <span class="detail-value">${pengajuan.pemohon}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-money-bill-wave"></i>
                            Jumlah:
                        </span>
                        <span class="detail-value detail-amount">${pengajuan.jumlah}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-calendar-alt"></i>
                            Tanggal Pengajuan:
                        </span>
                        <span class="detail-value">${pengajuan.tanggal}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">
                            <i class="fas fa-info-circle"></i>
                            Status:
                        </span>
                        <span class="detail-value">
                            <span class="status-badge ${this.getStatusClass(pengajuan.status)}">${this.getStatusText(pengajuan.status)}</span>
                        </span>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Keterangan Pengajuan
                    </div>
                    <p class="keterangan-text">Pengajuan dana untuk keperluan operasional dan program kerja.</p>
                </div>
                
                <h6 class="mt-4 mb-3">
                    <i class="fas fa-route"></i>
                    Timeline Approval
                </h6>
                <div class="tracking-timeline">
                    <div class="timeline-item pending">
                        <div class="timeline-content pending">
                            <div class="timeline-title">Nazim Maal Wilayah</div>
                            <div class="timeline-desc">Menunggu review dari Nazim Maal Wilayah</div>
                            <div class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                Dalam antrian...
                            </div>
                            <div class="status-indicator pending">
                                <i class="fas fa-clock"></i>
                                Menunggu
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        document.getElementById('trackingDetail').innerHTML = trackingHtml;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('trackingModal'));
        modal.show();
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
        if (typeof amount === 'string') return amount;
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
    if (document.getElementById('trackingTable')) {
        window.trackingManager = new TrackingManager();
    }
});

// Global functions
function changeTrackingPage(page) {
    if (window.trackingManager) {
        window.trackingManager.changePage(page);
    }
}

function showTrackingDetail(pengajuanId) {
    if (window.trackingManager) {
        window.trackingManager.showTrackingDetail(pengajuanId);
    }
}