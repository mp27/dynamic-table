<template>
    <div id="app">
        <DynamicTable />
    </div>
</template>

<script>
    import DynamicTable from './components/DynamicTable.vue'
    import {mapActions} from 'vuex'
    export default {
        name: 'app',
        data(){
          return {
              currentPage: 1,
              per_page: 10
          }
        },
        components: {
            DynamicTable
        },
        created(){
            this.getAllUsers({
                page: this.currentPage,
                per_page: this.per_page
            })
        },
        methods: {
            // map vuex action getAllUsers, that are namespaced to users
            ...mapActions("users", ['getAllUsers'])
        }
    }
</script>
