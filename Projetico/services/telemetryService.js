import { Accelerometer } from 'expo-sensors';

let subscription = null;
let maxGForce = 0;

export const startAccelerometer = async (
    onInstabilityDetected,
    onSensorUpdate
) => {
    try {
        const isAvailable = await Accelerometer.isAvailableAsync();

        if (!isAvailable) return false;

        maxGForce = 1.0;

        Accelerometer.setUpdateInterval(200);

        subscription = Accelerometer.addListener(data => {
            const magnitude = Math.sqrt(
                data.x * data.x +
                data.y * data.y +
                data.z * data.z
            );

            if (magnitude > maxGForce) {
                maxGForce = magnitude;
            }

            // Envia o valor atual para a tela
            if (onSensorUpdate) {
                onSensorUpdate(magnitude);
            }

            // Detecta instabilidade
            if (magnitude > 2.0 && onInstabilityDetected) {
                onInstabilityDetected();
            }
        });

        return true;
    } catch (error) {
        return false;
    }
};

export const stopAccelerometer = () => {
    if (subscription) {
        subscription.remove();
        subscription = null;
    }
};

export const checkInstability = () => {
    return maxGForce > 2.0;
};