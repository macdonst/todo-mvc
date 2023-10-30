// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html ({ html, state }) {
  const { store } = state
  let todos = store.todos || []
  const todo = store.todo || {}
  const problems = store.problems || {}

  return html`<enhance-page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Todos page</h1>
    ${todos.map(item => `<article class="mb2">
<div class="mb0">
  <p class="pb-2"><strong class="capitalize">task: </strong>${item?.task || ''}</p>
  <p class="pb-2"><strong class="capitalize">completed: </strong>${item?.completed || ''}</p>
  <p class="pb-2"><strong class="capitalize">created: </strong>${item?.created || ''}</p>
  <p class="pb-2"><strong class="capitalize">key: </strong>${item?.key || ''}</p>
</div>
<p class="mb-1">
  <enhance-link href="/todos/${item.key}">Edit this todo</enhance-link>
</p>
<form action="/todos/${item.key}/delete" method="POST" class="mb-1">
  <enhance-submit-button><span slot="label">Delete this todo</span></enhance-submit-button>
</form>
</article>`).join('\n')}
<details class="mb0" ${Object.keys(problems).length ? 'open' : ''}>
    <summary>New todo</summary>
    <enhance-form
  action="/todos/${todo.key}"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="Todo">
  <enhance-text-input label="Task" type="text" id="task" name="task" value="${todo?.task}" errors="${problems?.task?.errors}"></enhance-text-input>
  <enhance-checkbox label="Completed" type="checkbox" id="completed" name="completed" value="${todo?.completed}" errors="${problems?.completed?.errors}"></enhance-checkbox>
  <enhance-text-input label="Created" type="date" id="created" name="created" value="${todo?.created}" errors="${problems?.created?.errors}"></enhance-text-input>
  <input type="hidden" id="key" name="key" value="${todo?.key}" />
  <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
  </enhance-fieldset>
</enhance-form>
</details>
</main>
</enhance-page-container>
  `
}
