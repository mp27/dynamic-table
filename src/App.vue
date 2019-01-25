<template>
    <div id="app">
        <DynamicTable :data="usersMeta.data"
                      :total="usersMeta.total"
                      :columns="columns"
                      :uniqueKey="uniqueKey"
                      @loadData="getAllUsers"
        />
    </div>
</template>

<script>
    import DynamicTable from './components/DynamicTable.vue'
    import {mapActions, mapState} from 'vuex'

    export default {
        name: 'app',
        data(){
          return {
              currentPage: 1,
              per_page: 100,
              columns: [
                  {
                      name: "ID",
                      key: "_id",
                      type: "string"
                  },
                  {
                      name: "Email",
                      key: "email",
                      type: "string"
                  },
                  {
                      name: "Name",
                      key: "name",
                      type: "string"
                  },
                  {
                      name: "Company",
                      key: "company",
                      type: "string"
                  }
              ],
              uniqueKey: '_id',
          }
        },
        components: {
            DynamicTable
        },
        computed: {
            ...mapState({
                usersMeta: ({users}) => {
                    return users.all
                }
            })
        },
        methods: {
            // map vuex action getAllUsers, that are namespaced to users
            ...mapActions("users", ['getAllUsers'])
        }
    }
</script>
<style>
    html,body, #app{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
