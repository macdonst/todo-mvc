/* globals customElements document */
import CustomElement from '@enhance-labs/custom-element'
import API from './api.mjs'

export default class TodoList extends CustomElement {
  constructor () {
    super()
    this.api = API()
    this.api.list()
    this.section = this.querySelector('section')
    this.ul = this.querySelector('ul')
  }

  connectedCallback() {
    this.api.subscribe(this.update, [ 'todos' ])
    this.addEventListener('click', this.handleClick)
    this.addEventListener('dblclick', this.handleDblClick)
  }

  disconnectedCallback() {
    this.api.unsubscribe(this.update)
    this.removeEventListener('click', this.handleClick)
    this.removeEventListener('dblclick', this.handleDblClick)
  }

  update = ({ todos }) => {
    console.log('todos are updated', todos)
    if (todos.length > 0) {
      this.section.style.display = 'block'
    } else {
      this.section.style.display = 'none'
    }
    this.ul.innerHTML = todos.map(todo => `<todo-item key="${todo.key}" ${todo.completed ? 'completed' : ''} task="${todo.task}"></todo-item>`).join('')
  }

  handleClick = (event) => {
    let key = event.target.closest(`todo-item`).getAttribute('key')
    if (event.target.tagName === 'BUTTON') {
      event.preventDefault()
      this.deleteTodo(key)
    } else if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
      this.completeTodo(key, event.target)
    }
  }

  handleDblClick = (event) => {
    if (event.target.tagName === 'LABEL') {
      let li = event.target.closest(`li`)
      li.classList.toggle('editing')
      let input = li.querySelector('input[type=text]')
      input.focus()
      let len = input.value.length
      input.setSelectionRange(len, len)
    }
  }

  completeTodo = async (key, target) => {
    let completed = target.checked ? true : false
    let todoItem = target.closest('todo-item')
    completed ?
      todoItem.setAttribute('completed', '') :
      todoItem.removeAttribute('completed')
    let task = target.nextElementSibling.innerText

    this.api.update(JSON.stringify({ key, task, completed }))
  }

  deleteTodo = async (key) => {
    try {
      this.api.destroy(JSON.stringify({ key }))
      document.querySelector(`todo-item[key='${key}']`).remove()
    }
    catch (err) {
      console.error(err)
    }
  }

  render({ html, state }) {
    const { store = {} } = state
    const { todos = [] } = store

    const display = todos.length ? 'block' : 'none'

    const listItems = todos.map(todo => `<todo-item key="${todo.key}" ${todo.completed ? 'completed' : ''} task="${todo.task}"></todo-item>`).join('')

    return html`
  <section class="main" style="display: ${display};">
    <input id="toggle-all" type="checkbox" class="toggle-all">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      ${listItems}
    </ul>
  </section>
    `
  }
}

customElements.define('todo-list', TodoList)
