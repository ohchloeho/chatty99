<script>
	import { currentUser, pb } from '../lib/pbConfig';

	let username = '';
	let password = '';
	let error = false;
	let loading = false;

	const errorCatcher = (err) => {
		username = '';
		password = '';
		error = true;
		setTimeout(() => {
			error = false;
		}, 3000);
	};

	const login = async () => {
		try {
			loading = true;
			await pb.collection('users').authWithPassword(username, password);
			loading = false;
			username = '';
			password = '';
		} catch (err) {
			errorCatcher(err);
		}
	};

	const signUp = async () => {
		try {
			loading = true;
			const data = {
				username,
				password,
				passwordConfirm: password,
				name: 'no name'
			};
			const createdUser = await pb.collection('users').create(data);
			loading = false;
			await login();
			username = '';
			password = '';
		} catch (err) {
			errorCatcher();
			loading = false;
		}
	};

	const signOut = () => {
		pb.authStore.clear();
	};
</script>

<div class="container-lg mt-0 main">
	{#if $currentUser}
		<div class="header">
			<h1>Chatty 99</h1>
			<div class="user">
				<p>@{$currentUser.username}</p>
				<button type="button" class="btn btn-secondary" on:click={signOut}>Sign Out</button>
			</div>
		</div>
		<slot />
	{:else}
		<h1>Chatty 99</h1>
		<p>Welcome! Please login or sign up to begin</p>
		<form on:submit|preventDefault>
			<div class="input-group mb-3">
				<span class="input-group-text" id="addon-wrapping">Username</span>
				<input
					type="text"
					class="form-control"
					aria-label="Username"
					aria-describedby="addon-wrapping"
					bind:value={username}
				/>
			</div>
			<div class="input-group mb-3">
				<span class="input-group-text" id="addon-wrapping">Password</span>
				<input
					type="password"
					class="form-control"
					aria-label="Password"
					aria-describedby="addon-wrapping"
					bind:value={password}
				/>
			</div>
			{#if error}
				<p>Login / Sign Up failed. Please try again</p>
			{/if}
			{#if loading}
				<p>Loading... Please wait</p>
			{/if}
			<button type="button" class="btn btn-primary" on:click={login}>Login</button>
			<button type="button" class="btn btn-secondary" on:click={signUp}>Sign Up</button>
		</form>
	{/if}
	<p class="mt-3">Powered by SvelteKit, Pocketbase & Bootstrap</p>
</div>

<style>
	.main{
		max-height: 90vh;
	}
	.header {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
</style>
