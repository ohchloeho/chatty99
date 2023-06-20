<script>
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { currentUser, pb } from './pbConfig';
	import NewMessage from './NewMessage.svelte';
	const dispatch = createEventDispatcher();

	let usersListDisplayToggle = false;

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
			allCurrentUserChats = await getAllCurrentUserChats();
		});
	});
	onDestroy(() => {
		pb.collection('chats').unsubscribe('*');
	});
	const submit = (chat) => {
		dispatch('currentChat', chat);
	};
</script>

<div class="chat-body">
	<h2 class="mt-1">Chats</h2>
	<div class="btn-group mb-3" role="group" aria-label="Basic outlined example">
		<button
			type="button"
			class="btn btn-outline-secondary"
			on:click={() => {
				usersListDisplayToggle = true;
			}}>Message</button
		>
		<button type="button" class="btn btn-outline-secondary">Create Group</button>
		<button
			type="button"
			class="btn btn-outline-secondary"
			on:click={() => {
				usersListDisplayToggle = false;
			}}>All Chats</button
		>
	</div>
	{#if !usersListDisplayToggle}
		{#each allCurrentUserChats as chat}
			<button
				class="card chat-container mb-2"
				on:click={() => {
					submit(chat);
				}}
			>
				{#if chat.expand?.users
					?.filter((user) => user.id != $currentUser.id)
					.map((a) => a.name).length > 1}
					<p>{chat.name}</p>
				{:else}
					<p>
						{chat.expand?.users?.filter((user) => user.id != $currentUser.id).map((a) => a.name)}
					</p>
				{/if}
			</button>
		{/each}
	{:else}
		<NewMessage />
	{/if}
</div>

<style>
	.chat-body {
		min-width: 315px;
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
