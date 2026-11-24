const API_URL = "https://thunghiemupcloud.onrender.com/api/SinhViens";

const studentForm = document.getElementById("SinhVien");
const tableBody = document.getElementById("studentTableBody");

async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const students = await response.json();

        // Dùng DocumentFragment để render nhanh, tránh gán += innerHTML nhiều lần trong vòng lặp
        const fragment = document.createDocumentFragment();

        students.forEach(function (student) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${student.id}</td>
                <td class="fw-bold">${student.ten ?? ""}</td>
                <td>${student.tuoi ?? ""}</td>
                <td>${student.maSV ?? student.masv ?? ""}</td>
                <td>${student.diemTB ?? student.diemtb ?? ""}</td>
                <td>${student.mail ?? ""}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Xóa</button>
                </td>
            `;
            fragment.appendChild(tr);
        });

        tableBody.replaceChildren(fragment);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadStudents);

studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newStudent = {
        ten: document.getElementById("ten").value.trim(),
        tuoi: parseInt(document.getElementById("tuoi").value, 10),
        maSV: document.getElementById("maSV").value.trim(),
        diemTB: parseFloat(document.getElementById("diemTB").value),
        mail: document.getElementById("mail").value.trim()
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newStudent)
        });

        const responseText = await response.text();

        if (response.ok) {
            await loadStudents();
            studentForm.reset();
        } else {
            console.error("Server lỗi:", response.status, responseText);
            alert(`Lưu thất bại (${response.status}): ${responseText || "Kiểm tra Console"}`);
        }
    } catch (error) {
        console.error("Lỗi mạng hoặc CORS:", error);
        alert("Không kết nối được tới API trên Render (kiểm tra trạng thái server Render hoặc CORS).");
    }
});

async function deleteStudent(id) {
    const isConfirm = confirm(`Bạn có chắc chắn muốn xóa sinh viên mang ID: ${id} không?`);

    if (isConfirm) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await loadStudents();
            } else {
                const errText = await response.text();
                console.error("Xóa lỗi:", response.status, errText);
                alert(`Không thể xóa sinh viên này! (${response.status})`);
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Lỗi kết nối khi xóa sinh viên.");
        }
    }
}