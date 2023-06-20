<script>
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from './pbConfig';

	const dispatch = createEventDispatcher();

	let value = 0;
	let allCurrentUserChats = [];

	const getAllCurrentUserChats = () => {
		try {
			return pb
				.collection('chats')
				.getFullList({ sort: 'created', expand: 'users', filter: `users ~ '${$currentUser.id}'` });
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		allCurrentUserChats = await getAllCurrentUserChats();
		pb.collection('chats').subscribe('*', async (e) => {
			allChats = await getChatWithUsers();
		});
	});
	onDestroy(() => {
		pb.collection('chats').unsubscribe('*');
	});
	const submit = (chat) => {
		dispatch("currentChat",chat)
	};
</script>

<div class="chat-body">
	{#each allCurrentUserChats as chat}
		<button class="card chat-container mb-2" on:click={()=>{submit(chat)}}>
			{#if chat.expand?.users
				?.filter((user) => user.id != $currentUser.id)
				.map((a) => a.name).length > 1}
				<p>{chat.name}</p>
			{:else}
				<p>{chat.expand?.users?.filter((user) => user.id != $currentUser.id).map((a) => a.name)}</p>
			{/if}
		</button>
	{/each}
</div>

<style>
	.chat-body {
		min-width: 250px;
		height: 84vh;
		overflow: scroll;
		border-right: 1px solid grey;
		padding-right: 10px;
	}
	.chat-container {
		width: 100%;
		height: 80px;
		margin: 0;
		padding: 10px;
		cursor: pointer;
		transition: 300ms;
	}
	.chat-container:hover {
		border: 1px solid grey;
	}
</style>
