const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, "public")));


// --------------------------------------------------
// Database
// --------------------------------------------------

const databasePath = path.join(
    __dirname,
    "database",
    "attendance.db"
);

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error(
            "Database connection failed:",
            error.message
        );
    } else {
        console.log("Connected to SQLite database.");
    }
});


// --------------------------------------------------
// Create Attendance Table
// --------------------------------------------------

db.run(
    `
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        student_id TEXT NOT NULL,

        attendance_date TEXT NOT NULL,

        subject TEXT NOT NULL,

        status TEXT NOT NULL
            CHECK(status IN ('Present', 'Absent', 'Late')),

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(
            student_id,
            attendance_date,
            subject
        )
    )
    `,
    (error) => {
        if (error) {
            console.error(
                "Failed to create attendance table:",
                error.message
            );
        } else {
            console.log(
                "Attendance table is ready."
            );
        }
    }
);


// ==================================================
// GET /
// ==================================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});


// ==================================================
// POST /attendance/save
// ==================================================

app.post("/attendance/save", (req, res) => {

    const {
        studentId,
        date,
        subject,
        status
    } = req.body;


    // ------------------------------------------------
    // Validate required fields
    // ------------------------------------------------

    if (
        !studentId ||
        !date ||
        !subject ||
        !status
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Student ID, date, subject and status are required."
        });
    }


    // ------------------------------------------------
    // Clean input
    // ------------------------------------------------

    const cleanStudentId =
        studentId.trim();

    const cleanSubject =
        subject.trim();


    if (!cleanStudentId) {
        return res.status(400).json({
            success: false,
            message:
                "Student ID cannot be empty."
        });
    }


    if (!cleanSubject) {
        return res.status(400).json({
            success: false,
            message:
                "Subject cannot be empty."
        });
    }


    // ------------------------------------------------
    // Validate attendance status
    // ------------------------------------------------

    const validStatuses = [
        "Present",
        "Absent",
        "Late"
    ];

    if (!validStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message:
                "Status must be Present, Absent or Late."
        });
    }


    // ------------------------------------------------
    // Validate date
    // ------------------------------------------------

    const datePattern =
        /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(date)) {

        return res.status(400).json({
            success: false,
            message:
                "Please provide a valid date."
        });
    }


    // ------------------------------------------------
    // Check duplicate attendance
    // ------------------------------------------------

    const duplicateQuery = `
        SELECT id
        FROM attendance
        WHERE student_id = ?
        AND attendance_date = ?
        AND subject = ?
    `;

    db.get(
        duplicateQuery,
        [
            cleanStudentId,
            date,
            cleanSubject
        ],
        (error, existingRecord) => {

            if (error) {

                console.error(
                    "Duplicate check error:",
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Database error while checking attendance."
                });
            }


            // ------------------------------------------------
            // Duplicate found
            // ------------------------------------------------

            if (existingRecord) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Attendance already exists for this student, date and subject."
                });
            }


            // ------------------------------------------------
            // Insert attendance
            // ------------------------------------------------

            const insertQuery = `
                INSERT INTO attendance
                (
                    student_id,
                    attendance_date,
                    subject,
                    status
                )
                VALUES (?, ?, ?, ?)
            `;

            db.run(
                insertQuery,
                [
                    cleanStudentId,
                    date,
                    cleanSubject,
                    status
                ],
                function (insertError) {

                    if (insertError) {

                        console.error(
                            "Insert error:",
                            insertError.message
                        );


                        // SQLite unique constraint
                        if (
                            insertError.code ===
                            "SQLITE_CONSTRAINT"
                        ) {

                            return res.status(409).json({
                                success: false,
                                message:
                                    "Attendance already exists for this student, date and subject."
                            });
                        }


                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to save attendance."
                        });
                    }


                    // ------------------------------------------------
                    // Success
                    // ------------------------------------------------

                    return res.status(201).json({

                        success: true,

                        message:
                            "Attendance saved successfully.",

                        attendance: {

                            id: this.lastID,

                            studentId:
                                cleanStudentId,

                            date: date,

                            subject:
                                cleanSubject,

                            status:
                                status
                        }
                    });
                }
            );
        }
    );
});


// ==================================================
// GET /attendance
// Get all attendance records
// ==================================================

app.get("/attendance", (req, res) => {

    const query = `
        SELECT
            id,
            student_id,
            attendance_date,
            subject,
            status,
            created_at
        FROM attendance
        ORDER BY attendance_date DESC, id DESC
    `;


    db.all(
        query,
        [],
        (error, rows) => {

            if (error) {

                console.error(
                    "Fetch attendance error:",
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to fetch attendance records."
                });
            }


            return res.json({
                success: true,
                attendance: rows
            });
        }
    );
});


// ==================================================
// GET /attendance/:studentId
// Get attendance for one student
// ==================================================

app.get(
    "/attendance/:studentId",
    (req, res) => {

        const studentId =
            req.params.studentId;


        const query = `
            SELECT
                id,
                student_id,
                attendance_date,
                subject,
                status,
                created_at
            FROM attendance
            WHERE student_id = ?
            ORDER BY attendance_date DESC
        `;


        db.all(
            query,
            [studentId],
            (error, rows) => {

                if (error) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to fetch student attendance."
                    });
                }


                return res.json({
                    success: true,
                    attendance: rows
                });
            }
        );
    }
);


// ==================================================
// Start Server
// ==================================================

app.listen(PORT, () => {

    console.log("");
    console.log(
        "======================================"
    );

    console.log(
        `Attendance server running at:`
    );

    console.log(
        `http://localhost:${PORT}`
    );

    console.log(
        "======================================"
    );

});
