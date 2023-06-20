<script>
	import { pb, currentUser } from './pbConfig';
	import { onMount } from 'svelte';

	let users = [];

	const startChatWithUser = async (user) => {
		try {
			const data = {
				users: [user.id, $currentUser.id]
			};
			const newConversation = await pb.collection('chats').create(data);
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		const data = await pb.collection('users').getFullList();
		users = data.filter((user) => user.id != $currentUser.id);
	});
</script>

<div class="users-body">
	{#each users as user}
		<button
			class="card mb-2 fs-6"
			on:click={() => {
				startChatWithUser(user);
			}}
		>
			<span class="fs-5">
				{user.name}
			</span>
			@{user.username}
		</button>
	{/each}
</div>

<style>
	.users-body,
	.users-body > * {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.users-body > * {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
		transition: 300ms;
	}
	.users-body > *:hover {
		border: 1px solid grey;
	}
</style>
