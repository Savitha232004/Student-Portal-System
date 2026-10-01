// Sample monthly attendance data
// This is for testing the frontend.
// Later it can be replaced with data from the backend API.

const attendanceData = [

    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-01",
        subject: "DBMS",
        status: "Present"
    },
    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-02",
        subject: "Operating Systems",
        status: "Present"
    },
    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-03",
        subject: "Computer Networks",
        status: "Absent"
    },
    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-04",
        subject: "Artificial Intelligence",
        status: "Present"
    },
    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-05",
        subject: "DBMS",
        status: "On Leave"
    },

    {
        studentId: "STU002",
        studentName: "Priya Sharma",
        date: "2026-10-01",
        subject: "DBMS",
        status: "Present"
    },
    {
        studentId: "STU002",
        studentName: "Priya Sharma",
        date: "2026-10-02",
        subject: "Operating Systems",
        status: "Present"
    },
    {
        studentId: "STU002",
        studentName: "Priya Sharma",
        date: "2026-10-03",
        subject: "Computer Networks",
        status: "Present"
    },
    {
        studentId: "STU002",
        studentName: "Priya Sharma",
        date: "2026-10-04",
        subject: "Artificial Intelligence",
        status: "Absent"
    },

    {
        studentId: "STU003",
        studentName: "Arun Kumar",
        date: "2026-10-01",
        subject: "DBMS",
        status: "Present"
    },
    {
        studentId: "STU003",
        studentName: "Arun Kumar",
        date: "2026-10-02",
        subject: "Operating Systems",
        status: "Late"
    },
    {
        studentId: "STU003",
        studentName: "Arun Kumar",
        date: "2026-10-03",
        subject: "Computer Networks",
        status: "Present"
    }
];


// Generate report
function generateReport() {

    const selectedMonth = document.getElementById("month").value;
    const selectedStudent = document.getElementById("student").value;
    const selectedStatus = document.getElementById("status").value;

    let filteredData = attendanceData.filter(record => {

        const monthMatch = record.date.startsWith(selectedMonth);

        const studentMatch =
            selectedStudent === "all" ||
            record.studentId === selectedStudent;

        const statusMatch =
            selectedStatus === "all" ||
            record.status === selectedStatus;

        return monthMatch && studentMatch && statusMatch;
    });

    displayReport(filteredData);
    updateSummary(filteredData);
}


// Display table
function displayReport(data) {

    const table = document.getElementById("reportTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">No attendance records found.</td>
            </tr>
        `;

        return;
    }

    data.forEach((record, index) => {

        let statusClass = "";

        if (record.status === "Present") {
            statusClass = "status-present";
        } else if (record.status === "Absent") {
            statusClass = "status-absent";
        } else if (record.status === "On Leave") {
            statusClass = "status-leave";
        } else if (record.status === "Late") {
            statusClass = "status-late";
        }

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.studentId}</td>
                <td>${record.studentName}</td>
                <td>${record.date}</td>
                <td>${record.subject}</td>
                <td class="${statusClass}">
                    ${record.status}
                </td>
            </tr>
        `;
    });
}


// Update summary
function updateSummary(data) {

    const total = data.length;

    const present = data.filter(
        record => record.status === "Present"
    ).length;

    const absent = data.filter(
        record => record.status === "Absent"
    ).length;

    const leave = data.filter(
        record => record.status === "On Leave"
    ).length;

    const attendancePercentage =
        total > 0
            ? ((present / total) * 100).toFixed(2)
            : 0;

    document.getElementById("totalDays").textContent = total;
    document.getElementById("presentDays").textContent = present;
    document.getElementById("absentDays").textContent = absent;
    document.getElementById("leaveDays").textContent = leave;
    document.getElementById("attendancePercentage").textContent =
        attendancePercentage + "%";
}


// Reset report
function resetReport() {

    document.getElementById("month").value = "2026-10";
    document.getElementById("student").value = "all";
    document.getElementById("status").value = "all";

    document.getElementById("reportTable").innerHTML = "";

    document.getElementById("totalDays").textContent = "0";
    document.getElementById("presentDays").textContent = "0";
    document.getElementById("absentDays").textContent = "0";
    document.getElementById("leaveDays").textContent = "0";
    document.getElementById("attendancePercentage").textContent = "0%";
}


// Export CSV
function exportCSV() {

    const rows = document.querySelectorAll("#reportTable tr");

    if (rows.length === 0) {
        alert("Generate the report first.");
        return;
    }

    let csv = "Sl No,Student ID,Student Name,Date,Subject,Status\n";

    attendanceData.forEach((record, index) => {

        csv += `${index + 1},${record.studentId},${record.studentName},${record.date},${record.subject},${record.status}\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "monthly-attendance-report.csv";

    link.click();

    URL.revokeObjectURL(url);
}


// Export PDF
function exportPDF() {

    window.print();

}


// Load initial report
window.onload = function () {
    generateReport();
};