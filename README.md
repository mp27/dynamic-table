# dynamic-table

This project is an example of a Vue js component for listing data, with infinite scroll and always keeping loaded only 
3 pages.

####props
```javascript
columns: {
    type: Array,
    required: true
},
data: {
    type: Array,
    required: true
},
total: {
    type: Number,
    required: true
},
uniqueKey: {
    type: String,
    default: () => {
        return "id";
    }
}
```
####example of usage (App.vue)
```javascript
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
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```