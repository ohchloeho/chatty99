<script>
	import { currentUser, pb } from './pbConfig';
	import { onMount, onDestroy } from 'svelte';

	let allChats = [];
	let newUserUsername = '';

	const getChatWithUsers = () => {
		try {
			return pb
				.collection('chats')
				.getFullList({ sort: 'created', expand: 'users', filter: `users ~ '${$currentUser.id}'` });
		} catch (error) {
			return [];
		}
	};

	const createChatWithUser = async () => {
		try {
			const otherUser = await pb
				.collection('users')
				.getFirstListItem(`username = '${newUserUsername}'`);

			await pb.collection('chats').create({
				users: [$currentUser.id, otherUser.id]
			});
		} catch (err) {
			console.log('error');
		}
	};
    
    const getAllMessages = (chatId) => {
		try {
			return pb
				.collection('messages')
				.getFullList({ sort: 'created', filter: `chat_id=${chatId}` });
		} catch (err) {
			console.log(err);
			return [];
		}
	};

	onMount(async () => {
		allChats = await getChatWithUsers();
		pb.collection('chats').subscribe('*', async (e) => {
			allChats = await getChatWithUsers();
		});
	});

	onDestroy(() => {
		pb.collection('chats').unsubscribe('*');
	});
</script>
