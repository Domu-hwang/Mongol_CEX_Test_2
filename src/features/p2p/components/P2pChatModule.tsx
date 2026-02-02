import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    MessageSquare,
    Paperclip,
    Send,
    Image as ImageIcon,
    AlertTriangle,
    Clock,
    CheckCheck,
    X
} from 'lucide-react';

interface ChatMessage {
    id: string;
    sender: 'buyer' | 'seller' | 'system';
    text?: string;
    imageUrl?: string;
    timestamp: string;
    status?: 'sending' | 'sent' | 'read';
}

interface P2pChatModuleProps {
    tradeId: string;
    currentUserId: string;
    onSendMessage: (tradeId: string, sender: string, message: string) => void;
    onUploadImage: (tradeId: string, sender: string, imageUrl: string) => void;
    onRaiseDispute: () => void;
}

const P2pChatModule: React.FC<P2pChatModuleProps> = ({
    tradeId,
    currentUserId,
    onSendMessage,
    onUploadImage,
    onRaiseDispute,
}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock messages for demonstration
    useEffect(() => {
        setMessages([
            {
                id: '1',
                sender: 'system',
                text: 'Trade started. The seller\'s crypto has been locked in escrow.',
                timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
                id: '2',
                sender: 'seller',
                text: 'Hi! I\'ve confirmed the trade. Please make the payment to my Khan Bank account.',
                timestamp: new Date(Date.now() - 240000).toISOString(),
                status: 'read',
            },
            {
                id: '3',
                sender: 'buyer',
                text: 'Hello! I\'m making the payment now. Will send the confirmation shortly.',
                timestamp: new Date(Date.now() - 180000).toISOString(),
                status: 'read',
            },
            {
                id: '4',
                sender: 'system',
                text: 'Reminder: Please complete the payment within the time limit.',
                timestamp: new Date(Date.now() - 120000).toISOString(),
            },
        ]);
    }, [tradeId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                sender: currentUserId as 'buyer' | 'seller',
                text: message.trim(),
                timestamp: new Date().toISOString(),
                status: 'sending',
            };
            setMessages((prev) => [...prev, newMessage]);
            onSendMessage(tradeId, currentUserId, message.trim());
            setMessage('');

            // Simulate message sent
            setTimeout(() => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === newMessage.id ? { ...m, status: 'sent' } : m
                    )
                );
            }, 500);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                const newImageMessage: ChatMessage = {
                    id: Date.now().toString(),
                    sender: currentUserId as 'buyer' | 'seller',
                    imageUrl: imageUrl,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                };
                setMessages((prev) => [...prev, newImageMessage]);
                onUploadImage(tradeId, currentUserId, imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSameUser = (sender: string) => sender === currentUserId;

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Trade Chat</h3>
                        <p className="text-xs text-muted-foreground">
                            Communicate with the trader
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                        {messages.filter(m => m.sender !== 'system').length} messages
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        {isExpanded ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <MessageSquare className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <>
                    {/* Messages */}
                    <ScrollArea className="h-[400px]">
                        <div className="p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex",
                                        msg.sender === 'system'
                                            ? "justify-center"
                                            : isSameUser(msg.sender)
                                                ? "justify-end"
                                                : "justify-start"
                                    )}
                                >
                                    {msg.sender === 'system' ? (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{msg.text}</span>
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-4 py-3",
                                                isSameUser(msg.sender)
                                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                                    : "bg-muted rounded-bl-md"
                                            )}
                                        >
                                            {msg.text && <p className="text-sm">{msg.text}</p>}
                                            {msg.imageUrl && (
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Uploaded"
                                                    className="max-w-full h-auto rounded-lg mt-2 cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => setPreviewImage(msg.imageUrl || null)}
                                                />
                                            )}
                                            <div className={cn(
                                                "flex items-center gap-1 mt-1",
                                                isSameUser(msg.sender) ? "justify-end" : "justify-start"
                                            )}>
                                                <span className={cn(
                                                    "text-[10px]",
                                                    isSameUser(msg.sender)
                                                        ? "text-primary-foreground/70"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                                {isSameUser(msg.sender) && msg.status && (
                                                    <CheckCheck className={cn(
                                                        "h-3 w-3",
                                                        msg.status === 'read'
                                                            ? "text-blue-400"
                                                            : "text-primary-foreground/50"
                                                    )} />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 flex-shrink-0"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 h-10"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-10 w-10 flex-shrink-0"
                                disabled={!message.trim()}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() => setMessage("I've completed the payment.")}
                                >
                                    Payment done
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() => setMessage("Please check your bank account.")}
                                >
                                    Check account
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                                onClick={onRaiseDispute}
                            >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Report Issue
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-12 right-0 text-white hover:bg-white/20"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default P2pChatModule;
