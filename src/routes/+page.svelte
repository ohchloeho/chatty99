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


</script>

<div class="main">
	<Chats on:currentChat={loadCurrentChat} />
	<Messages {chatTitle} {messages}/>

	<!---render messages here-->
</div>

<style>
	.main {
		display: flex;
		flex-direction: row;
	}
	
</style>
