<template>
    <div>
        <b-container>
            <b-card> <b-button @click="createJob">Create Job</b-button></b-card></b-container>
        <jobComponent :countrys="countrys" @displayJobs="jobData" :jobModal="createJobModal"
            @closeJobModal="createJobModal = false" />
        <b-container>
            <b-card>
                <h2>Jobs</h2>
                <div class="form mb-3">
                    <b-form-input v-model="searchData" placeholder="Search Job.."></b-form-input>
                </div>
                <div class="form mb-3">
                    <b-button v-b-toggle.collapse-1 variant="outline-secondary" size="sm">
                        <b-icon icon="filter"></b-icon>Filter</b-button>
                    <b-collapse id="collapse-1" class="mt-2" v-model="filterOpen">
                        <b-card>
                            <b-form-group label-cols-lg="1" label-size="sm" label="Country" label-for="input-country">
                                <select v-model="selectedCountry" class="custom-select custom-select-sm"
                                    aria-label="Default select example">
                                    <option value="">ALL</option>
                                    <option v-for="country in countrys" :value="country.id">{{ country.name }} ({{
                                        country.countryCode }})</option>
                                </select>
                            </b-form-group>
                        </b-card>
                    </b-collapse>
                </div>
                <div class="form text-center">
                    <b-button variant="outline-primary" size="md" @click="fetchJobs" :disabled="loading">
                        <b-icon icon="search" font-scale="1"></b-icon> Search
                    </b-button>
                </div>

            </b-card>
        </b-container>

        <b-card v-if="jobList.length">
            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                    <b-skeleton-table :rows="5" :columns="4" :table-props="{ bordered: true, striped: true }">
                    </b-skeleton-table>
                </template>
                <table class="table table-bordered" v-if="!loading">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>JobName</th>
                            <th>Job Description</th>
                            <th>Company Name</th>
                            <th>Company Description</th>
                            <th>Country</th>
                            <th>Industry</th>
                            <th>Vancancy</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody v-for="(data, idx) in jobList" :key="idx">
                        <tr>
                            <td>{{ idx + 1 }}</td>
                            <td>{{ data.jobName }}</td>
                            <td>{{ handleDescription(data.jobDescription) }}</td>
                            <td>{{ data.companyName }}</td>
                            <td>{{ data.companyDescription }}</td>
                            <td>{{ data.countryDetails[0].name }}</td>
                            <td>{{ data.industryType }}</td>
                            <td>{{ data.vacancy }}</td>
                            <td :class="data.status == 'ACTIVE' ? 'table-success' : 'table-danger'">{{ data.status }}
                            </td>
                            <td>{{ data.adminDetails[0].name }}</td>
                            <td>
                                <b-button variant="outline-primary" size="sm" @click="handleEdit()">
                                    <b-icon icon="pencil"></b-icon>
                                    Edit
                                </b-button>
                                <b-button variant="outline-danger" size="sm" @click="handleDelete(data.id)">
                                    <b-icon icon="trash"></b-icon>
                                    Delete
                                </b-button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </b-skeleton-wrapper>
        </b-card>

    </div>
</template>

<script>
import jobComponent from './jobComponent.vue';
export default {
    components: { jobComponent },
    name: "jobList",
    data() {
        return {
            searchData: "",
            filterOpen: false,
            countrys: [],
            selectedCountry: '',
            loading: false,
            jobList: [],
            root: process.env.VUE_APP_ROOT_API,
            createJobModal: false,
            jobModal: false,
        }
    },

    mounted() { this.fetchCountries() },
    methods: {
        jobData(val) {
            this.$axios
                .post(`${this.root}/job/create`, val)
                .then((response) => {
                    const responseData = response.data;
                    if (responseData.status) {
                        this.$bvToast.toast("Job details Added Successfully", {
                            title: "Success",
                            variant: "success",
                            solid: true,
                        });
                    } else {
                        this.$bvToast.toast("Couldn't fetch data, try again", {
                            title: "Error",
                            variant: "danger",
                            solid: true,
                        });
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Error Occured!", {
                        title: "Error",
                        variant: "danger",
                        solid: true,
                    });
                });
        },
        fetchJobs() {
            this.loading = true;
            this.$axios
                .post(`${this.root}/job`)
                .then((response) => {
                    const responseData = response.data;
                    if (responseData.status) {
                        this.jobList = responseData.data.jobs;
                    } else {
                        this.toast("Couldn't fetch data, try again", "Error", "danger");
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.toast("Error Occured!", "Error", "danger");
                });
        },
        createJob() { this.createJobModal = true },
        fetchCountries() {
            this.loading = true;
            this.$axios
                .get(`${this.root}/country`)
                .then((response) => {
                    const responseData = response.data;
                    if (responseData.status) {
                        this.countrys = responseData.data.country;
                    } else {
                        this.toast("Error", "Couldn't fetch data, try again", "danger");
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.toast("Error", "Error Occured", "danger");
                });
        },
        fetchJobs() {
            this.loading = true;
            const data = {}
            if (this.selectedCountry) {
                data.countryId = this.selectedCountry;
            }
            if (this.searchData) {
                data.jobName = this.searchData;
            }
            this.$axios
                .post(`${this.root}/job`, data)
                .then((response) => {
                    const responseData = response.data;
                    if (responseData.status) {
                        this.jobList = responseData.data.jobs;
                        if (!this.jobList.length) {
                            this.toast("Empty", "No data found, try again", "warning");
                        }
                    } else {
                        this.toast("Empty", "No data found, try again", "warning");
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.toast("Error", "Error Occured", "danger");
                });
        },
        handleDescription(str) {
            if (str.length > 20) {
                return str.slice(0, 20) + ' ...'
            }
        },
        handleEdit() {
        },
        handleDelete() {

        },
        toast(title, msg, variant) {
            this.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true,
            });
        }
    },
}
</script>