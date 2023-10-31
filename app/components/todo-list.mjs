/* globals customElements document */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoList extends CustomElement {
  connectedCallback() {
    this.addEventListener('click', event => {
      let key = event.target.closest(`li`).getAttribute('id')
      console.log('clicked: ', key)
      if (event.target.tagName === 'BUTTON') {
        event.preventDefault()
        this.deleteTodo(key)
      } else if (event.target.tagName === 'INPUT') {
        this.completeTodo(key, event.target)
      }
    })
  }

  completeTodo = async (key, target) => {
    let completed = target.checked ? true : false
    let task = target.nextElementSibling.innerText
    console.log(task)
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
