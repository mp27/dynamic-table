<template>
    <div id="app">
        <DynamicTable :data="usersMeta.data"
                      :total="usersMeta.total"
                      :columns="columns"
                      :uniqueKey="uniqueKey"
                      @loadData="getAllUsers"
                      @rowSelected="select"
                      @deleteClick="deleteRow"
                      @editClick="editRow"
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
                  },
                  {
                      name: "Actions",
                      type: "actions",
                      actions: {
                          edit: {
                              visible: true,
                              label: "Edit",
                              classes: "btn btn-sm btn-success",
                              style: {
                                marginRight: '15px'
                              },
                              eventName: "editClick"
                          },
                          delete: {
                              visible: true,
                              label: "Delete",
                              classes: "btn btn-sm btn-danger",
                              eventName: "deleteClick"
                          }
                      }
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
            ...mapActions("users", ['getAllUsers']),
            select(row){
                alert(row[this.uniqueKey]);
            },
            editRow(row){
                alert(`EDIT: ${row[this.uniqueKey]}`);
            },
            deleteRow(row){
                alert(`DELETE: ${row[this.uniqueKey]}`);
            }
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
