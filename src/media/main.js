(function() {
    const messageContainer = document.getElementById('message-container');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('send-btn');
    const loading = document.getElementById('loading');
  
    function addMessage(role, content) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${role}-message`;
      
      if (role === 'error') {
        messageDiv.textContent = content;
        messageDiv.style.color = 'var(--vscode-errorForeground)';
      } else {
        messageDiv.innerHTML = hljs.highlightAuto(content).value;
      }
      
      messageContainer.appendChild(messageDiv);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  
    window.addEventListener('message', event => {
      switch (event.data.command) {
        case 'addMessage':
          addMessage(event.data.role, event.data.content);
          break;
        case 'setLoading':
          loading.style.display = event.data.isLoading ? 'block' : 'none';
          break;
      }
    });
  
    function sendMessage() {
      const text = input.value.trim();
      if (text) {
        addMessage('user', text);
        vscode.postMessage({ command: 'sendMessage', text });
        input.value = '';
      }
    }
  
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  })();