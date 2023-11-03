/* globals customElements */
import CustomElement from '@enhance/custom-element'
import API from './api.mjs'

export default class TodoHeader extends CustomElement {
  constructor () {
    super()
    this.api = API()
    this.form = this.querySelector('form')
    this.input = this.querySelector('input')
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.addTodo)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.addTodo)
  }

  addTodo = (event) => {
    event.preventDefault()
    this.api.create({ task: this.input.value })
    this.form.reset()
  }

  render({ html }) {
    return html`
  <header class="header">
    <h1>todos</h1>
    <form action="/todos" method="POST">
      <input autofocus="autofocus" autocomplete="off" placeholder="What needs to be done?" name="task" class="new-todo">
    </form>
  </header>
    `
  }
}

customElements.define('todo-header', TodoHeader)
