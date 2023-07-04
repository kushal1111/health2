<template>
  <div>
    <div id="display">
      <h1>Health Records</h1>

      <form @submit.prevent="fetchHealthRecords">
        <label for="patientId">Patient ID:</label>
        <input
          type="text"
          id="patientId"
          placeholder="patientId"
          v-model="patientIdinput"
          required
        />
        <button type="submit">Fetch Records</button>
      </form>

      <div v-if="healthRecords">
        <h2>Patient ID: {{ healthRecords.patient_id }}</h2>
        <pre>{{ healthRecords.health_records }}</pre>
      </div>
    </div>
    <div id="input">
      <h1>Health Records</h1>

      <form @submit.prevent="createHealthRecords">
        <label for="patientsId">Patient ID:</label>
        <input type="text" id="patientsId" v-model="patientId" required />

        <label for="healthRecords">Health Records:</label>
        <input
          type="text"
          placeholder="Health details"
          id="healthRecords"
          v-model="healthRecordsoutput"
          required
        />

        <button type="submit">Create Records</button>
      </form>

      <div v-if="loading">
        <p>Loading...</p>
      </div>

      <div v-else-if="error">
        <p>Error: {{ error }}</p>
      </div>

      <div v-else-if="success">
        <p>Health records created successfully!</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HealthApp",
  el: "#app",
  data: () => {
    return {
      patientId: "",
      patientIdinput: "",
      healthRecords: { patient_id: "", health_records: "" },
      healthRecordsoutput: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    fetchHealthRecords() {
      this.loading = true;
      this.error = null;

      axios
        .get(`http://localhost:3000/api/health/${this.patientIdinput}`)
        .then((response) => {
          console.log(response);
          this.healthRecords.patient_id = response.data.patientId;
          this.healthRecords.health_records = response.data.healthRecords;
          this.loading = false;
        })
        .catch((error) => {
          this.error = error.message;
          this.loading = false;
        });
    },
    createHealthRecords() {
      this.loading = true;
      this.error = null;
      this.success = false;

      axios
        .put(`http://localhost:3000/api/health/${this.patientId}`, {
          patientId: this.patientId,
          healthRecords: this.healthRecordsoutput,
        })
        .then((response) => {
          if (response) {
            this.success = true;
            this.patientId = "";
            this.healthRecordsoutput = "";
            this.loading = false;
          }
        })
        .catch((error) => {
          this.error = error.message;
          this.loading = false;
        });
    },
  },
};
</script>
