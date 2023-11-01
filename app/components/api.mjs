/* global Worker */
import Store from '@enhance/store'
const store = Store()

const CREATE = 'create'
const UPDATE = 'update'
const DESTROY = 'destroy'
const LIST = 'list'

let worker
export default function API() {
  if (!worker) {
    worker = new Worker('/_public/worker.mjs')
    worker.onmessage = mutate
  }

  return {
    create,
    update,
    destroy,
    list,
    toggle,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe
  }
}

function mutate(e) {
  const { data } = e
  const { result, type } = data
  switch (type) {
  case CREATE:
    createMutation(result)
    break
  case UPDATE:
    updateMutation(result)
    break
  case DESTROY:
    destroyMutation(result)
    break
  case LIST:
    listMutation(result)
    break
  }
}

function toggle() {
  const copy = store.todos.slice()
  const active = copy.filter((todo) => !todo.completed)
  const completed = copy.filter((todo) => todo.completed)
  if (active.length > 0) {
    active.map(todo => worker.postMessage({
      type: UPDATE,
      data: JSON.stringify({...todo, completed: true})
    }))
  } else {
    completed.map(todo => worker.postMessage({
      type: UPDATE,
      data: JSON.stringify({...todo, completed: false})
    }))
  }
}

function createMutation({ todo }) {
  const copy = store.todos.slice()
  copy.push(todo)
  store.todos = copy
}

function updateMutation({ todo }) {
  const copy = store.todos.slice()
  copy.splice(copy.findIndex(i => i.key === todo.key), 1, todo)
  store.todos = copy
}

function destroyMutation({ todo }) {
  let copy = store.todos.slice()
  copy.splice(copy.findIndex(i => i.key === todo.key), 1)
  store.todos = copy
}

function listMutation({ todos }) {
  store.todos = todos || []
}

function create(todo) {
  worker.postMessage({
    type: CREATE,
    data: todo
  })
}

function destroy (todo) {
  worker.postMessage({
    type: DESTROY,
    data: todo
  })
}

function list () {
  worker.postMessage({
    type: LIST
  })
}

function update (todo) {
  worker.postMessage({
    type: UPDATE,
    data: todo
  })
}
