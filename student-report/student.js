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
        status: "Absent"
    },

    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-03",
        subject: "Computer Networks",
        status: "Present"
    },

    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-04",
        subject: "Artificial Intelligence",
        status: "Late"
    },

    {
        studentId: "STU001",
        studentName: "Rahul Kumar",
        date: "2026-10-05",
        subject: "DBMS",
        status: "Present"
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
    }

];


function generateReport() {

    const student =
        document.getElementById("student").value;

    const subject =
        document.getElementById("subject").value;

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;

    const status =
        document.getElementById("status").value;


    if (!student) {

        alert("Please select a student.");

        return;
    }


    const filteredData =
        attendanceData.filter(record => {

            return (

                record.studentId === student &&

                (!subject ||
                    record.subject === subject) &&

                (!fromDate ||
                    record.date >= fromDate) &&

                (!toDate ||
                    record.date <= toDate) &&

                (!status ||
                    record.status === status)

            );

        });


    displayStudentInfo(student);

    displayReport(filteredData);

    updateSummary(filteredData);
}


function displayStudentInfo(studentId) {

    const studentRecords =
        attendanceData.filter(
            record =>
                record.studentId === studentId
        );


    if (studentRecords.length === 0) {

        return;
    }


    document.getElementById("studentName")
        .textContent =
        studentRecords[0].studentName;


    document.getElementById("studentId")
        .textContent =
        "Student ID: " + studentId;
}


function displayReport(data) {

    const tbody =
        document.getElementById("reportBody");

    const noRecords =
        document.getElementById("noRecords");


    tbody.innerHTML = "";


    if (data.length === 0) {

        noRecords.style.display = "block";

        return;
    }


    noRecords.style.display = "none";


    data.forEach((record, index) => {

        let statusClass = "";


        if (record.status === "Present") {

            statusClass =
                "status-present";

        } else if (record.status === "Absent") {

            statusClass =
                "status-absent";

        } else if (record.status === "Late") {

            statusClass =
                "status-late";

        } else if (record.status === "On Leave") {

            statusClass =
                "status-leave";
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${record.date}</td>

            <td>${record.subject}</td>

            <td>
                <span class="status ${statusClass}">
                    ${record.status}
                </span>
            </td>

        `;


        tbody.appendChild(row);

    });
}


function updateSummary(data) {

    const totalClasses =
        data.length;


    const totalPresent =
        data.filter(
            record =>
                record.status === "Present"
        ).length;


    const totalAbsent =
        data.filter(
            record =>
                record.status === "Absent"
        ).length;


    const attendancePercentage =
        totalClasses > 0
            ? ((totalPresent / totalClasses) * 100)
                .toFixed(2)
            : 0;


    document.getElementById("totalClasses")
        .textContent =
        totalClasses;


    document.getElementById("totalPresent")
        .textContent =
        totalPresent;


    document.getElementById("totalAbsent")
        .textContent =
        totalAbsent;


    document.getElementById("attendancePercentage")
        .textContent =
        attendancePercentage + "%";
}


function resetFilters() {

    document.getElementById("student").value = "";

    document.getElementById("subject").value = "";

    document.getElementById("fromDate").value = "";

    document.getElementById("toDate").value = "";

    document.getElementById("status").value = "";


    document.getElementById("studentName")
        .textContent =
        "Select a student";


    document.getElementById("studentId")
        .textContent =
        "Student ID: -";


    document.getElementById("reportBody")
        .innerHTML = "";


    document.getElementById("noRecords")
        .textContent =
        "Select a student and generate the report.";


    document.getElementById("noRecords")
        .style.display =
        "block";


    updateSummary([]);
}


// CSV Export

function exportCSV() {

    const table =
        document.getElementById(
            "studentReportTable"
        );


    let csv = [];


    const rows =
        table.querySelectorAll("tr");


    rows.forEach(row => {

        const rowData = [];


        row.querySelectorAll(
            "th, td"
        ).forEach(cell => {

            rowData.push(
                `"${cell.innerText
                    .replace(/"/g, '""')}"`
            );

        });


        csv.push(rowData.join(","));

    });


    const csvFile =
        new Blob(
            [csv.join("\n")],
            {
                type: "text/csv"
            }
        );


    const downloadLink =
        document.createElement("a");


    downloadLink.href =
        URL.createObjectURL(csvFile);


    downloadLink.download =
        "student-attendance-report.csv";


    downloadLink.click();


    URL.revokeObjectURL(
        downloadLink.href
    );
}


// PDF Export

function exportPDF() {

    window.print();

}