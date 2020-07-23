import { Permissions, Notifications } from 'expo';

export async function registerForPushNotificationsAsyncSecond() {
    const status = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS)
        .then(({ status }) => status);
    if (status === 'granted') {
        const [expoToken, deviceToken] = await Promise.all([
            Notifications.getExponentPushTokenAsync(),
            Notifications.getDevicePushTokenAsync()
        ]);
        return {
            expoToken,
            deviceToken,
        };
    }

    const error = new Error('Permission denied');
    error.status = status;
    throw error;
}