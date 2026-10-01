const attendanceData = [
    {
        studentId: "STU001",
        name: "Rahul Kumar",
        department: "CSE",
        section: "A",
        date: "2026-10-01",
        status: "Present"
    },
    {
        studentId: "STU002",
        name: "Priya Sharma",
        department: "CSE",
        section: "A",
        date: "2026-10-01",
        status: "Absent"
    },
    {
        studentId: "STU003",
        name: "Arun Kumar",
        department: "ECE",
        section: "B",
        date: "2026-10-01",
        status: "Late"
    },
    {
        studentId: "STU004",
        name: "Sneha Patil",
        department: "CSE",
        section: "B",
        date: "2026-10-01",
        status: "On Leave"
    },
    {
        studentId: "STU005",
        name: "Anil Raj",
        department: "EEE",
        section: "A",
        date: "2026-10-01",
        status: "Present"
    }
];


function generateReport() {

    const date = document.getElementById("attendanceDate").value;
    const department = document.getElementById("department").value;
    const section = document.getElementById("section").value;
    const status = document.getElementById("status").value;

    let filteredData = attendanceData.filter(student => {

        return (
            (!date || student.date === date) &&
            (!department || student.department === department) &&
            (!section || student.section === section) &&
            (!status || student.status === status)
        );

    });

    displayAttendance(filteredData);
    updateSummary(filteredData);
}


function displayAttendance(data) {

    const tbody = document.getElementById("attendanceBody");
    const noRecords = document.getElementById("noRecords");

    tbody.innerHTML = "";

    if (data.length === 0) {

        noRecords.style.display = "block";

        return;
    }

    noRecords.style.display = "none";

    data.forEach((student, index) => {

        const row = document.createElement("tr");

        let statusClass = "";

        if (student.status === "Present") {
            statusClass = "status-present";
        }
        else if (student.status === "Absent") {
            statusClass = "status-absent";
        }
        else if (student.status === "Late") {
            statusClass = "status-late";
        }
        else if (student.status === "On Leave") {
            statusClass = "status-leave";
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.section}</td>
            <td>${student.date}</td>
            <td>
                <span class="status ${statusClass}">
                    ${student.status}
                </span>
            </td>
        `;

        tbody.appendChild(row);

    });
}


function updateSummary(data) {

    const total = data.length;

    const present = data.filter(
        student => student.status === "Present"
    ).length;

    const absent = data.filter(
        student => student.status === "Absent"
    ).length;

    const late = data.filter(
        student => student.status === "Late"
    ).length;

    const leave = data.filter(
        student => student.status === "On Leave"
    ).length;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent = absent;
    document.getElementById("lateCount").textContent = late;
    document.getElementById("leaveCount").textContent = leave;
}


function resetFilters() {

    document.getElementById("attendanceDate").value = "";
    document.getElementById("department").value = "";
    document.getElementById("section").value = "";
    document.getElementById("status").value = "";

    displayAttendance(attendanceData);
    updateSummary(attendanceData);
}


function exportCSV() {

    const table = document.getElementById("attendanceTable");

    let csv = [];

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {

        const rowData = [];

        row.querySelectorAll("th, td").forEach(cell => {

            rowData.push(
                `"${cell.innerText.replace(/"/g, '""')}"`
            );

        });

        csv.push(rowData.join(","));

    });

    const csvFile = new Blob(
        [csv.join("\n")],
        { type: "text/csv" }
    );

    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = "daily-attendance-report.csv";

    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}


// Load records when page opens

document.addEventListener("DOMContentLoaded", () => {

    displayAttendance(attendanceData);
    updateSummary(attendanceData);

});