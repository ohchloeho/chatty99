<script>
	import Chats from '../lib/Chats.svelte';

	const test = (e) => {
		console.log(e.detail);
	};
</script>

<div class="main">
	<Chats on:currentChat={test} />

	<!---render messages here-->
	<div class="messages container-sm">
		<h1>Messages</h1>
        <div class="messages-container" >
            
        </div>
		<div class="input-group new-message">
			<input
				type="text"
				class="form-control"
				placeholder="Message"
				aria-label="Message"
				aria-describedby="button-addon2"
			/>
			<button class="btn btn-outline-secondary" type="button" id="button-addon2">Send</button>
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
    .messages-container{
        overflow: scroll;
        height: 75vh;
    }
	.new-message {
		position: absolute;
		bottom: 0px;
		left: 7px;
		width: 100%;
	}
</style>
