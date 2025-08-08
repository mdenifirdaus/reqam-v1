// Dashboard JavaScript
class DashboardManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('reqamUser') || '{}');
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.updateCurrentTime();
        this.loadRecentSubmissions();
        this.updateStatistics();
        
        // Update time every minute
        setInterval(() => {
            this.updateCurrentTime();
        }, 60000);
    }

    loadUserInfo() {
        // Load user info in sidebar
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = this.currentUser.nama || 'John Doe';
        }
        
        const userRole = document.getElementById('userRole');
        if (userRole) {
            userRole.textContent = this.currentUser.jabatan || 'Nazim Maal';
        }
        
        // Load user info in header
        const headerUserName = document.getElementById('headerUserName');
        if (headerUserName) {
            headerUserName.textContent = this.currentUser.nama || 'John Doe';
        }
        
        const headerUserLocation = document.getElementById('headerUserLocation');
        if (headerUserLocation) {
            headerUserLocation.textContent = this.currentUser.wilayah || 'Jakarta';
        }
        
        // Load user info in welcome banner
        const welcomeUserName = document.getElementById('welcomeUserName');
        if (welcomeUserName) {
            welcomeUserName.textContent = this.currentUser.nama || 'John Doe';
        }
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateString = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = `${timeString} - ${dateString}`;
        }
    }

    loadRecentSubmissions() {
        const tbody = document.getElementById('recentSubmissions');
        if (!tbody) return;

        // Mock recent submissions data
        const recentData = [
            {
                id: 'REQ-001',
                kategori: 'Operasional',
                jumlah: 2500000,
                status: 'approved',
                tanggal: '2024-01-15'
            },
            {
                id: 'REQ-002',
                kategori: 'Program',
                jumlah: 1800000,
                status: 'processing',
                tanggal: '2024-01-14'
            },
            {
                id: 'REQ-003',
                kategori: 'Darurat',
                jumlah: 3200000,
                status: 'pending',
                tanggal: '2024-01-13'
            },
            {
                id: 'REQ-004',
                kategori: 'Maintenance',
                jumlah: 1500000,
                status: 'approved',
                tanggal: '2024-01-12'
            },
            {
                id: 'REQ-005',
                kategori: 'Investasi',
                jumlah: 5000000,
                status: 'rejected',
                tanggal: '2024-01-11'
            }
        ];

        let html = '';
        recentData.forEach(item => {
            const statusClass = this.getStatusClass(item.status);
            const statusText = this.getStatusText(item.status);
            
            html += `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td><span class="badge bg-secondary">${item.kategori}</span></td>
                    <td><strong>${this.formatCurrency(item.jumlah)}</strong></td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${this.formatDate(item.tanggal)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewDetail('${item.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="trackStatus('${item.id}')">
                            <i class="fas fa-route"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    updateStatistics() {
        // Update dashboard statistics
        const totalPengajuan = document.getElementById('totalPengajuan');
        const pengajuanDisetujui = document.getElementById('pengajuanDisetujui');
        const pengajuanMenunggu = document.getElementById('pengajuanMenunggu');
        const totalNominal = document.getElementById('totalNominal');
        
        if (totalPengajuan) totalPengajuan.textContent = '25';
        if (pengajuanDisetujui) pengajuanDisetujui.textContent = '18';
        if (pengajuanMenunggu) pengajuanMenunggu.textContent = '5';
        if (totalNominal) totalNominal.textContent = 'Rp 125M';
    }

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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});

// Global functions for sidebar and navigation
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function toggleSubmenu(menuId) {
    const menuItem = document.getElementById(menuId);
    const submenu = menuItem.querySelector('.submenu');
    
    // Close other open submenus
    document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
        if (item.id !== menuId) {
            item.classList.remove('open');
            const otherSubmenu = item.querySelector('.submenu');
            if (otherSubmenu) {
                otherSubmenu.classList.remove('open');
            }
        }
    });
    
    // Toggle current submenu
    menuItem.classList.toggle('open');
    if (submenu) {
        submenu.classList.toggle('open');
    }
}

function logout() {
    if (window.showConfirm) {
        showConfirm(
            'Konfirmasi Logout',
            'Apakah Anda yakin ingin keluar dari sistem?',
            {
                confirmText: 'Ya, Keluar',
                cancelText: 'Batal'
            }
        ).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('reqamUser');
                window.location.href = 'index.html';
            }
        });
    } else {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('reqamUser');
            window.location.href = 'index.html';
        }
    }
}

function showNotifications() {
    if (window.showInfo) {
        showInfo('Notifikasi', 'Anda memiliki 3 notifikasi baru');
    } else {
        alert('Anda memiliki 3 notifikasi baru');
    }
}

function showAllNotifications() {
    if (window.showInfo) {
        showInfo('Semua Notifikasi', 'Menampilkan semua notifikasi sistem');
    } else {
        alert('Menampilkan semua notifikasi sistem');
    }
}

function exportDashboardReport() {
    if (window.showLoading) {
        showLoading('Mengexport Report', 'Mohon tunggu sebentar...');
        
        setTimeout(() => {
            if (window.SwalHelper) {
                SwalHelper.close();
                showSuccess('Export Berhasil', 'Report dashboard telah berhasil diexport');
            }
        }, 2000);
    } else {
        alert('Export report berhasil');
    }
}

function viewDetail(id) {
    window.location.href = `daftar-pengajuan.html?id=${id}`;
}

function trackStatus(id) {
    window.location.href = `tracking-approval.html?id=${id}`;
}

// Auto-open user management submenu if on user management pages
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    if (currentPage.includes('daftar-user.html') || currentPage.includes('assignment-user.html')) {
        const userManagementMenu = document.getElementById('userManagementMenu');
        if (userManagementMenu) {
            userManagementMenu.classList.add('open');
            const submenu = userManagementMenu.querySelector('.submenu');
            if (submenu) {
                submenu.classList.add('open');
            }
        }
    }
});