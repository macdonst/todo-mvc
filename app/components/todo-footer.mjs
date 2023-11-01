/* globals customElements, document */
import CustomElement from '@enhance-labs/custom-element'
import API from './api.mjs'

export default class TodoFooter extends CustomElement {
  constructor () {
    super()
    this.api = API()
    this.footer = this.querySelector('footer')
    this.counter = this.querySelector('strong')
    this.ul = this.querySelector('ul')
    this.button = this.querySelector('button')
  }

  connectedCallback() {
    this.api.subscribe(this.update, [ 'active', 'completed', 'todos' ])
    this.ul.addEventListener('click', this.filter)
    this.button.addEventListener('click', this.clear)
  }

  disconnectedCallback() {
    this.api.unsubscribe(this.update)
    this.ul.removeEventListener('click', this.filter)
    this.button.removeEventListener('click', this.clear)
  }

  update = ({ active, completed, todos }) => {
    this.counter.innerText = active.length
    this.footer.style.display = todos.length > 0 ? 'block' : 'none'
    this.button.style.display = completed.length > 0 ? 'block' : 'none'
  }

  filter = (event) => {
    event.preventDefault()
    let list = Array.from(this.ul.querySelectorAll('a'))
    list.map(anchor => {
      anchor === event.target ? anchor.classList.add('selected') : anchor.classList.remove('selected')
    })
    document.querySelector('todo-list').setAttribute('filter', 'completed')
  }

  clear = () => {
    this.api.clear()
  }

  render({ html, state }) {
    const { store = {} } = state
    const { todos = [], active = [], completed = [] } = store
    const display = todos.length ? 'block' : 'none'

    return html`
  <footer class="footer" style="display: ${display};">
    <span class="todo-count"><strong>${active.length}</strong> items left</span>
    <ul class="filters">
      <li><a href="#/all" class="selected">All</a></li>
      <li><a href="#/active" class="">Active</a></li>
      <li><a href="#/completed" class="">Completed</a></li></ul>
      <button class="clear-completed" style="display: ${completed.length ? 'block' : 'none'};">Clear completed</button>
  </footer>
    `
  }
}

customElements.define('todo-footer', TodoFooter)
