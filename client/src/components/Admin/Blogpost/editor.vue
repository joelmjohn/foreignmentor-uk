<template>
    <div class="blog-page">
        <b-card>
            <h1>{{ actionType }} blogpost</h1>
            <div>
                <b-form-input v-model="blogName" :state="blogState" placeholder="Your blog highlight"></b-form-input>
            </div>
        </b-card>
        <br />
        <b-card>
            <h1>Content creator</h1>

            <div class="editor-selector">
                <EditorElements :editor="editor" @img="getUrl" />
            </div>
            <br />
            <editor-content :editor="editor" />
        </b-card>
        <div>
            <b-modal title="Enter Image URL" v-model="showModal" @ok="handleImgUrl" :no-close-on-backdrop="true">
                <form ref="form" @submit.stop.prevent="handleImgUrl">
                    <b-form-group label="URL" label-for="img-url" invalid-feedback="URL is required" :state="imgUrlState">
                        <b-form-input id="img-url" v-model="imgUrl" required :state="imgUrlState"></b-form-input>
                    </b-form-group>
                </form>
            </b-modal>
        </div>
        <div class="text-center">
            <b-button variant="outline-primary" @click="handleFinalize" :disabled="loading">Finalize</b-button>
        </div>
    </div>
</template>

<script>
import EditorElements from './editorElements.vue'
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

export default {
    name: "blogEditor",
    props: {
        htmlContent: {
            type: String,
            default: `<h1 style="text-align:center;">Sample Blog</h1><hr/>
                <h2 style="text-align:center;"><p>Welcome to the testing on new blogpost</p></h2>
                <img src="https://colorwhistle.com/wp-content/uploads/2022/04/AI-Statistics-for-Small-Business.webp"/>
                <ul><li><p> Ut enim ad minim veniam</p></li><li><p> quis nostrud exercitation ullamco</p></li><li><p> laboris nisi ut aliquip ex ea commodo </p></li><li><p>consequa</p></li></ul>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                <h3 style="text-align: center"><i>you can add you content however you like</i></h3>`
        },
        actionType: {
            type: String,
            default: 'Create'
        },
        name: {
            type: String
        }
    },
    components: {
        EditorContent, EditorElements
    },
    data() {
        return {
            editor: new Editor({
                content: ``,
                extensions: [
                    StarterKit,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    Image,
                    TextStyle,
                    Color
                ],
            }),
            html: '',
            showModal: false,
            imgUrl: '',
            imgUrlState: null,
            blogName: this.name ? this.name : '',
            blogState: null,
            loading: false,
            root: process.env.VUE_APP_ROOT_API
        }
    },
    methods: {
        getUrl() {
            this.showModal = true;
        },
        cancelModal() {
            this.showModal = false;
        },
        handleImgUrl(evt) {
            evt.preventDefault();
            if (this.imgUrl.startsWith("https://") && this.imgUrl) {
                this.editor.commands.setImage({ src: this.imgUrl });
                this.showModal = false;
                this.imgUrl = '';
            }
            else {
                this.showModal = true;
                this.imgUrlState = false;
            }
        },
        handleFinalize() {
            this.html = this.editor.getHTML();
            if (!this.html) {
                this.$bvToast.toast("Invalid Content, add some content..", {
                    title: "Invalid",
                    variant: "danger",
                    solid: true,
                });
                return false;
            }
            else if (!this.blogName) {
                this.$bvToast.toast("Invalid Blog name", {
                    title: "Invalid",
                    variant: "danger",
                    solid: true,
                });
                this.blogState = false;
                return false;
            }
            this.loading = true;
            const blogData = {
                name: this.blogName,
                richTextBody: this.html,
            }
            this.$emit("finalized", blogData);
        }
    },
    mounted() {
        this.editor.commands.setContent(`${this.htmlContent}`);
    }
}
</script>

<style>
.blog-page {
    padding: 20px;

}

.ProseMirror {
    background-color: rgb(253, 253, 253);
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: black;
    outline: 1px solid black;
}

.editor-selector {
    padding: 0.75rem;
    text-align: center;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    backdrop-filter: blur(10px);
}

img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

pre {
    background-color: black;
    color: rgb(131, 218, 255) !important;
}
</style>