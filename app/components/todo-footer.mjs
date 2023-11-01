/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'
import API from './api.mjs'

export default class TodoFooter extends CustomElement {
  constructor () {
    super()
    this.api = API()
    this.counter = this.querySelector('strong')
  }

  connectedCallback() {
    this.api.subscribe(this.update, [ 'todos' ])
  }

  disconnectedCallback() {
    this.api.unsubscribe(this.update)
  }

  update = ({ todos }) => {
    this.counter.innerText = todos.length
  }

  render({ html, state }) {
    const { store = {} } = state
    const { todos = [] } = store
    const display = todos.length ? 'block' : 'none'

    return html`
  <footer class="footer" style="display: ${display};">
    <span class="todo-count"><strong>${todos.length}</strong> items left</span>
    <ul class="filters">
      <li><a href="#/all" class="selected">All</a></li>
      <li><a href="#/active" class="">Active</a></li>
      <li><a href="#/completed" class="">Completed</a></li></ul>
      <button class="clear-completed" style="display: none;">Clear completed</button>
  </footer>
    `
  }
}

customElements.define('todo-footer', TodoFooter)
