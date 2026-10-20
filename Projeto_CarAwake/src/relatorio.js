import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';

if (typeof global.__CAR_AWAKE_THEME__ === 'undefined') {
    global.__CAR_AWAKE_THEME__ = 'dark';
    global.__CAR_AWAKE_LISTENERS__ = new Set();
}

function useAppTheme() {
    const [themeMode, setThemeMode] = useState(global.__CAR_AWAKE_THEME__);

    useEffect(() => {
        const listener = (newTheme) => setThemeMode(newTheme);
        global.__CAR_AWAKE_LISTENERS__.add(listener);
        return () => global.__CAR_AWAKE_LISTENERS__.delete(listener);
    }, []);

    const isDark = themeMode === 'dark';

    const colors = isDark
        ? {
              bg: '#09090B',
              surface: '#121215',
              surfaceElevated: '#18181C',
              border: '#27272A',
              textPrimary: '#FAFAFA',
              textSecondary: '#A1A1AA',
              textMuted: '#52525B',
              accentBg: '#FAFAFA',
              accentText: '#09090B',
          }
        : {
              bg: '#F4F4F5',
              surface: '#FFFFFF',
              surfaceElevated: '#FAFAFA',
              border: '#E4E4E7',
              textPrimary: '#09090B',
              textSecondary: '#52525B',
              textMuted: '#A1A1AA',
              accentBg: '#09090B',
              accentText: '#FAFAFA',
          };

    return { isDark, colors };
}

export default function Relatorio({ navigation }) {
    const [registrado, setRegistrado] = useState(false);
    const { isDark, colors } = useAppTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.bg}
            />

            <View style={styles.contentWrapper}>
                {/* CABEÇALHO DO RELATÓRIO */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.kicker, { color: colors.textMuted }]}>
                            SUMÁRIO DE TELEMETRIA
                        </Text>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                            RELATÓRIO DA CORRIDA
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.sessionBadge,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text style={[styles.sessionBadgeText, { color: colors.textPrimary }]}>
                            #017
                        </Text>
                    </View>
                </View>

                {/* ESTATÍSTICAS DA SESSÃO */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        MÉTRICAS CONSOLIDADAS
                    </Text>
                    <Text style={[styles.sectionMeta, { color: colors.textMuted }]}>
                        FINALIZADO
                    </Text>
                </View>

                <View
                    style={[
                        styles.bentoGrid,
                        {
                            backgroundColor: colors.border,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <StatCell title="VIAGEM" value="17" unit="SESSÃO" colors={colors} />
                    <StatCell title="DISTÂNCIA" value="18.2" unit="KM" colors={colors} />
                    <StatCell title="DURAÇÃO" value="28:21" unit="MIN" colors={colors} />
                    <StatCell title="BOCEJOS" value="04" unit="EVENTOS" colors={colors} />
                    <StatCell title="PISCADAS L." value="03" unit="ALERTAS" colors={colors} />
                    <StatCell title="PAUSAS" value="00" unit="SUGERIDAS" colors={colors} />
                </View>

                {/* PAINEL DE CONFIRMAÇÃO DE REGISTO */}
                <View style={styles.footerActions}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={registrado}
                        style={[
                            styles.secondaryButton,
                            {
                                backgroundColor: registrado ? colors.surfaceElevated : colors.surface,
                                borderColor: registrado ? colors.textPrimary : colors.border,
                            },
                        ]}
                        onPress={() => setRegistrado(true)}
                    >
                        <Text
                            style={[
                                styles.secondaryButtonText,
                                { color: colors.textPrimary },
                            ]}
                        >
                            {registrado
                                ? '✓ RELATÓRIO ARQUIVADO NO SISTEMA'
                                : 'REGISTRAR RELATÓRIO'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={[
                            styles.primaryButton,
                            { backgroundColor: colors.accentBg },
                        ]}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text
                            style={[
                                styles.primaryButtonText,
                                { color: colors.accentText },
                            ]}
                        >
                            PROSSEGUIR PARA O PAINEL
                        </Text>
                        <Text
                            style={[
                                styles.primaryButtonArrow,
                                { color: colors.accentText },
                            ]}
                        >
                            →
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

function StatCell({ title, value, unit, colors }) {
    return (
        <View style={[styles.statCell, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
                {title}
            </Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {value}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textMuted }]}>
                {unit}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 12,
        justifyContent: 'space-between',
        paddingBottom: 28,
    },
    header: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    kicker: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1.8,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    sessionBadge: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    sessionBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
        letterSpacing: 1,
    },
    sectionHeader: {
        marginTop: 10,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    sectionMeta: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    bentoGrid: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
    },
    statCell: {
        width: '33.1%',
        flexGrow: 1,
        paddingVertical: 22,
        paddingHorizontal: 14,
        justifyContent: 'space-between',
    },
    statTitle: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 12,
    },
    statValue: {
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.5,
        fontVariant: ['tabular-nums'],
        marginBottom: 4,
    },
    statUnit: {
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    footerActions: {
        marginTop: 24,
        gap: 12,
    },
    secondaryButton: {
        height: 52,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.4,
    },
    primaryButton: {
        height: 54,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    primaryButtonText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.4,
    },
    primaryButtonArrow: {
        fontSize: 18,
        fontWeight: '600',
    },
});