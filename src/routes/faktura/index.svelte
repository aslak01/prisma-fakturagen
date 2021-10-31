<script context="module">
  import { enhance } from '$lib/form'

  // see https://kit.svelte.dev/docs#loading
  export const load = async ({ fetch }) => {
    const res = await fetch('/faktura.json')
    const res2 = await fetch('/kunder.json')

    if (res.ok && res2.ok) {
      const [fakturaer, kunder] = await Promise.all([res.json(), res2.json()])
      return {
        props: { fakturaer, kunder },
      }
    }

    const { message } = await res.json()

    return {
      error: new Error(message),
    }
  }
</script>

<script>
  import { scale } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import { parseDate } from '$lib/utils'

  export let fakturaer
  export let kunder

  async function patch(res) {
    const faktura = await res.json()

    fakturaer = fakturaer.map((t) => {
      if (t.uid === faktura.uid) return faktura
      return t
    })
  }
</script>

<svelte:head>
  <title>Fakturaer</title>
</svelte:head>

<div class="fakturaer">
  <h1>Fakturaer</h1>

  <form
    class="new"
    action="/faktura.json"
    method="post"
    use:enhance={{
      result: async (res, form) => {
        const created = await res.json()
        fakturaer = [...fakturaer, created]
        form.reset()
      },
    }}
  >
    <label>
      Forfall:
      <input type="date" name="forfall" value={new Date()} />
    </label>
    <select name="kunde">
      {#each kunder as kunde (kunde.uid)}
        <option value={kunde.uid}>{kunde.name}</option>
      {/each}
    </select>

    <input type="submit" />
  </form>

  {#each fakturaer as faktura (faktura.uid)}
    <div
      class="faktura"
      transition:scale|local={{ start: 0.7 }}
      animate:flip={{ duration: 200 }}
    >
      <form
        class="name"
        action="/fakturaer/{faktura.uid}.json?_method=patch"
        method="post"
        use:enhance={{
          result: patch,
        }}
      >
        <input
          aria-label="Edit faktura"
          type="text"
          name="name"
          value={faktura.name}
        />
        <button class="save" aria-label="Save faktura" />
      </form>

      <form
        class="orgnr"
        action="/fakturaer/{faktura.uid}.json?_method=patch"
        method="post"
        use:enhance={{
          result: patch,
        }}
      >
        <input
          aria-label="Edit faktura"
          type="text"
          name="orgnr"
          value={faktura.orgnr}
        />
        <button class="save" aria-label="Save faktura" />
      </form>

      <form
        class="address"
        action="/fakturaer/{faktura.uid}.json?_method=patch"
        method="post"
        use:enhance={{
          result: patch,
        }}
      >
        <input
          aria-label="Edit faktura"
          type="text"
          name="address"
          value={faktura.address}
        />
        <button class="save" aria-label="Save faktura" />
      </form>

      <div class="delete">
        <form
          action="/fakturaer/{faktura.uid}.json?_method=delete"
          method="post"
          use:enhance={{
            pending: () => (faktura.pending_delete = true),
            result: () => {
              fakturaer = fakturaer.filter((t) => t.uid !== faktura.uid)
            },
          }}
        >
          <button
            class="deletebtn"
            aria-label="Delete todo"
            disabled={faktura.pending_delete}
          />
        </form>
      </div>
      <ul class="consts">
        <li>
          Uid: {faktura.uid}
        </li>
        <li>
          Created: {parseDate(faktura.created_at)}
        </li>
        {#if faktura.fakturaer}
          <li>
            {#each faktura.fakturaer as faktura (faktura.uid)}
              {faktura.fakturanr}
            {/each}
          </li>
        {/if}
      </ul>
    </div>
  {/each}
</div>

<style>
  .fakturaer {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
    line-height: 1;
  }

  .new {
    margin: 0 0 0.5rem 0;
  }

  input {
    border: 1px solid transparent;
  }

  input:focus-visible {
    box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ff3e00 !important;
    outline: none;
  }

  .new input {
    font-size: 28px;
    width: 100%;
    padding: 0.5em 1em 0.3em 1em;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    text-align: center;
  }

  .faktura {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    transform: translate(-1px, -1px);
    transition: filter 0.2s, transform 0.2s;
  }

  .faktura form {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .faktura input {
    flex: 1;
    padding: 0.5em 2em 0.5em 0.8em;
    border-radius: 3px;
  }

  .faktura button {
    width: 2em;
    height: 2em;
    border: none;
    background-color: transparent;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  .delete {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .deletebtn {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 5V22H19.5V5H4.5Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M10 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M2 5H22' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 5L9.6445 2H14.3885L16 5H8Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    opacity: 0.2;
  }

  .delete:hover,
  .delete:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }

  .save {
    position: absolute;
    right: 0;
    opacity: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.5 2H3.5C2.67158 2 2 2.67157 2 3.5V20.5C2 21.3284 2.67158 22 3.5 22H20.5C21.3284 22 22 21.3284 22 20.5V3.5C22 2.67157 21.3284 2 20.5 2Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M17 2V11H7.5V2H17Z' fill='white' stroke='white' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M13.5 5.5V7.5' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3Cpath d='M5.99844 2H18.4992' stroke='%23676778' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
  }

  .faktura input:focus + .save,
  .save:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }
</style>
