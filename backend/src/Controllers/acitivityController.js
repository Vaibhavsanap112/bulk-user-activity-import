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
      invalidRecords.push({
        import_id: importId,
        error_message: error,
        record_data: JSON.stringify(record),
      });
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

 
  if (validRecords.length > 0) {
    db.query(insertValidQuery, [validRecords], (err) => {
      if (err) {
        console.log("Error inserting valid records:", err);
        return res.status(500).json({ message: "DB error (valid records)" });
      }
    });
  }

  
  if (invalidRecords.length > 0) {
    const invalidValues = invalidRecords.map((r) => [
      r.import_id,
      r.error_message,
      r.record_data,
    ]);

    db.query(insertInvalidQuery, [invalidValues], (err) => {
      if (err) {
        console.log("Error inserting invalid records:", err);
      }
    });
  }

  
  const updateQuery = `
    UPDATE import_logs
    SET 
      processed_records = processed_records + ?,
      success_count = success_count + ?,
      failed_count = failed_count + ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [data.length, validRecords.length, invalidRecords.length, importId],
    (err) => {
      if (err) {
        console.log("Error updating import_logs:", err);
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