# ⚔️ Task Adventure Web

![Task Adventure Banner](https://via.placeholder.com/1000x400/0f172a/eab308?text=Task+Adventure+Web)

**Task Adventure** adalah aplikasi *To-Do List* berbasis gamifikasi yang dirancang untuk meningkatkan produktivitas. Pengguna dapat mengubah tugas sehari-hari menjadi "Quest" (Misi), menyelesaikannya untuk mendapatkan koin emas, dan menukarkan koin tersebut di "Toko Self-Reward".

Awalnya dibangun sebagai program C++ berbasis CLI (Terminal), proyek ini telah berevolusi menjadi arsitektur **Modern Fullstack Web Application** dengan pemisahan *Frontend* dan *Backend* yang jelas menggunakan protokol REST API.

## Fitur Utama
* **Gamified Task Management:** Tambah tugas dengan nilai *reward* (koin) yang dapat disesuaikan.
* **Auto-Sorting Algorithm:** Menerapkan algoritma *Bubble Sort* bawaan C++ untuk secara otomatis mengurutkan tugas berdasarkan *reward* tertinggi.
* **Reward System:** Sistem ekonomi virtual sederhana di mana koin yang terkumpul dapat digunakan untuk "membeli" *self-reward*.
* **Real-time Sync:** Antarmuka React yang tersinkronisasi langsung dengan memori server C++ tanpa *database* eksternal.
* **CORS Handling:** Konfigurasi keamanan lintas asal (Cross-Origin) yang dikelola langsung dari *router* C++.

## Teknologi yang Digunakan

### Backend (Core Logic & API)
* **Bahasa:** C++ (Standard C++17)
* **Framework:** [Crow](https://crowcpp.org/) (C++ Microframework untuk web)
* **Networking:** Asio (Standalone)
* **Arsitektur:** RESTful API (JSON Response)

### Frontend (User Interface)
* **Library:** React.js
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (v4)

## Panduan Instalasi & Menjalankan Aplikasi

Pastikan komputermu sudah terinstal **Node.js** dan *compiler* **C++ (g++ / MinGW)**.

### 1. Menjalankan Backend (C++)
1. Buka terminal dan arahkan ke folder utama proyek (tempat `main.cpp` berada).
2. Lakukan kompilasi kode C++ dengan perintah berikut:
   ```bash
   g++ main.cpp -I ./include -o server.exe -lws2_32 -lmswsock