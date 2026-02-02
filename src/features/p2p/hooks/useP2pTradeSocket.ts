import { useEffect, useRef, useState, useCallback } from 'react';

// This is a mock WebSocket implementation.
// In a real application, you would connect to a WebSocket server.
class MockWebSocket {
    public onmessage: ((event: MessageEvent) => void) | null = null;
    public onopen: (() => void) | null = null;
    public onclose: (() => void) | null = null;
    public onerror: ((event: Event) => void) | null = null;
    private timer: any | null = null; // Use any for NodeJS.Timeout in a mock
    private url: string;

    constructor(url: string) {
        this.url = url;
        console.log(`MockWebSocket: Connecting to ${this.url}...`);
        this.timer = setTimeout(() => {
            this.onopen && this.onopen();
            console.log('MockWebSocket: Connected.');
            this.sendMockMessages();
        }, 500); // Simulate connection delay
    }

    send(data: string) {
        console.log('MockWebSocket: Sending data:', data);
        // Simulate server response
        setTimeout(() => {
            if (this.onmessage) {
                const message = JSON.parse(data);
                if (message.type === 'chat') {
                    this.onmessage(new MessageEvent('message', {
                        data: JSON.stringify({
                            type: 'chat',
                            payload: {
                                id: `mock-chat-${Date.now()}`,
                                sender: 'other', // Simulate response from another user
                                text: `Echo: ${message.payload.text}`,
                                timestamp: new Date().toISOString(),
                            }
                        })
                    }));
                }
            }
        }, 100);
    }

    close() {
        console.log('MockWebSocket: Closing connection.');
        this.timer && clearTimeout(this.timer);
        this.onclose && this.onclose();
    }

    private sendMockMessages() {
        // Simulate receiving some initial messages
        if (this.onmessage) {
            setTimeout(() => {
                this.onmessage(new MessageEvent('message', {
                    data: JSON.stringify({
                        type: 'trade_update',
                        payload: { orderId: 'trade-123', status: 'PaymentConfirmed' }
                    })
                }));
            }, 1000);
        }
    }
}


interface Message {
    type: string;
    payload: any;
}

const useP2pTradeSocket = (tradeId: string | undefined, currentUserId: string | undefined) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const ws = useRef<MockWebSocket | null>(null);

    const sendMessage = useCallback((type: string, payload: any) => {
        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({ type, payload }));
        } else {
            console.warn('WebSocket not connected.');
        }
    }, [isConnected]);

    useEffect(() => {
        if (!tradeId || !currentUserId) return;

        const socketUrl = `ws://localhost:8080/p2p/trade/${tradeId}?userId=${currentUserId}`;
        ws.current = new MockWebSocket(socketUrl);

        ws.current.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        ws.current.onmessage = (event) => {
            const receivedMessage: Message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        ws.current.onerror = (event) => {
            console.error('WebSocket error:', event);
            setError('WebSocket error occurred.');
        };

        ws.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected.');
        };

        return () => {
            ws.current?.close();
        };
    }, [tradeId, currentUserId]);

    return { messages, sendMessage, isConnected, error };
};

export default useP2pTradeSocket;