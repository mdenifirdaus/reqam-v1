// Finance Approval JavaScript
class FinanceApprovalManager {
    constructor() {
        this.financeData = this.generateMockFinanceData();
        this.filteredData = [...this.financeData];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentUser = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        this.bankAccounts = this.getBankAccounts();
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
        this.populateBankAccounts();
        this.setDefaultTransferDate();
    }

    generateMockFinanceData() {
        const categories = ['Operasional', 'Program', 'Darurat', 'Investasi', 'Maintenance'];
        const priorities = ['Rendah', 'Normal', 'Tinggi', 'Urgent'];
        const pemohonList = ['Ahmad Pratama', 'Budi Santoso', 'Citra Dewi', 'Dedi Kurniawan', 'Eka Sari', 'Fajar Hidayat'];
        const wilayahList = ['Jakarta', 'Bandung', 'Surabaya', 'Jawa Barat 10', 'Jawa Barat 7'];
        const branchData = {
            'Jakarta': ['Jakarta Utara', 'Jakarta Pusat', 'Lenteng Agung'],
            'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Cimahi'],
            'Surabaya': ['Surabaya Utara', 'Surabaya Selatan', 'Sidoarjo'],
            'Jawa Barat 10': ['Depok', 'Bogor', 'Bekasi'],
            'Jawa Barat 7': ['Manislor', 'Garut', 'Tasikmalaya']
        };

        const financeData = [];
        
        // Generate pengajuan yang sudah approved dan siap transfer
        for (let i = 1; i <= 12; i++) {
            const wilayah = wilayahList[Math.floor(Math.random() * wilayahList.length)];
            const branches = branchData[wilayah];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const kategori = categories[Math.floor(Math.random() * categories.length)];
            const prioritas = priorities[Math.floor(Math.random() * priorities.length)];
            const jumlah = Math.floor(Math.random() * 15000000) + 1000000; // 1M - 16M
            const tanggalPengajuan = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const tanggalApproval = new Date(tanggalPengajuan.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
            
            // 70% ready for transfer, 30% already transferred
            const isTransferred = Math.random() > 0.7;
            
            const pengajuan = {
                id: `REQ-${String(i).padStart(3, '0')}`,
                pemohon: pemohonList[Math.floor(Math.random() * pemohonList.length)],
                wilayah: wilayah,
                branch: branch,
                kategori: kategori,
                prioritas: prioritas,
                jumlah: jumlah,
                tanggalPengajuan: tanggalPengajuan.toISOString().split('T')[0],
                tanggalApproval: tanggalApproval.toISOString().split('T')[0],
                keterangan: `Pengajuan dana untuk keperluan ${kategori.toLowerCase()} di ${branch}. Dana akan digunakan untuk operasional dan program kerja sesuai dengan rencana yang telah disetujui.`,
                status: isTransferred ? 'transferred' : 'ready_transfer',
                approvalHistory: [
                    {
                        approver: 'Nazim Maal Wilayah',
                        tanggal: tanggalPengajuan.toISOString().split('T')[0],
                        keputusan: 'approved',
                        catatan: 'Pengajuan sesuai dengan kebutuhan operasional'
                    },
                    {
                        approver: 'Qaid Majelis',
                        tanggal: new Date(tanggalPengajuan.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        keputusan: 'approved',
                        catatan: 'Disetujui sesuai dengan anggaran yang tersedia'
                    },
                    {
                        approver: 'Qaid Wilayah',
                        tanggal: tanggalApproval.toISOString().split('T')[0],
                        keputusan: 'approved',
                        catatan: 'Final approval untuk pencairan dana'
                    }
                ]
            };

            // Add transfer details if already transferred
            if (isTransferred) {
                const transferDate = new Date(tanggalApproval.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000);
                pengajuan.transferDetails = {
                    tanggalTransfer: transferDate.toISOString().split('T')[0],
                    rekeningPengirim: 'Bank Mandiri - 1380001234567',
                    metodePembayaran: 'Internet Banking',
                    nomorReferensi: `TRF${Date.now().toString().slice(-8)}`,
                    catatanTransfer: 'Transfer berhasil dilakukan sesuai dengan pengajuan',
                    buktiTransfer: 'bukti-transfer-' + pengajuan.id + '.jpg',
                    transferredBy: 'Bendahara Wilayah',
                    transferredAt: transferDate.toISOString()
                };
            }

            financeData.push(pengajuan);
        }

        return financeData.sort((a, b) => {
            // Sort by status (ready_transfer first) then by priority
            if (a.status !== b.status) {
                return a.status === 'ready_transfer' ? -1 : 1;
            }
            const priorityOrder = { 'Urgent': 4, 'Tinggi': 3, 'Normal': 2, 'Rendah': 1 };
            return priorityOrder[b.prioritas] - priorityOrder[a.prioritas];
        });
    }

    getBankAccounts() {
        // Get bank accounts from rekening bank manager or use mock data
        if (window.rekeningBankManager && window.rekeningBankManager.rekeningData) {
            return window.rekeningBankManager.rekeningData;
        }
        
        // Mock bank accounts
        return [
            {
                id: 'REK-001',
                namaBank: 'Bank Mandiri',
                nomorRekening: '1380001234567',
                namaPemilik: 'REQAM Jakarta',
                saldo: 50000000,
                wilayah: 'Jakarta',
                branch: 'Jakarta Utara'
            },
            {
                id: 'REK-002',
                namaBank: 'Bank BCA',
                nomorRekening: '0141987654321',
                namaPemilik: 'REQAM Jakarta',
                saldo: 30000000,
                wilayah: 'Jakarta',
                branch: 'Jakarta Pusat'
            },
            {
                id: 'REK-003',
                namaBank: 'Bank BRI',
                nomorRekening: '0026123456789',
                namaPemilik: 'REQAM Bandung',
                saldo: 25000000,
                wilayah: 'Bandung',
                branch: 'Bandung Utara'
            }
        ];
    }

    loadUserInfo() {
        document.getElementById('userName').textContent = 'Bendahara';
        document.getElementById('userRole').textContent = 'Finance Manager';
    }

    updateStatistics() {
        const pendingTransfer = this.filteredData.filter(item => item.status === 'ready_transfer').length;
        const completedTransfer = this.filteredData.filter(item => item.status === 'transferred').length;
        
        // Calculate total transfer amount for current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTransfers = this.filteredData.filter(item => {
            if (item.status !== 'transferred' || !item.transferDetails) return false;
            const transferDate = new Date(item.transferDetails.tanggalTransfer);
            return transferDate.getMonth() === currentMonth && transferDate.getFullYear() === currentYear;
        });
        const totalTransferAmount = monthlyTransfers.reduce((sum, item) => sum + item.jumlah, 0);
        
        // Calculate available balance
        const totalBankBalance = this.bankAccounts.reduce((sum, account) => sum + account.saldo, 0);
        const pendingAmount = this.filteredData
            .filter(item => item.status === 'ready_transfer')
            .reduce((sum, item) => sum + item.jumlah, 0);
        const availableBalance = totalBankBalance - pendingAmount;

        document.getElementById('pendingTransferCount').textContent = pendingTransfer;
        document.getElementById('completedTransferCount').textContent = completedTransfer;
        document.getElementById('totalTransferAmount').textContent = this.formatCurrency(totalTransferAmount);
        document.getElementById('availableBalance').textContent = this.formatCurrency(availableBalance);
        document.getElementById('financeNotificationCount').textContent = pendingTransfer;
        document.getElementById('totalFinanceCount').textContent = this.filteredData.length;
    }

    renderTable() {
        const tbody = document.getElementById('financeApprovalTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        let html = '';
        pageData.forEach(item => {
            const statusClass = item.status === 'ready_transfer' ? 'status-pending' : 'status-approved';
            const statusText = item.status === 'ready_transfer' ? 'Siap Transfer' : 'Sudah Transfer';
            const priorityClass = this.getPriorityClass(item.prioritas);
            const isUrgent = item.prioritas === 'Urgent';
            
            html += `
                <tr class="${isUrgent ? 'table-warning' : ''}">
                    <td>
                        <strong>${item.id}</strong>
                        ${isUrgent ? '<i class="fas fa-exclamation-triangle text-warning ms-1" title="Urgent"></i>' : ''}
                    </td>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar-mini">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details-mini">
                                <strong>${item.pemohon}</strong>
                                <small class="text-muted d-block">${item.wilayah} - ${item.branch}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-secondary">${item.kategori}</span></td>
                    <td><strong class="text-success">${this.formatCurrency(item.jumlah)}</strong></td>
                    <td><span class="priority-badge priority-${item.prioritas.toLowerCase()}">${item.prioritas}</span></td>
                    <td>${this.formatDate(item.tanggalApproval)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="viewFinanceDetail('${item.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${item.status === 'ready_transfer' ? `
                            <button class="btn btn-sm btn-success btn-action" onclick="showTransferModal('${item.id}')" title="Transfer Dana">
                                <i class="fas fa-money-check-alt"></i>
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline-info btn-action" onclick="viewTransferDetail('${item.id}')" title="Lihat Transfer">
                                <i class="fas fa-receipt"></i>
                            </button>
                        `}
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        this.updatePaginationInfo();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('financePaginationControls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeFinancePage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="changeFinancePage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeFinancePage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = html;
    }

    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredData.length);
        
        document.getElementById('financeShowingStart').textContent = this.filteredData.length > 0 ? startIndex + 1 : 0;
        document.getElementById('financeShowingEnd').textContent = endIndex;
        document.getElementById('financeShowingTotal').textContent = this.filteredData.length;
    }

    filterData() {
        const status = document.getElementById('filterFinanceStatus').value;
        const kategori = document.getElementById('filterFinanceKategori').value;
        const prioritas = document.getElementById('filterFinancePrioritas').value;
        const search = document.getElementById('searchFinance').value.toLowerCase();

        this.filteredData = this.financeData.filter(item => {
            const statusMatch = !status || item.status === status;
            const kategoriMatch = !kategori || item.kategori === kategori;
            const prioritasMatch = !prioritas || item.prioritas === prioritas;
            const searchMatch = !search || 
                               item.id.toLowerCase().includes(search) ||
                               item.pemohon.toLowerCase().includes(search) ||
                               item.kategori.toLowerCase().includes(search);

            return statusMatch && kategoriMatch && prioritasMatch && searchMatch;
        });

        this.currentPage = 1;
        this.updateStatistics();
        this.renderTable();
        this.renderPagination();
    }

    resetFilter() {
        document.getElementById('filterFinanceStatus').value = '';
        document.getElementById('filterFinanceKategori').value = '';
        document.getElementById('filterFinancePrioritas').value = '';
        document.getElementById('searchFinance').value = '';
        
        this.filteredData = [...this.financeData];
        this.currentPage = 1;
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

    populateBankAccounts() {
        const select = document.getElementById('transferFromAccount');
        if (!select) return;

        select.innerHTML = '<option value="">Pilih Rekening Sumber</option>';
        this.bankAccounts.forEach(account => {
            select.innerHTML += `
                <option value="${account.id}" data-balance="${account.saldo}">
                    ${account.namaBank} - ${account.nomorRekening} (${this.formatCurrency(account.saldo)})
                </option>
            `;
        });
    }

    setDefaultTransferDate() {
        const today = new Date().toISOString().split('T')[0];
        const transferDateInput = document.getElementById('transferDate');
        if (transferDateInput) {
            transferDateInput.value = today;
            transferDateInput.min = today;
        }
    }

    viewFinanceDetail(id) {
        const pengajuan = this.financeData.find(item => item.id === id);
        if (!pengajuan) return;

        const detailHtml = `
            <div class="finance-detail-content">
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
                                <span class="detail-value">${this.formatDate(pengajuan.tanggalPengajuan)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Tanggal Final Approval:</span>
                                <span class="detail-value">${this.formatDate(pengajuan.tanggalApproval)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value">
                                    <span class="status-badge ${pengajuan.status === 'ready_transfer' ? 'status-pending' : 'status-approved'}">
                                        ${pengajuan.status === 'ready_transfer' ? 'Siap Transfer' : 'Sudah Transfer'}
                                    </span>
                                </span>
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
                        <div class="approval-history-card">
                            <h6><i class="fas fa-route"></i> History Approval</h6>
                            <div class="approval-timeline">
                                ${pengajuan.approvalHistory.map(approval => `
                                    <div class="timeline-item completed">
                                        <div class="timeline-content completed">
                                            <div class="timeline-title">${approval.approver}</div>
                                            <div class="timeline-desc">${approval.catatan}</div>
                                            <div class="timeline-date">
                                                <i class="fas fa-calendar-alt"></i>
                                                ${this.formatDate(approval.tanggal)}
                                            </div>
                                            <div class="status-indicator completed">
                                                <i class="fas fa-check-circle"></i>
                                                Disetujui
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        ${pengajuan.transferDetails ? `
                            <div class="transfer-info-card mt-3">
                                <h6><i class="fas fa-money-check-alt"></i> Info Transfer</h6>
                                <div class="transfer-detail-item">
                                    <span class="label">Tanggal Transfer:</span>
                                    <span class="value">${this.formatDate(pengajuan.transferDetails.tanggalTransfer)}</span>
                                </div>
                                <div class="transfer-detail-item">
                                    <span class="label">Rekening Pengirim:</span>
                                    <span class="value">${pengajuan.transferDetails.rekeningPengirim}</span>
                                </div>
                                <div class="transfer-detail-item">
                                    <span class="label">No. Referensi:</span>
                                    <span class="value"><code>${pengajuan.transferDetails.nomorReferensi}</code></span>
                                </div>
                                <div class="transfer-detail-item">
                                    <span class="label">Metode:</span>
                                    <span class="value">${pengajuan.transferDetails.metodePembayaran}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('financeDetailContent').innerHTML = detailHtml;
        
        // Update modal footer
        const footerHtml = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times"></i>
                Tutup
            </button>
            ${pengajuan.status === 'ready_transfer' ? `
                <button type="button" class="btn btn-success" onclick="showTransferModal('${id}')">
                    <i class="fas fa-money-check-alt"></i>
                    Transfer Dana
                </button>
            ` : `
                <button type="button" class="btn btn-info" onclick="viewTransferDetail('${id}')">
                    <i class="fas fa-receipt"></i>
                    Lihat Detail Transfer
                </button>
            `}
        `;
        document.getElementById('financeModalFooter').innerHTML = footerHtml;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('financeDetailModal'));
        modal.show();
    }

    showTransferModal(id) {
        const pengajuan = this.financeData.find(item => item.id === id);
        if (!pengajuan) return;

        // Close detail modal if open
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('financeDetailModal'));
        if (detailModal) {
            detailModal.hide();
        }

        // Populate transfer form
        document.getElementById('transferPengajuanId').value = id;
        document.getElementById('transferSummaryId').textContent = pengajuan.id;
        document.getElementById('transferSummaryPemohon').textContent = pengajuan.pemohon;
        document.getElementById('transferSummaryKategori').textContent = pengajuan.kategori;
        document.getElementById('transferSummaryJumlah').textContent = this.formatCurrency(pengajuan.jumlah);
        document.getElementById('transferSummaryLocation').textContent = `${pengajuan.wilayah} - ${pengajuan.branch}`;

        // Reset form
        document.getElementById('transferForm').reset();
        this.setDefaultTransferDate();
        this.populateBankAccounts();

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('transferModal'));
        modal.show();
    }

    confirmTransfer() {
        const formData = {
            pengajuanId: document.getElementById('transferPengajuanId').value,
            fromAccount: document.getElementById('transferFromAccount').value,
            transferDate: document.getElementById('transferDate').value,
            transferMethod: document.getElementById('transferMethod').value,
            transferReference: document.getElementById('transferReference').value,
            transferNotes: document.getElementById('transferNotes').value,
            transferProof: document.getElementById('transferProof').files[0]
        };

        // Validate form
        if (!this.validateTransferForm(formData)) {
            return;
        }

        const pengajuan = this.financeData.find(item => item.id === formData.pengajuanId);
        if (!pengajuan) return;

        // Check if selected account has sufficient balance
        const selectedAccount = this.bankAccounts.find(acc => acc.id === formData.fromAccount);
        if (!selectedAccount || selectedAccount.saldo < pengajuan.jumlah) {
            showError('Saldo Tidak Mencukupi', 'Saldo rekening yang dipilih tidak mencukupi untuk transfer ini');
            return;
        }

        // Show confirmation
        showConfirm(
            'Konfirmasi Transfer',
            `Apakah Anda yakin ingin mentransfer dana sebesar ${this.formatCurrency(pengajuan.jumlah)} untuk pengajuan ${pengajuan.id}?`,
            {
                confirmText: 'Ya, Transfer',
                cancelText: 'Batal'
            }
        ).then((result) => {
            if (result.isConfirmed) {
                this.processTransfer(formData, pengajuan, selectedAccount);
            }
        });
    }

    processTransfer(formData, pengajuan, selectedAccount) {
        // Show loading
        showLoading('Memproses Transfer', 'Sedang melakukan transfer dana...');

        // Simulate transfer processing
        setTimeout(() => {
            // Update pengajuan status
            pengajuan.status = 'transferred';
            pengajuan.transferDetails = {
                tanggalTransfer: formData.transferDate,
                rekeningPengirim: `${selectedAccount.namaBank} - ${selectedAccount.nomorRekening}`,
                metodePembayaran: this.getMethodText(formData.transferMethod),
                nomorReferensi: formData.transferReference,
                catatanTransfer: formData.transferNotes || 'Transfer berhasil dilakukan',
                buktiTransfer: formData.transferProof ? formData.transferProof.name : 'bukti-transfer-' + pengajuan.id + '.jpg',
                transferredBy: 'Bendahara Wilayah',
                transferredAt: new Date().toISOString()
            };

            // Deduct balance from selected account
            selectedAccount.saldo -= pengajuan.jumlah;

            // Update localStorage if using rekening bank manager
            if (window.rekeningBankManager) {
                const accountIndex = window.rekeningBankManager.rekeningData.findIndex(acc => acc.id === selectedAccount.id);
                if (accountIndex !== -1) {
                    window.rekeningBankManager.rekeningData[accountIndex].saldo = selectedAccount.saldo;
                }
            }

            // Add to general ledger
            this.addToGeneralLedger(pengajuan, selectedAccount);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('transferModal'));
            modal.hide();

            // Refresh display
            this.updateStatistics();
            this.renderTable();
            this.renderPagination();

            // Close loading and show success
            SwalHelper.close();
            showSuccess(
                'Transfer Berhasil!',
                `Dana sebesar ${this.formatCurrency(pengajuan.jumlah)} telah berhasil ditransfer untuk pengajuan ${pengajuan.id}`,
                { timer: 4000 }
            );

            // Show additional info
            setTimeout(() => {
                showToast('info', 'Pemohon akan menerima notifikasi transfer dan dapat melihat bukti transfer');
            }, 1000);

        }, 3000);
    }

    addToGeneralLedger(pengajuan, selectedAccount) {
        // Add transaction to general ledger if available
        if (window.ledgerManager && window.ledgerManager.ledgerData) {
            const newTransaction = {
                id: `TXN-${Date.now()}`,
                tanggal: new Date(pengajuan.transferDetails.tanggalTransfer),
                deskripsi: `Transfer Dana - ${pengajuan.kategori} (${pengajuan.id})`,
                wilayah: pengajuan.wilayah,
                branch: pengajuan.branch,
                managementType: 'MARKAZ',
                pemasukan: 0,
                pengeluaran: pengajuan.jumlah,
                saldo: selectedAccount.saldo,
                type: 'expense'
            };
            
            window.ledgerManager.ledgerData.unshift(newTransaction);
        }
    }

    viewTransferDetail(id) {
        const pengajuan = this.financeData.find(item => item.id === id);
        if (!pengajuan || !pengajuan.transferDetails) return;

        const transferDetail = pengajuan.transferDetails;
        const detailHtml = `
            <div class="transfer-detail-content">
                <div class="row">
                    <div class="col-md-6">
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
                                <span class="detail-label">Jumlah:</span>
                                <span class="detail-value detail-amount">${this.formatCurrency(pengajuan.jumlah)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Kategori:</span>
                                <span class="detail-value"><span class="badge bg-secondary">${pengajuan.kategori}</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-card">
                            <h6><i class="fas fa-money-check-alt"></i> Detail Transfer</h6>
                            <div class="detail-row">
                                <span class="detail-label">Tanggal Transfer:</span>
                                <span class="detail-value">${this.formatDate(transferDetail.tanggalTransfer)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Rekening Pengirim:</span>
                                <span class="detail-value">${transferDetail.rekeningPengirim}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Metode Transfer:</span>
                                <span class="detail-value">${transferDetail.metodePembayaran}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">No. Referensi:</span>
                                <span class="detail-value"><code>${transferDetail.nomorReferensi}</code></span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Transfer Oleh:</span>
                                <span class="detail-value">${transferDetail.transferredBy}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="keterangan-section">
                    <div class="keterangan-title">
                        <i class="fas fa-sticky-note"></i>
                        Catatan Transfer
                    </div>
                    <p class="keterangan-text">${transferDetail.catatanTransfer}</p>
                </div>
                
                <div class="bukti-transfer-section">
                    <div class="keterangan-title">
                        <i class="fas fa-file-image"></i>
                        Bukti Transfer
                    </div>
                    <div class="bukti-transfer-preview">
                        <div class="file-preview">
                            <i class="fas fa-file-image text-primary"></i>
                            <span>${transferDetail.buktiTransfer}</span>
                            <button class="btn btn-sm btn-outline-primary" onclick="downloadTransferProof('${id}')">
                                <i class="fas fa-download"></i>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('transferDetailContent').innerHTML = detailHtml;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('transferDetailModal'));
        modal.show();
    }

    validateTransferForm(formData) {
        const requiredFields = ['fromAccount', 'transferDate', 'transferMethod', 'transferReference'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            showError('Form Tidak Lengkap', 'Mohon lengkapi semua field yang diperlukan');
            return false;
        }

        if (!formData.transferProof) {
            showError('Bukti Transfer Diperlukan', 'Mohon upload bukti transfer dari bank');
            return false;
        }

        return true;
    }

    refreshData() {
        showLoading('Memuat Ulang Data', 'Mengambil data terbaru...');
        
        setTimeout(() => {
            // Simulate refresh
            this.financeData = this.generateMockFinanceData();
            this.filteredData = [...this.financeData];
            this.currentPage = 1;
            
            this.updateStatistics();
            this.renderTable();
            this.renderPagination();
            
            SwalHelper.close();
            showToast('success', 'Data berhasil dimuat ulang');
        }, 1500);
    }

    exportData() {
        showLoading('Mengexport Data', 'Mohon tunggu sebentar...');

        setTimeout(() => {
            // Create CSV content
            const headers = ['ID Pengajuan', 'Pemohon', 'Kategori', 'Jumlah', 'Prioritas', 'Tanggal Approval', 'Status Transfer', 'Tanggal Transfer', 'No. Referensi'];
            const csvContent = [
                headers.join(','),
                ...this.filteredData.map(item => [
                    item.id,
                    `"${item.pemohon}"`,
                    item.kategori,
                    item.jumlah,
                    item.prioritas,
                    item.tanggalApproval,
                    item.status === 'ready_transfer' ? 'Siap Transfer' : 'Sudah Transfer',
                    item.transferDetails ? item.transferDetails.tanggalTransfer : '-',
                    item.transferDetails ? item.transferDetails.nomorReferensi : '-'
                ].join(','))
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-approval-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            SwalHelper.close();
            showSuccess('Export Berhasil', 'Data finance approval telah berhasil diexport');
        }, 1500);
    }

    downloadTransferProof(id) {
        const pengajuan = this.financeData.find(item => item.id === id);
        if (!pengajuan || !pengajuan.transferDetails) return;

        // Simulate download
        showToast('info', `Mengunduh bukti transfer: ${pengajuan.transferDetails.buktiTransfer}`);
    }

    // Helper methods
    getPriorityClass(priority) {
        return `priority-${priority.toLowerCase()}`;
    }

    getMethodText(method) {
        const methods = {
            'internet_banking': 'Internet Banking',
            'mobile_banking': 'Mobile Banking',
            'atm': 'ATM Transfer',
            'teller': 'Teller Bank'
        };
        return methods[method] || method;
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
    if (document.getElementById('financeApprovalTable')) {
        window.financeApprovalManager = new FinanceApprovalManager();
    }
});

// Global functions
function filterFinanceData() {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.filterData();
    }
}

function resetFinanceFilter() {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.resetFilter();
    }
}

function changeFinancePage(page) {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.changePage(page);
    }
}

function refreshFinanceData() {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.refreshData();
    }
}

function exportFinanceData() {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.exportData();
    }
}

function viewFinanceDetail(id) {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.viewFinanceDetail(id);
    }
}

function showTransferModal(id) {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.showTransferModal(id);
    }
}

function confirmTransfer() {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.confirmTransfer();
    }
}

function viewTransferDetail(id) {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.viewTransferDetail(id);
    }
}

function downloadTransferProof(id) {
    if (window.financeApprovalManager) {
        window.financeApprovalManager.downloadTransferProof(id);
    }
}