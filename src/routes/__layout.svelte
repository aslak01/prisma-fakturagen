<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p><a href="https://svelte.dev">Svelte Kit</a> fakturagenerator med <a href="https://www.prisma.io">Prisma</a> og <a href="https://pdf-lib.js.org">PDF-LIB</a></p>
	<p>(uten auth inntil videre, så kun til lokal bruk)</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}
	p:not(:first-child) {
		margin-top: 0;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
