/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class TodoItemTask extends CustomElement {
  constructor() {
    super()
    this.input = this.querySelector('input')
  }

  connectedCallback() {
    this.backupTask = this.getAttribute('task')
    this.input.addEventListener('keyup',this.handleKeyUp)
  }

  disconnectedCallback() {
    this.input.removeEventListener('keyup',this.handleKeyUp)
  }

  handleKeyUp = async (event) => {
    if (event.which === ESCAPE_KEY) {
      this.cancelEdit(event)
    } else if (event.which === ENTER_KEY) {
      await this.updateTask(event.target)
    }
  }

  cancelEdit(event) {
    let li = event.target.closest(`li`)
    li.classList.toggle('editing')
    this.input.value = this.backupTask
  }

  async updateTask(target) {
    let li = target.closest(`li`)
    let key = li.getAttribute('id')
    li.classList.toggle('editing')
    let checkbox = li.querySelector('input')
    let completed = checkbox.checked ? true : false
    let task = target.value
    checkbox.nextElementSibling.innerText = task

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

  render({ html, state }) {
    const { attrs = {} } = state
    const { task = '' } = attrs

    return html`
      <input name="task" type="text" class="edit" value="${task}"/>
    `
  }
}

customElements.define('todo-item-task', TodoItemTask)
