import { useState, useEffect, useRef, useCallback } from 'react';
import { MCPEvent } from '@/lib/types';
import { api } from '@/lib/api';

export interface UseEventSourceOptions {
  maxEvents?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export interface UseEventSourceReturn {
  events: MCPEvent[];
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
  reconnectCount: number;
  clearEvents: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useEventSource(
  sessionId: string | null,
  options: UseEventSourceOptions = {}
): UseEventSourceReturn {
  const {
    maxEvents = 200,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [events, setEvents] = useState<MCPEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyDisconnectedRef = useRef(false);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const disconnect = useCallback(() => {
    isManuallyDisconnectedRef.current = true;
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setIsReconnecting(false);
    setError(null);
    onDisconnect?.();
  }, [onDisconnect]);

  const connect = useCallback(() => {
    if (!sessionId || eventSourceRef.current) {
      return;
    }

    try {
      const eventSource = api.getEventStream(sessionId);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        setError(null);
        setReconnectCount(0);
        isManuallyDisconnectedRef.current = false;
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const mcpEvent: MCPEvent = JSON.parse(event.data);
          
          setEvents(prev => {
            const updated = [...prev, mcpEvent];
            // Keep only the most recent events to prevent memory leaks
            return updated.slice(-maxEvents);
          });
        } catch (parseError) {
          console.error('Failed to parse MCP event:', parseError);
          setError('Failed to parse event data');
        }
      };

      eventSource.onerror = (errorEvent) => {
        setIsConnected(false);
        setError('Connection error occurred');
        onError?.(errorEvent);

        // Only attempt reconnection if not manually disconnected
        if (!isManuallyDisconnectedRef.current && reconnectCount < maxReconnectAttempts) {
          setIsReconnecting(true);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
            connect();
          }, reconnectInterval);
        } else if (reconnectCount >= maxReconnectAttempts) {
          setError(`Max reconnection attempts (${maxReconnectAttempts}) exceeded`);
          setIsReconnecting(false);
        }
      };

    } catch (connectError) {
      setError(`Failed to establish connection: ${connectError}`);
      setIsConnected(false);
    }
  }, [
    sessionId,
    maxEvents,
    reconnectInterval,
    maxReconnectAttempts,
    reconnectCount,
    onConnect,
    onError,
  ]);

  const reconnect = useCallback(() => {
    disconnect();
    setReconnectCount(0);
    isManuallyDisconnectedRef.current = false;
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
      connect();
    }, 100);
  }, [disconnect, connect]);

  // Initialize connection when sessionId changes
  useEffect(() => {
    if (sessionId && !isManuallyDisconnectedRef.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [sessionId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    events,
    isConnected,
    isReconnecting,
    error,
    reconnectCount,
    clearEvents,
    disconnect,
    reconnect,
  };
} 