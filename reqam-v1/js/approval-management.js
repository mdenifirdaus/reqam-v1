// Approval Management JavaScript
class ApprovalManager {
    constructor() {
        this.pendingApprovals = [];
        this.approvalHistory = [];
        this.filteredPending = [];
        this.filteredHistory = [];
        this.currentPendingPage = 1;
        this.currentHistoryPage = 1;
        this.itemsPerPage = 10;
        this.currentUser = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        this.approvalHierarchy = this.getApprovalHierarchy();
        this.init();
    }

    init() {
        this.generateMockData();
        this.loadUserInfo();
        this.loadPendingApprovals();
        this.loadApprovalHistory();
        this.updateTabCounts();
    }

    getApprovalHierarchy() {
        // Define approval hierarchy based on position
        return {
            'Nazim Maal': {
                level: 1,
                canApprove: ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'],
                maxAmount: 50000000, // 50 million
                nextApprover: 'Qaid Majelis'
            },
            'Qaid Majelis': {
                level: 2,
                canApprove: ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'],
                maxAmount: 100000000, // 100 million
                nextApprover: 'Qaid Wilayah'
            },
            'Qaid Wilayah': {
                level: 3,
                canApprove: ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'],
                maxAmount: 999999999, // No limit
                nextApprover: null
            },
            'Nazim Sehat Jasmani': {
                level: 1,
                canApprove: ['Program'],
                maxAmount: 10000000, // 10 million
                nextApprover: 'Qaid Majelis'
            },
            'Nazim Tarbiayat': {
                level: 1,
                canApprove: ['Program'],
                maxAmount: 10000000, // 10 million
                nextApprover: 'Qaid Majelis'
            },
            'Nazim Tabligh': {
                level: 1,
                canApprove: ['Program'],
                maxAmount: 10000000, // 10 million
                nextApprover: 'Qaid Majelis'
            }
        };
    }

    generateMockData() {
        const categories = ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'];
        const priorities = ['Rendah', 'Normal', 'Tinggi', 'Urgent'];
        const pemohonList = ['Ahmad Pratama', 'Budi Santoso', 'Citra Dewi', 'Dedi Kurniawan', 'Eka Sari'];
        
        // Generate pending approvals
        for (let i = 1; i <= 15; i++) {
            const kategori = categories[Math.floor(Math.random() * categories.length)];
            const prioritas = priorities[Math.floor(Math.random() * priorities.length)];
            const jumlah = Math.floor(Math.random() * 20000000) + 1000000; // 1M - 21M
            const tanggal = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const deadline = new Date(tanggal.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            // Check if current user can approve this request
            const userHierarchy = this.approvalHierarchy[this.currentUser.jabatan];
            if (userHierarchy && 
                userHierarchy.canApprove.includes(kategori) && 
                jumlah <= userHierarchy.maxAmount) {
                
                this.pendingApprovals.push({
                    id: `REQ-${String(i).padStart(3, '0')}`,
                    pemohon: pemohonList[Math.floor(Math.random() * pemohonList.length)],
                    wilayah: this.currentUser.wilayah || 'Jakarta',
                    branch: 'Jakarta Utara',
                    kategori: kategori,
                    prioritas: prioritas,
                    jumlah: jumlah,
                    tanggal: tanggal.toISOString().split('T')[0],
                    deadline: deadline.toISOString().split('T')[0],
                    keterangan: `Pengajuan dana untuk keperluan ${kategori.toLowerCase()} branch Jakarta Utara`,
                    status: 'pending',
                    currentApprover: this.currentUser.jabatan,
                    approvalLevel: userHierarchy.level,
                    createdAt: tanggal.toISOString()
                });
            }
        }

        // Generate approval history
        for (let i = 1; i <= 20; i++) {
            const kategori = categories[Math.floor(Math.random() * categories.length)];
            const jumlah = Math.floor(Math.random() * 15000000) + 500000;
            const tanggalPengajuan = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
            const tanggalApproval = new Date(tanggalPengajuan.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
            const keputusan = Math.random() > 0.3 ? 'approved' : 'rejected';
            
            this.approvalHistory.push({
                id: `REQ-H${String(i).padStart(3, '0')}`,
                pemohon: pemohonList[Math.floor(Math.random() * pemohonList.length)],
                kategori: kategori,
                jumlah: jumlah,
                tanggalPengajuan: tanggalPengajuan.toISOString().split('T')[0],
                tanggalApproval: tanggalApproval.toISOString().split('T')[0],
                keputusan: keputusan,
                catatan: keputusan === 'approved' ? 
                    'Pengajuan disetujui sesuai dengan kebijakan dan anggaran yang tersedia' :
                    'Pengajuan ditolak karena melebihi batas anggaran periode ini',
                approver: this.currentUser.nama || 'John Doe',
                approverJabatan: this.currentUser.jabatan || 'Nazim Maal'
            });
        }

        this.filteredPending = [...this.pendingApprovals];
        this.filteredHistory = [...this.approvalHistory];
    }

    loadUserInfo() {
        document.getElementById('currentUserPosition').textContent = this.currentUser.jabatan || 'Nazim Maal';
        document.getElementById('userName').textContent = this.currentUser.nama || 'John Doe';
        document.getElementById('userRole').textContent = this.currentUser.jabatan || 'Nazim Maal';
    }

    loadPendingApprovals() {
        this.renderPendingTable();
        this.renderPendingPagination();
        this.updatePendingPaginationInfo();
    }

    loadApprovalHistory() {
        this.renderHistoryTable();
        this.renderHistoryPagination();
        this.updateHistoryPaginationInfo();
    }

    updateTabCounts() {
        document.getElementById('pendingTabCount').textContent = this.filteredPending.length;
        document.getElementById('historyTabCount').textContent = this.filteredHistory.length;
        document.getElementById('pendingCount').textContent = this.filteredPending.length;
        document.getElementById('totalPendingCount').textContent = this.filteredPending.length;
        document.getElementById('totalHistoryCount').textContent = this.filteredHistory.length;
    }

    renderPendingTable() {
        const tbody = document.getElementById('pendingApprovalsTable');
        if (!tbody) return;

        const startIndex = (this.currentPendingPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredPending.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const priorityClass = this.getPriorityClass(item.prioritas);
            const isUrgent = item.prioritas === 'Urgent';
            const daysDiff = Math.ceil((new Date(item.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const isNearDeadline = daysDiff <= 3;
            
            html += `
                <tr class="${isUrgent ? 'table-warning' : isNearDeadline ? 'table-danger' : ''}">
                    <td>
                        <strong>${item.id}</strong>
                        ${isUrgent ? '<i class="fas fa-exclamation-triangle text-warning ms-1" title="Urgent"></i>' : ''}
                        ${isNearDeadline ? '<i class="fas fa-clock text-danger ms-1" title="Mendekati Deadline"></i>' : ''}
                    </td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-mini">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details-mini">
                                <strong>${item.pemohon}</strong>
                                <small class="text-muted d-block">${item.wilayah}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-secondary">${item.kategori}</span></td>
                    <td><strong>${this.formatCurrency(item.jumlah)}</strong></td>
                    <td><span class="priority-badge priority-${item.prioritas.toLowerCase()}">${item.prioritas}</span></td>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>
                        ${this.formatDate(item.deadline)}
                        ${isNearDeadline ? '<br><small class="text-danger">Segera!</small>' : ''}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="viewApprovalDetail('${item.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success btn-action" onclick="showApprovalAction('${item.id}', 'approve')" title="Approve">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="showApprovalAction('${item.id}', 'reject')" title="Reject">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    renderHistoryTable() {
        const tbody = document.getElementById('approvalHistoryTable');
        if (!tbody) return;

        const startIndex = (this.currentHistoryPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredHistory.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const statusClass = item.keputusan === 'approved' ? 'status-approved' : 'status-rejected';
            const statusText = item.keputusan === 'approved' ? 'Disetujui' : 'Ditolak';
            
            html += `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-mini">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details-mini">
                                <strong>${item.pemohon}</strong>
                                <small class="text-muted d-block">${item.kategori}</small>
                            </div>
                        </div>
                    </td>
                    <td><strong>${this.formatCurrency(item.jumlah)}</strong></td>
                    <td>${this.formatDate(item.tanggalApproval)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <small class="text-muted">${item.catatan.substring(0, 50)}${item.catatan.length > 50 ? '...' : ''}</small>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-info btn-action" onclick="viewHistoryDetail('${item.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    renderPendingPagination() {
        const totalPages = Math.ceil(this.filteredPending.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pendingPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = this.generatePaginationHTML(this.currentPendingPage, totalPages, 'changePendingPage');
        paginationContainer.innerHTML = html;
    }

    renderHistoryPagination() {
        const totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('historyPaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = this.generatePaginationHTML(this.currentHistoryPage, totalPages, 'changeHistoryPage');
        paginationContainer.innerHTML = html;
    }

    generatePaginationHTML(currentPage, totalPages, functionName) {
        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="${functionName}(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="${functionName}(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="${functionName}(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        return html;
    }

    updatePendingPaginationInfo() {
        const startIndex = (this.currentPendingPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredPending.length);
        
        document.getElementById('pendingShowingStart').textContent = this.filteredPending.length > 0 ? startIndex + 1 : 0;
        document.getElementById('pendingShowingEnd').textContent = endIndex;
        document.getElementById('pendingShowingTotal').textContent = this.filteredPending.length;
    }

    updateHistoryPaginationInfo() {
        const startIndex = (this.currentHistoryPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredHistory.length);
        
        document.getElementById('historyShowingStart').textContent = this.filteredHistory.length > 0 ? startIndex + 1 : 0;
        document.getElementById('historyShowingEnd').textContent = endIndex;
        document.getElementById('historyShowingTotal').textContent = this.filteredHistory.length;
    }

    filterPendingApprovals() {
        const kategori = document.getElementById('filterPendingKategori').value;
        const prioritas = document.getElementById('filterPendingPrioritas').value;
        const jumlahRange = document.getElementById('filterPendingJumlah').value;
        const search = document.getElementById('searchPending').value.toLowerCase();

        this.filteredPending = this.pendingApprovals.filter(item => {
            const kategoriMatch = !kategori || item.kategori === kategori;
            const prioritasMatch = !prioritas || item.prioritas === prioritas;
            
            let jumlahMatch = true;
            if (jumlahRange) {
                const [min, max] = jumlahRange.split('-').map(Number);
                jumlahMatch = item.jumlah >= min && item.jumlah <= max;
            }
            
            const searchMatch = !search || 
                               item.id.toLowerCase().includes(search) ||
                               item.pemohon.toLowerCase().includes(search) ||
                               item.kategori.toLowerCase().includes(search);

            return kategoriMatch && prioritasMatch && jumlahMatch && searchMatch;
        });

        this.currentPendingPage = 1;
        this.loadPendingApprovals();
        this.updateTabCounts();
    }

    filterApprovalHistory() {
        const startDate = document.getElementById('filterHistoryTanggalMulai').value;
        const endDate = document.getElementById('filterHistoryTanggalAkhir').value;
        const keputusan = document.getElementById('filterHistoryKeputusan').value;
        const search = document.getElementById('searchHistory').value.toLowerCase();

        this.filteredHistory = this.approvalHistory.filter(item => {
            const dateMatch = (!startDate || item.tanggalApproval >= startDate) && 
                            (!endDate || item.tanggalApproval <= endDate);
            const keputusanMatch = !keputusan || item.keputusan === keputusan;
            const searchMatch = !search || 
                               item.id.toLowerCase().includes(search) ||
                               item.pemohon.toLowerCase().includes(search);

            return dateMatch && keputusanMatch && searchMatch;
        });

        this.currentHistoryPage = 1;
        this.loadApprovalHistory();
        this.updateTabCounts();
    }

    resetPendingFilter() {
        document.getElementById('filterPendingKategori').value = '';
        document.getElementById('filterPendingPrioritas').value = '';
        document.getElementById('filterPendingJumlah').value = '';
        document.getElementById('searchPending').value = '';
        
        this.filteredPending = [...this.pendingApprovals];
        this.currentPendingPage = 1;
        this.loadPendingApprovals();
        this.updateTabCounts();
        
        if (window.showToast) {
            showToast('info', 'Filter pending telah direset');
        }
    }

    resetHistoryFilter() {
        document.getElementById('filterHistoryTanggalMulai').value = '';
        document.getElementById('filterHistoryTanggalAkhir').value = '';
        document.getElementById('filterHistoryKeputusan').value = '';
        document.getElementById('searchHistory').value = '';
        
        this.filteredHistory = [...this.approvalHistory];
        this.currentHistoryPage = 1;
        this.loadApprovalHistory();
        this.updateTabCounts();
        
        if (window.showToast) {
            showToast('info', 'Filter history telah direset');
        }
    }

    changePendingPage(page) {
        const totalPages = Math.ceil(this.filteredPending.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPendingPage = page;
            this.loadPendingApprovals();
        }
    }

    changeHistoryPage(page) {
        const totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentHistoryPage = page;
            this.loadApprovalHistory();
        }
    }

    viewApprovalDetail(id) {
        const pengajuan = this.pendingApprovals.find(item => item.id === id);
        if (!pengajuan) return;

        const detailHtml = `
            <div class="approval-detail-content">
                <div class="row">
                    <div class="col-md-8">
                        <div class="detail-card">
                            <h6><i class="fas fa-file-invoice-dollar"></i> Informasi Pengajuan</h6>
                            <div class="detail-row">
                                <span class="detail-label">ID Pengajuan:</span>
                                <span class="detail-value">${pengajuan.id}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Pemohon:</span>
                                <span class="detail-value">${pengajuan.pemohon}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Wilayah/Branch:</span>
                                <span class="detail-value">${pengajuan.wilayah} - ${pengajuan.branch}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Kategori:</span>
                                <span class="detail-value"><span class="badge bg-secondary">${pengajuan.kategori}</span></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Prioritas:</span>
                                <span class="detail-value"><span class="priority-badge priority-${pengajuan.prioritas.toLowerCase()}">${pengajuan.prioritas}</span></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Jumlah Dana:</span>
                                <span class="detail-value detail-amount">${this.formatCurrency(pengajuan.jumlah)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Tanggal Pengajuan:</span>
                                <span class="detail-value">${this.formatDate(pengajuan.tanggal)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Target Pencairan:</span>
                                <span class="detail-value">${this.formatDate(pengajuan.deadline)}</span>
                            </div>
                        </div>
                        
                        <div class="keterangan-section">
                            <div class="keterangan-title">
                                <i class="fas fa-sticky-note"></i>
                                Keterangan Pengajuan
                            </div>
                            <p class="keterangan-text">${pengajuan.keterangan}</p>
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="approval-info-card">
                            <h6><i class="fas fa-route"></i> Informasi Approval</h6>
                            <div class="approval-level">
                                <div class="level-item current">
                                    <div class="level-icon">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <div class="level-content">
                                        <strong>${this.currentUser.jabatan}</strong>
                                        <small>Menunggu Approval Anda</small>
                                    </div>
                                </div>
                                ${this.approvalHierarchy[this.currentUser.jabatan]?.nextApprover ? `
                                <div class="level-item next">
                                    <div class="level-icon">
                                        <i class="fas fa-user-check"></i>
                                    </div>
                                    <div class="level-content">
                                        <strong>${this.approvalHierarchy[this.currentUser.jabatan].nextApprover}</strong>
                                        <small>Approval Selanjutnya</small>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="approval-limits">
                                <h6><i class="fas fa-info-circle"></i> Batas Approval Anda</h6>
                                <div class="limit-item">
                                    <span class="limit-label">Maksimal Jumlah:</span>
                                    <span class="limit-value">${this.formatCurrency(this.approvalHierarchy[this.currentUser.jabatan]?.maxAmount || 0)}</span>
                                </div>
                                <div class="limit-item">
                                    <span class="limit-label">Kategori yang Dapat Disetujui:</span>
                                    <div class="category-badges">
                                        ${this.approvalHierarchy[this.currentUser.jabatan]?.canApprove.map(cat => 
                                            `<span class="badge bg-primary me-1">${cat}</span>`
                                        ).join('') || ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('approvalDetailContent').innerHTML = detailHtml;
        
        // Update modal footer with action buttons
        const footerHtml = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times"></i>
                Tutup
            </button>
            <button type="button" class="btn btn-danger me-2" onclick="showApprovalAction('${id}', 'reject')">
                <i class="fas fa-times"></i>
                Reject
            </button>
            <button type="button" class="btn btn-success" onclick="showApprovalAction('${id}', 'approve')">
                <i class="fas fa-check"></i>
                Approve
            </button>
        `;
        document.getElementById('approvalModalFooter').innerHTML = footerHtml;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('approvalDetailModal'));
        modal.show();
    }

    showApprovalAction(id, action) {
        const pengajuan = this.pendingApprovals.find(item => item.id === id);
        if (!pengajuan) return;

        // Close detail modal if open
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('approvalDetailModal'));
        if (detailModal) {
            detailModal.hide();
        }

        // Update action modal
        const isApprove = action === 'approve';
        const title = isApprove ? 'Approve Pengajuan' : 'Reject Pengajuan';
        const iconClass = isApprove ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
        const buttonClass = isApprove ? 'btn-success' : 'btn-danger';
        const buttonText = isApprove ? 'Approve' : 'Reject';

        document.getElementById('approvalActionTitle').innerHTML = `<i class="fas ${iconClass} me-2"></i>${title}`;
        document.getElementById('actionPengajuanId').value = id;
        document.getElementById('actionType').value = action;
        
        // Update summary
        document.getElementById('actionSummaryId').textContent = pengajuan.id;
        document.getElementById('actionSummaryPemohon').textContent = pengajuan.pemohon;
        document.getElementById('actionSummaryJumlah').textContent = this.formatCurrency(pengajuan.jumlah);
        document.getElementById('actionSummaryKategori').textContent = pengajuan.kategori;
        
        // Update button
        const confirmButton = document.getElementById('confirmApprovalAction');
        confirmButton.className = `btn ${buttonClass}`;
        confirmButton.innerHTML = `<i class="fas fa-check"></i> ${buttonText}`;
        
        // Clear notes
        document.getElementById('approvalNotes').value = '';
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('approvalActionModal'));
        modal.show();
    }

    confirmApprovalAction() {
        const id = document.getElementById('actionPengajuanId').value;
        const action = document.getElementById('actionType').value;
        const notes = document.getElementById('approvalNotes').value;
        
        if (!notes.trim()) {
            showWarning('Catatan Diperlukan', 'Mohon masukkan catatan untuk keputusan approval ini');
            return;
        }

        const pengajuan = this.pendingApprovals.find(item => item.id === id);
        if (!pengajuan) return;

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('approvalActionModal'));
        modal.hide();

        // Show loading
        showLoading('Memproses Approval', 'Mohon tunggu sebentar...');

        // Simulate processing
        setTimeout(() => {
            // Remove from pending
            this.pendingApprovals = this.pendingApprovals.filter(item => item.id !== id);
            
            // Add to history
            this.approvalHistory.unshift({
                id: pengajuan.id,
                pemohon: pengajuan.pemohon,
                kategori: pengajuan.kategori,
                jumlah: pengajuan.jumlah,
                tanggalPengajuan: pengajuan.tanggal,
                tanggalApproval: new Date().toISOString().split('T')[0],
                keputusan: action === 'approve' ? 'approved' : 'rejected',
                catatan: notes,
                approver: this.currentUser.nama || 'John Doe',
                approverJabatan: this.currentUser.jabatan || 'Nazim Maal'
            });

            // Update filtered data
            this.filteredPending = [...this.pendingApprovals];
            this.filteredHistory = [...this.approvalHistory];

            // Refresh displays
            this.loadPendingApprovals();
            this.loadApprovalHistory();
            this.updateTabCounts();

            // Close loading and show success
            SwalHelper.close();
            const actionText = action === 'approve' ? 'disetujui' : 'ditolak';
            showSuccess(
                'Approval Berhasil!',
                `Pengajuan ${id} telah ${actionText} dan akan diteruskan ke tahap selanjutnya`
            );

            // Show toast notification
            setTimeout(() => {
                showToast('info', `Notifikasi telah dikirim ke pemohon`);
            }, 1000);

        }, 2000);
    }

    viewHistoryDetail(id) {
        const history = this.approvalHistory.find(item => item.id === id);
        if (!history) return;

        const detailHtml = `
            <div class="history-detail-content">
                <div class="detail-card">
                    <h6><i class="fas fa-history"></i> Detail Approval History</h6>
                    <div class="detail-row">
                        <span class="detail-label">ID Pengajuan:</span>
                        <span class="detail-value">${history.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Pemohon:</span>
                        <span class="detail-value">${history.pemohon}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Kategori:</span>
                        <span class="detail-value"><span class="badge bg-secondary">${history.kategori}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Jumlah:</span>
                        <span class="detail-value detail-amount">${this.formatCurrency(history.jumlah)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Pengajuan:</span>
                        <span class="detail-value">${this.formatDate(history.tanggalPengajuan)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Approval:</span>
                        <span class="detail-value">${this.formatDate(history.tanggalApproval)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Keputusan:</span>
                        <span class="detail-value">
                            <span class="status-badge ${history.keputusan === 'approved' ? 'status-approved' : 'status-rejected'}">
                                ${history.keputusan === 'approved' ? 'Disetujui' : 'Ditolak'}
                            </span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Approver:</span>
                        <span class="detail-value">${history.approver} (${history.approverJabatan})</span>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Catatan Approval
                    </div>
                    <p class="keterangan-text">${history.catatan}</p>
                </div>
            </div>
        `;

        if (window.SwalHelper) {
            SwalHelper.html(`Detail History - ${history.id}`, detailHtml, {
                width: '600px',
                confirmButtonText: 'Tutup'
            });
        }
    }

    refreshPendingApprovals() {
        showLoading('Memuat Ulang Data', 'Mengambil data terbaru...');
        
        setTimeout(() => {
            // Simulate refresh by regenerating some data
            this.generateMockData();
            this.loadPendingApprovals();
            this.updateTabCounts();
            
            SwalHelper.close();
            showToast('success', 'Data berhasil dimuat ulang');
        }, 1500);
    }

    exportApprovalHistory() {
        showLoading('Mengexport History', 'Mohon tunggu sebentar...');

        setTimeout(() => {
            // Create CSV content
            const headers = ['ID Pengajuan', 'Pemohon', 'Kategori', 'Jumlah', 'Tanggal Pengajuan', 'Tanggal Approval', 'Keputusan', 'Catatan'];
            const csvContent = [
                headers.join(','),
                ...this.filteredHistory.map(item => [
                    item.id,
                    `"${item.pemohon}"`,
                    item.kategori,
                    item.jumlah,
                    item.tanggalPengajuan,
                    item.tanggalApproval,
                    item.keputusan === 'approved' ? 'Disetujui' : 'Ditolak',
                    `"${item.catatan}"`
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `approval-history-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            SwalHelper.close();
            showSuccess('Export Berhasil', 'History approval telah berhasil diexport');
        }, 1500);
    }

    // Helper methods
    getPriorityClass(priority) {
        return `priority-${priority.toLowerCase()}`;
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
    if (document.getElementById('pendingApprovalsTable')) {
        window.approvalManager = new ApprovalManager();
    }
});

// Global functions
function filterPendingApprovals() {
    if (window.approvalManager) {
        window.approvalManager.filterPendingApprovals();
    }
}

function filterApprovalHistory() {
    if (window.approvalManager) {
        window.approvalManager.filterApprovalHistory();
    }
}

function resetPendingFilter() {
    if (window.approvalManager) {
        window.approvalManager.resetPendingFilter();
    }
}

function resetHistoryFilter() {
    if (window.approvalManager) {
        window.approvalManager.resetHistoryFilter();
    }
}

function changePendingPage(page) {
    if (window.approvalManager) {
        window.approvalManager.changePendingPage(page);
    }
}

function changeHistoryPage(page) {
    if (window.approvalManager) {
        window.approvalManager.changeHistoryPage(page);
    }
}

function viewApprovalDetail(id) {
    if (window.approvalManager) {
        window.approvalManager.viewApprovalDetail(id);
    }
}

function showApprovalAction(id, action) {
    if (window.approvalManager) {
        window.approvalManager.showApprovalAction(id, action);
    }
}

function confirmApprovalAction() {
    if (window.approvalManager) {
        window.approvalManager.confirmApprovalAction();
    }
}

function viewHistoryDetail(id) {
    if (window.approvalManager) {
        window.approvalManager.viewHistoryDetail(id);
    }
}

function refreshPendingApprovals() {
    if (window.approvalManager) {
        window.approvalManager.refreshPendingApprovals();
    }
}

function exportApprovalHistory() {
    if (window.approvalManager) {
        window.approvalManager.exportApprovalHistory();
    }
}