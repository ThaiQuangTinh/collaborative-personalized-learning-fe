import { Client, IMessage } from '@stomp/stompjs';
import { Dispatch, SetStateAction, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Storage } from '../utils/storage';
import { NotificationResponse } from './../types/notification';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useNotificationSocket = (
    setNotifications: Dispatch<SetStateAction<NotificationResponse[]>>
) => {
    const accessToken = Storage.get('access_token');

    useEffect(() => {
        if (!accessToken) {
            console.warn("No access token → skip websocket connection");
            return;
        }

        const tokenEncode = encodeURIComponent(accessToken);
        const socket = new SockJS(`${API_BASE_URL}/ws?token=${tokenEncode}`);

        const client = new Client({
            webSocketFactory: () => socket as any,
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');

            // client.subscribe('/topic/notifications', (message) => {
            //     const body: NotificationResponse = JSON.parse(message.body);
            //     setNotifications(prev => [body, ...prev]);
            // });

            client.subscribe('/user/queue/notifications', (message: IMessage) => {
                const body: NotificationResponse = JSON.parse(message.body);
                setNotifications(prev => [body, ...prev]);
            });
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [accessToken, setNotifications]);
};

export default useNotificationSocket;