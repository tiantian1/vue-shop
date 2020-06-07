import request from './base'
//设置请求基地址

let get = (url, params) => {
  return new Promise((resolve, reject) => {
    request.get(url, { params }).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
}
let post = (url, data) => {
  return new Promise((resolve, reject) => {
    request.post(url, data).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
};
let deletes = (url, data) => {
  return new Promise((resolve, reject) => {
    request.delete(url, { data }).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
}
let put = (url, data) => {
  return new Promise((resolve, reject) => {
    request.put(url, data).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
}


function login (data) {
  return post('/login', data)
}
function getMenus (params) {
  return get('/menus', params)
}
function getUsers (params) {
  return get('/users', params)

}
function changeUserState (data) {
  return put(`users/${data.uId}/state/${data.type}`, data)
}
function addUser (data) {
  return post('/users', data)
}
function searchUserById (params) {
  return get(`/users/${params.id}`)
}
function editUser (data) {
  return put(`users/${data.id}`, data)
}
function deleteUser (data) {
  return deletes(`users/${data.id}`, data)

}
export default {
  login,
  getMenus,
  getUsers,
  changeUserState,
  addUser,
  searchUserById,
  editUser,
  deleteUser
};