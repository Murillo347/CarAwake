import 'react-native-worklets-core'; 
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Vibration, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core'; 
import * as Speech from 'expo-speech';
import { useAudioPlayer } from 'expo-audio';
import { startAccelerometer, stopAccelerometer, checkInstability } from '../services/telemetryService';

const ALERT_LEVEL_CONFIG = {
    0: {
        name: 'VIGÍLIA NORMAL',
        primaryColor: '#6ec4eb',
        borderColor: '#565b68',
        fullScreenBg: 'transparent',
        fullScreenAltBg: 'transparent',
        bannerBg: '#181b24',
        textColor: '#ffffff',
        fullTitle: '',
        fullSubtitle: '',
        message: 'Condução monitorizada. Nenhum sinal de fadiga recente.',
    },
    1: {
        name: 'NÍVEL 1: PREVENTIVO (480nm)',
        primaryColor: '#00e5ff',
        borderColor: '#00b4d8',
        fullScreenBg: 'rgba(0, 180, 216, 0.85)', // Translúcido para não bloquear 100% da câmara
        fullScreenAltBg: 'rgba(0, 150, 199, 0.85)',
        bannerBg: '#042b38',
        textColor: '#ffffff',
        fullTitle: 'ALERTA PREVENTIVO',
        fullSubtitle: 'Luz Ciana de Inibição de Sono Ativa',
        message: 'Sinal leve de cansaço detetado. Mantenha o foco!',
    },
    2: {
        name: 'NÍVEL 2: ALERTA MODERADO',
        primaryColor: '#ffbe0b',
        borderColor: '#ff9f1c',
        fullScreenBg: '#ff9f1c',
        fullScreenAltBg: '#f77f00',
        bannerBg: '#3d2600',
        textColor: '#1f1100',
        fullTitle: '⚠️ FADIGA MODERADA ⚠️',
        fullSubtitle: 'FREQUÊNCIA DE SONOLÊNCIA ELEVADA',
        message: 'Intervalo curto entre sinais de sono! Redobre a atenção!',
    },
    3: {
        name: 'NÍVEL 3: RISCO CRÍTICO',
        primaryColor: '#ff1744',
        borderColor: '#ff1744',
        fullScreenBg: '#ff1744',
        fullScreenAltBg: '#590010',
        bannerBg: '#4a000b',
        textColor: '#ffffff',
        fullTitle: '🚨 PERIGO CRÍTICO DE SONO 🚨',
        fullSubtitle: 'RISCO IMINENTE DE ACIDENTE',
        message: 'REDUZA A VELOCIDADE E ENCOSTE O VEÍCULO COM SEGURANÇA!',
    },
};

export default function Viagem({ navigation }) {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isUnstable, setIsUnstable] = useState(false);
    const [gForce, setGForce] = useState(1.0);

    const [longBlinks, setLongBlinks] = useState(0);
    const [yawns, setYawns] = useState(0);

    const [alertLevel, setAlertLevel] = useState(0);
    const [fullScreenVisible, setFullScreenVisible] = useState(false);
    const [eventsPerMin, setEventsPerMin] = useState(0);
    const [lastIntervalSec, setLastIntervalSec] = useState(null);
    const [flashActive, setFlashActive] = useState(false);

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');
    const timeoutRef = useRef(null);
    const fullScreenTimerRef = useRef(null);
    const beepTimerRef = useRef(null);
    const lastGForceUpdate = useRef(0);

    const alarmPlayer = useAudioPlayer(require('../assets/sounds/alarm.mp3'));

    const isBlinking = useRef(false);
    const blinkStartTime = useRef(0);
    const blinkCounted = useRef(false);
    const microsleepTriggered = useRef(false);

    const isYawning = useRef(false);
    const yawnStartTime = useRef(0);
    const yawnCounted = useRef(false);

    const eventTimestampsRef = useRef([]);
    const lastEventTimeRef = useRef(0);
    const currentLevelRef = useRef(0);
    const lastStimulusTimeRef = useRef(0);

    const fullScreenOpacity = useRef(new Animated.Value(0)).current;

    const baselineRef = useRef({
        landmarkRatio: 0,
        noseChinRatio: 0,
        boxRatio: 0,
        initialized: false
    });

    const detectorOptions = useRef({
        performanceMode: 'fast',
        classificationMode: 'all',
        landmarkMode: 'all',
        contourMode: 'all'
    }).current;

    const { detectFaces } = useFaceDetector(detectorOptions);

    useEffect(() => {
        return () => {
            stopAllStimuli();
            stopAccelerometer();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (fullScreenTimerRef.current) clearTimeout(fullScreenTimerRef.current);
            if (beepTimerRef.current) clearTimeout(beepTimerRef.current);
        };
    }, []);

    useEffect(() => {
        let flashTimer = null;
        if (isMonitoring && fullScreenVisible && (alertLevel === 2 || alertLevel === 3)) {
            const intervalMs = alertLevel === 3 ? 165 : 380;
            flashTimer = setInterval(() => {
                setFlashActive(prev => !prev);
            }, intervalMs);
        } else {
            setFlashActive(false);
        }

        return () => {
            if (flashTimer) clearInterval(flashTimer);
        };
    }, [alertLevel, isMonitoring, fullScreenVisible]);

    useEffect(() => {
        if (!isMonitoring) return;

        const monitorTimer = setInterval(() => {
            const now = Date.now();
            eventTimestampsRef.current = eventTimestampsRef.current.filter(t => now - t <= 60000);
            setEventsPerMin(eventTimestampsRef.current.length);

            const lvl = currentLevelRef.current;
            const timeSinceLastEvent = lastEventTimeRef.current > 0 ? now - lastEventTimeRef.current : 999999;

            if (lvl > 0 && timeSinceLastEvent > 30000) {
                const nextLevel = lvl - 1;
                currentLevelRef.current = nextLevel;
                setAlertLevel(nextLevel);
                lastEventTimeRef.current = now - 10000;
                
                if (nextLevel === 0) {
                    stopAllStimuli();
                } else if (nextLevel === 1) {
                    activateFullScreenColor(1); // Reativa o azul contínuo se cair para o nível 1
                }
                return;
            }

            if (lvl === 3 && (now - lastStimulusTimeRef.current > 10000)) {
                triggerMultimodalStimulus(3);
            }
        }, 2000);

        return () => clearInterval(monitorTimer);
    }, [isMonitoring]);

    const playCustomAlarm = (isLooping = true, rate = 1.0, volume = 1.0) => {
        try {
            if (!alarmPlayer) return;
            alarmPlayer.loop = isLooping;
            alarmPlayer.volume = volume;
            if (typeof alarmPlayer.setPlaybackRate === 'function') {
                alarmPlayer.setPlaybackRate(rate);
            }
            if (typeof alarmPlayer.seekTo === 'function') {
                alarmPlayer.seekTo(0);
            }
            alarmPlayer.play();
        } catch (error) {}
    };

    const stopAlarmAudio = () => {
        try {
            if (!alarmPlayer) return;
            alarmPlayer.pause();
            if (typeof alarmPlayer.seekTo === 'function') {
                alarmPlayer.seekTo(0);
            }
        } catch (error) {}
    };

    const stopAllStimuli = () => {
        Vibration.cancel();
        if (fullScreenTimerRef.current) clearTimeout(fullScreenTimerRef.current);
        if (beepTimerRef.current) clearTimeout(beepTimerRef.current);
        setFullScreenVisible(false);
        fullScreenOpacity.setValue(0);
        stopAlarmAudio();
        try { Speech.stop(); } catch (e) {}
    };

    // 📍 ALTERAÇÃO AQUI: Duração condicional do Ecrã/Mensagem
    const activateFullScreenColor = (level) => {
        if (fullScreenTimerRef.current) clearTimeout(fullScreenTimerRef.current);

        setFullScreenVisible(true);
        Animated.timing(fullScreenOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();

        // Nível 2 e 3 somem sozinhos após 3 Segundos. Nível 1 fica ativo contínuo.
        if (level === 2 || level === 3) {
            fullScreenTimerRef.current = setTimeout(() => {
                Animated.timing(fullScreenOpacity, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }).start(() => {
                    setFullScreenVisible(false);
                });
            }, 3000); // Exatamente 3 segundos
        }
    };

    const triggerMultimodalStimulus = (level) => {
        lastStimulusTimeRef.current = Date.now();
        Vibration.cancel();
        if (beepTimerRef.current) clearTimeout(beepTimerRef.current);

        activateFullScreenColor(level);

        if (level === 1) {
            Vibration.vibrate([0, 200, 180, 200]);
            try {
                Speech.stop();
                playCustomAlarm(true, 1.2, 0.8);
            } catch (e) {}
        } else if (level === 2) {
            Vibration.vibrate([0, 250, 120, 250, 120, 250, 250, 350]);
            try {
                Speech.stop();
                playCustomAlarm(true, 1.6, 1.0);
            } catch (e) {}
        } else if (level === 3) {
            Vibration.vibrate([0, 600, 120, 600, 120, 800, 150, 600]);
            try {
                Speech.stop();
                playCustomAlarm(true, 2.0, 1.0);

                beepTimerRef.current = setTimeout(() => {
                    if (currentLevelRef.current === 3) {
                        Speech.speak(
                            'Atenção! Nível crítico de sonolência. Reduza a velocidade e encoste o veículo com segurança.',
                            { language: 'pt-BR', pitch: 1.05, rate: 1.08 }
                        );
                    }
                }, 900);
            } catch (e) {}
        }
    };

    const registerDrowsinessEvent = (eventType) => {
        const now = Date.now();
        const prevTime = lastEventTimeRef.current;
        const intervalSec = prevTime > 0 ? (now - prevTime) / 1000 : null;

        if (intervalSec !== null) {
            setLastIntervalSec(intervalSec);
        }
        lastEventTimeRef.current = now;

        const updatedWindow = eventTimestampsRef.current.filter(t => now - t <= 60000);
        updatedWindow.push(now);
        eventTimestampsRef.current = updatedWindow;

        const count60s = updatedWindow.length;
        const count45s = updatedWindow.filter(t => now - t <= 45000).length;
        const count35s = updatedWindow.filter(t => now - t <= 35000).length;
        setEventsPerMin(count60s);

        let targetLevel = currentLevelRef.current;

        if (eventType === 'MICROSLEEP') {
            targetLevel = 3;
        } else if (
            count35s >= 3 ||
            (currentLevelRef.current >= 2 && intervalSec !== null && intervalSec <= 15)
        ) {
            targetLevel = 3;
        } else if (
            count45s >= 2 ||
            (intervalSec !== null && intervalSec <= 30)
        ) {
            targetLevel = Math.max(targetLevel, 2);
        } else {
            targetLevel = Math.max(targetLevel, 1);
        }

        currentLevelRef.current = targetLevel;
        setAlertLevel(targetLevel);
        triggerMultimodalStimulus(targetLevel);
    };

    const handleInstabilityDetected = () => {
        setIsUnstable(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsUnstable(false), 1500);
    };

    const handleStart = async () => {
        let granted = hasPermission;
        if (!granted) granted = await requestPermission();

        if (granted) {
            baselineRef.current = { landmarkRatio: 0, noseChinRatio: 0, boxRatio: 0, initialized: false };
            eventTimestampsRef.current = [];
            lastEventTimeRef.current = 0;
            currentLevelRef.current = 0;
            setAlertLevel(0);
            setFullScreenVisible(false);
            setEventsPerMin(0);
            setLastIntervalSec(null);

            const started = await startAccelerometer(
                handleInstabilityDetected,
                (value) => {
                    const now = Date.now();
                    if (now - lastGForceUpdate.current > 150) {
                        setGForce(value);
                        lastGForceUpdate.current = now;
                    }
                }
            );
            if (started) {
                setIsMonitoring(true);
            } else {
                Alert.alert('Erro', 'O acelerómetro não está disponível.');
            }
        } else {
            Alert.alert(
                'Permissão Negada', 
                'Ative a permissão da câmara nas definições para continuar.',
                [{ text: 'Cancelar', style: 'cancel' }, { text: 'Definições', onPress: () => Linking.openSettings() }]
            );
        }
    };

    const handleStop = () => {
        const hadInstability = checkInstability();
        stopAllStimuli();
        stopAccelerometer();
        setIsMonitoring(false);
        setIsUnstable(false);
        setAlertLevel(0);
        currentLevelRef.current = 0;

        Alert.alert(
            'Monitoramento Encerrado',
            hadInstability 
                ? 'O sistema registou momentos de instabilidade física intensa.' 
                : 'Viagem finalizada em segurança.'
        );
    };

    const processFaceEvents = useRef(
        Worklets.createRunOnJS((eyesClosed, isSmiling, contourRatio, landmarkRatio, noseChinRatio, boxRatio) => {
            const now = Date.now();

            if (eyesClosed) {
                if (!isBlinking.current) {
                    isBlinking.current = true;
                    blinkStartTime.current = now;
                    microsleepTriggered.current = false;
                } else {
                    const closedDuration = now - blinkStartTime.current;
                    if (!blinkCounted.current && closedDuration > 1000) {
                        setLongBlinks(prev => prev + 1);
                        blinkCounted.current = true;
                        registerDrowsinessEvent('BLINK');
                    }
                    if (!microsleepTriggered.current && closedDuration >= 2500) {
                        microsleepTriggered.current = true;
                        registerDrowsinessEvent('MICROSLEEP');
                    }
                }
            } else {
                isBlinking.current = false;
                blinkCounted.current = false;
                microsleepTriggered.current = false;
            }

            const base = baselineRef.current;
            if (!base.initialized) {
                if (landmarkRatio > 0 || noseChinRatio > 0 || boxRatio > 0) {
                    base.landmarkRatio = landmarkRatio;
                    base.noseChinRatio = noseChinRatio;
                    base.boxRatio = boxRatio;
                    base.initialized = true;
                }
                return;
            }

            let mouthOpen = false;
            if (!isSmiling) {
                if (contourRatio > 0.28) {
                    mouthOpen = true;
                } else if (landmarkRatio > 0 && (landmarkRatio > 0.42 || landmarkRatio > base.landmarkRatio * 1.35)) {
                    mouthOpen = true;
                } else if (noseChinRatio > 0 && noseChinRatio > base.noseChinRatio * 1.25) {
                    mouthOpen = true;
                } else if (landmarkRatio === 0 && contourRatio === 0 && boxRatio > base.boxRatio * 1.15) {
                    mouthOpen = true;
                }
            }

            if (!mouthOpen) {
                if (landmarkRatio > 0) base.landmarkRatio = base.landmarkRatio * 0.92 + landmarkRatio * 0.08;
                if (noseChinRatio > 0) base.noseChinRatio = base.noseChinRatio * 0.92 + noseChinRatio * 0.08;
                if (boxRatio > 0) base.boxRatio = base.boxRatio * 0.92 + boxRatio * 0.08;
            }

            if (mouthOpen) {
                if (!isYawning.current) {
                    isYawning.current = true;
                    yawnStartTime.current = now;
                } else if (!yawnCounted.current && (now - yawnStartTime.current > 1200)) {
                    setYawns(prev => prev + 1);
                    yawnCounted.current = true;
                    registerDrowsinessEvent('YAWN');
                }
            } else {
                isYawning.current = false;
                yawnCounted.current = false;
            }
        })
    ).current;

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const faces = detectFaces(frame);
        
        if (faces && faces.length > 0) {
            const face = faces[0];
            const leftEye = typeof face.leftEyeOpenProbability === 'number' ? face.leftEyeOpenProbability : 1.0;
            const rightEye = typeof face.rightEyeOpenProbability === 'number' ? face.rightEyeOpenProbability : 1.0;
            const smileProb = typeof face.smilingProbability === 'number' ? face.smilingProbability : 0.0;

            const eyesClosed = (leftEye < 0.25 && rightEye < 0.25);
            const isSmiling = (smileProb > 0.55);

            const dist2D = (p1, p2) => {
                if (!p1 || !p2 || typeof p1.x !== 'number' || typeof p2.x !== 'number') return 0;
                return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            };

            const lm = face.landmarks || {};
            const ct = face.contours || {};

            const mouthLeft = lm.MOUTH_LEFT || lm.leftMouth || lm.mouthLeft;
            const mouthRight = lm.MOUTH_RIGHT || lm.rightMouth || lm.mouthRight;
            const mouthBottom = lm.MOUTH_BOTTOM || lm.bottomMouth || lm.mouthBottom;
            const noseBase = lm.NOSE_BASE || lm.noseBase;
            const leftEyePt = lm.LEFT_EYE || lm.leftEye;
            const rightEyePt = lm.RIGHT_EYE || lm.rightEye;

            const upperLipArr = ct.UPPER_LIP_BOTTOM || ct.upperLipBottom;
            const lowerLipArr = ct.LOWER_LIP_TOP || ct.lowerLipTop;

            let contourRatio = 0; let landmarkRatio = 0; let noseChinRatio = 0; let boxRatio = 0;

            const mouthWidth = dist2D(mouthLeft, mouthRight);

            if (Array.isArray(upperLipArr) && upperLipArr.length > 0 && Array.isArray(lowerLipArr) && lowerLipArr.length > 0) {
                const upperMid = upperLipArr[Math.floor(upperLipArr.length / 2)];
                const lowerMid = lowerLipArr[Math.floor(lowerLipArr.length / 2)];
                const lipOpening = dist2D(upperMid, lowerMid);
                const refWidth = mouthWidth > 0 ? mouthWidth : dist2D(upperLipArr[0], upperLipArr[upperLipArr.length - 1]);
                if (refWidth > 0) contourRatio = lipOpening / refWidth;
            }

            if (mouthLeft && mouthRight && mouthBottom && mouthWidth > 0) {
                const mouthMid = { x: (mouthLeft.x + mouthRight.x) / 2, y: (mouthLeft.y + mouthRight.y) / 2 };
                landmarkRatio = dist2D(mouthMid, mouthBottom) / mouthWidth;
            }

            const eyeDist = dist2D(leftEyePt, rightEyePt);
            if (noseBase && mouthBottom && eyeDist > 0) {
                noseChinRatio = dist2D(noseBase, mouthBottom) / eyeDist;
            }

            if (face.bounds && face.bounds.width > 0 && face.bounds.height > 0) {
                boxRatio = Math.max(face.bounds.width, face.bounds.height) / Math.min(face.bounds.width, face.bounds.height);
            }
            
            processFaceEvents(eyesClosed, isSmiling, contourRatio, landmarkRatio, noseChinRatio, boxRatio);
        }
    }, [detectFaces, processFaceEvents]);

    const activeConfig = ALERT_LEVEL_CONFIG[alertLevel];

    return (
        <View style={styles.mainContainer}>
            {!isMonitoring ? (
                <SafeAreaView style={styles.centerBox}>
                    <Text style={styles.title}>Viagem</Text>
                    <Text style={styles.subtitle}>Posicione o telemóvel no suporte para iniciar.</Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                        <Text style={styles.buttonText}>INICIAR MONITORIZAÇÃO</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            ) : (
                <View style={styles.cameraContainer}>
                    {/* CÂMERA SEMPRE ATIVA NO FUNDO */}
                    {device != null && (
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            frameProcessor={frameProcessor}
                            pixelFormat="yuv"
                        />
                    )}

                    {/* OVERLAY DE COR DEPENDENTE DA VARIÁVEL fullScreenVisible */}
                    {alertLevel > 0 && fullScreenVisible && (
                        <View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: flashActive
                                        ? activeConfig.fullScreenAltBg
                                        : activeConfig.fullScreenBg,
                                    zIndex: 1,
                                },
                            ]}
                        />
                    )}

                    {/* INTERFACE SOBREPOSTA */}
                    <SafeAreaView style={styles.safeUI} pointerEvents="box-none">
                        
                        <View style={[styles.topNeuroBanner, { backgroundColor: activeConfig.bannerBg, borderColor: activeConfig.borderColor }]}>
                            <Text style={[styles.neuroLevelTitle, { color: activeConfig.primaryColor }]}>{activeConfig.name}</Text>
                            <Text style={styles.neuroMessageText}>{activeConfig.message}</Text>
                            <View style={styles.temporalRow}>
                                <Text style={styles.temporalText}>FREQUÊNCIA: {eventsPerMin} ev/min</Text>
                                <Text style={styles.temporalText}>INTERVALO (Δt): {lastIntervalSec !== null ? `${lastIntervalSec.toFixed(1)}s` : '--'}</Text>
                            </View>
                        </View>

                        {/* 📍 ALTERAÇÃO AQUI: Novo grupo inferior para empilhar o Alerta Gigante em cima das Métricas */}
                        <View style={styles.bottomSectionUI} pointerEvents="box-none">
                            
                            {fullScreenVisible && alertLevel > 0 && (
                                <Animated.View pointerEvents="none" style={[styles.alertMessageWrapper, { opacity: fullScreenOpacity }]}>
                                    <Text style={[styles.fullScreenTitle, { color: activeConfig.textColor }]}>{activeConfig.fullTitle}</Text>
                                    {activeConfig.fullSubtitle ? <Text style={[styles.fullScreenSubtitle, { color: activeConfig.textColor }]}>{activeConfig.fullSubtitle}</Text> : null}
                                    <Text style={[styles.fullScreenMessage, { color: activeConfig.textColor }]}>{activeConfig.message}</Text>
                                </Animated.View>
                            )}

                            <View style={styles.hud} pointerEvents="box-none">
                                <View style={styles.metricsContainer}>
                                    <View style={[styles.metricBox, { borderColor: activeConfig.borderColor }]}>
                                        <Text style={styles.metricTitle}>ESTABILIDADE</Text>
                                        <Text style={[styles.metricValue, { color: activeConfig.primaryColor }]}>{gForce.toFixed(2)} G</Text>
                                    </View>
                                    <View style={[styles.metricBox, { borderColor: activeConfig.borderColor }]}>
                                        <Text style={styles.metricTitle}>PISCADAS L.</Text>
                                        <Text style={[styles.metricValue, { color: activeConfig.primaryColor }]}>{longBlinks}</Text>
                                    </View>
                                    <View style={[styles.metricBox, { borderColor: activeConfig.borderColor }]}>
                                        <Text style={styles.metricTitle}>BOCEJOS</Text>
                                        <Text style={[styles.metricValue, { color: activeConfig.primaryColor }]}>{yawns}</Text>
                                    </View>
                                </View>

                                {isUnstable && (
                                    <View style={styles.warningBox}>
                                        <Text style={styles.warningText}>⚠️ INSTABILIDADE DETETADA ⚠️</Text>
                                        <Text style={styles.warningSubText}>Movimento brusco detetado no veículo</Text>
                                    </View>
                                )}

                                <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                                    <Text style={styles.buttonText}>ENCERRAR MONITORIZAÇÃO</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.reportButton} onPress={() => navigation.navigate('Relatorio')}>
                                    <Text style={styles.buttonText}>RELATÓRIO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#03050d' },
    centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: '#ffffff', fontSize: 24, fontWeight: '600', marginBottom: 15 },
    subtitle: { color: '#aeb5c2', fontSize: 13, marginBottom: 30, textAlign: 'center' },
    cameraContainer: { flex: 1, width: '100%' },
    safeUI: { flex: 1, zIndex: 2, justifyContent: 'space-between' },
    
    topNeuroBanner: {
        alignSelf: 'center', width: '92%', borderRadius: 10, borderWidth: 1.5,
        paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', marginTop: 15,
    },
    neuroLevelTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    neuroMessageText: { color: '#ffffff', fontSize: 11, textAlign: 'center', marginTop: 4 },
    temporalRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.2)' },
    temporalText: { color: '#d0d7e2', fontSize: 10, fontWeight: '600' },
    
    // Contêiner Inferior que agrupa os Textos Gigantes e o HUD
    bottomSectionUI: { width: '100%', justifyContent: 'flex-end', marginBottom: 20 },
    
    alertMessageWrapper: { width: '100%', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    fullScreenTitle: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 8, letterSpacing: 0.8 },
    fullScreenSubtitle: { fontSize: 13, fontWeight: '800', textAlign: 'center', marginBottom: 15, opacity: 0.9, letterSpacing: 1 },
    fullScreenMessage: { fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 26 },

    hud: { width: '100%', alignItems: 'center' },
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 15 },
    metricBox: { backgroundColor: 'rgba(24, 27, 36, 0.92)', borderWidth: 1.5, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center', flex: 1, marginHorizontal: 3 },
    metricTitle: { color: '#7f9cad', fontSize: 10, fontWeight: '600' },
    metricValue: { fontSize: 20, fontWeight: '600', marginTop: 2 },
    
    warningBox: { backgroundColor: '#303543', borderWidth: 1, borderColor: '#e5d600', borderRadius: 8, padding: 10, marginBottom: 15, alignItems: 'center', width: '90%' },
    warningText: { color: '#e5d600', fontSize: 13, fontWeight: '600' },
    warningSubText: { color: '#ffffff', fontSize: 11, marginTop: 4 },
    
    startButton: { width: 200, height: 40, borderRadius: 8, backgroundColor: '#303543', borderWidth: 1, borderColor: '#5d6678', justifyContent: 'center', alignItems: 'center' },
    stopButton: { width: 220, height: 40, borderRadius: 8, backgroundColor: '#303543', borderWidth: 1, borderColor: '#8c4b4b', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    reportButton: { width: 200, height: 40, borderRadius: 8, backgroundColor: '#303543', borderWidth: 1, borderColor: '#5d6678', justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
});