<script>
	import { onMount, onDestroy } from 'svelte';
	import Chats from '../lib/Chats.svelte';
	import Messages from '../lib/Messages.svelte';
	import { currentUser, pb } from '../lib/pbConfig';

	let chatTitle = '';
	let currentChatId = '';
	let messages = [];

	let newMessage = '';

	const getUserById = (id) => {
		return pb.collection('users').getOne(id);
	};

	const getMessagesByChatId = (chatId) => {
		return pb
			.collection('messages')
			.getFullList({ sort: 'created', expand: 'author_id', filter: `chat_id = '${chatId}'` });
	};

	const loadCurrentChat = async (e) => {
		currentChatId = e.detail.id;
		const getMessages = await getMessagesByChatId(currentChatId);
		messages = getMessages;

		const userIds = e.detail.users.filter((user) => {
			return user !== $currentUser.id;
		});
		if (userIds.length === 1) {
			// set chat title to other user's name if there's only 2 ppl in the convo
			const chat = await getUserById(userIds[0]);
			chatTitle = chat.name;
		} else {
			chatTitle = e.detail.name;
		}
	};

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

<div class="main">
	<Chats on:currentChat={loadCurrentChat} />


	<!---render messages here-->
	<div class="messages container-sm">
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
</div>

<style>
	.main {
		display: flex;
		flex-direction: row;
	}
	.messages {
		position: relative;
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
