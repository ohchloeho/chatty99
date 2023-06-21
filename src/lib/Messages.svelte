<script>
	import { currentUser, pb } from './pbConfig';
	import { onMount, onDestroy } from 'svelte';
	export let chatTitle;
	export let messages;
	$: {}

	let newMessage;

	const sendMessage = async () => {
		try {
			const data = {
				chat_id: currentChatId,
				author_id: $currentUser.id,
				content: newMessage
			};
			const createdMessage = await pb.collection('messages').create(data);
		} catch (err) {
			console.log(err);
		}
		messages = await getMessagesByChatId(currentChatId);
		newMessage = '';
	};

    onMount(() => {
		pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				messages = [...messages, record];
			}
		});
	});
	onDestroy(() => {
		pb.collection('messages').unsubscribe('*');
	});
</script>

<div class="messages">
	<h1>Messages</h1>
	<h3>{chatTitle}</h3>
	<div class="messages-container">
		{#if !messages.length}
			<p>Welcome! Create a chat or select a chat and start chatting!</p>
		{:else}
			<div class="chat-messages mb-4">
				{#each messages as msg}
					<div
						class={`chat-bubble ${
							msg.expand?.author_id?.id === $currentUser.id
								? 'align-items-end'
								: 'align-items-start'
						}`}
					>
						<p class="fw-bold mb-0">
							{msg.expand?.author_id?.username}
							<span class="fw-normal">{msg.created}</span>
						</p>
						<p class="mb-0">{msg.content}</p>
					</div>
				{/each}
			</div>
		{/if}
		<div class="input-group new-message">
			<input
				type="text"
				class="form-control"
				placeholder="Message"
				aria-label="Message"
				aria-describedby="button-addon2"
				bind:value={newMessage}
			/>
			<button
				class="btn btn-outline-secondary"
				type="button"
				id="button-addon2"
				on:click={sendMessage}>Send</button
			>
		</div>
	</div>
</div>

<style>
	.messages {
		position: relative;
        width: 100%;
        margin-left:10px;
	}
	.messages-container {
		overflow: scroll;
		height: 70vh;
		display: flex;
		flex-direction: column-reverse;
	}
	::-webkit-scrollbar {
		display: none;
	}
	.chat-bubble {
		display: flex;
		flex-direction: column;
		text-align: right;
		gap: 10px;
		padding: 10px;
	}
	.new-message {
		position: absolute;
		bottom: 0px;
		left: 7px;
		width: 100%;
	}
</style>
