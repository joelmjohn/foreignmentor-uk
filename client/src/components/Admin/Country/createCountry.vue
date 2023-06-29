<template>
    <div>
        <b-card>
            <b-container>
                <h1>
                    <b>ADD COUNTRY</b>
                </h1>
                <div class="form mb-3">
                    <label>Country Name</label><b-form-input v-model="country.name" placeholder="Enter the CountryName" required></b-form-input>
                </div>
                <div class="form mb-3">
                    <label>Country Description</label><b-form-input v-model="country.description" placeholder="Description" required></b-form-input>
                </div>
                <div class="form mb-3">
                    <label>Country Code</label><b-form-input v-model="country.countryCode" placeholder="Country Code" required></b-form-input>
                </div>
                <b-button variant="outline-primary" size="lg" @click="handleAdd">Add</b-button>
            </b-container>
        </b-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            root: process.env.VUE_APP_ROOT_API,
            adminId: localStorage.getItem("adminId"),
            country: { name: "", description: "", countryCode: "" },
        };
    },
    props: { countryListing: { type: Function, required: true } },
    methods: {
        handleAdd() {
            if (
                !this.country.name ||
                !this.country.description ||
                !this.country.countryCode
            ) {
                this.$bvToast.toast("Please fill all the details", {
                    title: "Error",
                    variant: "danger",
                    solid: true,
                });
            }
            else {
                this.country.name = this.country.name.toUpperCase();
                const data = {
                name: this.country.name,
                description: this.country.description,
                countryCode:this.country.countryCode,
                adminId: this.adminId
            }
                this.$axios
                    .post(`${this.root}/country/create`,data )

                    .then((response) => {
                        if (response.data.status) {
                            this.countryListing();
                            this.$bvToast.toast("Country Created Successfully", {
                            title: "Success",
                            variant: "success",
                            solid: true,})
                            this.country.name = "";
                            this.country.description = "";
                            this.country.countryCode = "";
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$bvToast.toast("Error Occured", {
                            title: "Error ",
                            variant: "danger",
                            solid: true,
                        });
                    });
            }
        }
    },
};
</script>

<style></style>