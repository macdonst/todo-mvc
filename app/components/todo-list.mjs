/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'
import API from './api.mjs'
import Store from '@enhance/store'

export default class TodoList extends CustomElement {
  constructor () {
    super()
    this.api = API()
    this.api.list()
    this.store = Store()
    this.section = this.querySelector('section')
    this.ul = this.querySelector('ul')
  }

  static get observedAttributes() {
    return [ 'filter' ]
  }

  connectedCallback() {
    this.api.subscribe(this.update, [ 'todos', 'active', 'completed', 'filter' ])
    this.addEventListener('click', this.handleClick)
    this.addEventListener('dblclick', this.handleDblClick)
  }

  disconnectedCallback() {
    this.api.unsubscribe(this.update)
    this.removeEventListener('click', this.handleClick)
    this.removeEventListener('dblclick', this.handleDblClick)
  }

  filterChanged(filter) {
    this.update({ filter })
  }

  update = ({ filter = 'all' }) => {
    this.section.style.display = this.store.todos.length > 0 ? 'block' : 'none'
    let items = filter === 'all' ? this.store.todos : this.store[filter]
    this.ul.innerHTML = items.map(todo => `<todo-item key="${todo.key}" ${todo.completed ? 'completed' : ''} task="${todo.task}"></todo-item>`).join('')
  }

  handleClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
      event.preventDefault()
      let key = event.target.closest(`todo-item`).getAttribute('key')
      this.deleteTodo(key)
    } else if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
      if (event.target.id === 'toggle-all') {
        this.api.toggle()
      } else {
        let key = event.target.closest(`todo-item`).getAttribute('key')
        this.completeTodo(key, event.target)
      }
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

  completeTodo = (key, target) => {
    let completed = target.checked ? true : false
    let todoItem = target.closest('todo-item')
    completed ?
      todoItem.setAttribute('completed', '') :
      todoItem.removeAttribute('completed')
    let task = target.nextElementSibling.innerText

    this.api.update(JSON.stringify({ key, task, completed }))
  }

  deleteTodo = (key) => {
    this.api.destroy(JSON.stringify({ key }))
  }

  render({ html, state }) {
    const { store = {}, attrs = {} } = state
    const { filter = 'all' } = attrs
    const { todos = [] } = store

    const display = todos.length ? 'block' : 'none'
    let items = filter === 'all' ? todos : store[filter] || []
    const listItems = items.map(todo => `<todo-item key="${todo.key}" ${todo.completed ? 'completed' : ''} task="${todo.task}"></todo-item>`).join('')

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
