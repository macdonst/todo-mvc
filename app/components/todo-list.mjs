/* globals customElements document */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoList extends CustomElement {
  connectedCallback() {
    this.addEventListener('click', this.handleClick)
    this.addEventListener('dblclick', this.handleDblClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick)
    this.removeEventListener('dblclick', this.handleDblClick)
  }

  handleClick = (event) => {
    let key = event.target.closest(`li`).getAttribute('id')
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
    let task = target.nextElementSibling.innerText
    let result = await fetch(`/todos/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({key, task, completed})
    })
    let json = await result.json()
    return json
  }

  deleteTodo = async (key) => {
    let result = await fetch(`/todos/${key}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({})
    })
    let json = await result.json()
    document.getElementById(key).remove()
    return json
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
