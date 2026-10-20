import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';

// ============================================================================
// MOTOR DE TEMA GLOBAL (Sincroniza Modo Escuro e Claro entre todas as telas)
// ============================================================================
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

    const toggleTheme = () => {
        const next = global.__CAR_AWAKE_THEME__ === 'dark' ? 'light' : 'dark';
        global.__CAR_AWAKE_THEME__ = next;
        global.__CAR_AWAKE_LISTENERS__.forEach((fn) => fn(next));
    };

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
              statusDot: '#FAFAFA',
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
              statusDot: '#09090B',
          };

    return { isDark, colors, toggleTheme };
}

export default function Home({ navigation }) {
    const { isDark, colors } = useAppTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.bg}
            />

            <View style={styles.contentWrapper}>
                {/* CABEÇALHO MINIMALISTA */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.brandKicker, { color: colors.textMuted }]}>
                            TELEMETRIA NEURAL // V2.4
                        </Text>
                        <View style={styles.brandRow}>
                            <Text style={[styles.logo, { color: colors.textPrimary }]}>
                                CARAWAKE
                            </Text>
                            <View
                                style={[
                                    styles.liveIndicator,
                                    { backgroundColor: colors.textPrimary },
                                ]}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                            styles.configButton,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                        onPress={() => navigation.navigate('Config')}
                    >
                        <Text style={[styles.configButtonText, { color: colors.textPrimary }]}>
                            AJUSTES
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* MÓDULO PRINCIPAL DE OPERAÇÃO */}
                <View
                    style={[
                        styles.heroCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.telemetryStrip,
                            { borderBottomColor: colors.border },
                        ]}
                    >
                        <View style={styles.statusItem}>
                            <View
                                style={[
                                    styles.statusDot,
                                    { backgroundColor: colors.statusDot },
                                ]}
                            />
                            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                IA FACIAL
                            </Text>
                            <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                                ATIVA
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.verticalDivider,
                                { backgroundColor: colors.border },
                            ]}
                        />

                        <View style={styles.statusItem}>
                            <View
                                style={[
                                    styles.statusDot,
                                    { backgroundColor: colors.statusDot },
                                ]}
                            />
                            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                                GPS / INÉRCIA
                            </Text>
                            <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
                                ATIVO
                            </Text>
                        </View>
                    </View>

                    <View style={styles.heroBody}>
                        <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                            Sistemas óticos prontos para leitura ocular e prevenção de microssono em tempo real.
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                                styles.primaryActionButton,
                                { backgroundColor: colors.accentBg },
                            ]}
                            onPress={() => navigation.navigate('Viagem')}
                        >
                            <Text
                                style={[
                                    styles.primaryActionText,
                                    { color: colors.accentText },
                                ]}
                            >
                                INICIAR VIAGEM
                            </Text>
                            <Text
                                style={[
                                    styles.primaryActionArrow,
                                    { color: colors.accentText },
                                ]}
                            >
                                →
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* HISTÓRICO SEMANAL EM BENTO GRID ARQUITETÔNICO */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        HISTÓRICO SEMANAL
                    </Text>
                    <Text style={[styles.sectionMeta, { color: colors.textMuted }]}>
                        ÚLTIMOS 7 DIAS
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
                    <StatCell
                        title="VIAGENS"
                        value="17"
                        unit="TOTAL"
                        colors={colors}
                    />
                    <StatCell
                        title="DISTÂNCIA"
                        value="129.6"
                        unit="KM"
                        colors={colors}
                    />
                    <StatCell
                        title="TEMPO ATIVO"
                        value="08:31"
                        unit="HRS"
                        colors={colors}
                    />
                    <StatCell
                        title="BOCEJOS"
                        value="09"
                        unit="EVENTOS"
                        colors={colors}
                    />
                    <StatCell
                        title="PISCADAS L."
                        value="03"
                        unit="ALERTAS"
                        colors={colors}
                    />
                    <StatCell
                        title="PAUSAS"
                        value="01"
                        unit="SUGERIDA"
                        colors={colors}
                    />
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
    },
    header: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brandKicker: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1.8,
        marginBottom: 4,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.8,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 8,
    },
    configButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
    },
    configButtonText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    heroCard: {
        marginTop: 28,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    telemetryStrip: {
        height: 44,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    statusItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        marginRight: 8,
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginRight: 6,
    },
    statusValue: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    verticalDivider: {
        width: 1,
        height: '60%',
    },
    heroBody: {
        padding: 20,
    },
    heroSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 20,
        fontWeight: '400',
    },
    primaryActionButton: {
        height: 54,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    primaryActionText: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    primaryActionArrow: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionHeader: {
        marginTop: 36,
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
        paddingVertical: 18,
        paddingHorizontal: 14,
        justifyContent: 'space-between',
    },
    statTitle: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
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
});