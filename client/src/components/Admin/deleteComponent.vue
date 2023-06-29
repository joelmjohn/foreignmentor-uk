<template>
    <div>
        <b-modal title="Delete Job" id="modal-center" v-model="show" centered @cancel="cancelDeleteModal"
            @close="closeDeleteModal" :no-close-on-backdrop="true" @ok="deleteJob">
            <div class="d-block text-center">
                <h3>Are you sure want to Delete</h3>
            </div>
            <div class="form mb-3 text-center"></div>
        </b-modal>
    </div>
</template>
<script>
export default {
    data() {
        return { root: process.env.VUE_APP_ROOT_API };
    },
    props: {
        show: { required: true, type: Boolean },
        deleteId: { required: true, type: String },
        jobDetails: { required: true, type: Function },
    },
    methods: {
        cancelDeleteModal(evt) {
            evt.preventDefault();
            this.$emit("closeDeleteModal");
        },
        closeDeleteModal(evt) {
            evt.preventDefault();
            this.$emit("closeDeleteModal");
        },
        deleteJob(evt) {
            evt.preventDefault();
            this.$emit("closeDeleteModal");
            this.$emit("deleteJobDetails", this.deleteId)
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
<style></style>