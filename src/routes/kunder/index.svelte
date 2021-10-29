<script context="module">
	import { enhance } from '$lib/form';

	// see https://kit.svelte.dev/docs#loading
	export const load = async ({ fetch }) => {
		const res = await fetch('/kunder.json');

		if (res.ok) {
			const kunder = await res.json();

			return {
				props: { kunder }
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script>
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let kunder;

	async function patch(res) {
		const kunde = await res.json();

		kunder = kunder.map((t) => {
			if (t.uid === kunde.uid) return kunde;
			return t;
		});
	}
</script>

<svelte:head>
	<title>Kunder</title>
</svelte:head>

<div class="kunder">
	<h1>Kunder</h1>

	<form
		class="new"
		action="/kunder.json"
		method="post"
		use:enhance={{
			result: async (res, form) => {
				const created = await res.json();
				kunder = [...kunder, created];

				form.reset();
			}
		}}
	>
		<input name="name" aria-label="Add kunde" placeholder="Kundenavn" />
		<input name="orgnr" aria-label="Add kunde" placeholder="Kundens orgnr." />
		<input name="address" aria-label="Add kunde" placeholder="Kundens adresse" />
		<input type="submit" />
	</form>

	{#each kunder as kunde (kunde.uid)}
		<div
			class="kunde"
			transition:scale|local={{ start: 0.7 }}
			animate:flip={{ duration: 200 }}
		>

			<form
				class="name"
				action="/kunder/{kunde.uid}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch
				}}
			>
				<input aria-label="Edit kunde" type="text" name="name" value={kunde.name} />
				<button class="save" aria-label="Save kunde" />

			</form>

			<form
				class="orgnr"
				action="/kunder/{kunde.uid}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch
				}}
			>
				<input aria-label="Edit kunde" type="text" name="orgnr" value={kunde.orgnr} />
				<button class="save" aria-label="Save kunde" />

			</form>

			<form
				class="address"
				action="/kunder/{kunde.uid}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch
				}}
			>
				<input aria-label="Edit kunde" type="text" name="address" value={kunde.address} />
				<button class="save" aria-label="Save kunde" />

			</form>

			<form
				action="/kunder/{kunde.uid}.json?_method=delete"
				method="post"
				use:enhance={{
					pending: () => (kunde.pending_delete = true),
					result: () => {
						kunder = kunder.filter((t) => t.uid !== kunde.uid);
					}
				}}
			>
				<button class="delete" aria-label="Delete todo" disabled={kunde.pending_delete} />
			</form>
		</div>
	{/each}
</div>

<style>
	.kunder {
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

	.kunde {
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

	.kunde form {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	.kunde input {
		flex: 1;
		padding: 0.5em 2em 0.5em 0.8em;
		border-radius: 3px;
	}

	.kunde button {
		width: 2em;
		height: 2em;
		border: none;
		background-color: transparent;
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.delete {
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

	.kunde input:focus + .save,
	.save:focus {
		transition: opacity 0.2s;
		opacity: 1;
	}
</style>
