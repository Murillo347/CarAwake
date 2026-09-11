import React, { useEffect, useRef, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';

import { CameraView } from 'expo-camera';

import { requestCameraAccess } from '../services/cameraService';
import {
    startAccelerometer,
    stopAccelerometer,
    checkInstability,
} from '../services/telemetryService';

export default function Viagem2({ navigation }) {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isUnstable, setIsUnstable] = useState(false);
    const [gForce, setGForce] = useState(1.0);

    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            stopAccelerometer();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleInstabilityDetected = () => {
        setIsUnstable(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsUnstable(false);
        }, 1500);
    };

    const handleStart = async () => {
        const result = await requestCameraAccess();

        if (result.success) {
            const started = await startAccelerometer(
                handleInstabilityDetected,
                (value) => setGForce(value)
            );

            if (started) {
                setIsMonitoring(true);
            } else {
                Alert.alert(
                    'Erro',
                    'O acelerômetro não está disponível neste dispositivo.'
                );
            }
        } else if (result.error !== 'canAskAgain_false') {
            Alert.alert('Erro', result.error);
        }
    };

    const handleStop = () => {
        const hadInstability = checkInstability();

        stopAccelerometer();
        setIsMonitoring(false);
        setIsUnstable(false);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (hadInstability) {
            Alert.alert(
                'Monitoramento Encerrado',
                'O sistema registrou momentos de instabilidade física intensa no trajeto (Força G > 2.0).'
            );
        } else {
            Alert.alert(
                'Monitoramento Encerrado',
                'Nenhuma instabilidade grave foi detectada.'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isMonitoring ? (
                <View style={styles.centerBox}>
                    <Text style={styles.title}>
                        Viagem
                    </Text>

                    <Text style={styles.subtitle}>
                        Posicione o celular no suporte para iniciar.
                    </Text>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStart}
                    >
                        <Text style={styles.buttonText}>
                            INICIAR MONITORAMENTO
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing="front"
                    />

                    <View style={styles.hud}>
                        <View style={styles.gForceBox}>
                            <Text style={styles.gForceTitle}>
                                FORÇA G
                            </Text>

                            <Text style={styles.gForceValue}>
                                {gForce.toFixed(2)} G
                            </Text>
                        </View>

                        {isUnstable && (
                            <View style={styles.warningBox}>
                                <Text style={styles.warningText}>
                                    ⚠️ INSTABILIDADE DETECTADA ⚠️
                                </Text>

                                <Text style={styles.warningSubText}>
                                    Movimento brusco. Força G &gt; 2.0
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.stopButton}
                            onPress={handleStop}
                        >
                            <Text style={styles.buttonText}>
                                ENCERRAR MONITORAMENTO
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.reportButton}
                            onPress={() =>
                                navigation.navigate('Relatorio2')
                            }
                        >
                            <Text style={styles.buttonText}>
                                RELATÓRIO
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7379ee',
        alignItems: 'center',
    },

    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        color: '#11152a',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15,
    },

    subtitle: {
        color: '#30385e',
        fontSize: 13,
        marginBottom: 30,
        textAlign: 'center',
    },

    cameraContainer: {
        flex: 1,
        width: '100%',
    },

    camera: {
        flex: 1,
    },

    hud: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        alignItems: 'center',
    },

    warningBox: {
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#8c8700',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },

    warningText: {
        color: '#8c8700',
        fontSize: 13,
        fontWeight: '600',
    },

    warningSubText: {
        color: '#11152a',
        fontSize: 11,
        marginTop: 4,
    },

    startButton: {
        width: 200,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#20284a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    stopButton: {
        width: 220,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#3f9b52',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    reportButton: {
        width: 200,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#20284a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#11152a',
        fontSize: 12,
        fontWeight: '600',
    },

    gForceBox: {
        backgroundColor: '#9095ff',
        borderWidth: 1,
        borderColor: '#20284a',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginBottom: 15,
        alignItems: 'center',
    },

    gForceTitle: {
        color: '#30385e',
        fontSize: 10,
        fontWeight: '600',
    },

    gForceValue: {
        color: '#176049',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 2,
    },
});