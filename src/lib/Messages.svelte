<script>
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from './pbConfig';

	let messages = [];
	let newMessage = '';

	

	onMount(async () => {

    });

	onDestroy(() => {
		
	});

	const sendMessage = async () => {
		const data = {
			text: newMessage,
			user: $currentUser.id
		};
		const createdMessage = await pb.collection('messages').create(data);
		newMessage = '';
	};
</script>

<div class="messages mt-3">
	{#each messages as message (message.id)}
		<div class="col msg">
			<img
				class="avatar"
				src={`https://api.dicebear.com/6.x/identicon/svg?seed=${message.expand?.user?.username}`}
				alt="avatar"
			/>
			<p>@{message.expand?.user?.username}</p>
			<p>{message.text}</p>
		</div>
	{/each}
</div>
<form on:submit|preventDefault={sendMessage}>
	<div class="input-group mb-3">
		<input
			type="text"
			class="form-control"
			placeholder="Message"
			aria-label="Message Text"
			aria-describedby="button-addon2"
			bind:value={newMessage}
		/>
		<button class="btn btn-outline-secondary" type="submit" id="button-addon2">Send</button>
	</div>
</form>

<style>
	.avatar {
		width: 60px;
	}
</style>
