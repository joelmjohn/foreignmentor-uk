<template>
    <b-modal size="xl" :title="actionType" v-model="jobModal" centered @ok="handleModal" @cancel="cancelJobModal"
        @close="closeJobModal" :no-close-on-backdrop="true">
        <b-container>
            <b-row>
                <b-col>
                    <label>Job Name</label>
                    <b-form-input required v-model="jobDetails.jobName" placeholder="Enter Job Name"
                        trim></b-form-input></b-col>
                <b-col>
                    <label>Job Description</label>
                    <b-form-textarea class="rows-sm" required id="textarea" v-model="jobDetails.jobDescription"
                        placeholder="Enter Job Description"></b-form-textarea></b-col>
                <b-col>
                    <label>Company Name</label>
                    <b-form-input required v-model="jobDetails.companyName" placeholder="Enter Company Name"
                        trim></b-form-input></b-col></b-row>
            <b-row>
                <b-col>
                    <label>Company Description</label>
                    <b-form-textarea required id="textarea" v-model="jobDetails.companyDescription"
                        placeholder="Enter Company Description"></b-form-textarea></b-col>
                <b-col cols="4">
                    <label>Job status</label>
                    <select required v-model="jobDetails.status" class="custom-select custom-select-sm"
                        aria-label="Default select example">
                        <option value="" disabled>Select</option>
                        <option v-for="(statusValue, index) in statusSelected" :key="index">
                            {{ statusValue }}
                        </option>
                    </select></b-col>

                <b-col>
                    <label>Industry</label>
                    <b-form-input required v-model="jobDetails.industryType"
                        placeholder="Enter Industry"></b-form-input></b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label>Vacancy</label>
                    <b-form-input :state="vacancyCheck" required v-model="jobDetails.vacancy"
                        placeholder="Enter Vacancy"></b-form-input></b-col>
                <b-col>
                    <label>Employment Type</label>
                    <select required v-model="jobDetails.employmentType" class="custom-select custom-select-sm"
                        aria-label="Default select example">
                        <option value="" disabled>Select</option>
                        <option v-for="(type, index) in employmentTypeSelected" :key="index">
                            {{ type }}
                        </option>
                    </select>
                </b-col>
                <b-col>
                    <label>Experience Required</label>
                    <b-form-input :state="experienceCheck" required v-model="jobDetails.experienceRequired"
                        placeholder="Enter Experience"></b-form-input></b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label>Address</label>
                    <b-form-textarea required id="textarea" v-model="jobDetails.address"
                        placeholder="Enter Address"></b-form-textarea></b-col>
                <b-col>
                    <label>Country</label>
                    <select required v-model="jobDetails.countrySelected" class="custom-select custom-select-sm"
                        aria-label="Default select example">
                        <option value="" disabled>Select</option>
                        <option v-for="(country, index) in countrys" :value="country.id" :key="index">
                            {{ country.name }} ({{ country.countryCode }})
                        </option>
                    </select></b-col>
                <b-col>
                    <label>Skills Required</label>
                    <multiselect v-model="jobDetails.skillsRequired" :options="skillsDetails" :multiple="true"
                        :close-on-select="true">
                    </multiselect>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="4">
                    <label>Valid Till Date</label>
                    <b-form-datepicker v-model="jobDetails.validTillDate" class="mb-2"></b-form-datepicker></b-col>
            </b-row>
        </b-container>
    </b-modal>
</template>
  
<script>
import Multiselect from "vue-multiselect";
export default {
    components: { Multiselect },
    data() {
        return {
            jobDetails: {
                jobName: "",
                jobDescription: "",
                companyName: "",
                companyDescription: "",
                address: "",
                vacancy: "",
                experienceRequired: "",
                industryType: "",
                validTillDate: "",
                employmentType: "",
                skillsRequired: "",
                status: "",
                countrySelected: "",
            },
            employmentTypeSelected: ["FULL TIME", "PART TIME"],
            skillsDetails: [
                "Situational Awareness",
                "Empathy",
                "Leadership",
                "Teamwork",
            ],
            countryId: "",
            statusSelected: ["ACTIVE", "EXPIRED"],
            adminId: localStorage.getItem("adminId"),
            vacancyCheck: false,
            experienceCheck: false,
        };
    },
    props: {
        jobModal: { required: true, type: Boolean, default: false },
        countrys: { required: true, type: Array, default: [] },
        actionType: {
            type: String,
            default: "Create",
        },
        jobDataDetails: { required: true, type: Object },
    },
    watch: {
        jobDataDetails() {
            this.jobDetails = this.jobDataDetails;
            if (this.actionType === "Update") {
                this.jobDetails.countrySelected = this.jobDataDetails.countryId;
            }
        },
        "jobDetails.vacancy": function (data) {
            if (this.actionType === "Create" || this.actionType === "Update") {
                if (!Number.isInteger(Number(data)) || this.jobDetails.vacancy == "") {
                    this.vacancyCheck = false;
                } else {
                    this.vacancyCheck = true;
                }
            }
            else { this.vacancyCheck = false; }
        },
        "jobDetails.experienceRequired": function (data) {
            if (this.actionType === "Create" || this.actionType === "Update") {
                if (
                    !Number.isInteger(Number(data)) ||
                    this.jobDetails.experienceRequired == ""
                ) {
                    this.experienceCheck = false;
                } else {
                    this.experienceCheck = true;
                }
            }
            else { this.experienceCheck = false; }
        },
    },
    methods: {
        toggleStatus() {
            this.status = !this.status;
        },
        handleModal(evt) {
            evt.preventDefault();
            if (this.actionType === "Create") {
                const data = {
                    jobName: this.jobDetails.jobName,
                    jobDescription: this.jobDetails.jobDescription,
                    companyName: this.jobDetails.companyName,
                    companyDescription: this.jobDetails.companyDescription,
                    vacancy: this.jobDetails.vacancy,
                    address: this.jobDetails.address,
                    experienceRequired: this.jobDetails.experienceRequired,
                    skillsRequired: this.jobDetails.skillsRequired,
                    industryType: this.jobDetails.industryType,
                    employmentType: this.jobDetails.employmentType,
                    validTillDate: this.jobDetails.validTillDate,
                    status: this.jobDetails.status,
                    adminId: this.adminId,
                    countryId: this.jobDetails.countrySelected,
                };
                const isEmpty = Object.values(data).some(
                    (value) => value === undefined || data.skillsRequired == [] || value === ""
                );
                console.log(data);
                if (isEmpty) {
                    this.toast("Error", "Please fill all the details", "danger");
                } else {
                    this.$emit("displayJobs", data);
                    this.$emit("closeJobModal");
                    this.countryId = this.jobDetails.countrySelected;
                    for (const key in this.jobDetails) {
                        this.jobDetails[key]="";
                    }
                }
            } else if (this.actionType === "Update") {
                const isEmpty = Object.values(this.jobDataDetails).some(
                    (value) => value === "" || this.jobDataDetails.skillsRequired.length == 0
                );
                if (isEmpty) {
                    this.toast("Error", "Please fill all the details", "danger");
                } else {
                    this.jobDataDetails.countryId = this.jobDetails.countrySelected;

                    this.$emit("newDataDetails", this.jobDataDetails);
                    this.$emit("closeJobModal");
                }
            }
        },
        cancelJobModal(evt) {
            evt.preventDefault();
            this.$emit("closeJobModal");
        },
        closeJobModal(evt) {
            evt.preventDefault();
            this.$emit("closeJobModal");
        },
        toast(title, msg, variant) {
            this.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true,
            });
        },
    },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
  