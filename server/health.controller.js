const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

// Connection URL
const url = "mongodb://localhost:27017/health_database";

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Define the HealthRecord schema
    const healthRecordSchema = new mongoose.Schema({
      patientId: { type: String, required: true },
      healthRecords: { type: String, required: true }
    });

    // Create the HealthRecord model
    const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

    // API endpoint to update health records by patient ID
    app.put("/api/health/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { healthRecords } = req.body;

        // Update health records
        const result = await HealthRecord.findOneAndUpdate(
          { patientId: id },
          { healthRecords },
          { upsert: true }
        );

        if (result) {
          res.status(httpStatus.OK).json({ message: "Health records updated successfully" });
        } else {
          await HealthRecord.create({ patientId: id, healthRecords });
          res.status(httpStatus.OK).json({ message: "Health records created successfully" });
        }
      } catch (err) {
        console.error("Error updating health records:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    });

    // API endpoint to get health records by patient ID
    app.get("/api/health/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // Find health records by patient ID
        const result = await HealthRecord.findOne({ patientId: id });

        if (result) {
          res.status(httpStatus.OK).json(result);
        } else {
          res.status(httpStatus.NOT_FOUND).json({ message: "Health records not found" });
        }
      } catch (err) {
        console.error("Error retrieving health records:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    });

    // Start the server
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
