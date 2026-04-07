const db = require("../Config/db");


const validateRecord = (record) => {
  const { userId, email, activity, timestamp } = record;

  if (!userId || !email || !activity || !timestamp) {
    return "Missing required fields";
  }

  if (!email.includes("@")) {
    return "Invalid email format";
  }

  if (isNaN(new Date(timestamp))) {
    return "Invalid timestamp";
  }

  return null;
};

exports.bulkInsert = (req, res) => {
  const { importId, data } = req.body;

  if (!importId || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  let validRecords = [];
  let invalidRecords = [];

  data.forEach((record) => {
    const error = validateRecord(record);

    if (error) {
      invalidRecords.push([
        importId,
        error,
        JSON.stringify(record),
      ]);
    } else {
      validRecords.push([
        importId,
        record.userId,
        record.email,
        record.activity,
        record.timestamp,
      ]);
    }
  });

  console.log("Invalid Records:", invalidRecords);

  const insertValidQuery = `
    INSERT IGNORE INTO user_activity
    (import_id, user_id, email, activity_type, activity_time)
    VALUES ?
  `;

  const insertInvalidQuery = `
    INSERT INTO failed_records
    (import_id, error_message, record_data)
    VALUES ?
  `;

  const updateQuery = `
    UPDATE import_logs
    SET 
      processed_records = processed_records + ?,
      success_count = success_count + ?,
      failed_count = failed_count + ?
    WHERE id = ?
  `;

  
  const insertValid = (callback) => {
    if (validRecords.length === 0) return callback();

    db.query(insertValidQuery, [validRecords], (err) => {
      if (err) {
        console.log("Error inserting valid:", err);
        return res.status(500).json({ message: "Valid insert failed" });
      }
      callback();
    });
  };

 
  const insertInvalid = (callback) => {
    if (invalidRecords.length === 0) return callback();

    db.query(insertInvalidQuery, [invalidRecords], (err) => {
      if (err) {
        console.log("Error inserting invalid:", err);
        return res.status(500).json({ message: "Invalid insert failed" });
      }
      callback();
    });
  };

  
  const updateLogs = () => {
    db.query(
      updateQuery,
      [data.length, validRecords.length, invalidRecords.length, importId],
      (err) => {
        if (err) {
          console.log("Error updating logs:", err);
        }

        res.json({
          message: "Chunk processed",
          processed: data.length,
          success: validRecords.length,
          failed: invalidRecords.length,
        });
      }
    );
  };


  insertValid(() => {
    insertInvalid(() => {
      updateLogs();
    });
  });
};