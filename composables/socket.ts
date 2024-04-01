// composables/useWebSocket.js

export default function useSocket() {
  // Connect to the WebSocket endpoint
  const config = useRuntimeConfig();
  const socket = ref<WebSocket | null>(null);
  const baseUrl = config.public.websocketApiUrl;

  const connect = (path: string) => {
    const url = baseUrl + path;
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.value.onclose = (ev) => {
      console.log('WebSocket closed', ev);
    };
  };

  const sendMessage = (message: string) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  };

  const onMessage = (handler: (data: any) => void) => {
    if (socket.value) {
      socket.value.onmessage = (event) => {
        handler(JSON.parse(event.data));
      };
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  // Expose the socket and connect/disconnect functions
  return {
    connect,
    disconnect,
    sendMessage,
    onMessage,
  };
}
